import { useCallback, useEffect, useRef, useState } from 'react';
import Header from './Header';
import ExplorerMap, { TERRAIN_SRC } from './ExplorerMap';
import IntroPanel from './IntroPanel';
import QuestionCard from './QuestionCard';
import FinaleBanner from './FinaleBanner';
import GameOverPanel from './GameOverPanel';
import Certificate from './Certificate';
import ConfettiCanvas from './ConfettiCanvas';
import { MISTAKES_ALLOWED, TIMING, WAYPOINTS } from '../data/explorerConfig';
import { buildJourneyQuestions } from '../data/journey';
import { sound } from '../utils/audio';
import { motionMs, prefersReducedMotion } from '../utils/motion';

const LAST = WAYPOINTS.length - 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One playthrough. App remounts this (new key) to restart, which also resets
 * the map overlay to a clean copy.
 */
export default function Game({ layout, lang, muted, onToggleLang, onToggleSound, onFullscreen, onRestart, onIdle }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'play' | 'finale' | 'over'
  const [questions] = useState(buildJourneyQuestions);
  const [cur, setCur] = useState(-1);
  // revealed: index of the right answer, shown when a wrong answer ends the game
  const [card, setCard] = useState({ open: false, index: 0, wrong: [], correct: null, revealed: null });
  const [shake, setShake] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showCert, setShowCert] = useState(false);

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
  const alive = useRef(true);
  const busy = useRef(false);
  const advancing = useRef(false);

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

  const openCertificate = () => {
    sound.tap();
    setShowCert(true);
  };

  const closeCertificate = useCallback(() => {
    sound.tap();
    setShowCert(false);
  }, []);

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

      {phase === 'intro' && <IntroPanel lang={lang} onStart={start} />}
      {phase === 'finale' && !showCert && (
        <FinaleBanner
          lang={lang}
          firstTry={firstTry}
          total={questions.length}
          onCertificate={openCertificate}
          onPlayAgain={onRestart}
        />
      )}
      {phase === 'over' && (
        <GameOverPanel lang={lang} question={questions[card.index]} cleared={card.index} total={questions.length} onPlayAgain={onRestart} />
      )}
      {showCert && <Certificate lang={lang} firstTry={firstTry} total={questions.length} onClose={closeCertificate} />}
    </>
  );
}
