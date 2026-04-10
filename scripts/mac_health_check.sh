#!/usr/bin/env bash

set -u

TS="$(date +%Y%m%d_%H%M%S)"
REPORT_PATH="${1:-/tmp/mac_health_check_${TS}.txt}"

warn_count=0

section() {
  printf "\n==== %s ====\n" "$1"
}

line() {
  printf "%s\n" "$1"
}

run_cmd() {
  local title="$1"
  local cmd="$2"
  section "$title"
  printf "$ %s\n" "$cmd"
  eval "$cmd" 2>&1 || true
}

warn() {
  warn_count=$((warn_count + 1))
  line "[WARN] $1"
}

{
  section "MAC HEALTH CHECK"
  line "Generated at: $(date '+%Y-%m-%d %H:%M:%S %Z')"
  line "Report path: ${REPORT_PATH}"

  run_cmd "System Info" "sw_vers; echo; uname -a; echo; uptime"
  run_cmd "Battery and Thermal" "pmset -g batt; echo; pmset -g therm 2>/dev/null || true"
  run_cmd "Disk Usage" "df -h /; echo; df -h"
  run_cmd "Top CPU Processes" "ps -Ao pid,pcpu,pmem,rss,comm | sort -k2 -nr | head -n 15 || { echo 'ps unavailable, fallback to top'; top -l 1 -o cpu | sed -n '1,35p'; }"
  run_cmd "Top Memory Processes" "ps -Ao pid,pcpu,pmem,rss,comm | sort -k4 -nr | head -n 15 || { echo 'ps unavailable, fallback to top'; top -l 1 -o mem | sed -n '1,35p'; }"
  run_cmd "Memory Pressure" "memory_pressure 2>/dev/null | sed -n '1,80p'; echo; vm_stat | sed -n '1,30p'"
  run_cmd "Login Items (Finder/System Events)" "osascript -e 'tell application \"System Events\" to get the name of every login item' 2>/dev/null || echo 'Login items unavailable (permission may be required)'"
  run_cmd "LaunchAgents/Daemons (File List)" "ls -la ~/Library/LaunchAgents 2>/dev/null || true; echo; ls -la /Library/LaunchAgents 2>/dev/null || true; echo; ls -la /Library/LaunchDaemons 2>/dev/null || true"
  run_cmd "Recent Panic/Reset/Shutdown Reports" "ls -lt /Library/Logs/DiagnosticReports 2>/dev/null | rg -i 'panic|shutdown_stall|ResetCounter|JetsamEvent' | head -n 40 || true"
  run_cmd "Risky Network Driver Check (Realtek/RTL815)" "pkgutil --pkgs | rg -i 'realtek|rtl815|8153' || true; echo; ls -la /Library/Extensions 2>/dev/null | rg -i 'realtek|rtl815|AppleRTL815X' || true"

  section "Quick Risk Summary"
  disk_used_pct="$(df -h / | awk 'NR==2 {gsub("%","",$5); print $5}')"
  if [[ "$disk_used_pct" =~ ^[0-9]+$ ]]; then
    line "Disk used on /: ${disk_used_pct}%"
    if (( disk_used_pct >= 85 )); then
      warn "System disk usage is high (>=85%). Target <80%."
    fi
  else
    line "Disk usage parse failed."
  fi

  mem_free_pct="$(memory_pressure 2>/dev/null | awk '/System-wide memory free percentage:/ {gsub("%","",$5); print $5; exit}')"
  if [[ "$mem_free_pct" =~ ^[0-9]+$ ]]; then
    line "System-wide memory free percentage: ${mem_free_pct}%"
    if (( mem_free_pct <= 10 )); then
      warn "Memory free percentage is low (<=10%)."
    fi
  else
    line "Memory free percentage unavailable."
  fi

  recent_panic_count="$(find /Library/Logs/DiagnosticReports -maxdepth 1 -type f -iname '*panic*' -mtime -3 2>/dev/null | wc -l | tr -d ' ')"
  if [[ "$recent_panic_count" =~ ^[0-9]+$ ]]; then
    line "Recent panic files (last 3 days): ${recent_panic_count}"
    if (( recent_panic_count > 0 )); then
      warn "Recent panic reports detected."
    fi
  else
    line "Recent panic count unavailable."
  fi

  line "Total warnings: ${warn_count}"
  if (( warn_count == 0 )); then
    line "[OK] No immediate high-risk signals from this quick check."
  else
    line "[ACTION] Please review WARN items first."
  fi
} | tee "${REPORT_PATH}"

printf "\nSaved report to: %s\n" "${REPORT_PATH}"
