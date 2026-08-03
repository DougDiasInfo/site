document.addEventListener('DOMContentLoaded', () => {
  // Mapeamento correto dos IDs do seu HTML
  const buscaInput = document.getElementById('buscaVideo');
  const typeFilter = document.getElementById('typeFilter');
  const videoGrid = document.getElementById('videoGrid');
  const contadorVideos = document.getElementById('contadorVideos');

  let videosData = [];

  // Helper para remover acentos e converter para caixa baixa
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  // 1. Carregamento do catálogo JSON
  fetch('dados/videos.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      videosData = data;
      populateTypeFilter(videosData);
      applyFilters(); // Renderiza inicialmente
    })
    .catch(error => {
      console.error('Erro ao carregar os vídeos:', error);
      if (videoGrid) {
        videoGrid.innerHTML = `
          <div class="sem-resultados">
            ⚠️ Erro ao carregar a biblioteca de vídeos. Verifique se o arquivo dados/videos.json existe.
          </div>`;
      }
      if (contadorVideos) contadorVideos.textContent = 'Erro de carregamento.';
    });

  // 2. Preenche o Dropdown de Categorias
  function populateTypeFilter(videos) {
    if (!typeFilter) return;

    // Extrai tipos/categorias únicos suportando retrocompatibilidade de nomenclatura
    const tipos = [...new Set(videos.map(v => v.tipo || v.categoria).filter(Boolean))];
    
    typeFilter.innerHTML = '<option value="">Todas as Categorias</option>';
    
    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      typeFilter.appendChild(option);
    });
  }

  // 3. Aplicação unificada de Filtro e Busca
  function applyFilters() {
    const searchTerm = normalizeText(buscaInput ? buscaInput.value : '');
    const selectedType = typeFilter ? typeFilter.value : '';

    const filteredVideos = videosData.filter(video => {
      // Suporte a 'tipo' ou 'categoria'
      const videoTipo = video.tipo || video.categoria || '';
      const matchesType = selectedType === '' || videoTipo === selectedType;

      // Normaliza Título e Palavras-Chave (tags)
      const titleNormalized = normalizeText(video.titulo);
      
      const tagsArray = Array.isArray(video.palavrasChave) 
        ? video.palavrasChave 
        : (Array.isArray(video.tags) ? video.tags : []);

      const matchesKeyword = tagsArray.some(tag => 
        normalizeText(tag).includes(searchTerm)
      );

      const matchesTitle = titleNormalized.includes(searchTerm);

      return matchesType && (matchesTitle || matchesKeyword);
    });

    renderVideos(filteredVideos);
    updateCounter(filteredVideos.length, videosData.length);
  }

  // 4. Renderização dos Cards no Grid
  function renderVideos(videos) {
    if (!videoGrid) return;
    videoGrid.innerHTML = '';

    if (videos.length === 0) {
      videoGrid.innerHTML = `
        <div class="sem-resultados">
          Nenhum vídeo encontrado para os critérios selecionados.
        </div>`;
      return;
    }

    videos.forEach(video => {
      const card = document.createElement('article');
      card.className = 'video-card';

      const tipoText = video.tipo || video.categoria || 'Geral';
      const tagsArray = Array.isArray(video.palavrasChave) 
        ? video.palavrasChave 
        : (Array.isArray(video.tags) ? video.tags : []);

      const tagsHTML = tagsArray
        .map(tag => `<span class="tag">#${tag.trim()}</span>`)
        .join('');

      card.innerHTML = `
        <img src="${video.thumb || 'img/default-thumb.jpg'}" alt="${video.titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x225/111/ff6b1a?text=Video+HealthTech'">
        <div class="video-info">
          <span class="categoria-badge">${tipoText}</span>
          <h3>${video.titulo}</h3>
          <div class="tags-container">${tagsHTML}</div>
          <a href="${video.link}" target="_blank" rel="noopener noreferrer" class="btn-watch">Assistir Vídeo</a>
        </div>
      `;

      videoGrid.appendChild(card);
    });
  }

  // 5. Atualização do Contador
  function updateCounter(filteredCount, totalCount) {
    if (!contadorVideos) return;
    if (filteredCount === totalCount) {
      contadorVideos.textContent = `Exibindo todos os ${totalCount} vídeos`;
    } else {
      contadorVideos.textContent = `Exibindo ${filteredCount} de ${totalCount} vídeos localizados`;
    }
  }

  // Registo de Listeners Reativos
  if (buscaInput) {
    buscaInput.addEventListener('input', applyFilters);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', applyFilters);
  }
});
