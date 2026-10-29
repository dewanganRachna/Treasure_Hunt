import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Game from './components/Game';
import { getLayout } from './data/explorerConfig';
import { LAUNCHER_URL } from './data/platform';
import { sound } from './utils/audio';
import './App.css';

/** Layout and scale for the current window, or null while the window has no size yet. */
const measure = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (!vw || !vh) return null;
  const layout = getLayout(vw, vh);
  return { layout, scale: Math.min(vw / layout.w, vh / layout.h) };
};

export default function App() {
  const [gameKey, setGameKey] = useState(0);
  const [lang, setLang] = useState('hi');
  const [muted, setMuted] = useState(false);
  // Kept across "Play again" (same player); cleared by the idle reset (next visitor)
  const [playerName, setPlayerName] = useState('');
  const [fit, setFit] = useState(measure);

  useLayoutEffect(() => {
    const onResize = () => {
      const next = measure();
      if (next) setFit((prev) => (prev && prev.layout === next.layout && prev.scale === next.scale ? prev : next));
    };
    // The window can get its size between the first render and this effect, with no resize event left to catch it
    onResize();
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

  // Kiosk idle reset: back to the select-game screen if there is one, otherwise a fresh start in Hindi
  const idleReset = useCallback(() => {
    if (LAUNCHER_URL) {
      window.location.assign(LAUNCHER_URL);
      return;
    }
    setLang('hi');
    setPlayerName('');
    setGameKey((k) => k + 1);
  }, []);

  // Focusing an element near the edge can scroll the clipped stage sideways; undo it
  const lockScroll = (e) => {
    e.currentTarget.scrollLeft = 0;
    e.currentTarget.scrollTop = 0;
  };

  if (!fit) return <div className="fit" />;
  const { layout, scale } = fit;

  return (
    <div className="fit">
      <div
        className={`stage${layout.portrait ? ' portrait' : ''}`}
        style={{ width: layout.w, height: layout.h, transform: `scale(${scale})` }}
        onScroll={lockScroll}
      >
        <Game
          key={gameKey}
          layout={layout}
          lang={lang}
          muted={muted}
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onToggleLang={toggleLang}
          onToggleSound={toggleSound}
          onFullscreen={toggleFullscreen}
          onRestart={restart}
          onIdle={idleReset}
        />
      </div>
    </div>
  );
}
