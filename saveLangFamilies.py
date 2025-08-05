import json

# Load your GeoJSON file
with open('native_languages2.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Collect all unique family names
families = set()

for feature in data['features']:
    family = feature['properties'].get('Family', 'Unknown')
    families.add(family)

# Sort and print
for family in sorted(families):
    print(family)

# Optional: Save to a file
with open('unique_families.txt', 'w', encoding='utf-8') as out:
    for family in sorted(families):
        out.write(family + '\n')