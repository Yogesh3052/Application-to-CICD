const cards = [...document.querySelectorAll('.destination-card')];
const filters = [...document.querySelectorAll('.filter')];
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const emptyState = document.querySelector('#emptyState');
const toast = document.querySelector('#toast');
const saved = new Set();
let activeFilter = 'all';

lucide.createIcons();

function updateCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matchesFilter = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesSearch = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    const show = matchesFilter && matchesSearch;
    card.style.display = show ? '' : 'none';
    if (show) visible += 1;
  });
  resultCount.textContent = `${String(visible).padStart(2, '0')} places`;
  emptyState.style.display = visible ? 'none' : 'block';
}

function showToast(message) {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function renderSaved() {
  const list = document.querySelector('#savedList');
  if (!saved.size) {
    list.innerHTML = '<p class="saved-empty">Your collection is waiting for its first place.</p>';
    return;
  }
  list.innerHTML = [...saved].map((name) => `<div class="saved-item"><div><strong>${name}</strong><small>Saved for later</small></div><button data-remove="${name}">Remove</button></div>`).join('');
  list.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      const name = button.dataset.remove;
      saved.delete(name);
      const saveButton = document.querySelector(`[data-name="${name}"]`);
      saveButton.classList.remove('saved');
      saveButton.setAttribute('aria-label', `Save ${name}`);
      updateSavedCount();
      renderSaved();
    });
  });
}

function updateSavedCount() {
  document.querySelector('.saved-count').textContent = saved.size;
}

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    filter.classList.add('active');
    activeFilter = filter.dataset.filter;
    updateCards();
  });
});

document.querySelectorAll('[data-query]').forEach((button) => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.query;
    activeFilter = 'all';
    filters.forEach((item) => item.classList.toggle('active', item.dataset.filter === 'all'));
    updateCards();
    document.querySelector('#journal').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

searchInput.addEventListener('input', updateCards);
document.querySelector('#searchButton').addEventListener('click', () => {
  updateCards();
  document.querySelector('#journal').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('#searchButton').click();
});

document.querySelectorAll('.save-button').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.name;
    if (saved.has(name)) {
      saved.delete(name);
      button.classList.remove('saved');
      button.setAttribute('aria-label', `Save ${name}`);
      showToast('Removed from your collection');
    } else {
      saved.add(name);
      button.classList.add('saved');
      button.setAttribute('aria-label', `Remove ${name} from saved trips`);
      showToast(`${name} saved to your collection`);
    }
    updateSavedCount();
  });
});

document.querySelector('#savedButton').addEventListener('click', () => {
  renderSaved();
  document.querySelector('#modalBackdrop').classList.add('open');
});
document.querySelector('#modalClose').addEventListener('click', () => document.querySelector('#modalBackdrop').classList.remove('open'));
document.querySelector('#modalBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'modalBackdrop') event.currentTarget.classList.remove('open');
});

document.querySelector('#nextButton').addEventListener('click', () => document.querySelector('#destinationGrid').scrollIntoView({ behavior: 'smooth', block: 'center' }));
document.querySelector('#prevButton').addEventListener('click', () => document.querySelector('#discover').scrollIntoView({ behavior: 'smooth' }));
