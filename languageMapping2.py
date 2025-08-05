import pandas as pd
import json
import re

# Load Glottolog data files
languages = pd.read_csv('./glottolog/cldf/languages.csv')
alt_names = pd.read_csv('./glottolog/cldf/names.csv')

# Filter to languages only for direct matching
langs_only = languages[languages['Level'] == 'language']

# Load your language names (assumed JSON list)
with open('language_names.json', 'r', encoding='utf-8') as f:
    your_langs = json.load(f)

def find_language(name):
    # 1. Try exact match on main language names
    match = langs_only[langs_only['Name'] == name]
    if not match.empty:
        return match.iloc[0]

    # 2. Try exact match on alternative names
    alt_match = alt_names[alt_names['Name'] == name]
    if not alt_match.empty:
        # Take the first matching Language_ID
        lang_id = alt_match.iloc[0]['Language_ID']
        lang_entry = langs_only[langs_only['ID'] == lang_id]
        if not lang_entry.empty:
            return lang_entry.iloc[0]
        
    # 3. Partial match on main names: check if name is contained in any main name
    partial_main = langs_only[langs_only['Name'].str.contains(re.escape(name), case=False, na=False)]
    if not partial_main.empty:
        return partial_main.iloc[0]

    # 4. Partial match on alt names: check if name is contained in any alt name
    partial_alt = alt_names[alt_names['Name'].str.contains(re.escape(name), case=False, na=False)]
    if not partial_alt.empty:
        lang_id = partial_alt.iloc[0]['Language_ID']
        lang_entry = langs_only[langs_only['ID'] == lang_id]
        if not lang_entry.empty:
            return lang_entry.iloc[0]

    # 5. Try fallback keyword extraction, e.g., if name has parentheses, search inside
    fallback = extract_fallback_keyword(name)
    if fallback != name:
        # Try exact match on main names
        match = langs_only[langs_only['Name'] == fallback]
        if not match.empty:
            return match.iloc[0]

        # Try exact match on alt names
        alt_match = alt_names[alt_names['Name'] == fallback]
        if not alt_match.empty:
            lang_id = alt_match.iloc[0]['Language_ID']
            lang_entry = langs_only[langs_only['ID'] == lang_id]
            if not lang_entry.empty:
                return lang_entry.iloc[0]

        # Partial match main
        partial_main = langs_only[langs_only['Name'].str.contains(re.escape(fallback), case=False, na=False)]
        if not partial_main.empty:
            return partial_main.iloc[0]

        # Partial match alt
        partial_alt = alt_names[alt_names['Name'].str.contains(re.escape(fallback), case=False, na=False)]
        if not partial_alt.empty:
            lang_id = partial_alt.iloc[0]['Language_ID']
            lang_entry = langs_only[langs_only['ID'] == lang_id]
            if not lang_entry.empty:
                return lang_entry.iloc[0]

    # No match found
    return None

def extract_fallback_keyword(name):
    import re
    m = re.search(r'\(([^)]+)\)', name)
    if m:
        return m.group(1).strip()
    # fallback: last word of name
    return name.split()[-1]

results = []
for lang_name in your_langs:
    lang_data = find_language(lang_name)
    if lang_data is not None:
        family_id = lang_data['Family_ID']
        family_row = languages[(languages['ID'] == family_id) & (languages['Level'] == 'family')]
        family_name = family_row['Name'].values[0] if not family_row.empty else 'Unknown'
        results.append({'language': lang_name, 'family': family_name})
    else:
        results.append({'language': lang_name, 'family': 'Not found'})

# Save results to CSV
df_results = pd.DataFrame(results)
df_results.to_csv('language_family_mapping2.csv', index=False)

print("Mapping complete! Saved to language_family_mapping.csv")