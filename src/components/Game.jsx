import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import ExplorerMap, { TERRAIN_SRC } from './ExplorerMap';
import IntroPanel from './IntroPanel';
import QuestionCard from './QuestionCard';
import FinaleBanner from './FinaleBanner';
import ConfettiCanvas from './ConfettiCanvas';
import { TIMING, WAYPOINTS } from '../data/explorerConfig';
import { buildJourneyQuestions } from '../data/journey';
import { t } from '../data/i18n';
import { sound } from '../utils/audio';

const LAST = WAYPOINTS.length - 1;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * One playthrough. App remounts this (new key) to restart, which also resets
 * the map overlay to a clean copy.
 */
export default function Game({ lang, muted, onToggleLang, onToggleSound, onFullscreen, onRestart }) {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'play' | 'finale'
  const [questions] = useState(buildJourneyQuestions);
  const [cur, setCur] = useState(-1);
  const [card, setCard] = useState({ open: false, index: 0, wrong: [], correct: null });
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState(false);

  const mapRef = useRef(null);
  const confettiRef = useRef(null);
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
    setCard({ open: true, index: j, wrong: [], correct: null });
    busy.current = false;
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
    if (!(await wait(TIMING.intoFirstStop))) return;
    openQuestion(0);
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
    setCard((c) => ({ ...c, open: false }));

    if (j === LAST) {
      finale();
      return;
    }
    map.flyTo(j + 1);
    await map.travel(j, TIMING.travel);
    if (!alive.current) return;
    map.setNode(j + 1, 'cur');
    if (!(await wait(TIMING.beforeQuestion))) return;
    openQuestion(j + 1);
  };

  const showCertificateToast = () => {
    sound.tap();
    setToast(true);
    setTimeout(() => alive.current && setToast(false), TIMING.toast);
  };

  return (
    <>
      <div className="backdrop" style={{ backgroundImage: `url(${TERRAIN_SRC})` }} />
      <ExplorerMap ref={mapRef} />
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
        question={phase === 'intro' ? null : questions[card.index]}
        index={card.index}
        wrong={card.wrong}
        correct={card.correct}
        shake={shake}
        lang={lang}
        onPick={pick}
      />

      <ConfettiCanvas ref={confettiRef} />

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
