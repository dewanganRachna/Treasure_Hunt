#!/usr/bin/env bash
# Installs a Treasure Hunt build on this server and serves it with nginx at /treasure_hunt/,
# behind an admin login.
#
#   sudo bash install.sh build.tar.gz     install a packed build (what `npm run deploy` uploads)
#   sudo bash install.sh dist             install a build directory
#   sudo bash install.sh --rollback       switch back to the previous release
#   sudo bash install.sh --set-password   change the admin ID/password (kiosks stay logged in)
#   sudo bash install.sh --logout-all     log every device out (they must log in again)
#
# The first install asks for the admin ID and password (or reads ADMIN_USER / ADMIN_PASSWORD).
#
# What it changes:
#   - $APP_DIR/releases/<timestamp>/...        the new release; $APP_DIR/current points at it
#   - /etc/nginx/snippets/treasure_hunt.conf   the game's locations (mode 600: holds the session token)
#   - /etc/nginx/treasure_hunt.htpasswd        admin ID + hashed password
#   - /etc/nginx/treasure_hunt.session         the session token kiosks carry in their cookie
#   - /etc/nginx/conf.d/treasure_hunt_login_limit.conf   slows down password guessing
#                                              (only if nginx.conf includes conf.d/*.conf)
#   - one `include` line (plus a comment) added inside your existing server block, only the
#     first time. A backup of that file goes to $APP_DIR/nginx-backups/.
# If `nginx -t` fails, the nginx changes above are undone and nginx is not reloaded.
#
# Settings (environment variables):
#   URL_PATH           /treasure_hunt            path the game is served under
#   APP_DIR            /var/www/treasure_hunt    where releases are kept
#   NGINX_SITE         (auto-detected)           config file holding your server block
#   NGINX_SERVER_NAME  (none)                    pick the server block by server_name
#   KEEP_RELEASES      5                         older releases are deleted
#   COOKIE_DAYS        365                       how long a kiosk stays logged in
#   COOKIE_SECURE      auto                      yes / no / auto (yes when the site has HTTPS)
#   CERT_API_URL       https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate
#                                                where wins are forwarded to make certificates
set -euo pipefail

URL_PATH="${URL_PATH:-/treasure_hunt}"
APP_DIR="${APP_DIR:-/var/www/treasure_hunt}"
NGINX_SITE="${NGINX_SITE:-}"
NGINX_SERVER_NAME="${NGINX_SERVER_NAME:-}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
COOKIE_DAYS="${COOKIE_DAYS:-365}"
COOKIE_SECURE="${COOKIE_SECURE:-auto}"
CERT_API_URL="${CERT_API_URL:-https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate}"
NGINX_DIR="${NGINX_DIR:-/etc/nginx}"
SNIPPET_DIR="$NGINX_DIR/snippets"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STAMP="$(date +%Y%m%d-%H%M%S)"

say()  { printf '\033[1;33m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m ok\033[0m %s\n' "$*"; }
warn() { printf '\033[1;35m !!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31mERR\033[0m %s\n' "$*" >&2; exit 1; }

find_file() {
  local f
  for f in "$@"; do [[ -f "$f" ]] && { printf '%s\n' "$f"; return 0; }; done
  return 1
}

reload_nginx() { systemctl reload nginx 2>/dev/null || nginx -s reload; }

# ---------- checks ----------
[[ $EUID -eq 0 ]] || die "Run as root (sudo bash $0 ...)."
command -v nginx >/dev/null || die "nginx is not installed on this server."

# /treasure_hunt (leading slash, no trailing slash)
URL_PATH="/${URL_PATH#/}"; URL_PATH="${URL_PATH%/}"
[[ "$URL_PATH" != "" && "$URL_PATH" != "/" ]] || die "URL_PATH must be a sub-path such as /treasure_hunt."
[[ "$URL_PATH" =~ ^/[A-Za-z0-9._/-]+$ ]] || die "URL_PATH may only contain letters, digits, . _ - and /."
[[ "$COOKIE_DAYS" =~ ^[0-9]+$ ]] || die "COOKIE_DAYS must be a number of days."
[[ "$CERT_API_URL" =~ ^https?://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~/-]*)?$ ]] \
  || die "CERT_API_URL must be a plain http(s) URL, e.g. https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate"

NAME="$(basename "$URL_PATH")"
SNIPPET="$SNIPPET_DIR/$NAME.conf"
HTPASSWD="$NGINX_DIR/$NAME.htpasswd"
SESSION_FILE="$NGINX_DIR/$NAME.session"
LIMIT_CONF="$NGINX_DIR/conf.d/${NAME}_login_limit.conf"
LIMIT_ZONE="${NAME}_login"
BACKUP_DIR="$APP_DIR/nginx-backups"
INCLUDE_LINE="include $SNIPPET;"
INCLUDE_NOTE="# Treasure Hunt game at $URL_PATH/ (added by treasure_hunt install.sh)"

TEMPLATE="$(find_file "$HERE/treasure_hunt.conf" "$HERE/../nginx/treasure_hunt.conf")" \
  || die "nginx template treasure_hunt.conf not found next to $0."
AWK_PROG="$(find_file "$HERE/add-include.awk")" || die "add-include.awk not found next to $0."

# ---------- admin login: password file and session token ----------
random_hex() {
  if command -v openssl >/dev/null; then openssl rand -hex 32
  else head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n'; fi
}

hash_password() {
  local h
  command -v openssl >/dev/null || die "openssl is needed to hash the password (apt install openssl)."
  h="$(printf '%s\n' "$1" | openssl passwd -6 -stdin 2>/dev/null)" \
    || h="$(printf '%s\n' "$1" | openssl passwd -apr1 -stdin)"
  printf '%s' "$h"
}

# nginx's worker user must be able to read the password file
worker_group() {
  local u
  u="$(awk '$1 == "user" { gsub(/;/, "", $2); print $2; exit }' "$NGINX_DIR/nginx.conf" 2>/dev/null || true)"
  for u in "$u" www-data nginx; do
    [[ -n "$u" ]] && id -gn "$u" 2>/dev/null && return 0
  done
  return 1
}

set_credentials() {
  local user="${ADMIN_USER:-}" pass="${ADMIN_PASSWORD:-}" pass2 grp tmp
  if [[ -z "$user" || -z "$pass" ]]; then
    [[ -t 0 ]] || die "Admin ID/password needed. Run interactively, or set ADMIN_USER and ADMIN_PASSWORD."
    echo
    say "Set the admin login for the kiosks"
    while [[ -z "$user" || "$user" == *:* ]]; do
      read -rp "    Admin ID: " user
      [[ "$user" == *:* ]] && warn "The ID can't contain ':'."
    done
    while :; do
      read -rsp "    Password (8+ characters): " pass; echo
      if (( ${#pass} < 8 )); then warn "Too short."; continue; fi
      read -rsp "    Same password again: " pass2; echo
      [[ "$pass" == "$pass2" ]] && break
      warn "The passwords don't match."
    done
  fi
  [[ "$user" != *:* ]] || die "ADMIN_USER can't contain ':'."
  (( ${#pass} >= 8 )) || die "ADMIN_PASSWORD must be at least 8 characters."

  tmp="$(mktemp "$NGINX_DIR/.${NAME}.htpasswd.XXXXXX")"
  printf '%s:%s\n' "$user" "$(hash_password "$pass")" > "$tmp"
  if grp="$(worker_group)"; then
    chown "root:$grp" "$tmp"; chmod 640 "$tmp"
  else
    chmod 644 "$tmp"
  fi
  mv -f "$tmp" "$HTPASSWD"
  ok "Admin login saved for '$user' in $HTPASSWD (password stored hashed)"
}

ensure_session_token() {
  if [[ ! -s "$SESSION_FILE" ]]; then
    ( umask 077; random_hex > "$SESSION_FILE" )
    ok "Created a new session token"
  fi
  SESSION_TOKEN="$(tr -dc 'a-f0-9' < "$SESSION_FILE")"
  [[ ${#SESSION_TOKEN} -ge 32 ]] || die "$SESSION_FILE is damaged; delete it and run again (devices will need to log in again)."
}

# ---------- nginx pieces ----------
login_limit_line() {
  if [[ -f "$LIMIT_CONF" ]]; then
    printf '    limit_req zone=%s burst=5 nodelay; limit_req_status 429;' "$LIMIT_ZONE"
  else
    printf '    # (no login rate limit: nginx.conf does not include conf.d/*.conf)'
  fi
}

cookie_secure_attr() {
  case "$COOKIE_SECURE" in
    yes) printf '; Secure' ;;
    no) ;;
    *) grep -qE '^[^#]*listen[[:space:]][^;]*(443|ssl)' "$NGINX_SITE" && printf '; Secure' || true ;;
  esac
}

write_snippet() {
  local limit tmp
  limit="$(login_limit_line)"
  tmp="$(mktemp "$SNIPPET_DIR/.${NAME}.conf.XXXXXX")"
  awk -v limit="$limit" '{ if ($0 == "__LOGIN_LIMIT__") print limit; else print }' "$TEMPLATE" \
    | sed -e "s|__URL_PATH__|$URL_PATH|g" \
          -e "s|__WEB_ROOT__|$APP_DIR/current|g" \
          -e "s|__HTPASSWD__|$HTPASSWD|g" \
          -e "s|__SESSION_TOKEN__|$SESSION_TOKEN|g" \
          -e "s|__COOKIE_MAX_AGE__|$(( COOKIE_DAYS * 86400 ))|g" \
          -e "s|__COOKIE_SECURE__|$(cookie_secure_attr)|g" \
          -e "s|__CERT_API_URL__|$CERT_API_URL|g" > "$tmp"
  chmod 600 "$tmp"
  mv -f "$tmp" "$SNIPPET"
}

# Slow down password guessing: a zone has to live at http level, i.e. in conf.d
ensure_login_limit() {
  [[ -f "$LIMIT_CONF" ]] && return 0
  if grep -qE '^[^#]*include[[:space:]]+[^;]*conf\.d/\*\.conf' "$NGINX_DIR/nginx.conf" 2>/dev/null; then
    printf '# Login rate limit for the Treasure Hunt game (added by treasure_hunt install.sh)\nlimit_req_zone $binary_remote_addr zone=%s:1m rate=6r/m;\n' "$LIMIT_ZONE" > "$LIMIT_CONF"
    chmod 644 "$LIMIT_CONF"
    created_limit=1
    ok "Login attempts limited to 6 a minute per address ($LIMIT_CONF)"
  else
    warn "nginx.conf doesn't include conf.d/*.conf, so login attempts are not rate limited."
  fi
}

detect_site() {
  local f candidates=()
  for f in "$NGINX_DIR"/sites-enabled/* "$NGINX_DIR"/conf.d/*.conf; do
    [[ -f "$f" ]] || continue
    f="$(readlink -f "$f")"
    grep -qE '^[^#]*\bserver[[:space:]]*(\{|$)' "$f" || continue
    if grep -qF "$INCLUDE_LINE" "$f"; then printf '%s\n' "$f"; return 0; fi
    candidates+=("$f")
  done
  if [[ ${#candidates[@]} -eq 0 ]] && grep -qE '^[^#]*\bserver[[:space:]]*(\{|$)' "$NGINX_DIR/nginx.conf"; then
    candidates+=("$NGINX_DIR/nginx.conf")
  fi
  if [[ ${#candidates[@]} -eq 1 ]]; then printf '%s\n' "${candidates[0]}"; return 0; fi
  if [[ ${#candidates[@]} -eq 0 ]]; then
    warn "No nginx file with a server block was found."
  else
    warn "Several nginx files have server blocks:"; printf '      %s\n' "${candidates[@]}" >&2
  fi
  return 1
}

resolve_site() {
  if [[ -z "$NGINX_SITE" ]]; then
    NGINX_SITE="$(detect_site)" || die "Set NGINX_SITE to the file of the site that should serve $URL_PATH/ (e.g. NGINX_SITE=/etc/nginx/sites-available/default)."
  fi
  NGINX_SITE="$(readlink -f "$NGINX_SITE")"
  [[ -f "$NGINX_SITE" ]] || die "NGINX_SITE=$NGINX_SITE is not a file."
}

# ---------- small modes ----------
case "${1:-}" in
  --rollback)
    [[ -L "$APP_DIR/current" ]] || die "No current release in $APP_DIR."
    current="$(readlink -f "$APP_DIR/current")"
    previous=""
    while IFS= read -r r; do
      [[ "$r" == "$current" ]] && break
      previous="$r"
    done < <(find "$APP_DIR/releases" -mindepth 1 -maxdepth 1 -type d | sort)
    [[ -n "$previous" ]] || die "There is no release older than $(basename "$current") to go back to."
    ln -sfn "$previous" "$APP_DIR/current.tmp" && mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"
    nginx -t >/dev/null 2>&1 && reload_nginx
    ok "Rolled back: $(basename "$current") -> $(basename "$previous")"
    exit 0
    ;;
  --set-password)
    set_credentials
    ok "Done. nginx reads the new password on the next login; logged-in kiosks stay logged in."
    exit 0
    ;;
  --logout-all)
    [[ -f "$SNIPPET" ]] || die "The game isn't installed yet."
    resolve_site
    cp -a "$SNIPPET" "$SNIPPET.bak-$STAMP"
    rm -f "$SESSION_FILE"
    ensure_session_token
    write_snippet
    if ! nginx -t; then
      mv -f "$SNIPPET.bak-$STAMP" "$SNIPPET"
      die "nginx rejected the configuration; nothing was changed."
    fi
    rm -f "$SNIPPET.bak-$STAMP"
    reload_nginx
    ok "All devices are logged out. Kiosks need the admin ID and password again."
    exit 0
    ;;
esac

SOURCE="${1:-}"
[[ -n "$SOURCE" ]] || die "Usage: sudo bash $0 <build.tar.gz | build-dir> | --rollback | --set-password | --logout-all"
[[ -e "$SOURCE" ]] || die "$SOURCE does not exist."

resolve_site
say "nginx site: $NGINX_SITE"

# ---------- unpack the release ----------
RELEASE="$APP_DIR/releases/$STAMP"
TARGET="$RELEASE$URL_PATH"
say "Installing release $STAMP into $APP_DIR"
mkdir -p "$TARGET"
if [[ -d "$SOURCE" ]]; then
  cp -a "$SOURCE"/. "$TARGET"/
else
  tar -xzf "$SOURCE" -C "$TARGET"
fi
[[ -f "$TARGET/index.html" ]] || { rm -rf "$RELEASE"; die "The build has no index.html."; }
if ! grep -q "$URL_PATH/assets/" "$TARGET/index.html"; then
  rm -rf "$RELEASE"
  die "This build was not made for $URL_PATH/ (its files point elsewhere). Build with BASE_PATH=$URL_PATH/ npm run build."
fi
[[ -f "$TARGET/login/index.html" && -f "$TARGET/login/ok.txt" ]] || { rm -rf "$RELEASE"; die "The build has no login page (public/login/)."; }
find "$RELEASE" -type d -exec chmod 755 {} +
find "$RELEASE" -type f -exec chmod 644 {} +
chmod 755 "$APP_DIR" "$APP_DIR/releases"
# SELinux (RHEL/Rocky/Fedora): let nginx read the new files
command -v restorecon >/dev/null && restorecon -R "$APP_DIR" 2>/dev/null || true
ok "Files unpacked"

# ---------- admin login ----------
if [[ -s "$HTPASSWD" ]]; then
  ok "Admin login already set ($HTPASSWD); change it with --set-password"
else
  set_credentials
fi
ensure_session_token

# ---------- nginx: snippet + include, with undo on failure ----------
mkdir -p "$BACKUP_DIR" "$SNIPPET_DIR"
chmod 700 "$BACKUP_DIR"

had_snippet=0
if [[ -f "$SNIPPET" ]]; then had_snippet=1; cp -a "$SNIPPET" "$BACKUP_DIR/$NAME.conf.$STAMP"; fi
site_backup=""
created_limit=0
previous_release=""
[[ -L "$APP_DIR/current" ]] && previous_release="$(readlink -f "$APP_DIR/current")"

undo() {
  warn "Undoing changes"
  if [[ $had_snippet -eq 1 ]]; then cp -a "$BACKUP_DIR/$NAME.conf.$STAMP" "$SNIPPET"; else rm -f "$SNIPPET"; fi
  [[ $created_limit -eq 1 ]] && rm -f "$LIMIT_CONF"
  [[ -n "$site_backup" ]] && cat "$site_backup" > "$NGINX_SITE"
  if [[ -n "$previous_release" ]]; then
    ln -sfn "$previous_release" "$APP_DIR/current.tmp" && mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"
  else
    rm -f "$APP_DIR/current"
  fi
  rm -rf "$RELEASE"
}

ensure_login_limit
write_snippet
ok "Wrote $SNIPPET"

if grep -qF "$INCLUDE_LINE" "$NGINX_SITE"; then
  ok "$NGINX_SITE already includes the snippet"
else
  if grep -qE "^[^#]*location[[:space:]]+([=^~]+[[:space:]]+)?$URL_PATH/?[[:space:]]*\{" "$NGINX_SITE"; then
    undo; die "$NGINX_SITE already has its own location for $URL_PATH. Remove it or choose another URL_PATH."
  fi
  site_backup="$BACKUP_DIR/$(basename "$NGINX_SITE").$STAMP"
  cp -a "$NGINX_SITE" "$site_backup"
  set +e
  awk -v inc="$INCLUDE_LINE" -v note="$INCLUDE_NOTE" -v name="$NGINX_SERVER_NAME" -f "$AWK_PROG" \
    "$NGINX_SITE" "$NGINX_SITE" > "$BACKUP_DIR/site.new"
  rc=$?
  set -e
  if [[ $rc -ne 0 ]]; then
    rm -f "$BACKUP_DIR/site.new"
    site_backup=""
    undo
    case $rc in
      3) die "No server block found in $NGINX_SITE." ;;
      4) die "$NGINX_SITE has several server blocks. Set NGINX_SERVER_NAME to the domain that should serve $URL_PATH/." ;;
      5) die "No server block in $NGINX_SITE has server_name $NGINX_SERVER_NAME." ;;
      6) die "The chosen server block in $NGINX_SITE is written on a single line; add this line inside it by hand: $INCLUDE_LINE" ;;
      *) die "Could not edit $NGINX_SITE (awk exit $rc)." ;;
    esac
  fi
  # Write through the original file so its owner, mode and symlinks stay as they were
  cat "$BACKUP_DIR/site.new" > "$NGINX_SITE"
  rm -f "$BACKUP_DIR/site.new"
  ok "Added '$INCLUDE_LINE' to $NGINX_SITE (backup: $site_backup)"
fi

ln -sfn "$RELEASE" "$APP_DIR/current.tmp"
mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"

say "Checking nginx configuration"
if ! nginx -t; then
  undo
  die "nginx rejected the configuration, so nothing was changed. See the error above."
fi
reload_nginx
ok "nginx reloaded; $APP_DIR/current -> releases/$STAMP"

# ---------- keep the newest releases ----------
mapfile -t releases < <(find "$APP_DIR/releases" -mindepth 1 -maxdepth 1 -type d | sort)
excess=$(( ${#releases[@]} - KEEP_RELEASES ))
if (( excess > 0 )); then
  for r in "${releases[@]:0:excess}"; do
    [[ "$r" == "$(readlink -f "$APP_DIR/current")" ]] || rm -rf "$r"
  done
  ok "Removed $excess old release(s)"
fi

# ---------- smoke test ----------
if command -v curl >/dev/null; then
  sleep 1
  host="$(awk '/^[^#]*server_name[ \t]/ { sub(/^.*server_name[ \t]+/, ""); gsub(/;.*/, ""); split($0, n, /[ \t]+/); for (i in n) if (n[i] != "_" && n[i] != "" && n[i] !~ /^~/) { print n[i]; exit } }' "$NGINX_SITE")"
  host="${NGINX_SERVER_NAME:-${host:-localhost}}"
  probe() {  # probe <path> [cookie] → HTTP status, trying http then https
    local code="" scheme
    for scheme in http https; do
      code="$(curl -ks -o /dev/null -w '%{http_code}' --max-time 5 ${2:+-b "th_session=$2"} \
        --resolve "$host:80:127.0.0.1" --resolve "$host:443:127.0.0.1" "$scheme://$host$1" || true)"
      [[ "$code" != "000" && "$code" != "301" && "$code" != "308" ]] && break
    done
    printf '%s' "$code"
  }
  login="$(probe "$URL_PATH/login/")"
  locked="$(probe "$URL_PATH/")"
  unlocked="$(probe "$URL_PATH/" "$SESSION_TOKEN")"
  if [[ "$login" == 200 && "$locked" == 302 && "$unlocked" == 200 ]]; then
    ok "Smoke test on $host: login page 200, game without login 302 → login, game with login 200"
  else
    warn "Smoke test on $host: login page $login (want 200), game without login $locked (want 302), with login $unlocked (want 200). Check it in a browser."
  fi
fi

say "Done. Open http(s)://<your-server>$URL_PATH/ and log in once on each kiosk."
