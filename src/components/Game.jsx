import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ExplorerMap from './ExplorerMap';
import IntroPanel from './IntroPanel';
import NamePanel from './NamePanel';
import TopicPanel from './TopicPanel';
import QuestionCard from './QuestionCard';
import FinaleBanner from './FinaleBanner';
import GameOverPanel from './GameOverPanel';
import ConfettiCanvas from './ConfettiCanvas';
import { MISTAKES_ALLOWED, TIME_LIMIT, TIMING, WAYPOINTS } from '../data/explorerConfig';
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
  onToggleLang,
  onToggleSound,
  onFullscreen,
  onRestart,
  onIdle
}) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'name' | 'topic' | 'play' | 'finale' | 'over' | 'timeup'
  // All 10 questions come from the topic the player picks, so they're built at that moment
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [cur, setCur] = useState(-1);
  // arrive: the card's entrance after landing on a stop
  // revealed: index of the right answer, shown when a wrong answer ends the game
  const [card, setCard] = useState({ open: false, arrive: false, index: 0, wrong: [], correct: null, revealed: null });
  const [shake, setShake] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  // Lives only as long as this game: Play again and the idle reset start a new Game, so the
  // next visitor never sees the previous player's name
  const [playerName, setPlayerName] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  // The game clock, as performance.now() times: start when the first flight begins, end when the
  // game is won or lost (0 = not yet). The header counts TIME_LIMIT down from start, and the
  // certificate's time is end - start.
  const [clock, setClock] = useState({ start: 0, end: 0 });
  const [cert, setCert] = useState({ status: 'idle' }); // 'idle' | 'loading' | 'ready' | 'error'

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
  const ringRef = useRef(null);
  const threadRef = useRef(null);
  const alive = useRef(true);
  const busy = useRef(false);
  const advancing = useRef(false);
  // The time ran out: a flight still under way lands without opening a question
  const timeUp = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Kiosk: back to the portal's home page after a period without interaction.
  // Not from the intro in Hindi, which is where a new player starts anyway, nor from the end
  // panels, which count down to the home page themselves (HomeCountdown).
  useEffect(() => {
    if ((phase === 'intro' && lang === 'hi') || phase === 'finale' || phase === 'over' || phase === 'timeup') return undefined;
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

  // A whole game has TIME_LIMIT. Running out ends it like a second wrong answer, closing any
  // open question. Winning or losing first stops the clock, which clears this timer.
  useEffect(() => {
    if (!clock.start || clock.end) return undefined;
    const timer = setTimeout(() => {
      timeUp.current = true;
      busy.current = true;
      setClock((c) => ({ ...c, end: c.start + TIME_LIMIT }));
      setCard((c) => ({ ...c, open: false, arrive: false }));
      sound.gameOver();
      setPhase('timeup');
    }, clock.start + TIME_LIMIT - performance.now());
    return () => clearTimeout(timer);
  }, [clock]);

  /** Sleep, then report whether this game is still mounted. */
  const wait = async (ms) => {
    await sleep(ms);
    return alive.current;
  };

  const openQuestion = (j) => {
    setCur(j);
    setCard({ open: true, arrive: true, index: j, wrong: [], correct: null, revealed: null });
    busy.current = false;
    advancing.current = false;
    // Drop the entrance class once it has played, so later animations (shake) can't replay it
    setTimeout(() => {
      if (alive.current) setCard((c) => (c.index === j ? { ...c, arrive: false } : c));
    }, TIMING.arrivalCardDelay + TIMING.arrival);
  };

  /**
   * Ring out of waypoint i and, beside the left column, a thread from it to the panel edge.
   * Positions follow the camera. Phones show the card below the map, so they get the ring only.
   */
  const playArrival = (i) => {
    const ring = ringRef.current;
    const thread = threadRef.current;
    if (!ring || !thread) return;
    const { x, y, diameter } = mapRef.current.screenPoint(i);

    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.setProperty('--ring-size', `${diameter}px`);

    const withThread = layout.panelRight !== null;
    if (withThread) {
      thread.style.left = `${layout.panelRight}px`;
      thread.style.top = `${y}px`;
      thread.style.width = `${Math.max(x - layout.panelRight, 0)}px`;
    }

    ring.classList.remove('go');
    thread.classList.remove('go');
    void ring.offsetWidth; // restart the animations
    ring.classList.add('go');
    if (withThread) thread.classList.add('go');
  };

  /** The traveller has landed on waypoint i and the camera has settled. */
  const arriveAt = (i) => {
    mapRef.current.setNode(i, 'cur');
    playArrival(i);
    openQuestion(i);
  };

  const start = async () => {
    if (busy.current) return;
    busy.current = true;
    sound.tap();
    setClock({ start: performance.now(), end: 0 });
    setPhase('play');
    const map = mapRef.current;
    map.beginJourney();
    await map.flyTo(0);
    if (!alive.current || timeUp.current) return;
    arriveAt(0);
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
    setClock((c) => ({ ...c, end: performance.now() }));
    setCard((c) => ({ ...c, revealed: questions[j].correctIndex }));
    mapRef.current.failAt(j);
    if (!(await wait(TIMING.gameOverReveal))) return;
    sound.gameOver();
    setCard((c) => ({ ...c, open: false, arrive: false }));
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
      const end = performance.now();
      const time = formatDuration(end - clock.start);
      setClock((c) => ({ ...c, end }));
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
    setCard((c) => ({ ...c, open: false, arrive: false }));

    if (j === LAST) {
      if (!(await wait(TIMING.cardClose))) return;
      finale();
      return;
    }
    const map = mapRef.current;
    await Promise.all([map.flyTo(j + 1), map.travel(j, prefersReducedMotion() ? 0 : TIMING.travel)]);
    if (!alive.current || timeUp.current) return;
    arriveAt(j + 1);
  };

  const retryCertificate = () => {
    if (cert.status !== 'error') return;
    sound.tap();
    makeCertificate(timeTaken);
  };

  return (
    <>
      <div className="backdrop" />
      <ExplorerMap ref={mapRef} layout={layout} />
      <div className="vignette" />

      <Header
        cur={cur}
        mistakesLeft={MISTAKES_ALLOWED - mistakes}
        clock={clock}
        lang={lang}
        muted={muted}
        onToggleLang={onToggleLang}
        onToggleSound={onToggleSound}
        onFullscreen={onFullscreen}
        onRestart={onRestart}
      />

      <QuestionCard
        open={card.open}
        arrive={card.arrive}
        question={questions.length ? questions[card.index] : null}
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

      <span className="arrive-ring" ref={ringRef} aria-hidden="true" />
      <span className="arrive-thread" ref={threadRef} aria-hidden="true" />

      <ConfettiCanvas ref={confettiRef} w={layout.w} h={layout.h} />

      {phase === 'intro' && (
        <IntroPanel
          lang={lang}
          onStart={() => {
            sound.tap();
            setPhase('name');
          }}
        />
      )}
      {phase === 'name' && (
        <NamePanel
          lang={lang}
          name={playerName}
          onNameChange={setPlayerName}
          onBack={() => {
            sound.tap();
            setPhase('intro');
          }}
          onGo={() => {
            sound.tap();
            setPhase('topic');
          }}
        />
      )}
      {phase === 'topic' && (
        <TopicPanel
          lang={lang}
          name={playerName.trim()}
          onBack={() => {
            sound.tap();
            setPhase('name');
          }}
          onPick={(id) => {
            setTopic(id);
            setQuestions(buildJourneyQuestions(id));
            start();
          }}
        />
      )}
      {phase === 'finale' && (
        <FinaleBanner
          lang={lang}
          topic={topic}
          name={playerName.trim()}
          firstTry={firstTry}
          total={questions.length}
          time={timeTaken}
          cert={cert}
          onRetry={retryCertificate}
          onPlayAgain={onRestart}
        />
      )}
      {(phase === 'over' || phase === 'timeup') && (
        <GameOverPanel
          lang={lang}
          timeUp={phase === 'timeup'}
          question={questions[card.index]}
          cleared={Math.max(cur, 0)}
          total={questions.length}
          onPlayAgain={onRestart}
        />
      )}
    </>
  );
}
