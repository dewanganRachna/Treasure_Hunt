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
import TreasureChest from './TreasureChest';
import { MISTAKES_ALLOWED, TIME_LIMIT, TIMING, WAYPOINTS } from '../data/explorerConfig';
import { buildJourneyQuestions } from '../data/journey';
import { sound } from '../utils/audio';
import { formatDuration, requestCertificate } from '../utils/certificate';
import { motionMs, prefersReducedMotion } from '../utils/motion';

const LAST = WAYPOINTS.length - 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Where the big chest of the win stands, and its size (stage px): in the middle of the map
 * beside the left column, or just under the header on phones, above the win panel.
 */
const placeChest = (L) => {
  if (L.portrait) {
    // The win panel takes about the bottom 560px
    const size = Math.round(Math.min(380, Math.max(260, L.h - L.headerH - 520)));
    return { x: L.w / 2, y: L.headerH + 10 + size / 2, size };
  }
  const areaW = L.w - L.mapLeft;
  const areaH = L.h - L.headerH;
  const size = Math.round(Math.min(areaW * 0.8, areaH * 0.98, 600));
  return { x: Math.round(L.mapLeft + areaW / 2), y: Math.round(L.headerH + areaH / 2 + 4), size };
};

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
  // Answers right on the first try in a row; three or more get a cheer of their own
  const [streak, setStreak] = useState(0);
  // The word of praise on a right answer: n picks it, streak is the run it extends
  const [praise, setPraise] = useState(null);
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
  // The big chest of the win: null until the finale, then its stage ('in' | 'rattle' | 'open')
  // and where the map's chest is (from), which it grows out of
  const [chest, setChest] = useState(null);

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
  const chestRef = useRef(null);
  const lastChestTap = useRef(0);
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
      sound.timeUp();
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
    setPraise(null);
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
    sound.arrive();
    setTimeout(() => alive.current && sound.card(), TIMING.arrivalCardDelay);
    playArrival(i);
    openQuestion(i);
  };

  const start = async () => {
    if (busy.current) return;
    busy.current = true;
    sound.select();
    sound.start();
    setClock({ start: performance.now(), end: 0 });
    setPhase('play');
    const map = mapRef.current;
    map.beginJourney();
    sound.whoosh();
    await map.flyTo(0);
    if (!alive.current || timeUp.current) return;
    arriveAt(0);
  };

  const finale = async () => {
    const map = mapRef.current;
    const shake = motionMs(TIMING.treasureShake);
    const reveal = motionMs(TIMING.treasureReveal);
    const rattle = motionMs(TIMING.chestRattle);
    map.shakeTreasure(true);
    sound.drumroll(shake + reveal + rattle);
    if (!(await wait(shake))) return;
    map.shakeTreasure(false);
    // The big chest grows out of the one on the map, lands and rattles
    setChest({ stage: 'in', from: map.treasurePoint() });
    map.revealTreasure();
    if (!(await wait(reveal))) return;
    sound.thud();
    setChest((c) => ({ ...c, stage: 'rattle' }));
    if (!(await wait(rattle))) return;
    // The lid flips open on a heap of gold and coins, diamonds and gems burst out; then the confetti cannons
    setChest((c) => ({ ...c, stage: 'open' }));
    sound.creak();
    sound.win();
    sound.shimmer();
    sound.coins(30);
    sound.gems(10);
    const mouth = chestRef.current?.mouth();
    if (mouth) confettiRef.current?.treasure(mouth.x, mouth.y);
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

  /** Answer m was picked, from button el. */
  const pick = (m, el) => {
    if (busy.current || !card.open || card.correct !== null || card.wrong.includes(m)) return;
    const j = card.index;

    if (m !== questions[j].correctIndex) {
      sound.wrong();
      setStreak(0);
      setCard((c) => ({ ...c, wrong: [...c.wrong, m] }));
      setShake(true);
      setTimeout(() => alive.current && setShake(false), TIMING.shake);
      if (mistakes >= MISTAKES_ALLOWED) gameOver(j);
      else {
        sound.lifeLost();
        setMistakes((n) => n + 1);
      }
      return;
    }

    busy.current = true;
    const run = card.wrong.length === 0 ? streak + 1 : 0;
    sound.correct(j);
    if (run >= 3) sound.streak();
    if (card.wrong.length === 0) setFirstTry((n) => n + 1);
    setStreak(run);
    setPraise({ n: Math.floor(Math.random() * 100), streak: run });
    confettiRef.current?.burstAt(el);
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
    const travel = prefersReducedMotion() ? 0 : TIMING.travel;
    sound.whoosh();
    if (travel) sound.trail(travel);
    await Promise.all([map.flyTo(j + 1), map.travel(j, travel)]);
    if (!alive.current || timeUp.current) return;
    arriveAt(j + 1);
  };

  const retryCertificate = () => {
    if (cert.status !== 'error') return;
    sound.tap();
    makeCertificate(timeTaken);
  };

  /** The open chest was tapped: a handful more treasure, at most every 350 ms. */
  const tapChest = () => {
    const now = performance.now();
    if (now - lastChestTap.current < 350) return;
    lastChestTap.current = now;
    sound.coins(8);
    sound.gems(3);
    const mouth = chestRef.current?.mouth();
    if (mouth) confettiRef.current?.treasure(mouth.x, mouth.y, true);
  };

  return (
    <>
      <div className="backdrop" />
      <ExplorerMap ref={mapRef} layout={layout} />
      <div className="vignette" />
      {/* Red edges on a wrong answer, a gold glow on a right one */}
      {shake && <div className="flash hurt" aria-hidden="true" />}
      {card.open && card.correct !== null && <div className="flash cheer" key={card.index} aria-hidden="true" />}
      {chest && (
        <TreasureChest ref={chestRef} stage={chest.stage} from={chest.from} lang={lang} onTap={tapChest} {...placeChest(layout)} />
      )}

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
        praise={praise}
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
            sound.select();
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
            sound.back();
            setPhase('intro');
          }}
          onGo={() => {
            sound.select();
            setPhase('topic');
          }}
        />
      )}
      {phase === 'topic' && (
        <TopicPanel
          lang={lang}
          name={playerName.trim()}
          onBack={() => {
            sound.back();
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
