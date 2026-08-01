import urllib.request
import base64
import re

def parse_url(url, is_base64=False):
    headers = {"User-Agent": "v2rayN/6.23", "Accept": "*/*"}
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

    lines = []
    
    if is_base64:
        # Пробуем декодировать цельный массив
        try:
            decoded = base64.b64decode(content.strip()).decode("utf-8", errors="ignore")
            lines.extend(decoded.splitlines())
        except Exception:
            # Если не вышло — декодируем построчно
            for line in content.splitlines():
                line = line.strip()
                if not line:
                    continue
                try:
                    dec_line = base64.b64decode(line).decode("utf-8", errors="ignore")
                    lines.extend(dec_line.splitlines())
                except Exception:
                    lines.append(line)
    else:
        lines = content.splitlines()

    valid_configs = []
    proto_pattern = re.compile(r"^(vless|trojan|ss|hysteria2)://", re.IGNORECASE)

    for line in lines:
        line = line.strip()
        if proto_pattern.match(line) and "0.0.0.0" not in line:
            valid_configs.append(line)

    return valid_configs

def save_file(filename, title, configs):
    header = f"#profile-update-interval: 1\n#profile-title: {title}\n#announce: Все обновы в тг PrihsVPN!\n\n"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(header)
        for cfg in configs:
            f.write(cfg + "\n")

if __name__ == "__main__":
    # 1. White
    white = parse_url("https://raw.githubusercontent.com/igareck/vpn-configs-for-russia/refs/heads/main/WHITE-CIDR-RU-checked.txt", is_base64=False)
    save_file("white.json", "PrihVPN⚡ White", white)

    # 2. Ros
    ros = parse_url("https://m1xzoocrrs1nezbe.mxm-secure.online/", is_base64=True)
    save_file("ros.json", "PrihVPN⚡ Ros", ros)

    # 3. Mifa
    mifa = parse_url("https://mifa.world/fast", is_base64=True)
    save_file("mifa.json", "PrihVPN⚡ Mifa Full", mifa)