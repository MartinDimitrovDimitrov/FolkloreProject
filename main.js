import { initTable } from './tableManager.js';
import { initSelectionPanel } from './selectionPanel.js';
import { initMap } from './mapManager.js';
import { initLegend } from './legendManager.js';
import { initFilters } from './filters.js';
import { loadTales } from './index.js';
import { setupExportButton } from './exportManager.js';
import { setupImportButton } from './importManager.js';

$(document).ready(async function () {
    const table = initTable();
    await loadTales(table);
    initSelectionPanel(table);
    const map = initMap();  // Make sure initMap() returns the map
    initLegend(table);
    initFilters(table);

    setupExportButton();
    setupImportButton(map);
});