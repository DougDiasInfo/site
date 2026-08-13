document.addEventListener('DOMContentLoaded', () => {
  const buscaInput = document.getElementById('buscaVideo');
  const typeFilter = document.getElementById('typeFilter');
  const videoGrid = document.getElementById('videoGrid');
  const contadorVideos = document.getElementById('contadorVideos');

  // Elementos do Modal de Vídeo
  const videoModal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalBadge = document.getElementById('modalVideoBadge');
  const closeModalBtn = document.getElementById('closeModalBtn');

  let videosData = [];

  // Helper para converter URLs do YouTube/Vimeo para links de Embed Seguros
  function getEmbedUrl(url) {
    if (!url) return '';

    // Trata links do YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
    }

    // Trata links do Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }

    // Retorna URL direta caso seja um link MP4 ou iFrame próprio
    return url;
  }

  function normalizeText(text) {
    if (!text) return '';
    return text.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // Carregamento do catálogo JSON
  fetch('dados/videos.json')
    .then(response => {
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      videosData = data;
      populateTypeFilter(videosData);
      applyFilters();
    })
    .catch(error => {
      console.error('Erro ao carregar os vídeos:', error);
      if (videoGrid) {
        videoGrid.innerHTML = `<div class="sem-resultados">⚠️ Erro ao carregar a biblioteca de vídeos.</div>`;
      }
      if (contadorVideos) contadorVideos.textContent = 'Erro de carregamento.';
    });

  function populateTypeFilter(videos) {
    if (!typeFilter) return;
    const tipos = [...new Set(videos.map(v => v.tipo || v.categoria).filter(Boolean))];
    typeFilter.innerHTML = '<option value="">Todas as Categorias</option>';
    tipos.forEach(tipo => {
      const option = document.createElement('option');
      option.value = tipo;
      option.textContent = tipo;
      typeFilter.appendChild(option);
    });
  }

  function applyFilters() {
    const searchTerm = normalizeText(buscaInput ? buscaInput.value : '');
    const selectedType = typeFilter ? typeFilter.value : '';

    const filteredVideos = videosData.filter(video => {
      const videoTipo = video.tipo || video.categoria || '';
      const matchesType = selectedType === '' || videoTipo === selectedType;
      const titleNormalized = normalizeText(video.titulo);
      
      const tagsArray = Array.isArray(video.palavrasChave) 
        ? video.palavrasChave 
        : (Array.isArray(video.tags) ? video.tags : []);

      const matchesKeyword = tagsArray.some(tag => normalizeText(tag).includes(searchTerm));
      const matchesTitle = titleNormalized.includes(searchTerm);

      return matchesType && (matchesTitle || matchesKeyword);
    });

    renderVideos(filteredVideos);
    updateCounter(filteredVideos.length, videosData.length);
  }

  function renderVideos(videos) {
    if (!videoGrid) return;
    videoGrid.innerHTML = '';

    if (videos.length === 0) {
      videoGrid.innerHTML = `<div class="sem-resultados">Nenhum vídeo encontrado.</div>`;
      return;
    }

    videos.forEach((video, index) => {
      const card = document.createElement('article');
      card.className = 'video-card';

      const tipoText = video.tipo || video.categoria || 'Geral';
      const tagsArray = Array.isArray(video.palavrasChave) 
        ? video.palavrasChave 
        : (Array.isArray(video.tags) ? video.tags : []);

      const tagsHTML = tagsArray.map(tag => `<span class="tag">#${tag.trim()}</span>`).join('');

      card.innerHTML = `
        <div class="video-thumb-wrapper">
          <img src="${video.thumb || 'img/default-thumb.jpg'}" alt="${video.titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x225/111/ff6b1a?text=Video+HealthTech'">
          <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
        </div>
        <div class="video-info">
          <span class="video-category">${tipoText}</span>
          <h3>${video.titulo}</h3>
          <div class="tags-container">${tagsHTML}</div>
          <button class="btn-watch js-open-video" data-index="${index}">
            <i class="fa-solid fa-play"></i> Assistir Agora
          </button>
        </div>
      `;

      videoGrid.appendChild(card);
    });

    // Registra eventos de clique nos botões e capas dos cards
    document.querySelectorAll('.js-open-video, .video-thumb-wrapper').forEach(element => {
      element.addEventListener('click', (e) => {
        const card = e.currentTarget.closest('.video-card');
        const btn = card.querySelector('.js-open-video');
        const videoIndex = btn.getAttribute('data-index');
        openVideoModal(videos[videoIndex]);
      });
    });
  }

  // Lógica de Abertura e Fechamento do Modal
  function openVideoModal(video) {
    if (!videoModal || !modalIframe) return;

    const embedUrl = getEmbedUrl(video.link);
    modalIframe.src = embedUrl;
    
    if (modalTitle) modalTitle.textContent = video.titulo;
    if (modalBadge) modalBadge.textContent = video.tipo || video.categoria || 'Geral';

    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
  }

  function closeVideoModal() {
    if (!videoModal || !modalIframe) return;

    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    modalIframe.src = ''; // Interrompe o áudio/vídeo imediatamente
    document.body.style.overflow = ''; // Restaura o scroll
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeVideoModal);

  // Fecha o modal ao clicar fora da caixa do vídeo
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // Fecha ao pressionar a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  function updateCounter(filteredCount, totalCount) {
    if (!contadorVideos) return;
    contadorVideos.textContent = filteredCount === totalCount 
      ? `Exibindo todos os ${totalCount} vídeos` 
      : `Exibindo ${filteredCount} de ${totalCount} vídeos localizados`;
  }

  if (buscaInput) buscaInput.addEventListener('input', applyFilters);
  if (typeFilter) typeFilter.addEventListener('change', applyFilters);
});
