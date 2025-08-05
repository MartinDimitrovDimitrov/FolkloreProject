import { markers, selected } from './sharedState.js';
import { updateLegend, createSvgIcon } from './legendManager.js';

export function initMap() {
    let map = L.map('map').setView([54.0, -130.0], 4);  // PNW-centered

    // Map base tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const familyColors = {
        "Afro-Asiatic": "#e6194B",
        "Ainu": "#3cb44b",
        "Algic": "#ffe119",
        "Araucanian": "#4363d8",
        "Arawakan": "#f58231",
        "Arawan": "#911eb4",
        "Artificial Language": "#46f0f0",
        "Athabaskan-Eyak-Tlingit": "#f032e6",
        "Atlantic-Congo": "#bcf60c",
        "Austroasiatic": "#fabebe",
        "Austronesian": "#008080",
        "Aymaran": "#e6beff",
        "Barbacoan": "#9A6324",
        "Bookkeeping": "#fffac8",
        "Boran": "#800000",
        "Bororoan": "#aaffc3",
        "Bunaban": "#808000",
        "Caddoan": "#ffd8b1",
        "Cahuapanan": "#000075",
        "Cariban": "#808080",
        "Chapacuran": "#ffffff",
        "Charruan": "#000000",
        "Chibchan": "#e6194B",
        "Chicham": "#3cb44b",
        "Chimakuan": "#ffe119",
        "Chinookan": "#4363d8",
        "Chiquitano": "#f58231",
        "Chocoan": "#911eb4",
        "Chonan": "#46f0f0",
        "Chumashan": "#f032e6",
        "Cochimi-Yuman": "#bcf60c",
        "Coosan": "#fabebe",
        "East Strickland": "#008080",
        "Eastern Daly": "#e6beff",
        "Eastern Trans-Fly": "#9A6324",
        "Eskimo-Aleut": "#fffac8",
        "Garrwan": "#800000",
        "Giimbiyu": "#aaffc3",
        "Guahiboan": "#808000",
        "Guaicuruan": "#ffd8b1",
        "Gunwinyguan": "#000075",
        "Haida": "#808080",
        "Huavean": "#ffffff",
        "Huitotoan": "#000000",
        "Indo-European": "#e6194B",
        "Iroquoian": "#3cb44b",
        "Iwaidjan Proper": "#ffe119",
        "Japonic": "#4363d8",
        "Jarrakan": "#f58231",
        "Kakua-Nukak": "#911eb4",
        "Kalapuyan": "#46f0f0",
        "Katukinan": "#f032e6",
        "Kawesqar": "#bcf60c",
        "Keresan": "#fabebe",
        "Kiowa-Tanoan": "#008080",
        "Koreanic": "#e6beff",
        "Lencan": "#9A6324",
        "Lengua-Mascoy": "#fffac8",
        "Limilngan-Wulna": "#800000",
        "Maiduan": "#aaffc3",
        "Mairasic": "#808000",
        "Mangarrayi-Maran": "#ffd8b1",
        "Maningrida": "#000075",
        "Mataguayan": "#808080",
        "Mayan": "#ffffff",
        "Mirndi": "#000000",
        "Misumalpan": "#e6194B",
        "Miwok-Costanoan": "#3cb44b",
        "Mixe-Zoque": "#ffe119",
        "Muskogean": "#4363d8",
        "Naduhup": "#f58231",
        "Nambiquaran": "#911eb4",
        "Northern Daly": "#46f0f0",
        "Nuclear Torricelli": "#f032e6",
        "Nuclear Trans New Guinea": "#bcf60c",
        "Nuclear-Macro-Je": "#fabebe",
        "Nyimang": "#008080",
        "Nyulnyulan": "#e6beff",
        "Otomanguean": "#9A6324",
        "Palaihnihan": "#fffac8",
        "Pama-Nyungan": "#800000",
        "Pano-Tacanan": "#aaffc3",
        "Peba-Yagua": "#808000",
        "Pidgin": "#ffd8b1",
        "Pomoan": "#000075",
        "Quechuan": "#808080",
        "Sahaptian": "#ffffff",
        "Saharan": "#000000",
        "Saliban": "#e6194B",
        "Salishan": "#3cb44b",
        "Shastan": "#ffe119",
        "Sino-Tibetan": "#4363d8",
        "Siouan": "#f58231",
        "South Omotic": "#911eb4",
        "Southern Daly": "#46f0f0",
        "Tamaic": "#f032e6",
        "Tangkic": "#bcf60c",
        "Tarascan": "#fabebe",
        "Teberan": "#008080",
        "Tequistlatecan": "#e6beff",
        "Ticuna-Yuri": "#9A6324",
        "Totonacan": "#fffac8",
        "Tsimshian": "#800000",
        "Tucanoan": "#aaffc3",
        "Tupian": "#808000",
        "Turkic": "#ffd8b1",
        "Unattested": "#000075",
        "Unclassifiable": "#808080",
        "Uralic": "#ffffff",
        "Uru-Chipaya": "#000000",
        "Uto-Aztecan": "#e6194B",
        "Wakashan": "#3cb44b",
        "Western Daly": "#ffe119",
        "Wintuan": "#4363d8",
        "Worrorran": "#f58231",
        "Xincan": "#911eb4",
        "Yam": "#46f0f0",
        "Yangmanic": "#f032e6",
        "Yanomamic": "#bcf60c",
        "Yokutsan": "#fabebe",
        "Yuki-Wappo": "#008080",
        "Zamucoan": "#e6beff",
        "Zaparoan": "#9A6324",
        "Unknown": "#cccccc",
        "Not found": "#dddddd"
    };

    // Add language regions
    fetch('./native_languages2.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        // L.geoJSON(geojsonData, {
        // style: {
        //     color: '#444',
        //     weight: 1,
        //     fillOpacity: 0.2
        // },
        // onEachFeature: function (feature, layer) {
        //     layer.bindPopup(feature.properties.Name || 'No name');
        // }
        // }).addTo(map);

        L.geoJSON(geojsonData, {
            style: feature => {
                const family = feature.properties.family || 'Unknown';
                return {
                    color: '#444',
                    weight: 1,
                    fillOpacity: 0.3,
                    fillColor: familyColors[family] || '#bbbbbb'
                };
            },
            onEachFeature: function (feature, layer) {
                const name = feature.properties.Name || 'No name';
                const family = feature.properties.family || 'Unknown';
                layer.bindPopup(`<strong>${name}</strong><br>Family: ${family}`);
            }
        }).addTo(map);
    });

    // Add to map
    $('#add-map').on('click', () => {
        const color = $('#pin-color').val();
        const shape = $('#pin-shape').val();

        Object.values(selected).forEach(tale => {
            const id = tale.taleid;
            updateLegend(color, shape);

            if (markers[id]) {
                map.removeLayer(markers[id]);
            }

            const styleKey = `${color}|${shape}`;

            // Add a small jitter to avoid exact overlap
            const jitter = (Math.random() - 0.5) * 0.1;
            const lat = parseFloat(tale.lat) + jitter;
            const lon = parseFloat(tale.lon) + jitter;

            markers[id] = L.marker([lat, lon], {
                icon: createSvgIcon(shape, color),
                styleKey: styleKey,
                taleData: tale  // store all tale data for use later
            });

            markers[id].bindPopup(`<b>${tale.title}</b><br>${tale.location}`)
                .on('click', function () {
                    const checkbox = $(`.row-check[data-taleid="${id}"]`);
                    if (!checkbox.prop('checked')) {
                        checkbox.prop('checked', true);
                        checkbox.trigger('change');
                    }
                });
            // oms.addMarker(markers[id]);  // needed to handle overlapping pins
            markers[id].addTo(map);
        });
    });

    // Remove from map
    $('#remove-map').on('click', ()=>{
        Object.values(selected).forEach(tale => {
            const id = tale.taleid;
            if (markers[id]) {
                map.removeLayer(markers[id]);
                delete markers[id];
            }
        });
    });

    // Remove full map
    $('#clear-map').on('click', () => {
        if (confirm("Are you sure you want to remove all pins from the map?")) {
            for (const id in markers) {
                map.removeLayer(markers[id]);
            }
            Object.keys(markers).forEach(key => delete markers[key]); // Reset the markers object
        }
    });

    return map;
}