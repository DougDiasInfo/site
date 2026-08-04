/**
 * Obtém os N vídeos mais recentes com base no valor numérico do 'id'
 * @param {string} jsonUrl - Caminho para o arquivo videos.json
 * @param {number} limit - Quantidade de itens a retornar (padrão: 3)
 */
async function fetchLatestVideos(jsonUrl = 'dados/videos.json', limit = 3) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
        
        const videos = await response.json();

        // 1. Ordena decrescente pelo campo 'id' (do maior ID para o menor)
        // 2. Extrai os primeiros 'limit' elementos do array ordenado
        const latestVideos = videos
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, limit);

        return latestVideos;
    } catch (error) {
        console.error("Falha ao obter os vídeos recentes:", error);
        return [];
    }
}

// Exemplo de uso e renderização dinâmica na Home
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('latestVideosContainer');
    const recentVideos = await fetchLatestVideos('data/videos.json', 3);

    if (recentVideos.length === 0) {
        container.innerHTML = '<p class="error-msg">Nenhum vídeo em destaque no momento.</p>';
        return;
    }

    container.innerHTML = recentVideos.map(video => `
        <div class="video-card" data-id="${video.id}">
            <div class="video-thumb-wrapper">
                <img src="${video.thumb}" alt="${video.title}" loading="lazy">
                <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
            </div>
            <div class="video-info">
                <span class="video-category">${video.category || 'Tutorial'}</span>
                <h3>${video.title}</h3>
                <a href="${video.url}" class="btn-watch-glow">
                    <span>Assistir Agora</span>
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            </div>
        </div>
    `).join('');
});
