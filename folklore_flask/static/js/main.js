import { initTable } from './tableManager.js';
import { initSelectionPanel } from './selectionPanel.js';
import { initMap } from './mapManager.js';
import { initLegend } from './legendManager.js';
import { initFilters } from './filters.js';

$(document).ready(function () {
    const table = initTable();
    initSelectionPanel(table);
    initMap();
    initLegend(table);
    initFilters(table);
});