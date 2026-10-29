import React, { useState, useEffect, useRef, useCallback } from 'react';
import StageScaler from './components/StageScaler';
import WelcomeScreen from './components/WelcomeScreen';
import GameplayBackground from './components/GameplayBackground';
import Hud from './components/Hud';
import CameraRig from './components/CameraRig';
import QuestionPanel from './components/QuestionPanel';
import FeedbackToast from './components/FeedbackToast';
import GameOverPanel from './components/GameOverPanel';
import VictoryPanel from './components/VictoryPanel';
import { sound } from './utils/audio';
import questionsData from './data/questions.json';
import './App.css';

/**
 * Chhattisgarh Digital Explorer - Main Game Application
 * Built for CHiPS Rajyotsav Exhibition
 * Matches 8-panel reference flow specification
 */
export default function App() {
  const questions = questionsData.questions;

  // Primary Game State Machine
  // 'welcome' | 'intro' | 'question' | 'feedback' | 'traveling' | 'gameOver' | 'victory'
  const [status, setStatus] = useState('welcome');
  const [currentLevel, setCurrentLevel] = useState(0); // 0 to 9
  const [completed, setCompleted] = useState(() => Array(10).fill(false));
  const [failedLevel, setFailedLevel] = useState(null);

  // Question Interaction State
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

  // Safe timeout tracking for clean unmount & reset
  const timeoutsRef = useRef([]);
  const addTimeout = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimeouts();
  }, [clearAllTimeouts]);

  // Total completed checkpoints count (0 to 10)
  const completedCount = completed.filter(Boolean).length;

  // 1. Handle START GAME from Welcome Screen (Panel 1 -> Panel 2)
  const handleStartGame = () => {
    sound.playClick();
    clearAllTimeouts();

    // Reset clean state
    setCurrentLevel(0);
    setCompleted(Array(10).fill(false));
    setFailedLevel(null);
    setSelectedOption(null);
    setIsLocked(false);
    setShowFeedbackToast(false);

    // Switch to intro (full map overview)
    setStatus('intro');

    // After 1.5s in Overview + 1.2s camera zoom -> question popup opens automatically
    addTimeout(() => {
      setStatus('question');
    }, 2700);
  };

  // 2. Handle PLAY AGAIN (from Game Over or Victory) -> Fully reset to Welcome
  const handlePlayAgain = () => {
    sound.playClick();
    clearAllTimeouts();

    setStatus('welcome');
    setCurrentLevel(0);
    setCompleted(Array(10).fill(false));
    setFailedLevel(null);
    setSelectedOption(null);
    setIsLocked(false);
    setShowFeedbackToast(false);
  };

  // 3. Handle Option Selection (Panel 3 / 6)
  const handleSelectOption = (optionIndex) => {
    // Process answer exactly once; ignore any taps during feedback or travel
    if (isLocked || status !== 'question') return;

    setIsLocked(true);
    setSelectedOption(optionIndex);

    const activeQ = questions[currentLevel];
    const isCorrect = optionIndex === activeQ.correctIndex;

    if (isCorrect) {
      // Correct Answer Flow (Panel 4)
      sound.playCorrect();

      // Show small toast feedback at top-left and mark checkpoint complete
      setShowFeedbackToast(true);
      setCompleted((prev) => {
        const next = [...prev];
        next[currentLevel] = true;
        return next;
      });

      setStatus('feedback');

      // Hold feedback for ~900ms then auto-travel to next checkpoint (never requires continue click!)
      addTimeout(() => {
        setShowFeedbackToast(false);
        setStatus('traveling');
        sound.playTravel();
      }, 950);
    } else {
      // Wrong Answer Flow (Panel 7)
      sound.playWrong();

      // Flash option in red for ~600ms, then immediately trigger Game Over
      addTimeout(() => {
        setFailedLevel(currentLevel);
        setStatus('gameOver');
        sound.playGameOver();
      }, 650);
    }
  };

  // 4. Handle Travel Segment Completion (Panel 5 -> Panel 6 or Panel 8)
  const handleTravelComplete = () => {
    if (currentLevel >= 9) {
      // All 10 levels completed successfully! Victory Flow (Panel 8)
      sound.playVictory();
      setStatus('victory');
    } else {
      // Advance to next question automatically (Panel 6)
      const nextLvl = currentLevel + 1;
      setCurrentLevel(nextLvl);
      setSelectedOption(null);
      setIsLocked(false);
      setStatus('question');
    }
  };

  return (
    <StageScaler>
      <main className="game-stage-container" aria-label="Chhattisgarh Digital Explorer Game">
        {/* PANEL 1: WELCOME SCREEN */}
        {status === 'welcome' && (
          <WelcomeScreen onStartGame={handleStartGame} />
        )}

        {/* PANELS 2 - 8: Stationary Map World with Moving Camera & Overlays */}
        {status !== 'welcome' && (
          <div className="gameplay-viewport">
            {/* Immersive Chhattisgarh Scenic Background */}
            <GameplayBackground />

            {/* Top HUD: CHiPS Logo (left), Title Plaque (center), Progress Pill (right) */}
            <Hud progressCount={completedCount} totalLevels={10} />

            {/* Camera Rig & 3D Stationary Chhattisgarh World */}
            <CameraRig
              status={status}
              currentLevel={currentLevel}
              completed={completed}
              failedLevel={failedLevel}
              onTravelComplete={handleTravelComplete}
            />

            {/* PANEL 3 & 6: Question Panel on Right Side */}
            {(status === 'question' || status === 'feedback') && (
              <QuestionPanel
                levelIndex={currentLevel}
                questionData={questions[currentLevel]}
                selectedOption={selectedOption}
                isLocked={isLocked}
                onSelectOption={handleSelectOption}
                isExiting={status === 'feedback'}
              />
            )}

            {/* PANEL 4: Small Non-Blocking Feedback Toast (Top-Left) */}
            <FeedbackToast isVisible={showFeedbackToast} />

            {/* PANEL 7: Game Over Panel (Left Side on Wrong Answer) */}
            {status === 'gameOver' && (
              <GameOverPanel onPlayAgain={handlePlayAgain} />
            )}

            {/* PANEL 8: Victory Panel (Left Side on 10/10 Completion) */}
            {status === 'victory' && (
              <VictoryPanel onPlayAgain={handlePlayAgain} />
            )}
          </div>
        )}
      </main>
    </StageScaler>
  );
}
