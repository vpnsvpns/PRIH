import sys
import urllib.request

# Целевая ссылка на подписку
URL = "https://m1xzoocrrs1nezbe.mxm-secure.online/"
OUTPUT_FILE = "max.json"

# Новые первые 4 строчки по твоему требованию
NEW_HEADER = [
    "#profile-update-interval: 1\n",
    "#profile-title: PrihVPN⚡️ Max\n",
    "#announce: Все обновы в тг PrihsVPN!\n",
    "\n" # пустая строка для разделения заголовка и данных
]

def update_subscription():
    # Маскируемся под клиент Karing / HiddifyNext, чтобы сервер отдал данные
    headers = {
        'User-Agent': 'HiddifyNext',
        'Accept': '*/*'
    }

    req = urllib.request.Request(URL, headers=headers)

    try:
        print(ج "Отправка запроса к серверу...")
        with urllib.request.urlopen(req, timeout=20) as response:
            content = response.read().decode('utf-8')
    except Exception as e:
        print(f"Критическая ошибка соединения: {e}")
        sys.exit(1)

    lines = content.splitlines(keepends=True)

    # Отрезаем старые первые 4 строки (если они есть) и берем остальное тело подписки
    if len(lines) >= 4:
        body = lines[4:]
    else:
        body = lines

    # Собираем итоговый файл: новые заголовки + оригинальные ноды
    final_content = "".join(NEW_HEADER) + "".join(body)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(final_content)

    print(f"Файл {OUTPUT_FILE} успешно перезаписан.")

if __name__ == "__main__":
    update_subscription()