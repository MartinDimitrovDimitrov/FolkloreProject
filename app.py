from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text
import os

app = Flask(__name__)
CORS(app)  # allow all origins, or configure specifically

DATABASE_URL = os.environ.get("DATABASE_URL")
engine = create_engine(DATABASE_URL)

@app.route('/tales')
def get_tales():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tales.tale_id, tales.title, tales.culture_group, tales.collector,
                   tales.year_collected, tales.source_page,
                   sources.title AS source_title, sources.link AS source_link,
                   tales.notes,
                   locations.lat, locations.lon, locations.name AS location_name
            FROM tales
            JOIN locations ON tales.location_id = locations.location_id
            LEFT JOIN sources ON tales.source_id = sources.source_id
        """))
        tales = [dict(row._mapping) for row in result.fetchall()]
    return jsonify(tales)

@app.route('/tales/<int:tale_id>')
def tale_detail(tale_id):
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tales.title, tales.culture_group, tales.collector, tales.year_collected,
                   sources.title AS source_title,
                   sources.link AS source_link,
                   tales.source_page,
                   tales.notes,
                   locations.name AS location_name, locations.region
            FROM tales
            JOIN locations ON tales.location_id = locations.location_id
            LEFT JOIN sources ON tales.source_id = sources.source_id
            WHERE tales.tale_id = :id
        """), {'id': tale_id})
        tale = result.fetchone()
        if not tale:
            return jsonify({'error': 'Tale not found'}), 404
        tale = dict(tale._mapping)  # Convert row to dictionary
    return jsonify(tale)

if __name__ == '__main__':
    app.run(debug=True)