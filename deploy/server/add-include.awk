# Adds include lines right after the opening brace of one server block in an nginx config.
# Plain POSIX awk (works with mawk, gawk and busybox awk). The file is read twice:
#
#   awk -v inc='include /etc/nginx/snippets/treasure_hunt.conf;' \
#       -v note='# Treasure Hunt game' -v name='example.gov.in' \
#       -f add-include.awk site.conf site.conf > site.conf.new
#
# Which block: the one whose server_name lists `name`, if given. Otherwise the block that
# listens on 443/ssl (the one that serves pages when port 80 only redirects), or the only block.
# Exit codes: 3 no server block, 4 several candidates (pass name), 5 name not found,
#             6 the block is written on one line.

function strip_comment(s,    out, i, c, q) {
    out = ""; q = ""
    for (i = 1; i <= length(s); i++) {
        c = substr(s, i, 1)
        if (q != "") { out = out c; if (c == q) q = ""; continue }
        if (c == "\"" || c == "'") { q = c; out = out c; continue }
        if (c == "#") break
        out = out c
    }
    return out
}

function choose(    i, n, any_ssl) {
    if (nb == 0) return -3
    if (name != "") {
        for (i = 1; i <= nb; i++) if (index(names[i], " " name " ") > 0) return i
        return -5
    }
    any_ssl = 0
    for (i = 1; i <= nb; i++) if (ssl[i]) any_ssl = 1
    n = 0
    for (i = 1; i <= nb; i++) if (!any_ssl || ssl[i]) { n++; pick = i }
    if (n != 1) return -4
    return pick
}

BEGIN { nb = 0; depth = 0; inblock = 0; pending = 0; chosen = 0 }

# First pass: find the server blocks
FNR == NR {
    line = strip_comment($0)
    if (!inblock && line ~ /(^|[;{}])[ \t]*server[ \t]*(\{|$)/) pending = 1
    for (i = 1; i <= length(line); i++) {
        c = substr(line, i, 1)
        if (c == "{") {
            depth++
            if (pending && !inblock) {
                inblock = 1; pending = 0; nb++
                open_line[nb] = FNR; base[nb] = depth - 1; names[nb] = " "; ssl[nb] = 0
                ind = $0; sub(/[^ \t].*$/, "", ind); indent[nb] = ind
            }
        } else if (c == "}") {
            depth--
            if (inblock && depth == base[nb]) { close_line[nb] = FNR; inblock = 0 }
        }
    }
    if (inblock || close_line[nb] == FNR) {
        if (line ~ /(^|[ \t;{])listen[ \t][^;]*(443|ssl)/) ssl[nb] = 1
        if (line ~ /(^|[ \t;{])server_name[ \t]/) {
            t = line
            sub(/^.*server_name[ \t]+/, "", t)
            gsub(/[;\t]/, " ", t)
            names[nb] = names[nb] t " "
        }
    }
    next
}

# Second pass: copy the file, adding the lines inside the chosen block
FNR == 1 {
    chosen = choose()
    if (chosen < 0) exit -chosen
    if (open_line[chosen] == close_line[chosen]) exit 6
}
{
    print
    if (FNR == open_line[chosen]) {
        if (note != "") print indent[chosen] "    " note
        print indent[chosen] "    " inc
    }
}
