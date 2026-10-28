import { useCallback, useEffect, useState } from 'react';
import Game from './components/Game';
import { STAGE } from './data/explorerConfig';
import { sound } from './utils/audio';
import './App.css';

const fitScale = () => Math.min(window.innerWidth / STAGE.w, window.innerHeight / STAGE.h);

export default function App() {
  const [gameKey, setGameKey] = useState(0);
  const [lang, setLang] = useState('hi');
  const [muted, setMuted] = useState(false);
  const [scale, setScale] = useState(fitScale);

  useEffect(() => {
    const onResize = () => setScale(fitScale());
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
      <div className="stage" style={{ transform: `scale(${scale})` }} onScroll={lockScroll}>
        <Game
          key={gameKey}
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
