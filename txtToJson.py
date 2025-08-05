# Read from your text file with one language name per line
with open('language_names.txt', 'r', encoding='utf-8') as f:
    lines = f.read().splitlines()

# Save as JSON list
import json
with open('language_names.json', 'w', encoding='utf-8') as f_json:
    json.dump(lines, f_json, ensure_ascii=False, indent=2)

print(f"Converted {len(lines)} language names from TXT to JSON list!")