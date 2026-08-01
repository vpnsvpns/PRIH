import urllib.request
import subprocess
import base64
import re
import sys

def fetch_url(url):
    """Скачивает URL с подменой User-Agent. Если urllib фейлится, использует curl."""
    headers = {
        "User-Agent": "v2rayN/6.23",
        "Accept": "*/*"
    }
    
    # Попытка 1: urllib
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as response:
            data = response.read().decode("utf-8", errors="ignore")
            if data.strip():
                print(f"[SUCCESS] {url} скачан через urllib ({len(data)} байт)")
                return data
    except Exception as e:
        print(f"[WARN] urllib не смог скачать {url}: {e}")

    # Попытка 2: curl (на случай если urllib режется)
    try:
        cmd = ["curl", "-sL", "-A", "v2rayN/6.23", url]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
        if result.stdout.strip():
            print(f"[SUCCESS] {url} скачан через curl ({len(result.stdout)} байт)")
            return result.stdout
    except Exception as e:
        print(f"[ERROR] curl тоже фейльнулся для {url}: {e}")

    return ""

def decode_base64_payload(content):
    """Декодирует любой вариант Base64 (монолит или построчно)."""
    lines = []
    content_clean = content.strip()
    
    # Добавляем padding если нужно
    missing_padding = len(content_clean) % 4
    if missing_padding:
        content_clean += '=' * (4 - missing_padding)

    # 1. Пробуем декодировать весь массив сразу
    try:
        decoded = base64.b64decode(content_clean.encode('utf-8')).decode('utf-8', errors='ignore')
        if "://" in decoded:
            return decoded.splitlines()
    except Exception:
        pass

    # 2. Если цельно не вышло, декодируем по строкам
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        
        # Фикс паддинга для отдельной строки
        p = len(line) % 4
        if p:
            line += '=' * (4 - p)
            
        try:
            dec = base64.b64decode(line.encode('utf-8')).decode('utf-8', errors='ignore')
            if "://" in dec:
                lines.extend(dec.splitlines())
            else:
                lines.append(line)
        except Exception:
            lines.append(line)

    return lines

def process_source(url, is_base64=False):
    print(f"\n--- Обработка: {url} ---")
    raw_data = fetch_url(url)
    
    if not raw_data:
        print(f"[ERROR] Не удалось получить данные с {url}")
        return []

    if is_base64:
        lines = decode_base64_payload(raw_data)
    else:
        lines = raw_data.splitlines()

    configs = []
    proto_pattern = re.compile(r"(vless|trojan|ss|hysteria2)://[^\s]+", re.IGNORECASE)

    for line in lines:
        match = proto_pattern.search(line.strip())
        if match:
            cfg = match.group(0)
            if "0.0.0.0" not in cfg:
                configs.append(cfg)

    print(f"[RESULT] Найдено валидных конфигов: {len(configs)}")
    return configs

def save_file(filename, title, configs):
    header = f"#profile-update-interval: 1\n#profile-title: {title}\n#announce: Все обновы в тг PrihsVPN!\n\n"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(header)
        for cfg in configs:
            f.write(cfg + "\n")

if __name__ == "__main__":
    white = process_source("https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/WHITE-CIDR-RU-checked.txt", False)
    save_file("white.json", "PrihVPN⚡ White", white)

    ros = process_source("https://m1xzoocrrs1nezbe.mxm-secure.online/", True)
    save_file("ros.json", "PrihVPN⚡ Ros", ros)

    mifa = process_source("https://mifa.world/fast", True)
    save_file("mifa.json", "PrihVPN⚡ Mifa Full", mifa)