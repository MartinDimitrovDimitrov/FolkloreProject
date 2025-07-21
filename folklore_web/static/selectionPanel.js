import { selected, markers } from './sharedState.js';

export function initSelectionPanel(table) {

    // Track if a row checkbox is toggled
    $('#tales-table').on('change','.row-check', function(){
            const taleId = $(this).data('taleid');
            if(this.checked){
                selected[taleId] = $(this).data();
            }else{
                delete selected[taleId];
            }
            updatePanel();
    });

    // Track if the header checkbox (select-all-visible) is toggled
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

    // Track for selctions from map
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

    $('#unselect-all').on('click', function () {
        Object.keys(selected).forEach(key => delete selected[key]);  // Clear selection dictionary

        // Uncheck all checkboxes
        $('.row-check').prop('checked', false);

        // Update the header checkbox
        $('#select-all-visible').prop('checked', false);

        updatePanel();

        // Redraw table in case "Show only selected" is active
        table.draw();
    });

    // Update row and header checkboxes on DataTable `draw` event
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
}

// Update the Selected Tales panel
export function updatePanel(){
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