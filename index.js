const API_BASE = 'https://folkloreproject.onrender.com';

export async function loadTales(table) {
  try {
    const response = await fetch(`${API_BASE}/tales`);
    if (!response.ok) throw new Error('Failed to fetch tales');
    const talesData = await response.json();

    table.clear();
    talesData.forEach((tale, index) => {
      table.row.add([
        index + 1,
        `<input type="checkbox"
            class="row-check"
            data-taleid="${tale.tale_id}"
            data-title="${tale.title}"
            data-culture="${tale.culture_group || ''}"
            data-collector="${tale.collector || ''}"
            data-year="${tale.year_collected || ''}"
            data-source="${tale.source_title || ''}"
            data-link="${tale.source_link || ''}"
            data-notes="${tale.notes || ''}"
            data-lat="${tale.lat || ''}"
            data-lon="${tale.lon || ''}"
            data-location="${tale.location_name || ''}">
        `,
        `<a href="tale_detail.html?tale_id=${tale.tale_id}" target="_blank" rel="noopener noreferrer">${tale.title}</a>`,
        tale.culture_group || "(Not provided)",
        tale.collector || "(Not provided)",
        tale.year_collected || "(Not provided)",
        tale.source_title ? tale.source_title + (tale.source_page ? `, p. ${tale.source_page}` : '') : "(Not provided)",
        tale.source_link ? `<a href="${tale.source_link}" target="_blank" rel="noopener noreferrer nofollow">View Source</a>` : "(Not provided)",
        tale.notes || "(Not provided)"
      ]);
    });
    table.draw();

  } catch (err) {
    console.error(err);
    alert('Failed to load tales');
  }
}