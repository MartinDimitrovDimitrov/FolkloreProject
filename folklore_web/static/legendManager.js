import { selected, markers } from './sharedState.js';
import { updatePanel } from './selectionPanel.js';

const styleLegend = {};  // key: "color|shape" → name

export function initLegend(table) {
    $('#legend-list').on('input', '.legend-label', function() {
        const $li = $(this).closest('li');
        const key = $li.data('key');
        styleLegend[key] = $(this).val();
    });

    $('#legend-list').on('click', '.delete-style', function () {
        const $li = $(this).closest('li');
        const key = $li.data('key');

        // Check if any marker uses this style
        const inUse = Object.entries(markers).some(([id, marker]) => {
            const icon = marker.options.icon;
            return icon && icon.options.html && icon.options.html.includes(key.split('|')[0]) && icon.options.html.includes(key.split('|')[1]);
        });

        if (inUse) {
            alert("This pin style is still in use on the map and cannot be deleted.");
            return;
        }

        delete styleLegend[key];
        $li.remove();
    });

    $('#legend-list').on('click', '.select-style', function () {
        const $li = $(this).closest('li');
        const key = $li.data('key'); // key = "color|shape"

        Object.entries(markers).forEach(([id, marker]) => {
            if (marker.options.styleKey === key) {
                if (!(id in selected)) {
                    const checkbox = $(`.row-check[data-taleid="${id}"]`);
                    // If checkbox is visible, use its data
                    if (checkbox.length) {
                        selected[id] = checkbox.data();
                    } else {
                        // Marker is on the map, so we can use marker's popup or other known source
                        const tale = marker.getPopup().getContent();
                        // You probably need to store full data at pin creation
                        // So instead:
                        const d = marker.options.taleData;
                        if (d) selected[id] = d;
                    }
                }
            }
        });

        updatePanel();
        table.draw(); // redraw the table to update visible checkboxes
    });

    $('#legend-list').sortable({
        placeholder: "legend-placeholder",
        axis: "y",
        handle: ".drag-handle"
    });

    $('#clear-legend').on('click', function () {
        $('#legend-list li').each(function () {
            const $li = $(this);
            const key = $li.data('key');

            // Check if this style is in use by any marker
            const inUse = Object.values(markers).some(marker =>
                marker.options.styleKey === key
            );

            if (!inUse) {
                delete styleLegend[key];
                $li.remove();
            }
        });
    });

    $('#add-new-style').on('click', () => {
        const color = $('#new-pin-color').val();
        const shape = $('#new-pin-shape').val();

        const key = `${color}|${shape}`;

        if (key in styleLegend) {
            alert('This pin style already exists in the legend.');
            return;
        }

        styleLegend[key] = ''; // empty label initially

        $('#legend-list').append(`
            <li data-key="${key}" style="margin-bottom: 6px;">
            <span class="legend-icon">${createSvgIconHtml(shape, color)}</span>
            <input type="text" class="legend-label" placeholder="Name this pin style" style="margin-left: 8px; width: 150px;" />
            <button class="select-style" style="margin-left: 10px;">Select All</button>
            <button class="delete-style" style="margin-left: 10px;">Delete</button>
            <span class="drag-handle" title="Drag to reorder" style="cursor: grab; margin-left: 10px;">&#x2630;</span>
            </li>
        `);
    });
}

export function updateLegend(color, shape) {
    const key = `${color}|${shape}`;

    if (!(key in styleLegend)) {
        styleLegend[key] = ''; // initially empty label

        $('#legend-list').append(`
            <li data-key="${key}" class="legend-item" style="margin-bottom: 6px;">
                <span class="legend-icon">${createSvgIconHtml(shape, color)}</span>
                <input type="text" class="legend-label" placeholder="Name this pin style" style="margin-left: 8px; width: 150px;" />
                <button class="select-style" style="margin-left: 10px;">Select All</button>
                <button class="delete-style" style="margin-left: 10px;">Delete</button>
                <span class="drag-handle" title="Drag to reorder" style="cursor: grab; margin-left: 10px;">&#x2630;</span>
            </li>
        `);
    }
}

// Used for rendering SVG pin in the legend
function createSvgIconHtml(shape, color) {
    if (shape === 'circle') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'square') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'triangle') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,4 20,20 4,20" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'star') {
        return `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    }
}

// Used for creating Leaflet divIcon for map pins
export function createSvgIcon(shape, color) {
    const size = 24;
    let svg;

    if (shape === 'circle') {
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'square') {
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="16" height="16" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'triangle') {
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,4 20,20 4,20" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    } else if (shape === 'star') {
        svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon points="12,2 15,10 23,10 17,14 19,22 12,17 5,22 7,14 1,10 9,10" fill="${color}" stroke="black" stroke-width="1"/>
        </svg>`;
    }

    return L.divIcon({
        className: '',
        html: svg,
        iconSize: [size, size],
        iconAnchor: [size/2, size],  // bottom-center
        popupAnchor: [0, -size]
    });
}