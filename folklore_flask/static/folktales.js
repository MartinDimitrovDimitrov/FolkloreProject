// old file, no longer in use

$(document).ready(function () {

    // tableManager

    const table = $('#tales-table').DataTable({
        pageLength: 10,
        order: [[2, 'asc']],  // sort by Title (index 2 due to checkbox column)
        columnDefs: [
            { orderable: false, targets: [0,1] },  // disable sorting on row number and checkbox columns
            { width: '30px', targets: 0 },        // narrow first column for numbers
            { width: '20px', targets: 1 }         // narrow checkbox column
        ],
    });

    table.on('draw.dt', function () {
        const pageInfo = table.page.info();
        table.column(0, {page: 'current'}).nodes().each(function (cell, i) {
            cell.innerHTML = pageInfo.start + i + 1;
        });
    });

    // Trigger draw.dt to fire (initialize numbering)
    table.draw(false);

    let selected = {};
    let markers = {};  // tale_id → marker
    let map = L.map('map').setView([54.0, -130.0], 4);  // PNW-centered
    const styleLegend = {};  // key: "color|shape" → name

    // Map base tile
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    $('#tales-table').on('change','.row-check', function(){
            const taleId = $(this).data('taleid');
            if(this.checked){
                selected[taleId] = $(this).data();
            }else{
                delete selected[taleId];
            }
            updatePanel();
    });

    table.on('search.dt', function() {
        console.log('Global search triggered:', table.search());
    });

    table.on('draw', function() {
        // For all rows currently visible
        const nodes = table.rows({page:'current'}).nodes();
        $(nodes).find('.row-check').each(function() {
            const taleId = $(this).data('taleid');
            $(this).prop('checked', !!selected[taleId]);
        });

        // Update header checkbox state on redraw
        const allChecked = table.rows({search:'applied'}).data().length === Object.keys(selected).length && Object.keys(selected).length > 0;
        $('#select-all-visible').prop('checked', allChecked);
    });

    $('#select-all-visible').on('change', function () {
        const checked = this.checked;

        // Get all filtered rows (across pages)
        const nodes = table.rows({ search: 'applied' }).nodes();

        $(nodes).find('.row-check').each(function () {
            $(this).prop('checked', checked);
            const taleId = $(this).data('taleid');

            if (checked) {
                selected[taleId] = {
                    taleid: taleId,
                    title: $(this).data('title'),
                    culture: $(this).data('culture'),
                    collector: $(this).data('collector'),
                    year: $(this).data('year'),
                    location: $(this).data('location'),
                    lat: $(this).data('lat'),
                    lon: $(this).data('lon'),
                    notes: $(this).data('notes')
                };
            } else {
                delete selected[taleId];
            }
        });

        updatePanel();
    });

    function updatePanel(){
        const n = Object.keys(selected).length;
        $('#sel-count').text(n);

        if(n === 0){
            // Show "no tales selected" message
            $('#sel-info').text('(no tales selected)');
            $('#style-controls').hide();
        } else {
            $('#style-controls').show();

            if(n === 1){
                const d = Object.values(selected)[0];
                $('#sel-info').html(`
                    <b><a href="/tale/${d.taleid}" target="_blank" rel="noopener noreferrer">${d.title}</a></b><br>
                    Culture group: ${d.culture}<br>
                    Collector: ${d.collector} (${d.year})<br>
                    Location: ${d.location}<br>
                    Notes: ${d.notes}
                `);
            } else {
                $('#sel-info').text('(multiple tales selected)');
            }
        }
    }

    function updateLegend(color, shape) {
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

    function createSvgIcon(shape, color) {
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

    $('#unselect-all').on('click', function () {
        selected = {};  // Clear selection dictionary

        // Uncheck all checkboxes
        $('.row-check').prop('checked', false);

        // Update the header checkbox
        $('#select-all-visible').prop('checked', false);

        updatePanel();

        // Redraw table in case "Show only selected" is active
        table.draw();
    });

    $('#clear-map').on('click', () => {
        if (confirm("Are you sure you want to remove all pins from the map?")) {
            for (const id in markers) {
                map.removeLayer(markers[id]);
            }
            markers = {}; // Reset the markers object
        }
    });
    
    $('#select-map').on('click', () => {
        for (const id in markers) {
            const checkbox = $(`.row-check[data-taleid="${id}"]`);

            // Update checkbox and internal selection
            checkbox.prop('checked', true).trigger('change');

            // If somehow the checkbox wasn't rendered yet (e.g., paginated away),
            // ensure the tale is in `selected` manually
            if (!selected[id]) {
                const marker = markers[id];
                const data = marker.options;  // No direct tale data in marker, so we pull from the checkbox if it exists

                // Try to find the checkbox (even if it's on a different page)
                const cb = $(`.row-check[data-taleid="${id}"]`);
                if (cb.length) {
                    selected[id] = {
                        taleid: id,
                        title: cb.data('title'),
                        culture: cb.data('culture'),
                        collector: cb.data('collector'),
                        year: cb.data('year'),
                        location: cb.data('location'),
                        lat: cb.data('lat'),
                        lon: cb.data('lon'),
                        notes: cb.data('notes')
                    };
                }
            }
        }

        updatePanel();
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

    const $filter = $(`
    <div class="filter-block" style="display: block; margin-top: 10px;">
        <!-- filter content -->
    </div>
    `);

    $('#filters-list').append($filter);

    let filterCount = 0;
    $('#add-filter').on('click', () => {
        const i = filterCount++;
        $('#filters-list').append(`
        <div class="filter-block">
            <input type="text" class="filter-input" placeholder="Search term">
            <select class="filter-column">
            <option value="title">Title</option>
            <option value="culture_group">Culture Group</option>
            <option value="collector">Collector</option>
            <option value="year_collected">Year</option>
            <option value="source">Source</option>
            <option value="notes">Notes</option>
            </select>
            <select class="filter-mode">
            <option value="AND">AND</option>
            <option value="OR">OR</option>
            <option value="NOT">NOT</option>
            </select>
            <button class="remove-filter">✕</button>
        </div>
        `);
    });

    // Remove filter button handler
    $('#filters-list').on('click', '.remove-filter', function() {
        $(this).closest('.filter-block').remove();
        table.draw();
    });

    $('#show-only-selected').on('change', function () {
        table.draw(); // triggers custom filter
    });

    $('#filters-list').on('input change', '.filter-input, .filter-column, .filter-mode', function() {
        table.draw();
    });

    // Custom filtering function
    $.fn.dataTable.ext.search.push((settings, data, dataIndex) => {
        // No global search filtering here — DataTables already filters globally

        let andPass = true;
        let orPass = false;

        const colMap = {
            title: 2,
            culture_group: 3,
            collector: 4,
            year_collected: 5,
            source: 6,
            notes: 8
        };

        $('#filters-list .filter-block').each(function() {
            const colName = $(this).find('.filter-column').val();
            const val = $(this).find('.filter-input').val();
            const term = val ? val.toLowerCase() : '';
            const op = $(this).find('.filter-mode').val();

            if (!term) return; // skip empty filters

            const colIdx = colMap[colName];
            if (colIdx === undefined) return;

            const cellRaw = data[colIdx];
            const cell = cellRaw ? cellRaw.toString().toLowerCase() : '';
            const match = cell.includes(term);

            if (op === 'AND') {
                if (!match) andPass = false;
            } else if (op === 'OR') {
                if (match) orPass = true;
            } else if (op === 'NOT') {
                if (match) andPass = false;
            }
        });

        const hasOr = $('#filters-list .filter-block').filter((_, f) => {
            return $(f).find('.filter-mode').val() === 'OR' && $(f).find('.filter-input').val();
        }).length > 0;

        if (!andPass) return false;
        if (hasOr && !orPass) return false;

        // show-only-selected checkbox logic
        const onlySelected = $('#show-only-selected').prop('checked');
        if (onlySelected) {
            // Get the tale ID from the checkbox in the row
            const rowNode = settings.aoData[dataIndex].nTr;
            const checkbox = $(rowNode).find('.row-check');
            const id = checkbox.data('taleid');
            return id && selected.hasOwnProperty(id);
        }

        return true;
    });
});