#!/usr/bin/env bash
# Writes a report on how the Treasure Hunt runs on this server and pushes it as report.md to
# the server-reports branch of this repository, so a developer can read it, fix things and push:
#
#   on the server:   git pull && bash deploy/server/report.sh --deploy
#   on the dev PC:   git fetch origin server-reports && git show FETCH_HEAD:report.md
#
#   bash deploy/server/report.sh             report only
#   bash deploy/server/report.sh --deploy    deploy this checkout first (npm run deploy -- --local);
#                                            its output goes in the report, even when it fails
#   bash deploy/server/report.sh --no-push   only write the report to ~/treasure_hunt_report.md
#
# Pushing needs the server's deploy key to have write access. Settings, from deploy/deploy.env or
# the environment (see deploy/README.md):
#   REPORT_BRANCH   branch of this repository the reports go to (default server-reports)
#   REPORT_REPO     push to this separate repository's main branch instead
#   REPORT_SSH_KEY  key to push with, when it isn't the one this checkout pulls with
#   REPORT_DIR      where REPORT_REPO is cloned on this server (default ~/treasure_hunt_reports)
#   and URL_PATH, APP_DIR, NGINX_SITE, NGINX_SERVER_NAME, CERT_API_URL as for the deploy.
#
# Never in the report: the admin ID and password hash, the session token, other sites' full
# configs (only their listen/server_name/location lines) and the last part of client IPs in logs.
set -uo pipefail
PATH="$PATH:/usr/sbin:/sbin"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$ROOT/deploy/deploy.env"

say()  { printf '\033[1;33m==>\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m ok\033[0m %s\n' "$*"; }
warn() { printf '\033[1;35m !!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31mERR\033[0m %s\n' "$*" >&2; exit 1; }

# The environment wins over deploy/deploy.env, as in deploy.mjs
setting() {
  local v="${!1:-}"
  if [[ -z "$v" && -f "$ENV_FILE" ]]; then
    v="$(tr -d '\r' < "$ENV_FILE" | sed -n -E "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*//p" | tail -n 1 \
      | sed -E "s/[[:space:]]+\$//; s/^'(.*)'\$/\\1/; s/^\"(.*)\"\$/\\1/")"
  fi
  printf '%s' "${v:-${2:-}}"
}

DEPLOY=0
PUSH=1
for a in "$@"; do
  case "$a" in
    --deploy) DEPLOY=1 ;;
    --no-push) PUSH=0 ;;
    -h|--help) sed -n '2,22p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) die "Unknown option $a (use --deploy, --no-push or --help)." ;;
  esac
done
[[ $EUID -eq 0 && -n "${SUDO_USER:-}" ]] && die "Run this without sudo, as $SUDO_USER. It asks for sudo itself."

URL_PATH="/$(setting URL_PATH /treasure_hunt | sed -E 's#^/+##; s#/+$##')"
APP_DIR="$(setting APP_DIR /var/www/treasure_hunt)"
NGINX_SITE="$(setting NGINX_SITE)"
NGINX_SERVER_NAME="$(setting NGINX_SERVER_NAME)"
CERT_API_URL="$(setting CERT_API_URL https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate)"
REPORT_BRANCH="$(setting REPORT_BRANCH server-reports)"
REPORT_REPO="$(setting REPORT_REPO)"
REPORT_SSH_KEY="$(setting REPORT_SSH_KEY)"; REPORT_SSH_KEY="${REPORT_SSH_KEY/#\~/$HOME}"
REPORT_DIR="$(setting REPORT_DIR "$HOME/treasure_hunt_reports")"; REPORT_DIR="${REPORT_DIR/#\~/$HOME}"
FALLBACK="$HOME/treasure_hunt_report.md"

NAME="$(basename "$URL_PATH")"
NGINX_DIR="${NGINX_DIR:-/etc/nginx}"
SNIPPET="$NGINX_DIR/snippets/$NAME.conf"
INCLUDE_LINE="include $SNIPPET;"
SESSION_FILE="$NGINX_DIR/$NAME.session"
HTPASSWD="$NGINX_DIR/$NAME.htpasswd"
LIMIT_CONF="$NGINX_DIR/conf.d/${NAME}_login_limit.conf"

BODY="$(mktemp)"; REPORT="$(mktemp)"; COOKIE_HDR="$(mktemp)"; DEPLOY_LOG="$(mktemp)"
trap 'rm -f "$BODY" "$REPORT" "$COOKIE_HDR" "$DEPLOY_LOG"' EXIT

# Most of nginx's files need root to read: ask for the password once, up front
if [[ $EUID -eq 0 ]]; then
  as_root() { "$@"; }
elif sudo -v; then
  as_root() { sudo -n "$@"; }
else
  as_root() { echo "(needs sudo)" >&2; return 1; }
  warn "No sudo: the report will miss nginx's own files and logs."
fi

# ---------- deploy first, if asked ----------
COMMIT_FULL="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || echo unknown)"
COMMIT="${COMMIT_FULL:0:7}"
DEPLOY_STATUS=0
if (( DEPLOY )); then
  say "Deploying $COMMIT (npm run deploy -- --local)"
  (cd "$ROOT" && npm run deploy -- --local) 2>&1 | tee "$DEPLOY_LOG"
  DEPLOY_STATUS=${PIPESTATUS[0]}
  [[ $EUID -eq 0 ]] || sudo -v || true
fi
say "Gathering the report"

# ---------- report helpers ----------
SUMMARY=()
check() { # check ok|fail|note <text>  → a line in the summary at the top
  case "$1" in ok) SUMMARY+=("- OK: $2") ;; fail) SUMMARY+=("- FAIL: $2") ;; *) SUMMARY+=("- NOTE: $2") ;; esac
}
section() { printf '\n## %s\n\n' "$*" >> "$BODY"; }
note() { printf '%s\n\n' "$*" >> "$BODY"; }

# Tokens, password hashes and passwords inside URLs never reach the report
redact() {
  sed -E -e 's/[0-9a-fA-F]{48,}/<redacted>/g' \
         -e 's#(://)[^/@[:space:]]+:[^/@[:space:]]+@#\1<user>:<redacted>@#g' \
         -e 's/\$(1|2[aby]?|5|6|apr1|y)\$[^[:space:]:"]{20,}/<hash>/g'
}
mask_ips() { sed -E 's/(^|[^0-9.])([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\.[0-9]{1,3}([^0-9.]|$)/\1\2.x\3/g'; }

run_cmd() { "$@" 2>&1; local s=$?; (( s == 0 )) || printf '(exit %d)\n' "$s"; }
# block <title> <command...>: the command's output in a code block, at most LIMIT lines
LIMIT=80
block() {
  local title="$1"; shift
  {
    printf '**%s**\n\n```\n' "$title"
    run_cmd "$@" | tr -d '\r' | redact | cut -c1-300 \
      | awk -v n="$LIMIT" 'NR <= n { print } END { if (NR == 0) print "(no output)"; else if (NR > n) printf "... %d more lines\n", NR - n }'
    printf '```\n\n'
  } >> "$BODY"
}

# ---------- deploy output ----------
if (( DEPLOY )); then
  section "Deploy output"
  if (( DEPLOY_STATUS == 0 )); then check ok "Deploy of $COMMIT succeeded"
  else check fail "Deploy of $COMMIT failed (exit $DEPLOY_STATUS): see Deploy output"; fi
  note "Last 150 lines of \`npm run deploy -- --local\`, exit $DEPLOY_STATUS:"
  {
    printf '```\n'
    sed -E 's/\x1b\[[0-9;?]*[A-Za-z]//g' "$DEPLOY_LOG" | tr '\r' '\n' | grep -v '^[[:space:]]*$' | redact | cut -c1-300 | tail -n 150
    printf '```\n'
  } >> "$BODY"
fi

# ---------- installed game ----------
section "Installed game"
CURRENT="$(readlink -f "$APP_DIR/current" 2>/dev/null || true)"
GAME_DIR="$CURRENT$URL_PATH"
LIVE_VERSION=""
if [[ -n "$CURRENT" && -f "$GAME_DIR/index.html" ]]; then
  LIVE_VERSION="$(head -n 1 "$GAME_DIR/version.txt" 2>/dev/null || true)"
  LIVE_SHA="${LIVE_VERSION%%[ ,]*}"
  if [[ -z "$LIVE_VERSION" ]]; then
    check note "Live release $(basename "$CURRENT") has no version.txt (deployed before it existed)"
  elif [[ -n "$LIVE_SHA" && "$COMMIT_FULL" == "$LIVE_SHA"* ]]; then
    check ok "Live release $(basename "$CURRENT") is this checkout ($LIVE_VERSION)"
  else
    check fail "Live release $(basename "$CURRENT") is $LIVE_VERSION, but the checkout is at $COMMIT"
  fi
  grep -q "$URL_PATH/assets/" "$GAME_DIR/index.html" \
    || check fail "The live index.html doesn't load its files from $URL_PATH/assets/ (built for another path)"
else
  check fail "No game installed in $APP_DIR/current"
fi
note "Live version: ${LIVE_VERSION:-unknown}"
block "$APP_DIR" ls -la "$APP_DIR"
block "Releases" ls -1 "$APP_DIR/releases"
if [[ -d "$GAME_DIR" ]]; then
  block "Live files (owner, mode, SELinux label)" ls -ldZ "$GAME_DIR" "$GAME_DIR/index.html" "$GAME_DIR/assets" "$GAME_DIR/login" "$GAME_DIR/map"
  block "Size and file count" sh -c 'du -sh "$1"; find "$1" -type f | wc -l' _ "$GAME_DIR"
fi

# ---------- nginx ----------
INCLUDED_IN="$(as_root grep -rlF "$INCLUDE_LINE" "$NGINX_DIR" 2>/dev/null | grep -v "^$NGINX_DIR/snippets/" || true)"
SITE="${NGINX_SITE:-${INCLUDED_IN%%$'\n'*}}"
if [[ -n "$INCLUDED_IN" ]]; then check ok "The game is included in $(echo $INCLUDED_IN)"
else check fail "No nginx site includes $SNIPPET yet${NGINX_SITE:+ (NGINX_SITE=$NGINX_SITE)}"; fi

NGINX_T="$(as_root nginx -t 2>&1)"; NGINX_T_STATUS=$?
if (( NGINX_T_STATUS == 0 )); then check ok "nginx -t passes"; else check fail "nginx -t fails: see nginx"; fi
systemctl is-active --quiet nginx 2>/dev/null && check ok "nginx is running" || check fail "nginx is not running"

# ---------- HTTP checks ----------
section "HTTP checks"
HOST="$NGINX_SERVER_NAME"
if [[ -z "$HOST" && -n "$SITE" ]]; then
  HOST="$(as_root cat "$SITE" 2>/dev/null | awk '/^[^#]*server_name[ \t]/ { sub(/^.*server_name[ \t]+/, ""); gsub(/;.*/, ""); n = split($0, a, /[ \t]+/); for (i = 1; i <= n; i++) if (a[i] != "_" && a[i] != "" && a[i] !~ /^~/) { print a[i]; exit } }')"
fi
HOST="${HOST:-localhost}"
TOKEN="$(as_root cat "$SESSION_FILE" 2>/dev/null | tr -dc 'a-f0-9' || true)"
[[ -n "$TOKEN" ]] && printf 'Cookie: th_session=%s\n' "$TOKEN" > "$COOKIE_HDR"
ASSET="$(grep -o "$URL_PATH/assets/[^\"]*\.js" "$GAME_DIR/index.html" 2>/dev/null | head -n 1 || true)"

probe() { # probe <scheme> <path> <cookie|-> → "code type → redirect"
  local args=(-ks -o /dev/null --max-time 5 -w '%{http_code} %{content_type} %{redirect_url}'
              --resolve "$HOST:80:127.0.0.1" --resolve "$HOST:443:127.0.0.1")
  [[ "$3" == cookie ]] && args+=(-H "@$COOKIE_HDR")
  curl "${args[@]}" "$1://$HOST$2" 2>/dev/null \
    | sed -E 's/;[[:space:]]*[a-z-]+=[^ ]*//g; s/ +/ /g; s/ $//; s/ (https?:)/ → \1/'
}
note "Requests to \`$HOST\` on this server (127.0.0.1). \"with login\" sends the kiosk cookie."
# path | cookie | expected code
PROBES=(
  "$URL_PATH|-|301"
  "$URL_PATH/|-|302"
  "$URL_PATH/login/|-|200"
  "$URL_PATH/auth|-|403"
)
if [[ -n "$TOKEN" ]]; then
  PROBES+=("$URL_PATH/|cookie|200" "$URL_PATH/map/cg-map-terrain.jpg|cookie|200")
  [[ -n "$ASSET" ]] && PROBES+=("$ASSET|cookie|200" "$ASSET|-|403")
else
  note "(No session token readable, so the requests with login were skipped.)"
fi
# Pages are served over https when plain http only redirects there
MAIN=http
[[ "$(probe http "$URL_PATH/login/" -)" =~ ^30[178]\ .*https: ]] && MAIN=https
MISMATCH=()
{
  printf '| Request | Want | http | https |\n|---|---|---|---|\n'
  for p in "${PROBES[@]}"; do
    IFS='|' read -r path cookie want <<< "$p"
    h="$(probe http "$path" "$cookie")"; s="$(probe https "$path" "$cookie")"
    login=""; [[ "$cookie" == cookie ]] && login=" with login"
    printf '| `%s`%s | %s | %s | %s |\n' "$path" "$login" "$want" "${h:-none}" "${s:-none}"
    got="$h"; [[ $MAIN == https ]] && got="$s"
    [[ "${got%% *}" == "$want" ]] || MISMATCH+=("$path$login gave ${got%% *}, want $want")
  done
  printf '\n'
} >> "$BODY"
if (( ${#MISMATCH[@]} == 0 )); then check ok "All HTTP checks on $MAIN://$HOST pass"
else check fail "HTTP checks on $MAIN://$HOST: $(printf '%s; ' "${MISMATCH[@]}" | sed 's/; $//')"; fi

section "Outbound connections from this server"
note "Kiosk browsers call the certificate API themselves, so this one is for information only (OpenSSL 3 refuses that server's old TLS, while browsers accept it)."
outbound() { curl -sS -o /dev/null --max-time 8 -w '%{http_code}' "$1" 2>&1 | tr '\n' ' '; }
{
  printf '```\n'
  for u in https://github.com https://registry.npmjs.org/ "$CERT_API_URL"; do printf '%-60s %s\n' "$u" "$(outbound "$u")"; done
  printf '```\n'
} >> "$BODY"

# ---------- nginx details ----------
section "nginx"
block "nginx -t" printf '%s\n' "$NGINX_T"
block "Version" sh -c 'nginx -V 2>&1 | head -n 3'
block "Service" systemctl status nginx --no-pager --lines=0

# The lines of a config file that decide what a site answers
outline() {
  as_root cat "$1" | awk '
    { line = $0; sub(/[ \t]*#.*/, "", line) }
    line ~ /(^|[ \t;{}])server[ \t]*(\{|$)/ || line ~ /(^|[ \t;{])(listen|server_name|include|location|root|alias|return|proxy_pass|ssl_certificate|ssl_certificate_key|auth_basic|error_log|access_log|user)[ \t]/ { printf "%5d  %s\n", NR, line }'
}
for f in "$NGINX_DIR/nginx.conf" "$NGINX_DIR"/conf.d/*.conf "$NGINX_DIR"/sites-enabled/*; do
  [[ -e "$f" ]] || continue
  block "$(readlink -f "$f") (outline)" outline "$(readlink -f "$f")"
done
for f in $INCLUDED_IN; do
  block "Where $f includes the game" as_root grep -n -B 6 -A 2 -F "$INCLUDE_LINE" "$f"
done
block "$SNIPPET" as_root cat "$SNIPPET"
block "Login files (owner, mode, SELinux label)" as_root ls -lZ "$SNIPPET" "$HTPASSWD" "$SESSION_FILE" "$LIMIT_CONF"
note "Admin logins in $(basename "$HTPASSWD"): $(as_root awk 'NF' "$HTPASSWD" 2>/dev/null | wc -l)"

# ---------- logs ----------
section "Logs (client IPs shortened)"
LOGS="$(as_root nginx -T 2>/dev/null | awk '($1 == "error_log" || $1 == "access_log") { gsub(/;/, "", $2); print $1, $2 }' | sort -u)"
[[ -n "$LOGS" ]] || LOGS=$'error_log /var/log/nginx/error.log\naccess_log /var/log/nginx/access.log'
while read -r kind file; do
  [[ "$file" == /* ]] || continue
  as_root test -f "$file" || continue
  if [[ "$kind" == error_log ]]; then
    block "$file: lines about the game" sh -c 'grep -E "$2" | tail -n 30' _ "$file" "$NAME|$APP_DIR" < <(as_root tail -n 5000 "$file" | mask_ips)
    block "$file: last lines" sh -c 'cat' < <(as_root tail -n 10 "$file" | mask_ips)
  else
    block "$file: requests for $URL_PATH" sh -c 'grep -F "$1" | tail -n 25' _ "$URL_PATH" < <(as_root tail -n 5000 "$file" | mask_ips)
  fi
done <<< "$LOGS"
block "nginx service log, last 24 hours" as_root journalctl -u nginx --since -24h --no-pager -n 20

# ---------- server ----------
section "Server"
OS="$(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME" || uname -s)"
SELINUX="$(getenforce 2>/dev/null || echo 'not installed')"
DENIALS="$(as_root ausearch -m AVC,USER_AVC -ts today -i 2>/dev/null | grep -iE 'nginx|httpd' | grep -c denied || true)"
if [[ "$SELINUX" == Enforcing && "${DENIALS:-0}" -gt 0 ]]; then check fail "$DENIALS SELinux denials for nginx today: see Server"
else check note "SELinux: $SELINUX"; fi
block "System" sh -c 'echo "$1"; uname -r; uptime; df -h / "$2" 2>/dev/null; free -h' _ "$OS" "$(dirname "$APP_DIR")"
block "Tools" sh -c 'for c in "node -v" "npm -v" "git --version" "nginx -v" "openssl version" "curl --version"; do printf "%-16s " "${c%% *}"; $c 2>&1 | head -n 1; done'
block "SELinux denials for nginx today" sh -c 'cat' < <(as_root ausearch -m AVC,USER_AVC -ts today -i 2>&1 | grep -iE 'nginx|httpd|no matches' | tail -n 20)
block "Firewall" sh -c 'if command -v firewall-cmd >/dev/null; then sudo -n firewall-cmd --state; echo "services: $(sudo -n firewall-cmd --list-services)"; echo "ports: $(sudo -n firewall-cmd --list-ports)"; else echo "firewalld not installed"; fi'

# ---------- checkout ----------
section "Checkout"
block "git status" git -C "$ROOT" status --short --branch
block "Recent commits" git -C "$ROOT" log --oneline -8
settings() {
  [[ -f "$ENV_FILE" ]] || echo "(no deploy/deploy.env: defaults)"
  for k in URL_PATH APP_DIR NGINX_SITE NGINX_SERVER_NAME KEEP_RELEASES COOKIE_DAYS COOKIE_SECURE PUBLIC_URL LAUNCHER_URL CERT_API_URL REPORT_BRANCH REPORT_REPO REPORT_DIR; do
    printf '%s=%s\n' "$k" "$(setting "$k")"
  done
}
block "Deploy settings" settings

# ---------- assemble ----------
{
  printf '# Treasure Hunt server report\n\n'
  printf -- '- **Server:** %s, %s\n' "$(hostname)" "$OS"
  printf -- '- **When:** %s, by %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$(id -un)"
  printf -- '- **Checkout:** `%s` at `%s` %s\n' "$(git -C "$ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null)" "$COMMIT" "$(git -C "$ROOT" log -1 --format='%s (%cr)' 2>/dev/null)"
  printf '\n## Summary\n\n'
  printf '%s\n' "${SUMMARY[@]}"
  cat "$BODY"
} > "$REPORT"

echo
printf '%s\n' "${SUMMARY[@]}"
echo
PROBLEMS="$(printf '%s\n' "${SUMMARY[@]}" | grep -c '^- FAIL' || true)"

# ---------- publish ----------
if (( ! PUSH )); then
  cp "$REPORT" "$FALLBACK"
  ok "Report written to $FALLBACK"
  exit 0
fi

[[ -n "$REPORT_SSH_KEY" ]] && export GIT_SSH_COMMAND="ssh -i $(printf '%q' "$REPORT_SSH_KEY") -o IdentitiesOnly=yes"
MESSAGE="$(hostname -s) $(date '+%Y-%m-%d %H:%M') at $COMMIT: $PROBLEMS problem(s)"

if [[ -z "$REPORT_REPO" ]]; then
  # A branch of this repository holding only report.md. Built with git plumbing, so this
  # checkout's files and branch stay as they are.
  r() { git -C "$ROOT" -c user.name="treasure_hunt server" -c user.email="treasure-hunt@$(hostname)" "$@"; }
  REF="refs/remotes/origin/$REPORT_BRANCH"
  r fetch -q origin "+refs/heads/$REPORT_BRANCH:$REF" 2>/dev/null || true
  parent="$(r rev-parse -q --verify "$REF" || true)"
  blob="$(r hash-object -w "$REPORT")"
  tree="$(printf '100644 blob %s\treport.md\n' "$blob" | r mktree)"
  commit="$(r commit-tree "$tree" ${parent:+-p "$parent"} -m "$MESSAGE")"
  if r push -q origin "$commit:refs/heads/$REPORT_BRANCH"; then
    r update-ref "$REF" "$commit"
    ok "Report pushed to the $REPORT_BRANCH branch of $(r remote get-url origin) ($PROBLEMS problem(s))"
  else
    cp "$REPORT" "$FALLBACK"
    die "Could not push the $REPORT_BRANCH branch. The server's deploy key needs write access (see \"Server reports\" in deploy/README.md). The report is in $FALLBACK."
  fi
  exit 0
fi

if [[ ! -d "$REPORT_DIR/.git" ]]; then
  git clone -q "$REPORT_REPO" "$REPORT_DIR" 2>&1 | grep -v 'empty repository' || true
  [[ -d "$REPORT_DIR/.git" ]] || { cp "$REPORT" "$FALLBACK"; die "Could not clone $REPORT_REPO. The report is in $FALLBACK."; }
fi
g() { git -C "$REPORT_DIR" -c user.name="treasure_hunt server" -c user.email="treasure-hunt@$(hostname)" "$@"; }
# Only this server writes there, so the clone simply follows the remote
git -C "$REPORT_DIR" rev-parse -q --verify HEAD >/dev/null || g symbolic-ref HEAD refs/heads/main
g fetch -q origin main 2>/dev/null && g reset -q --hard FETCH_HEAD
cp "$REPORT" "$REPORT_DIR/report.md"
g add report.md
g commit -q -m "$(hostname -s) $(date '+%Y-%m-%d %H:%M') at $COMMIT: $PROBLEMS problem(s)"
if g push -q origin HEAD:main; then
  ok "Report pushed to $REPORT_REPO (report.md, $PROBLEMS problem(s))"
else
  cp "$REPORT" "$FALLBACK"
  die "Could not push to $REPORT_REPO (is its deploy key added with write access?). The report is in $FALLBACK."
fi
