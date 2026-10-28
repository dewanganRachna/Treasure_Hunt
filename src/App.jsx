import { useCallback, useEffect, useState } from 'react';
import Game from './components/Game';
import { STAGE } from './data/explorerConfig';
import { sound } from './utils/audio';
import './App.css';

/**
 * Scale the 1280×720 design to the screen, then stretch the stage along the
 * longer axis so it fills the whole viewport instead of letterboxing.
 */
const fitStage = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.min(vw / STAGE.w, vh / STAGE.h);
  return { scale, w: Math.round(vw / scale), h: Math.round(vh / scale) };
};

export default function App() {
  const [gameKey, setGameKey] = useState(0);
  const [lang, setLang] = useState('hi');
  const [muted, setMuted] = useState(false);
  const [stage, setStage] = useState(fitStage);

  useEffect(() => {
    const onResize = () => setStage(fitStage());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    sound.tap();
    setLang((l) => (l === 'hi' ? 'en' : 'hi'));
  };

  const toggleSound = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) sound.tap();
  };

  const toggleFullscreen = () => {
    sound.tap();
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const restart = useCallback(() => setGameKey((k) => k + 1), []);

  // Focusing an element near the edge can scroll the clipped stage sideways; undo it
  const lockScroll = (e) => {
    e.currentTarget.scrollLeft = 0;
    e.currentTarget.scrollTop = 0;
  };

  return (
    <div className="fit">
      <div
        className="stage"
        style={{ width: stage.w, height: stage.h, transform: `scale(${stage.scale})` }}
        onScroll={lockScroll}
      >
        <Game
          key={gameKey}
          stage={stage}
          lang={lang}
          muted={muted}
          onToggleLang={toggleLang}
          onToggleSound={toggleSound}
          onFullscreen={toggleFullscreen}
          onRestart={restart}
        />
      </div>
    </div>
  );
}
