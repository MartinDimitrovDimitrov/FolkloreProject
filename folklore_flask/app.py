from flask import Flask, render_template
from sqlalchemy import create_engine, text

app = Flask(__name__)

# Update with your own credentials if needed
engine = create_engine("postgresql+psycopg2://postgres:Boldt1974@localhost:5432/folklore")

@app.route('/')
def index():
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tales.tale_id, tales.title, tales.culture_group, tales.collector,
                   tales.year_collected, tales.source_page,
                   publications.title AS source_title, publications.link AS source_link,
                   tales.notes,
                   locations.lat, locations.lon, locations.name AS location_name
            FROM tales
            JOIN locations ON tales.location_id = locations.location_id
            LEFT JOIN publications ON tales.source_id = publications.publication_id
        """))
        tales = [dict(row._mapping) for row in result.fetchall()]
    return render_template('table.html', tales=tales)

@app.route('/tale/<int:tale_id>')
def tale_detail(tale_id):
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT tales.title, tales.culture_group, tales.collector, tales.year_collected,
                   publications.title AS source_title,
                   publications.link AS source_link,
                   tales.source_page,
                   tales.notes,
                   locations.name AS location_name, locations.region
            FROM tales
            JOIN locations ON tales.location_id = locations.location_id
            LEFT JOIN publications ON tales.source_id = publications.publication_id
            WHERE tales.tale_id = :id
        """), {'id': tale_id})
        tale = result.fetchone()
        if not tale:
            return "Tale not found", 404
        tale = dict(tale._mapping)  # Convert row to dictionary
    return render_template('tale_detail.html', tale=tale)

if __name__ == '__main__':
    app.run(debug=True)