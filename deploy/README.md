# Deploying the Treasure Hunt

The game is served by your existing nginx at **`https://<your-server>/treasure_hunt/`**, behind an admin login. One command builds it, uploads it, installs it and reloads nginx:

```bash
npm run deploy
```

## What you need

- **Server:** Linux with nginx already running your site, SSH access, and a user that can `sudo`. Node is **not** needed on the server.
- **Your computer:** Node 18+ and `ssh`, `scp`, `tar`. These come with Windows 10/11, macOS and Linux.

## First deploy

1. Copy the settings file and fill in at least `DEPLOY_HOST`:

   ```bash
   cp deploy/deploy.env.example deploy/deploy.env
   ```

   `deploy/deploy.env` is git-ignored. If the server hosts more than one site, also set `NGINX_SITE` (the file holding the site's `server { }` block, for example `/etc/nginx/sites-available/default`). If that file has several `server` blocks, set `NGINX_SERVER_NAME` to the domain that should serve the game.

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

If you'd rather build on the server (needs Node there):

```bash
git pull
npm run deploy -- --local
```

or with a build you already have: `sudo bash deploy/server/install.sh dist`.

## Kiosk setup tips

- Open `https://<your-server>/treasure_hunt/` in Chrome with `--kiosk`. After logging in once it goes straight to the game.
- Press the fullscreen button in the game if the browser isn't already fullscreen.
- The game returns to a fresh Hindi start screen after 2 minutes without touches.
- Printing the certificate uses the kiosk's default printer. Chrome's `--kiosk-printing` flag prints without a dialog.

## Troubleshooting

- **"Several nginx files have server blocks"**: set `NGINX_SITE` in `deploy/deploy.env`.
- **"has several server blocks"**: set `NGINX_SERVER_NAME` to the domain that should serve the game.
- **The page loads but looks unstyled, or files 404**: the build was made for another path. `npm run deploy` always builds for `URL_PATH`, so redeploy with it.
- **Login keeps coming back**: the browser isn't keeping the cookie. Check it isn't in incognito/guest mode. On a plain-HTTP site, set `COOKIE_SECURE=no`.
- **See what nginx serves:** `curl -I https://<your-server>/treasure_hunt/` should answer `302` to `/treasure_hunt/login/` when not logged in.
