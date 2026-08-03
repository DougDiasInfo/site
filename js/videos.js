document.addEventListener('DOMContentLoaded', () => {
  const videoGrid = document.getElementById('videoGrid');
  const searchInput = document.getElementById('searchInput');
  const typeFilter = document.getElementById('typeFilter');

  let videosData = [];

  // 1. Carrega os dados do arquivo JSON
  fetch('dados/videos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      videosData = data;
      populateTypeFilter(data);
      renderVideos(data);
    })
    .catch(error => {
      console.error('Erro ao carregar o catálogo de vídeos:', error);
      videoGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">
        Falha ao carregar a biblioteca de vídeos.
      </p>`;
    });

  // 2. Preenche o Dropdown de Tipos dinamicamente
  function populateTypeFilter(videos) {
    const tipos = [...new Set(videos.map(v => v.tipo))];
    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      typeFilter.appendChild(option);
    });
  }

  // 3. Renderiza os Cards de Vídeo
  function renderVideos(videos) {
    videoGrid.innerHTML = '';

    if (videos.length === 0) {
      videoGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Nenhum vídeo encontrado.</p>';
      return;
    }

    videos.forEach(video => {
      const card = document.createElement('article');
      card.className = 'video-card';

      const tagsHTML = video.palavrasChave
        .map(tag => `<span class="tag">#${tag.trim()}</span>`)
        .join('');

      card.innerHTML = `
        <div class="thumb-wrapper">
          <img src="${video.thumb}" alt="${video.titulo}" loading="lazy">
        </div>
        <div class="video-info">
          <span class="badge-tipo">${video.tipo}</span>
          <h3>${video.titulo}</h3>
          <div class="tags-container">${tagsHTML}</div>
          <a href="${video.link}" target="_blank" class="btn-watch">Assistir Vídeo</a>
        </div>
      `;

      videoGrid.appendChild(card);
    });
  }

  // 4. Lógica de Busca e Filtro Unificados
  function filterVideos() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedType = typeFilter.value;

    const filtered = videosData.filter(video => {
      const matchesType = selectedType === '' || video.tipo === selectedType;

      const titleMatch = video.titulo.toLowerCase().includes(searchTerm);
      const keyMatch = video.palavrasChave.some(kw => 
        kw.toLowerCase().includes(searchTerm)
      );

      return matchesType && (titleMatch || keyMatch);
    });

    renderVideos(filtered);
  }

  // Listeners de Eventos
  searchInput.addEventListener('input', filterVideos);
  typeFilter.addEventListener('change', filterVideos);
});
