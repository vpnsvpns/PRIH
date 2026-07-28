#!/bin/sh
# ================================================================
#  SSClash & Mihomo Cleanup Script for OpenWrt
# ================================================================

# 1. Останавливаем и отключаем службы
echo "[+] Останавливаем сервисы..."
if [ -x /etc/init.d/clash ]; then
    /etc/init.d/clash stop 2>/dev/null
    /etc/init.d/clash disable 2>/dev/null
    rm -f /etc/init.d/clash
fi

# 2. Удаляем основной пакет SSClash
echo "[+] Удаляем пакет luci-app-ssclash..."
opkg remove luci-app-ssclash --force-depends 2>/dev/null

# 3. Безопасное удаление зависимостей, установленных инсталлером
# coreutils-base64 точно не нужен системе по умолчанию.
# kmod-nft-tproxy и kmod-tun удаляем без принуждения (если они нужны другим сервисам, opkg их оставит).
echo "[+] Удаляем вспомогательные зависимости..."
opkg remove coreutils-base64 2>/dev/null
opkg remove kmod-nft-tproxy 2>/dev/null
opkg remove kmod-tun 2>/dev/null

# 4. Удаляем файл бинарника mihomo и конфиги (/opt/clash) — это главный источник «съеденной» памяти!
echo "[+] Удаляем тяжелые файлы ядра mihomo и конфигов..."
rm -rf /opt/clash
rm -rf /etc/config/clash
rm -rf /tmp/clash*
rm -f /tmp/luci-app-ssclash.*

# 5. Очищаем кэш и списки пакетов opkg в RAM/overlay
echo "[+] Очищаем временный кэш opkg..."
rm -rf /var/opkg-lists/*
rm -rf /tmp/opkg-*

echo "------------------------------------------------"
echo "[✓] Очистка завершена!"
echo "Текущая свободная память (overlay):"
df -h /overlay