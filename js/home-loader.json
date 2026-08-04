// js/home-loader.js - Injetor Dinâmico de Conteúdo da Home
document.addEventListener('DOMContentLoaded', async () => {
    const videosContainer = document.getElementById('latestVideosContainer');
    const articlesContainer = document.getElementById('articlesContainer');

    try {
        const response = await fetch('config/home-content.json');
        if (!response.ok) throw new Error('Falha ao carregar configurações.');
        
        const data = await response.json();

        // 1. Renderiza Vídeos em Destaque
        if (data.latest_videos && videosContainer) {
            videosContainer.innerHTML = data.latest_videos.map(v => `
                <div class="video-card">
                    <div class="video-thumb-wrapper">
                        <img src="${v.thumb}" alt="${v.title}" loading="lazy">
                        <div class="play-overlay"><i class="fa-solid fa-circle-play"></i></div>
                    </div>
                    <div class="video-info">
                        <span class="video-category">${v.category}</span>
                        <h3>${v.title}</h3>
                        <a href="${v.url}" class="btn-watch"><i class="fa-solid fa-play"></i> Assistir Agora</a>
                    </div>
                </div>
            `).join('');
        }

        // 2. Renderiza Artigos
        if (data.articles && articlesContainer) {
            articlesContainer.innerHTML = data.articles.map(a => `
                <article class="article-card">
                    <div class="article-img-wrapper">
                        <img src="${a.image}" alt="${a.title}" loading="lazy">
                        <span class="article-tag">${a.category}</span>
                    </div>
                    <div class="article-content">
                        <span class="article-date">${a.date}</span>
                        <h3>${a.title}</h3>
                        <p>${a.summary}</p>
                        <a href="${a.link}" class="btn-read">Ler Artigo Completo <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </article>
            `).join('');
        }

    } catch (error) {
        console.error('Erro ao injetar conteúdo dinâmico:', error);
    }
});
