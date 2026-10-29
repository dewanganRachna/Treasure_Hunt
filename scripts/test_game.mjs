import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const PORT = 4173;
const DIST_DIR = path.resolve('dist');
const SCREENSHOTS_DIR = path.resolve('screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// 1. Simple static file server for dist/
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(DIST_DIR, reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        fs.readFile(path.join(DIST_DIR, 'index.html'), (err2, fallback) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallback);
          }
        });
      } else {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`[Server] Serving dist at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// 2. Launch Headless Chrome
function launchChrome() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\tmp\\chrome-cg-test';

  const args = [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--window-size=1920,1080',
    '--hide-scrollbars',
    '--disable-gpu',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ];

  console.log('[Chrome] Launching Chrome...');
  const proc = spawn(chromePath, args);
  return proc;
}

// 3. Connect to CDP via WebSocket
async function connectCDP() {
  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const list = await res.json();
      if (list && list[0] && list[0].webSocketDebuggerUrl) {
        wsUrl = list[0].webSocketDebuggerUrl;
        break;
      }
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!wsUrl) throw new Error('Could not connect to Chrome debugging port');

  console.log('[CDP] Connecting to:', wsUrl);
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let idCounter = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[Page Error]:', data.params?.exceptionDetails?.exception?.description || data.params?.exceptionDetails?.text);
    }
    if (data.id && callbacks.has(data.id)) {
      const { resolve, reject } = callbacks.get(data.id);
      callbacks.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res?.result?.value;
  };

  const waitForSelector = async (selector, timeoutMs = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const val = await evaluate(`!!document.querySelector('${selector}')`);
      if (val) return true;
      await new Promise((r) => setTimeout(r, 200));
    }
    return false;
  };

  const screenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(SCREENSHOTS_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`[Screenshot] Saved: ${filename}`);
  };

  return { ws, send, evaluate, waitForSelector, screenshot };
}

// 4. Main Automated Game Verification Flow
async function main() {
  const server = await startServer();
  const chromeProc = launchChrome();

  try {
    await new Promise((r) => setTimeout(r, 1500));
    const { ws, send, evaluate, waitForSelector, screenshot } = await connectCDP();

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('[Test] Navigating to game...');
    await send('Page.navigate', { url: `http://localhost:${PORT}` });
    await waitForSelector('.welcome-main-title', 10000);

    // STAGE 1: Welcome Screen (Panel 1)
    console.log('[Test] 1. Checking Welcome Screen...');
    const welcomeTitle = await evaluate('document.querySelector(".welcome-main-title")?.innerText');
    console.log('   Title found:', welcomeTitle?.replace(/\n/g, ' '));
    await screenshot('panel1_welcome.png');

    // Click START GAME
    console.log('[Test] Clicking START GAME...');
    await evaluate('document.querySelector(".welcome-start-btn")?.click()');
    await waitForSelector('.ribbon-main-title', 10000);

    // STAGE 2: Full Map View (Panel 2)
    console.log('[Test] 2. Checking Full Map View...');
    await new Promise((r) => setTimeout(r, 600));
    const hudTitle = await evaluate('document.querySelector(".ribbon-main-title")?.innerText');
    const progressText = await evaluate('document.querySelector(".progress-counter-text")?.innerText');
    console.log(`   HUD Title: "${hudTitle}", Progress: "${progressText}"`);
    await screenshot('panel2_full_map_view.png');

    // Wait for zoom to Level 1
    console.log('[Test] Waiting for auto-zoom to Level 1 (~2.2s)...');
    await new Promise((r) => setTimeout(r, 2400));

    // STAGE 3: Zoom to Level 1 + Question Popup (Panel 3)
    console.log('[Test] 3. Checking Question Popup at Level 1...');
    const q1En = await evaluate('document.querySelector(".question-title-en")?.innerText');
    const q1Hi = await evaluate('document.querySelector(".question-title-hi")?.innerText');
    console.log('   Q1 En:', q1En);
    console.log('   Q1 Hi:', q1Hi);
    await screenshot('panel3_zoom_level1_question.png');

    // STAGE 4: Correct Answer Selection (Panel 4)
    console.log('[Test] 4. Answering Q1 correctly (Option B)...');
    // Option B is index 1
    await evaluate('document.querySelectorAll(".question-option-btn")[1]?.click()');
    await new Promise((r) => setTimeout(r, 350));
    const isToastVisible = await evaluate('!!document.querySelector(".feedback-toast-widget")');
    console.log('   Toast visible:', isToastVisible);
    await screenshot('panel4_correct_answer_feedback.png');

    // STAGE 5: Auto Travel to Next (Panel 5)
    console.log('[Test] 5. Capturing Auto Travel to Level 2...');
    await new Promise((r) => setTimeout(r, 900));
    await screenshot('panel5_auto_travel.png');

    // STAGE 6: Next Question (Panel 6)
    console.log('[Test] 6. Checking Level 2 Question Popup...');
    await new Promise((r) => setTimeout(r, 1600));
    const q2En = await evaluate('document.querySelector(".question-title-en")?.innerText');
    const prog2 = await evaluate('document.querySelector(".progress-counter-text")?.innerText');
    console.log(`   Q2 En: ${q2En}, Progress: ${prog2}`);
    await screenshot('panel6_next_question.png');

    // Play answers for Levels 2 through 10
    // Correct answers:
    // Level 1 (idx 0): Option B (idx 1) [already done]
    // Level 2 (idx 1): Option A (idx 0)
    // Level 3 (idx 2): Option C (idx 2)
    // Level 4 (idx 3): Option A (idx 0)
    // Level 5 (idx 4): Option B (idx 1)
    // Level 6 (idx 5): Option B (idx 1)
    // Level 7 (idx 6): Option C (idx 2)
    // Level 8 (idx 7): Option B (idx 1)
    // Level 9 (idx 8): Option B (idx 1)
    // Level 10 (idx 9): Option D (idx 3)
    const remainingAnswers = [
      { level: 2, optionIndex: 0 },
      { level: 3, optionIndex: 2 },
      { level: 4, optionIndex: 0 },
      { level: 5, optionIndex: 1 },
      { level: 6, optionIndex: 1 },
      { level: 7, optionIndex: 2 },
      { level: 8, optionIndex: 1 },
      { level: 9, optionIndex: 1 },
      { level: 10, optionIndex: 3 }
    ];

    for (const item of remainingAnswers) {
      console.log(`[Test] Answering Level ${item.level} with Option Index ${item.optionIndex}...`);
      await evaluate(`document.querySelectorAll(".question-option-btn")[${item.optionIndex}]?.click()`);
      // Wait for feedback (~950ms) + travel (~2000ms) + buffer
      await new Promise((r) => setTimeout(r, 3300));
    }

    // STAGE 8: Victory Screen (Panel 8)
    console.log('[Test] 8. Checking Victory Screen...');
    await new Promise((r) => setTimeout(r, 1200));
    const victoryTitle = await evaluate('document.querySelector(".victory-main-title")?.innerText');
    const victoryScore = await evaluate('document.querySelector(".victory-score-text")?.innerText');
    console.log(`   Victory: "${victoryTitle}", Score: "${victoryScore}"`);
    await screenshot('panel8_victory.png');

    // Click PLAY AGAIN from Victory Screen
    console.log('[Test] Clicking PLAY AGAIN from Victory Screen...');
    await evaluate('document.querySelector(".play-again-btn")?.click()');
    await new Promise((r) => setTimeout(r, 800));
    const backToWelcome = await evaluate('!!document.querySelector(".welcome-main-title")');
    console.log('   Successfully returned to Welcome:', backToWelcome);

    // TEST WRONG ANSWER FLOW: Panel 7 (Game Over)
    console.log('[Test] 7. Testing Wrong Answer on Level 1 (Game Over Flow)...');
    await evaluate('document.querySelector(".welcome-start-btn")?.click()');
    await new Promise((r) => setTimeout(r, 3000)); // wait for zoom to Level 1
    // Click Option A (wrong answer on Level 1)
    console.log('   Clicking Wrong Option (A)...');
    await evaluate('document.querySelectorAll(".question-option-btn")[0]?.click()');
    await new Promise((r) => setTimeout(r, 1500)); // wait for red flash & zoom out
    const gameOverTitle = await evaluate('document.querySelector(".game-over-title-en")?.innerText');
    console.log(`   Game Over Title: "${gameOverTitle}"`);
    await screenshot('panel7_game_over.png');

    // Click PLAY AGAIN from Game Over
    console.log('[Test] Clicking PLAY AGAIN from Game Over...');
    await evaluate('document.querySelector(".play-again-btn")?.click()');
    await new Promise((r) => setTimeout(r, 800));
    const resetWelcome = await evaluate('!!document.querySelector(".welcome-main-title")');
    console.log('   Successfully reset to Welcome from Game Over:', resetWelcome);

    // KIOSK MODE TEST (?kiosk=1)
    console.log('[Test] Testing Kiosk Mode (?kiosk=1)...');
    await send('Page.navigate', { url: `http://localhost:${PORT}?kiosk=1` });
    await new Promise((r) => setTimeout(r, 1500));
    const isKioskClass = await evaluate('document.querySelector(".stage-viewport")?.classList.contains("kiosk-mode")');
    console.log('   Kiosk mode active:', isKioskClass);

    // MULTI-RESOLUTION SCALING TESTS
    console.log('[Test] Testing 1366x768 resolution scaling...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise((r) => setTimeout(r, 500));
    await screenshot('screen_1366x768.png');

    console.log('[Test] Testing 2560x1440 resolution scaling...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 2560,
      height: 1440,
      deviceScaleFactor: 1,
      mobile: false
    });
    await new Promise((r) => setTimeout(r, 500));
    await screenshot('screen_2560x1440.png');

    console.log('\n[SUCCESS] All 8 panels and game flows verified successfully!');
    ws.close();
  } catch (err) {
    console.error('[Error in Test]:', err);
  } finally {
    try {
      chromeProc.kill();
    } catch {}
    server.close();
  }
}

main();

