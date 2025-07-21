import { initTable } from './tableManager.js';
import { initSelectionPanel } from './selectionPanel.js';
import { initMap } from './mapManager.js';
import { initLegend } from './legendManager.js';
import { initFilters } from './filters.js';
import { loadTales } from './index.js';

$(document).ready(async function () {
    const table = initTable();
    await loadTales(table);
    initSelectionPanel(table);
    initMap();
    initLegend(table);
    initFilters(table);
});