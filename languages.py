import json

# Load your local GeoJSON file
with open("native_languages.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

# Extract all unique language names
languages = set()
for feature in data["features"]:
    name = feature.get("properties", {}).get("Name")
    if name:
        languages.add(name.strip())

# Sort the list
sorted_languages = sorted(languages)

# Save to a text file
with open("language_names.txt", "w", encoding="utf-8") as f:
    for lang in sorted_languages:
        f.write(lang + "\n")

print(f"Saved {len(sorted_languages)} language names to 'language_names.txt'")