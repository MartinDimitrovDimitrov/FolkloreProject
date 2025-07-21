const API_BASE = 'https://folkloreproject.onrender.com';

async function loadTales() {
  try {
    const response = await fetch(`${API_BASE}/tales`);
    if (!response.ok) throw new Error('Failed to fetch tales');
    const talesData = await response.json();

    const tbody = document.querySelector('#tales-table tbody');
    tbody.innerHTML = '';

    talesData.forEach((tale, index) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <input type="checkbox"
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
        </td>
        <td><a href="/tale/${tale.tale_id}" target="_blank" rel="noopener noreferrer">${tale.title}</a></td>
        <td>${tale.culture_group || "(Not provided)"}</td>
        <td>${tale.collector || "(Not provided)"}</td>
        <td>${tale.year_collected || "(Not provided)"}</td>
        <td>${tale.source_title ? tale.source_title + (tale.source_page ? `, p. ${tale.source_page}` : '') : "(Not provided)"}</td>
        <td>${tale.source_link ? `<a href="${tale.source_link}" target="_blank" rel="noopener noreferrer nofollow">View Source</a>` : "(Not provided)"}</td>
        <td>${tale.notes || "(Not provided)"}</td>
      `;

      tbody.appendChild(tr);
    });

    // If your other scripts rely on DataTables or anything else, they can initialize here or separately.

  } catch (err) {
    console.error(err);
    alert('Failed to load tales');
  }
}

document.addEventListener('DOMContentLoaded', loadTales);