import pandas as pd
import json
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from collections import defaultdict

# Load language-to-family mapping
mapping_df = pd.read_csv("language_family_mapping2.csv")
lang_to_family = dict(zip(mapping_df['language'], mapping_df['family']))

# Load original GeoJSON
with open("native_languages.geojson", "r", encoding="utf-8") as f:
    original_geojson = json.load(f)

# Group geometries by family
family_geometries = defaultdict(list)
family_slugs = defaultdict(list)
family_names = defaultdict(list)
family_descriptions = defaultdict(list)

for feature in original_geojson["features"]:
    lang_name = feature["properties"]["Name"]
    family = lang_to_family.get(lang_name, None)

    if not family or family in ["Not found", "Unknown"]:
        continue  # skip unknown families

    try:
        geom = shape(feature["geometry"])
        if not geom.is_valid:
            geom = geom.buffer(0)  # attempt to fix
        if geom.is_valid:
            family_geometries[family].append(geom)
        else:
            print(f"⚠️ Invalid geometry could not be fixed for: {lang_name}")
    except Exception as e:
        print(f"❌ Failed to parse geometry for: {lang_name} — {e}")

    family_slugs[family].append(feature["properties"].get("Slug", ""))
    family_names[family].append(lang_name)
    family_descriptions[family].append(feature["properties"].get("description", ""))

# Build new merged features
new_features = []
next_id = 1

for family, geoms in family_geometries.items():
    merged_geom = unary_union(geoms)
    new_feature = {
        "type": "Feature",
        "id": next_id,
        "properties": {
            "id": next_id,
            "Family": family,
            "Languages": sorted(set(family_names[family])),
            "Slugs": sorted(set(family_slugs[family])),
            "Descriptions": sorted(set(family_descriptions[family])),
        },
        "geometry": mapping(merged_geom)
    }
    new_features.append(new_feature)
    next_id += 1

# Build new FeatureCollection
merged_geojson = {
    "type": "FeatureCollection",
    "features": new_features
}

# Save to file
with open("native_languages2.geojson", "w", encoding="utf-8") as f:
    json.dump(merged_geojson, f, ensure_ascii=False, indent=2)

print(f"✅ Merged {len(original_geojson['features'])} features into {len(new_features)} families.")
