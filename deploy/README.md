# Deploying the Treasure Hunt

The game is served by your existing nginx at **`https://<your-server>/treasure_hunt/`**, behind an admin login. One command builds it, uploads it, installs it and reloads nginx:

```bash
npm run deploy
```

## What you need

- **Server:** Linux with nginx already running your site, SSH access, and a user that can `sudo`. Node is **not** needed on the server, unless you build there (see [Deploying from the server itself](#deploying-from-the-server-itself)).
- **Kiosks:** internet access to `cggeomap.cgstate.gov.in`, because the kiosk browser sends wins to the certificate API itself.
- **Your computer:** Node 20.19+ or 22.12+ (Vite needs it to build), and `ssh`, `scp`, `tar`. Those three come with Windows 10/11, macOS and Linux.

## First deploy

1. Copy the settings file and fill in at least `DEPLOY_HOST`:

   ```bash
   cp deploy/deploy.env.example deploy/deploy.env
   ```

   `deploy/deploy.env` is git-ignored. If the server hosts more than one site, also set `NGINX_SITE` (the file holding the site's `server { }` block, for example `/etc/nginx/sites-available/default`). If that file has several `server` blocks, set `NGINX_SERVER_NAME` to the domain that should serve the game.

   Once the select-game screen exists, set `LAUNCHER_URL` to its address and deploy again. That adds the **All games** links and sends idle kiosks back to it. The launcher should link to `https://<your-server>/treasure_hunt/`.

2. Run `npm run deploy`. It runs `npm ci`, the linter and a production build for `/treasure_hunt/`. Then it uploads the build over SSH and runs `deploy/server/install.sh` with `sudo`.

3. On the first deploy the server asks you to choose the **admin ID and password** (typed over SSH, stored only as a hash). Then open `https://<your-server>/treasure_hunt/` on each kiosk and log in once. The kiosk stays logged in for a year (`COOKIE_DAYS`).

Later deploys don't ask anything, and kiosks stay logged in across deploys.

## What changes on the server

Nothing in your existing nginx configuration is rewritten. The installer:

| What | Where |
|---|---|
| The game's files, one folder per release | `/var/www/treasure_hunt/releases/<timestamp>/`, with `current` pointing at the live one |
| The game's `location` blocks | `/etc/nginx/snippets/treasure_hunt.conf` (mode 600, it holds the session token) |
| **One `include` line** (plus a comment) inside your server block | added the first time only; a backup of the file is kept in `/var/www/treasure_hunt/nginx-backups/` |
| Admin ID + hashed password | `/etc/nginx/treasure_hunt.htpasswd` |
| Session token that kiosks carry in their cookie | `/etc/nginx/treasure_hunt.session` |
| Login rate limit (6 tries/minute per address) | `/etc/nginx/conf.d/treasure_hunt_login_limit.conf`, only if `nginx.conf` includes `conf.d/*.conf` |

It runs `nginx -t` before reloading. If nginx rejects anything, every change is undone and the live site is untouched. The template for the location blocks is [nginx/treasure_hunt.conf](nginx/treasure_hunt.conf), if you'd rather add it by hand.

## How the login works

- `/treasure_hunt/login/` is the only public page. It asks for the admin ID and password.
- It sends them to `/treasure_hunt/auth`, where **nginx itself** checks them against the hashed password file. If they're right, it sets an `HttpOnly` cookie, `Secure` when the site has HTTPS.
- Every game file (page, scripts, fonts, map) needs that cookie. Someone who copies the URL to another device gets the login page instead of the game.
- `/treasure_hunt/logout` logs out the device it's opened on.
- The kiosk browser must keep cookies between restarts: use a normal Chrome profile with `--kiosk`, not `--incognito`.
- If the select-game screen is on another site, the redirect to the game still carries the cookie, as long as the kiosk logged in to the game once.

## Certificates

When a player wins, the kiosk browser posts their name, `gameName` (`Treasure Hunt`, printed on the certificate) and time straight to `CERT_API_URL` (the Rajyotsav certificate API, baked into the build). The finale shows the QR code it returns, and players scan it with their phone to download the PDF.

- The API allows cross-site calls (`Access-Control-Allow-Origin: *`), so nothing is needed on your server for this.
- Our login cookie is not sent to the API.
- The call doesn't go through nginx on purpose: the API's server only offers an old TLS handshake that OpenSSL 3 (newer nginx, Node) refuses, while browsers connect fine.
- If your site sends a `Content-Security-Policy` header with `connect-src`, add `https://cggeomap.cgstate.gov.in` to it.

## Everyday commands

```bash
npm run deploy                      # deploy the current code
npm run deploy -- --rollback        # go back to the previous release (5 are kept)
npm run deploy -- --set-password    # change the admin ID/password; kiosks stay logged in
npm run deploy -- --logout-all      # log every device out (e.g. a kiosk was lost)
npm run deploy -- --dry-run         # build and show the server commands without running them
npm run deploy -- --host user@server   # without a deploy.env
```

### Deploying from the server itself

To build on the server instead, it pulls the code from `CMITF/treasure_hunt` with a read-only deploy key. The server then needs Node 20.19+ or 22.12+, and internet access to GitHub and npm.

1. On the server, as the user that will deploy, make a key just for this repository:

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/treasure_hunt_deploy -N "" -C "treasure_hunt deploy key"
   cat ~/.ssh/treasure_hunt_deploy.pub
   ```

2. On GitHub, open **CMITF/treasure_hunt → Settings → Deploy keys → Add deploy key**, paste that `.pub` line and leave **Allow write access** off.

3. Clone with that key and deploy. `-c` saves the key choice in the clone, so later pulls use it too. The first connection asks you to confirm GitHub's host key: answer `yes`.

   ```bash
   git clone -c core.sshCommand="ssh -i ~/.ssh/treasure_hunt_deploy -o IdentitiesOnly=yes" -b classic git@github.com:CMITF/treasure_hunt.git
   cd treasure_hunt
   npm run deploy -- --local
   ```

To update later, from that folder:

```bash
git pull && npm run deploy -- --local
```

Run it as your normal user, **not with `sudo`**: it asks for your sudo password itself for the install step. `--rollback`, `--set-password` and `--logout-all` work with `--local` too. With a build you already have: `sudo bash deploy/server/install.sh dist`.

## Server reports

`deploy/server/report.sh` checks the game on the server and pushes a report to a separate private repository, where developers read it. It covers:
- **The deploy:** whether it worked, with its output, and which commit is live.
- **nginx:** what nginx answers for each of the game's addresses, the nginx sites, and the game's snippet.
- **Logs:** recent nginx errors and requests for the game.
- **The server:** SELinux denials, the firewall, and tool versions.

The development cycle:

```bash
git pull && bash deploy/server/report.sh --deploy
```

Run that on the server. On the developer's PC, inside this project:

```bash
git -C .server-reports pull
```

Read `.server-reports/report.md`, fix, push, and repeat. Each report is one commit there, so `git log` shows earlier ones.

The script's options:
- **`--deploy`** deploys first and puts the deploy's output in the report, even when it fails. Without it, the script only reports.
- **`--no-push`** only writes `~/treasure_hunt_report.md`.

Run it without `sudo`; it asks for the sudo password once, to read nginx's files and logs.

**What the report leaves out:**
- the admin ID and password hash
- the session token
- passwords inside URLs
- other sites' full configs (only their `listen`, `server_name`, `location` and similar lines)
- the last part of client IP addresses in logs

### Setting up server reports (once)

The reports go to their own repository so the server's key for the game's code stays read-only. A key with write access there would let anyone who gets into the server change the code.

1. As CMITF, create an empty private repository `CMITF/treasure_hunt_reports` and add the developers as collaborators.
2. On the server, make a second key, because GitHub won't accept one deploy key for two repositories:

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/treasure_hunt_reports -N "" -C "treasure_hunt reports"
   cat ~/.ssh/treasure_hunt_reports.pub
   ```

   Add it under **CMITF/treasure_hunt_reports → Settings → Deploy keys** with **Allow write access** ticked.
3. Add these two lines to `deploy/deploy.env` on the server:

   ```
   REPORT_REPO=git@github.com:CMITF/treasure_hunt_reports.git
   REPORT_SSH_KEY=~/.ssh/treasure_hunt_reports
   ```

4. On the developer's PC, inside this project (the folder is git-ignored):

   ```bash
   git clone https://github.com/CMITF/treasure_hunt_reports.git .server-reports
   ```

## Kiosk setup tips

- **Browser.** Open the select-game screen (or `https://<your-server>/treasure_hunt/`) in Chrome with `--kiosk`, in a normal profile so the login cookie survives restarts (not `--incognito`). After logging in once it goes straight to the game. Useful extra Chrome flags:
  - `--noerrdialogs --disable-session-crashed-bubble` (no restore prompts after a power cut)
  - `--overscroll-history-navigation=0` (no swipe-back)
  - `--disable-pinch` (belt and braces; the game already blocks zoom)
  - `--disable-features=Translate` (no translate bar over the Hindi text)
- **Typing names.** The game brings its own on-screen keyboard, so the Windows touch keyboard isn't needed. You can leave its automatic pop-up off.
- **Windows.** Turn off screen sleep and screen saver, turn off edge-swipe gestures, and start Chrome automatically at login.
- **Fullscreen.** Press the game's fullscreen button if the browser isn't already fullscreen.
- **Idle.** After 2 minutes without touches the game goes back to the select-game screen (`LAUNCHER_URL`), or to a fresh Hindi start screen if none is set.

## Troubleshooting

- **"belongs to another user"** or npm `EACCES` errors on the server: npm was run with `sudo` once in this folder, which left root-owned files. Run `sudo chown -R "$(id -un):$(id -gn)" .` in the folder, then `npm run deploy -- --local` without `sudo`. The deploy refuses to run under `sudo` for this reason; it asks for `sudo` itself when it installs.
- **"Several nginx files have server blocks"**: the message lists each file's `listen` and `server_name` lines. Pick the file whose `server_name` is the address the kiosks open (its `listen 443 ssl` block if the site has HTTPS) and set `NGINX_SITE=<that file>` in `deploy/deploy.env`.
- **"has several server blocks"**: set `NGINX_SERVER_NAME` to the domain that should serve the game.
- **The page loads but looks unstyled, or files 404**: the build was made for another path. `npm run deploy` always builds for `URL_PATH`, so redeploy with it.
- **Login keeps coming back**: the browser isn't keeping the cookie. Check it isn't in incognito/guest mode. On a plain-HTTP site, set `COOKIE_SECURE=no`.
- **See what nginx serves:** `curl -I https://<your-server>/treasure_hunt/` should answer `302` to `/treasure_hunt/login/` when not logged in.
- **"The certificate could not be made"** on the finale: the kiosk can't reach `CERT_API_URL` (no internet, firewall, or a `Content-Security-Policy` blocking it), or the API is down. Open the browser's developer console on the kiosk to see which.
