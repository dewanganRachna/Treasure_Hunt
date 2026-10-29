import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ExplorerMap, { TERRAIN_SRC } from './ExplorerMap';
import IntroPanel from './IntroPanel';
import QuestionCard from './QuestionCard';
import FinaleBanner from './FinaleBanner';
import GameOverPanel from './GameOverPanel';
import ConfettiCanvas from './ConfettiCanvas';
import { MISTAKES_ALLOWED, TIMING, WAYPOINTS } from '../data/explorerConfig';
import { buildJourneyQuestions } from '../data/journey';
import { sound } from '../utils/audio';
import { formatDuration, requestCertificate } from '../utils/certificate';
import { motionMs, prefersReducedMotion } from '../utils/motion';

const LAST = WAYPOINTS.length - 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One playthrough. App remounts this (new key) to restart, which also resets
 * the map overlay to a clean copy.
 */
export default function Game({
  layout,
  lang,
  muted,
  playerName,
  onPlayerNameChange,
  onToggleLang,
  onToggleSound,
  onFullscreen,
  onRestart,
  onIdle
}) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'play' | 'finale' | 'over'
  const [questions] = useState(buildJourneyQuestions);
  const [cur, setCur] = useState(-1);
  // revealed: index of the right answer, shown when a wrong answer ends the game
  const [card, setCard] = useState({ open: false, index: 0, wrong: [], correct: null, revealed: null });
  const [shake, setShake] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeTaken, setTimeTaken] = useState('');
  const [cert, setCert] = useState({ status: 'idle' }); // 'idle' | 'loading' | 'ready' | 'error'

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
  const alive = useRef(true);
  const busy = useRef(false);
  const advancing = useRef(false);
  const startedAt = useRef(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Kiosk: return to a fresh Hindi intro after a period without interaction.
  // Nothing to reset when the intro is already showing in Hindi.
  useEffect(() => {
    if (phase === 'intro' && lang === 'hi') return undefined;
    let timer = setTimeout(onIdle, TIMING.idleReset);
    const bump = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, TIMING.idleReset);
    };
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
    };
  }, [phase, lang, onIdle]);

  /** Sleep, then report whether this game is still mounted. */
  const wait = async (ms) => {
    await sleep(ms);
    return alive.current;
  };

  const openQuestion = (j) => {
    setCur(j);
    setCard({ open: true, index: j, wrong: [], correct: null, revealed: null });
    busy.current = false;
    advancing.current = false;
  };

  const start = async () => {
    if (busy.current) return;
    busy.current = true;
    sound.tap();
    startedAt.current = performance.now();
    setPhase('play');
    const map = mapRef.current;
    map.beginJourney();
    map.flyTo(0);
    map.setNode(0, 'cur');
    if (!(await wait(motionMs(TIMING.intoFirstStop)))) return;
    openQuestion(0);
  };

  const finale = async () => {
    const map = mapRef.current;
    map.shakeTreasure(true);
    if (!(await wait(motionMs(TIMING.treasureShake)))) return;
    map.shakeTreasure(false);
    map.revealTreasure();
    if (!(await wait(motionMs(TIMING.treasureReveal)))) return;
    // Lid flips open and gold coins burst out, then the confetti cannons
    map.openTreasure();
    sound.win();
    sound.coins();
    const mouth = map.treasurePoint();
    if (mouth) confettiRef.current?.coins(mouth.x, mouth.y);
    if (!(await wait(motionMs(TIMING.confettiAfterCoins)))) return;
    confettiRef.current?.celebrate();
    if (!(await wait(motionMs(TIMING.bannerDelay)))) return;
    setPhase('finale');
  };

  /**
   * Ask the certificate API for this win. Each call makes a new PDF on the server, so it runs
   * once per won game (again only after a failure, from the Retry button).
   */
  const makeCertificate = async (time) => {
    setCert({ status: 'loading' });
    try {
      const result = await requestCertificate({ username: playerName.trim(), timeTaken: time });
      if (alive.current) setCert({ status: 'ready', ...result });
    } catch {
      if (alive.current) setCert({ status: 'error' });
    }
  };

  /** A wrong answer beyond the allowance: show the right one, then the game-over panel. */
  const gameOver = async (j) => {
    busy.current = true;
    setCard((c) => ({ ...c, revealed: questions[j].correctIndex }));
    mapRef.current.failAt(j);
    if (!(await wait(TIMING.gameOverReveal))) return;
    sound.gameOver();
    setCard((c) => ({ ...c, open: false }));
    setPhase('over');
  };

  const pick = (m) => {
    if (busy.current || !card.open || card.correct !== null || card.wrong.includes(m)) return;
    const j = card.index;

    if (m !== questions[j].correctIndex) {
      sound.wrong();
      setCard((c) => ({ ...c, wrong: [...c.wrong, m] }));
      setShake(true);
      setTimeout(() => alive.current && setShake(false), TIMING.shake);
      if (mistakes >= MISTAKES_ALLOWED) gameOver(j);
      else setMistakes((n) => n + 1);
      return;
    }

    busy.current = true;
    sound.correct();
    if (card.wrong.length === 0) setFirstTry((n) => n + 1);
    setCard((c) => ({ ...c, correct: m }));
    const map = mapRef.current;
    map.setNode(j, 'done');
    map.burst(j);
    setCur(j + 1);

    // Won: stop the clock and start making the certificate while the chest opens
    if (j === LAST) {
      const time = formatDuration(performance.now() - startedAt.current);
      setTimeTaken(time);
      makeCertificate(time);
    }
  };

  /** After reading the explanation: close the card and travel on (or open the treasure). */
  const advance = async () => {
    if (advancing.current || !card.open || card.correct === null) return;
    advancing.current = true;
    const j = card.index;
    sound.tap();
    setCard((c) => ({ ...c, open: false }));

    if (j === LAST) {
      if (!(await wait(TIMING.cardClose))) return;
      finale();
      return;
    }
    const map = mapRef.current;
    map.flyTo(j + 1);
    await map.travel(j, prefersReducedMotion() ? 0 : TIMING.travel);
    if (!alive.current) return;
    map.setNode(j + 1, 'cur');
    if (!(await wait(TIMING.beforeQuestion))) return;
    openQuestion(j + 1);
  };

  const retryCertificate = () => {
    if (cert.status !== 'error') return;
    sound.tap();
    makeCertificate(timeTaken);
  };

  return (
    <>
      <div className="backdrop" style={{ backgroundImage: `url(${TERRAIN_SRC})` }} />
      <ExplorerMap ref={mapRef} layout={layout} />
      <div className="vignette" />

      <Header
        cur={cur}
        mistakesLeft={MISTAKES_ALLOWED - mistakes}
        lang={lang}
        muted={muted}
        onToggleLang={onToggleLang}
        onToggleSound={onToggleSound}
        onFullscreen={onFullscreen}
        onRestart={onRestart}
      />

      <QuestionCard
        open={card.open}
        question={phase === 'intro' ? null : questions[card.index]}
        index={card.index}
        wrong={card.wrong}
        correct={card.correct}
        revealed={card.revealed}
        shake={shake}
        lang={lang}
        isLast={card.index === LAST}
        onPick={pick}
        onContinue={advance}
      />

      <ConfettiCanvas ref={confettiRef} w={layout.w} h={layout.h} />

      {phase === 'intro' && <IntroPanel lang={lang} name={playerName} onNameChange={onPlayerNameChange} onStart={start} />}
      {phase === 'finale' && (
        <FinaleBanner
          lang={lang}
          name={playerName.trim()}
          firstTry={firstTry}
          total={questions.length}
          time={timeTaken}
          cert={cert}
          onRetry={retryCertificate}
          onPlayAgain={onRestart}
        />
      )}
      {phase === 'over' && (
        <GameOverPanel lang={lang} question={questions[card.index]} cleared={card.index} total={questions.length} onPlayAgain={onRestart} />
      )}
    </>
  );
}
