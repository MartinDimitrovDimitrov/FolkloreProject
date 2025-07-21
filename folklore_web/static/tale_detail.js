const API_BASE = 'https://folkloreproject.onrender.com';

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function fillTale(tale) {
  document.title = tale.title || 'Tale Detail';
  document.getElementById('tale-title').textContent = tale.title || 'Untitled Tale';

  document.getElementById('culture-group').textContent = tale.culture_group || '(Not provided)';
  document.getElementById('collector').textContent = tale.collector || '(Not provided)';
  document.getElementById('year-collected').textContent = tale.year_collected || '(Not provided)';

  const sourceText = tale.source_title
    ? `${tale.source_title}${tale.source_page ? `, p. ${tale.source_page}` : ''}`
    : '(Not provided)';
  document.getElementById('source').textContent = sourceText;

  const linkElem = document.getElementById('source-link');
  if (tale.source_link) {
    const a = document.createElement('a');
    a.href = tale.source_link;
    a.textContent = 'View Source';
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow';
    linkElem.appendChild(a);
  } else {
    linkElem.textContent = '(Not provided)';
  }

  document.getElementById('location').textContent =
    tale.location_name
      ? `${tale.location_name}${tale.region ? ', ' + tale.region : ''}`
      : '(Not provided)';

  document.getElementById('notes').textContent = tale.notes || '(Not provided)';
}

async function fetchTale() {
  const taleId = getQueryParam('tale_id');
  if (!taleId) {
    alert('No tale_id provided in URL');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/tales/${taleId}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const tale = await response.json();
    fillTale(tale);
  } catch (err) {
    console.error(err);
    alert('Failed to load tale');
  }
}

document.addEventListener('DOMContentLoaded', fetchTale);