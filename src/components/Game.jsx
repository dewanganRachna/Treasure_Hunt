import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ExplorerMap from './ExplorerMap';
import IntroPanel from './IntroPanel';
import QuestionCard from './QuestionCard';
import FinaleBanner from './FinaleBanner';
import ConfettiCanvas from './ConfettiCanvas';
import { PANEL_RIGHT, TIMING, WAYPOINTS } from '../data/explorerConfig';
import { buildJourneyQuestions } from '../data/journey';
import { t } from '../data/i18n';
import { sound } from '../utils/audio';

const LAST = WAYPOINTS.length - 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One playthrough. App remounts this (new key) to restart, which also resets
 * the map overlay to a clean copy.
 */
export default function Game({ stage, lang, muted, onToggleLang, onToggleSound, onFullscreen, onRestart }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'play' | 'finale'
  const [questions] = useState(buildJourneyQuestions);
  const [cur, setCur] = useState(-1);
  const [card, setCard] = useState({ open: false, arrive: false, index: 0, wrong: [], correct: null });
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState(false);

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
  const ringRef = useRef(null);
  const threadRef = useRef(null);
  const alive = useRef(true);
  const busy = useRef(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Kiosk: return to the intro after a period without interaction
  useEffect(() => {
    if (phase === 'intro') return undefined;
    let timer = setTimeout(onRestart, TIMING.idleReset);
    const bump = () => {
      clearTimeout(timer);
      timer = setTimeout(onRestart, TIMING.idleReset);
    };
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
    };
  }, [phase, onRestart]);

  /** Sleep, then report whether this game is still mounted. */
  const wait = async (ms) => {
    await sleep(ms);
    return alive.current;
  };

  const openQuestion = (j) => {
    setCur(j);
    setCard({ open: true, arrive: true, index: j, wrong: [], correct: null });
    busy.current = false;
    // Drop the entrance class once it has played, so later animations (shake) can't replay it
    setTimeout(() => {
      if (alive.current) setCard((c) => (c.index === j ? { ...c, arrive: false } : c));
    }, TIMING.arrivalCardDelay + TIMING.arrival);
  };

  /** Ring out of waypoint i and a thread from it to the panel edge; positions follow the camera. */
  const playArrival = (i) => {
    const ring = ringRef.current;
    const thread = threadRef.current;
    if (!ring || !thread) return;
    const { x, y, diameter } = mapRef.current.screenPoint(i);

    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.style.setProperty('--ring-size', `${diameter}px`);

    thread.style.left = `${PANEL_RIGHT}px`;
    thread.style.top = `${y}px`;
    thread.style.width = `${Math.max(x - PANEL_RIGHT, 0)}px`;

    ring.classList.remove('go');
    thread.classList.remove('go');
    void ring.offsetWidth; // restart the animations
    ring.classList.add('go');
    thread.classList.add('go');
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
    setPhase('play');
    const map = mapRef.current;
    map.beginJourney();
    await map.flyTo(0);
    if (!alive.current) return;
    arriveAt(0);
  };

  const finale = async () => {
    const map = mapRef.current;
    map.shakeTreasure(true);
    if (!(await wait(TIMING.treasureShake))) return;
    map.shakeTreasure(false);
    map.revealTreasure();
    if (!(await wait(TIMING.treasureReveal))) return;
    map.openTreasure();
    sound.win();
    confettiRef.current?.celebrate();
    if (!(await wait(TIMING.bannerDelay))) return;
    setPhase('finale');
  };

  const pick = async (m) => {
    if (busy.current || !card.open || card.correct !== null || card.wrong.includes(m)) return;
    const j = card.index;

    if (m !== questions[j].correctIndex) {
      sound.wrong();
      setCard((c) => ({ ...c, wrong: [...c.wrong, m] }));
      setShake(true);
      setTimeout(() => alive.current && setShake(false), TIMING.shake);
      return;
    }

    busy.current = true;
    sound.correct();
    setCard((c) => ({ ...c, correct: m }));
    const map = mapRef.current;
    map.setNode(j, 'done');
    map.burst(j);
    setCur(j + 1);

    if (!(await wait(TIMING.afterCorrect))) return;
    setCard((c) => ({ ...c, open: false, arrive: false }));

    if (j === LAST) {
      finale();
      return;
    }
    await Promise.all([map.flyTo(j + 1), map.travel(j, TIMING.travel)]);
    if (!alive.current) return;
    arriveAt(j + 1);
  };

  const showCertificateToast = () => {
    sound.tap();
    setToast(true);
    setTimeout(() => alive.current && setToast(false), TIMING.toast);
  };

  return (
    <>
      <div className="backdrop" />
      <ExplorerMap ref={mapRef} stage={stage} />
      <div className="vignette" />

      <Header
        cur={cur}
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
        question={phase === 'intro' ? null : questions[card.index]}
        index={card.index}
        wrong={card.wrong}
        correct={card.correct}
        shake={shake}
        lang={lang}
        onPick={pick}
      />

      <span className="arrive-ring" ref={ringRef} aria-hidden="true" />
      <span className="arrive-thread" ref={threadRef} aria-hidden="true" />

      <ConfettiCanvas ref={confettiRef} width={stage.w} height={stage.h} />

      {phase === 'intro' && <IntroPanel lang={lang} onStart={start} />}
      {phase === 'finale' && (
        <FinaleBanner lang={lang} onCertificate={showCertificateToast} onPlayAgain={onRestart} />
      )}

      {toast && (
        <div className="toast" role="status">
          {t(lang, 'certToast')}
        </div>
      )}
    </>
  );
}
