import { selected } from './sharedState.js';

export function initFilters(table) {
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
}