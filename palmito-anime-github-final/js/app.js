function getAnimeById(id) {
  return ANIMES.find((anime) => anime.id === id) || ANIMES[0];
}

function renderGenres(anime) {
  return anime.genres.map((genre) => `<span class="genre">${genre}</span>`).join('');
}

function animeCard(anime) {
  return `
    <article class="anime-card" data-title="${anime.title.toLowerCase()}" data-genres="${anime.genres.join(' ').toLowerCase()}" data-year="${anime.year}">
      <a href="detalhes.html?id=${anime.id}">
        <div class="anime-cover">
          <img src="${anime.image}" alt="${anime.title}">
        </div>
        <div class="anime-content">
          <h2>${anime.title}</h2>
          <div class="meta">
            <span>${anime.year}</span>
            <span>★ ${anime.rating}</span>
          </div>
          <div class="genres">${renderGenres(anime)}</div>
          <span class="card-btn">Ver detalhes</span>
        </div>
      </a>
    </article>
  `;
}

function renderCatalog() {
  const grid = document.getElementById('animeGrid');
  if (!grid) return;

  grid.innerHTML = ANIMES.map(animeCard).join('');

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const emptyState = document.getElementById('emptyState');

  function filterCards() {
    const term = input.value.trim().toLowerCase();
    let visible = 0;

    document.querySelectorAll('.anime-card').forEach((card) => {
      const matches =
        card.dataset.title.includes(term) ||
        card.dataset.genres.includes(term) ||
        card.dataset.year.includes(term);

      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    filterCards();
  });

  input?.addEventListener('input', filterCards);
}

function renderDetails() {
  const details = document.getElementById('animeDetails');
  if (!details) return;

  const params = new URLSearchParams(window.location.search);
  const anime = getAnimeById(params.get('id'));

  details.innerHTML = `
    <div class="details-cover">
      <img src="${anime.image}" alt="${anime.title}">
    </div>

    <div class="details-info">
      <p class="eyebrow">Detalhes do anime</p>
      <h1>${anime.title}</h1>
      <div class="genres">${renderGenres(anime)}</div>

      <div class="rating-boxes">
        <div class="rating-box">
          <span>Nota</span>
          <strong>${anime.rating}</strong>
        </div>
        <div class="rating-box">
          <span>Ano</span>
          <strong>${anime.year}</strong>
        </div>
      </div>

      <p class="description">${anime.description}</p>

      <div class="episode-list">
        <a href="assistir.html?id=${anime.id}&ep=1">Episódio 1</a>
        <a href="assistir.html?id=${anime.id}&ep=2">Episódio 2</a>
        <a href="assistir.html?id=${anime.id}&ep=3">Episódio 3</a>
      </div>
    </div>
  `;

  const index = ANIMES.findIndex((item) => item.id === anime.id);
  const previous = ANIMES[(index - 1 + ANIMES.length) % ANIMES.length];
  const next = ANIMES[(index + 1) % ANIMES.length];

  const prevLink = document.getElementById('prevAnime');
  const nextLink = document.getElementById('nextAnime');

  if (prevLink) {
    prevLink.href = `detalhes.html?id=${previous.id}`;
    prevLink.textContent = `← ${previous.title}`;
  }

  if (nextLink) {
    nextLink.href = `detalhes.html?id=${next.id}`;
    nextLink.textContent = `${next.title} →`;
  }
}

function renderWatchPage() {
  const title = document.getElementById('watchTitle');
  const description = document.getElementById('watchDescription');
  const video = document.getElementById('videoPlayer');
  const source = document.getElementById('videoSource');
  const back = document.getElementById('backToAnime');

  if (!title || !video || !source) return;

  const params = new URLSearchParams(window.location.search);
  const anime = getAnimeById(params.get('id'));
  const episode = params.get('ep') || '1';

  title.textContent = `${anime.title} - Episódio ${episode}`;
  description.textContent = anime.description;

  video.poster = anime.image;
  source.src = anime.video;
  video.load();

  if (back) {
    back.href = `detalhes.html?id=${anime.id}`;
    back.textContent = `← Voltar para ${anime.title}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();
  renderDetails();
  renderWatchPage();
});
