#!/usr/bin/env node
/**
 * One-command deploy for the Treasure Hunt game.
 *
 *   npm run deploy                          build, upload over SSH, install, reload nginx
 *   npm run deploy -- --host user@server    same, without a deploy/deploy.env
 *   npm run deploy -- --local               run on the server itself (no SSH)
 *   npm run deploy -- --rollback            put the previous release back
 *   npm run deploy -- --set-password        change the kiosk admin ID/password
 *   npm run deploy -- --logout-all          log every device out
 *   npm run deploy -- --dry-run             build and pack, print what would run on the server
 *
 * The first deploy asks (on the server, over SSH) for the admin ID and password that unlock
 * the game on each kiosk.
 *
 * Settings come from deploy/deploy.env (see deploy/deploy.env.example), then the environment,
 * then the command line. Works on Windows (PowerShell/cmd), macOS and Linux: it only needs
 * node, npm, tar, ssh and scp, which all ship with Windows 10+.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IS_WIN = process.platform === 'win32';
const OUT_DIR = '.deploy'; // relative paths only: Windows tar/scp read "C:\..." as a remote host
const ARCHIVE = `${OUT_DIR}/treasure_hunt-build.tar.gz`;
const SERVER_FILES = ['deploy/server/install.sh', 'deploy/server/add-include.awk', 'deploy/nginx/treasure_hunt.conf'];

const color = (code) => (s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const step = (s) => console.log(`\n${color('1;33')('==>')} ${s}`);
const fail = (s) => {
  console.error(`\n${color('1;31')('Deploy failed:')} ${s}`);
  process.exit(1);
};

// ---------- settings ----------
const KNOWN_SETTINGS = new Set([
  'DEPLOY_HOST', 'DEPLOY_PORT', 'DEPLOY_SSH_KEY', 'URL_PATH', 'APP_DIR', 'NGINX_SITE', 'NGINX_SERVER_NAME',
  'KEEP_RELEASES', 'COOKIE_DAYS', 'COOKIE_SECURE', 'PUBLIC_URL', 'LAUNCHER_URL', 'CERT_API_URL',
  'REPORT_BRANCH', 'REPORT_REPO', 'REPORT_SSH_KEY', 'REPORT_DIR'
]);

function readEnvFile(file) {
  if (!existsSync(file)) return {};
  const out = {};
  // A mistyped line would otherwise be ignored without a word
  const ignored = (n, why) => console.warn(`${color('1;35')('!!')} ${file}: line ${n} ${why}, so it is ignored.`);
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    const eq = line.indexOf('=');
    if (eq < 1) return ignored(i + 1, 'is not KEY=value');
    const key = line.slice(0, eq).trim();
    if (!KNOWN_SETTINGS.has(key)) return ignored(i + 1, `sets ${key}, which isn't a setting (a typo?)`);
    out[key] = line.slice(eq + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
  });
  return out;
}

function parseArgs(argv) {
  const flags = new Set();
  const values = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--host' || a === '--port' || a === '--key') values[a.slice(2)] = argv[++i];
    else if (a.startsWith('--')) flags.add(a.slice(2));
    else fail(`Unknown argument "${a}". Run with --help.`);
  }
  return { flags, values };
}

const USAGE = `Usage: npm run deploy [-- options]

  --host user@server   SSH target (or DEPLOY_HOST in deploy/deploy.env)
  --port 22            SSH port (DEPLOY_PORT)
  --key ~/.ssh/id_x    SSH key (DEPLOY_SSH_KEY)
  --local              install on this machine (run it on the server itself)
  --rollback           switch the server back to the previous release
  --set-password       change the admin ID/password (logged-in kiosks stay logged in)
  --logout-all         log every device out; kiosks must log in again
  --dry-run            build and pack, then print the server commands instead of running them
  --skip-install       don't run npm ci first
  --skip-checks        don't run the linter first`;

const { flags, values } = parseArgs(process.argv.slice(2));
if (flags.has('help')) {
  console.log(USAGE);
  process.exit(0);
}

const fileEnv = readEnvFile(join(ROOT, 'deploy', 'deploy.env'));
const setting = (key, fallback = '') => process.env[key] || fileEnv[key] || fallback;
const urlPath = `/${setting('URL_PATH', '/treasure_hunt').replace(/^\/+|\/+$/g, '')}`;

const cfg = {
  host: values.host ?? setting('DEPLOY_HOST'),
  port: values.port ?? setting('DEPLOY_PORT', '22'),
  key: values.key ?? setting('DEPLOY_SSH_KEY'),
  urlPath,
  publicUrl: setting('PUBLIC_URL').replace(/\/+$/, ''),
  // Where the HOME buttons and the returns go; empty keeps the portal page built into the game
  launcherUrl: setting('LAUNCHER_URL'),
  // Certificate API the browser posts wins to; baked into the build
  certApiUrl: setting('CERT_API_URL', 'https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate'),
  // Passed to install.sh on the server
  remoteEnv: {
    URL_PATH: urlPath,
    APP_DIR: setting('APP_DIR', '/var/www/treasure_hunt'),
    NGINX_SITE: setting('NGINX_SITE'),
    NGINX_SERVER_NAME: setting('NGINX_SERVER_NAME'),
    KEEP_RELEASES: setting('KEEP_RELEASES', '5'),
    COOKIE_DAYS: setting('COOKIE_DAYS', '365'),
    COOKIE_SECURE: setting('COOKIE_SECURE', 'auto')
  }
};
if (cfg.launcherUrl && !/^(https?:\/\/|\/)/.test(cfg.launcherUrl)) {
  fail(`LAUNCHER_URL must start with http://, https:// or / (got "${cfg.launcherUrl}").`);
}
if (!/^https?:\/\//.test(cfg.certApiUrl)) fail(`CERT_API_URL must be an http(s) URL (got "${cfg.certApiUrl}").`);

const local = flags.has('local');
const dryRun = flags.has('dry-run');
// Maintenance modes run install.sh with a flag instead of deploying a build
const MODES = { rollback: 'Rolled back.', 'set-password': 'Admin login updated.', 'logout-all': 'All devices logged out.' };
const mode = Object.keys(MODES).find((m) => flags.has(m));
if (!local && !dryRun && !cfg.host) {
  fail('No server given. Copy deploy/deploy.env.example to deploy/deploy.env and set DEPLOY_HOST, or pass --host user@server.');
}
if (local && IS_WIN) fail('--local runs install.sh with sudo on the server itself; run it there, not on Windows.');

// ---------- helpers ----------
function run(cmd, args, { env, shell = false, quiet = false } = {}) {
  if (!quiet) console.log(color('2')(`$ ${cmd} ${args.join(' ')}`));
  const opts = { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env }, shell };
  // With a shell, pass one command string (our arguments are fixed words, nothing to escape)
  const r = shell ? spawnSync([cmd, ...args].join(' '), opts) : spawnSync(cmd, args, opts);
  if (r.error) fail(`could not start ${cmd}: ${r.error.message}`);
  if (r.status !== 0) fail(`${cmd} ${args[0] ?? ''} exited with code ${r.status}.`);
}
// npm is npm.cmd on Windows, which needs a shell
const npm = (...args) => run('npm', args, { shell: IS_WIN });

const shQuote = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
const sshArgs = () => ['-p', cfg.port, ...(cfg.key ? ['-i', cfg.key] : []), '-o', 'ServerAliveInterval=30'];
const scpArgs = () => ['-P', cfg.port, ...(cfg.key ? ['-i', cfg.key] : [])];
const envPairs = () => Object.entries(cfg.remoteEnv).filter(([, v]) => v !== '');

// ---------- file ownership ----------
// npm under sudo leaves root-owned files in the project that later normal runs can't replace.
// The installer asks for sudo itself, so the deploy never needs it.
if (!IS_WIN && process.getuid() === 0 && process.env.SUDO_USER) {
  fail(`Run this without sudo, as ${process.env.SUDO_USER}. It asks for sudo itself for the install step.`);
}

/** First path in the folders a deploy rewrites that belongs to another user, e.g. one left by a sudo run. */
function foreignPath() {
  if (IS_WIN || process.getuid() === 0) return '';
  const dirs = ['node_modules', 'dist', OUT_DIR].filter((d) => existsSync(join(ROOT, d)));
  if (dirs.length === 0) return '';
  const r = spawnSync('find', [...dirs, '!', '-uid', String(process.getuid()), '-print', '-quit'], { cwd: ROOT, encoding: 'utf8' });
  return r.stdout?.trim() ?? '';
}

const foreign = foreignPath();
if (foreign) {
  fail(
    `${foreign} belongs to another user (an earlier run with sudo?), so npm can't replace it.\n` +
      `Give the folder back to yourself, then run this again without sudo:\n\n` +
      `  sudo chown -R "$(id -un):$(id -gn)" ${shQuote(ROOT)}`
  );
}

/** Fresh .deploy/ folder holding LF-only copies of the server files (a Windows checkout may have CRLF, which bash rejects). */
function stageServerFiles() {
  rmSync(join(ROOT, OUT_DIR), { recursive: true, force: true });
  mkdirSync(join(ROOT, OUT_DIR), { recursive: true });
  return SERVER_FILES.map((f) => {
    const staged = `${OUT_DIR}/${basename(f)}`;
    writeFileSync(join(ROOT, staged), readFileSync(join(ROOT, f), 'utf8').replace(/\r\n/g, '\n'));
    return staged;
  });
}

/** Run install.sh on the server (or here with --local) with the given arguments. */
function runInstaller(installArgs, files) {
  if (local) {
    const args = ['env', ...envPairs().map(([k, v]) => `${k}=${v}`), 'bash', 'deploy/server/install.sh', ...installArgs];
    if (dryRun) {
      step('Dry run: this would run here');
      console.log(`sudo ${args.join(' ')}`);
    } else {
      step('Installing (sudo may ask for your password)');
      run('sudo', args);
    }
    return;
  }
  const remoteDir = `/tmp/treasure_hunt_deploy_${Date.now()}`;
  const env = envPairs().map(([k, v]) => `${k}=${shQuote(v)}`).join(' ');
  const wrapped = `cd ${remoteDir} && sudo env ${env} bash install.sh ${installArgs.map(shQuote).join(' ')}; status=$?; rm -rf ${remoteDir}; exit $status`;

  if (dryRun) {
    const host = cfg.host || '<DEPLOY_HOST>';
    step('Dry run: these would run against the server');
    console.log(`ssh ${sshArgs().join(' ')} ${host} "mkdir -p ${remoteDir}"`);
    console.log(`scp ${scpArgs().join(' ')} ${files.join(' ')} ${host}:${remoteDir}/`);
    console.log(`ssh -t ${sshArgs().join(' ')} ${host} "${wrapped}"`);
    return;
  }
  step(`Uploading to ${cfg.host}`);
  run('ssh', [...sshArgs(), cfg.host, `mkdir -p ${remoteDir}`]);
  run('scp', [...scpArgs(), ...files, `${cfg.host}:${remoteDir}/`]);
  step('Installing on the server (sudo may ask for your password)');
  run('ssh', ['-t', ...sshArgs(), cfg.host, wrapped]);
}

// ---------- rollback / password / logout ----------
if (mode) {
  runInstaller([`--${mode}`], local ? [] : stageServerFiles());
  if (!dryRun) {
    rmSync(join(ROOT, OUT_DIR), { recursive: true, force: true });
    console.log(`\n${color('1;32')(MODES[mode])}`);
  }
  process.exit(0);
}

// ---------- build ----------
const t0 = Date.now();
if (!flags.has('skip-install')) {
  step('Installing dependencies');
  npm('ci', '--no-audit', '--no-fund');
}
if (!flags.has('skip-checks')) {
  step('Lint');
  npm('run', 'lint');
}
step(`Building for ${cfg.urlPath}/${cfg.launcherUrl ? ` (home page: ${cfg.launcherUrl})` : ' (home page: the Rajyotsav portal)'}`);
run('npm', ['run', 'build'], {
  shell: IS_WIN,
  env: { BASE_PATH: `${cfg.urlPath}/`, VITE_LAUNCHER_URL: cfg.launcherUrl, VITE_CERT_API_URL: cfg.certApiUrl }
});

const indexHtml = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8');
if (!indexHtml.includes(`${cfg.urlPath}/assets/`)) fail(`dist/index.html does not point at ${cfg.urlPath}/assets/; the build used the wrong base path.`);

// Which commit is live: deploy/server/report.sh compares it with the server's checkout
const git = (...args) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' }).stdout?.trim() ?? '';
const commit = git('rev-parse', '--short', 'HEAD') || 'unknown';
const changed = git('status', '--porcelain', '--untracked-files=no') ? ' with local changes' : '';
writeFileSync(join(ROOT, 'dist', 'version.txt'), `${commit}${changed}, built ${new Date().toISOString()}\n`);

step('Packing the build');
const serverFiles = stageServerFiles();
run('tar', ['-czf', ARCHIVE, '-C', 'dist', '.']);

// ---------- install ----------
if (local) runInstaller([ARCHIVE], []);
else runInstaller(['treasure_hunt-build.tar.gz'], [ARCHIVE, ...serverFiles]);

if (!dryRun) rmSync(join(ROOT, OUT_DIR), { recursive: true, force: true });

const where = cfg.publicUrl || (cfg.host ? `http(s)://${cfg.host.replace(/^.*@/, '')}` : 'http(s)://<server>');
console.log(`\n${color('1;32')(dryRun ? 'Dry run finished' : 'Deployed')} in ${Math.round((Date.now() - t0) / 1000)}s → ${where}${cfg.urlPath}/`);
