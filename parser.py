import urllib.request
import base64
import re

def fix_base64_padding(s):
    """Добавляет недостающий padding к base64 строке."""
    s = s.strip()
    missing_padding = len(s) % 4
    if missing_padding:
        s += '=' * (4 - missing_padding)
    return s

def safe_b64decode(data_str):
    """Безопасно декодирует строку из base64."""
    try:
        data_str = fix_base64_padding(data_str)
        return base64.b64decode(data_str.encode('utf-8')).decode('utf-8', errors='ignore')
    except Exception:
        return ""

def parse_url(url, is_base64=False):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*"
    }
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            content = response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Ошибка при скачивании {url}: {e}")
        return []

    lines = []
    
    if is_base64:
        # 1. Пробуем декодировать весь файл целиком
        decoded_full = safe_b64decode(content)
        if "://" in decoded_full:
            lines = decoded_full.splitlines()
        else:
            # 2. Если не вышло целиком — декодируем каждую строчку отдельно
            for line in content.splitlines():
                line = line.strip()
                if not line:
                    continue
                dec_line = safe_b64decode(line)
                if dec_line:
                    lines.extend(dec_line.splitlines())
                else:
                    lines.append(line)
    else:
        lines = content.splitlines()

    valid_configs = []
    # Ищем протоколы в любой части строки
    proto_pattern = re.compile(r"(vless|trojan|ss|hysteria2)://[^\s]+", re.IGNORECASE)

    for line in lines:
        line = line.strip()
        match = proto_pattern.search(line)
        if match:
            cfg = match.group(0)
            if "0.0.0.0" not in cfg:
                valid_configs.append(cfg)

    print(f"Успешно обработано для {url}: {len(valid_configs)} конфигов.")
    return valid_configs

def save_file(filename, title, configs):
    header = f"#profile-update-interval: 1\n#profile-title: {title}\n#announce: Все обновы в тг PrihsVPN!\n\n"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(header)
        for cfg in configs:
            f.write(cfg + "\n")

if __name__ == "__main__":
    # 1. White (текстовый список)
    white = parse_url("https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/WHITE-CIDR-RU-checked.txt", is_base64=False)
    save_file("white.json", "PrihVPN⚡ White", white)

    # 2. Ros (закодированный список)
    ros = parse_url("https://m1xzoocrrs1nezbe.mxm-secure.online/", is_base64=True)
    save_file("ros.json", "PrihVPN⚡ Ros", ros)

    # 3. Mifa (закодированный список)
    mifa = parse_url("https://mifa.world/fast", is_base64=True)
    save_file("mifa.json", "PrihVPN⚡ Mifa Full", mifa)
