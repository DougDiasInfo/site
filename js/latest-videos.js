/**
 * Motor de Renderização de Vídeos em Destaque por ID Decrescente
 */
async function fetchLatestVideos(limit = 4) {
    // Array com possíveis caminhos para tolerar diferenças de pastas no servidor
    const possiblePaths = ['dados/videos.json', 'data/videos.json', 'config/videos.json'];
    let videos = null;

    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                videos = await response.json();
                break; // Encontrou o arquivo, encerra a busca
            }
        } catch (e) {
            // Tenta o próximo caminho
        }
    }

    if (!videos) {
        throw new Error("Não foi possível localizar o arquivo videos.json nos diretórios padrões.");
    }

    // Ordena decrescente pelo id numérico e fatia os últimos N
    return videos
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, limit);
}

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('latestVideosContainer');
    
    if (!container) {
        console.warn("Elemento #latestVideosContainer não encontrado no DOM.");
        return;
    }

    try {
        const recentVideos = await fetchLatestVideos(3);

        if (!recentVideos || recentVideos.length === 0) {
            container.innerHTML = '<p class="error-msg">Nenhum vídeo cadastrado no momento.</p>';
            return;
        }

        container.innerHTML = recentVideos.map(video => `
            <div class="video-card" data-id="${video.id}">
                <div class="video-thumb-wrapper">
                    <img src="${video.thumb}" alt="${video.titulo}" loading="lazy">
                    <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
                </div>
                <div class="video-info">
                    <span class="video-category">${video.tipo || 'Tutorial'}</span>
                    <h3>${video.titulo}</h3>
                    <a href="${video.url || 'videos.html'}" class="btn-watch-glow">
                        <span>Assistir Agora</span>
                        <i class="fa-solid fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error("Erro no carregamento dos vídeos:", error);
        container.innerHTML = '<p class="error-msg">Erro ao carregar os vídeos em destaque.</p>';
    }
});
