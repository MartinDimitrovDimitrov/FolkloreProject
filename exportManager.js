import { markers } from './sharedState.js';
import { getLegendData } from './legendManager.js';

export function setupExportButton() {
    $('#export-map-data').on('click', () => {
        const markerData = Object.entries(markers).map(([id, marker]) => ({
            taleid: id,
            latlng: marker.getLatLng(),
            styleKey: marker.options.styleKey,
            taleData: marker.options.taleData
        }));

        const exportData = {
            markers: markerData,
            legend: getLegendData()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "folktale_map_export.json";
        a.click();
        URL.revokeObjectURL(url);
    });
}