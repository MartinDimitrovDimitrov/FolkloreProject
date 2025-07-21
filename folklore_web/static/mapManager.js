import { markers, selected } from './sharedState.js';
import { updateLegend, createSvgIcon } from './legendManager.js';

export function initMap() {
    let map = L.map('map').setView([54.0, -130.0], 4);  // PNW-centered

    // Map base tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

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
            markers[id] = L.marker([tale.lat, tale.lon], {
                icon: createSvgIcon(shape, color),
                styleKey: styleKey,
                taleData: tale  // ← store all tale data for use later
            });

            markers[id].bindPopup(`<b>${tale.title}</b><br>${tale.location}`)
                .on('click', function () {
                    const checkbox = $(`.row-check[data-taleid="${id}"]`);
                    if (!checkbox.prop('checked')) {
                        checkbox.prop('checked', true);
                        checkbox.trigger('change');
                    }
                });
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
}