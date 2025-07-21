export function initTable() {

    const table = $('#tales-table').DataTable({
        pageLength: 10,
        order: [[2, 'asc']],  // sort by Title (index 2 due to checkbox column)
        columnDefs: [
            { orderable: false, targets: [0,1] },  // disable sorting on row number and checkbox columns
            { width: '30px', targets: 0 },        // narrow first column for numbers
            { width: '20px', targets: 1 }         // narrow checkbox column
        ],
    });

    table.on('search.dt', function() {
        console.log('Global search triggered:', table.search());
    });

    table.on('draw.dt', function () {
        const pageInfo = table.page.info();
        table.column(0, {page: 'current'}).nodes().each(function (cell, i) {
            cell.innerHTML = pageInfo.start + i + 1;
        });
    });

    // Trigger draw.dt to fire (initialize numbering)
    table.draw(false);

    return table;
}