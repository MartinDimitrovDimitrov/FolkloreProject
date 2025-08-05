import { markers } from './sharedState.js';
import { updateLegend, createSvgIcon } from './legendManager.js';

export function setupImportButton(map) {
    $('#import-map-data').on('click', () => {
        $('#import-file').click();
    });

    $('#import-file').on('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const data = JSON.parse(event.target.result);
            loadImportedMapData(data, map);
        };
        reader.readAsText(file);
    });
}

function loadImportedMapData(data, map) {
    if (!data.markers || !data.legend) {
        alert("Invalid map data file.");
        return;
    }

    // Clear existing markers
    for (const id in markers) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }

    // Clear existing legend
    $('#legend-list').empty();

    data.legend.forEach(({ key, name }) => {
        const [color, shape] = key.split('|');
        updateLegend(color, shape);
        $('#legend-list')
          .find(`li[data-key="${key}"] .legend-label`)
          .val(name || '');
    });

    data.markers.forEach(({ taleid, latlng, styleKey, taleData }) => {
        const [color, shape] = styleKey.split('|');
        const marker = L.marker(latlng, {
            icon: createSvgIcon(shape, color),
            styleKey,
            taleData
        });

        marker.bindPopup(`<b>${taleData.title}</b><br>${taleData.location}`);
        markers[taleid] = marker;
        marker.addTo(map);
    });
}