// js/home-loader.js - Orquestrador Central da Home
class HomeEngine {
    constructor() {
        this.init();
    }

    async init() {
        // Carrega vídeos e artigos de forma isolada e concorrente
        await Promise.allSettled([
            this.loadLatestVideos(),
            this.loadArticles()
        ]);
    }

    async loadLatestVideos() {
        const container = document.getElementById('latestVideosContainer');
        if (!container) return;

        try {
            const res = await fetch('dados/videos.json');
            if (!res.ok) throw new Error('Falha HTTP');
            const data = await res.json();
            
            const topVideos = data.sort((a, b) => Number(b.id) - Number(a.id)).slice(0, 3);
            
            container.innerHTML = topVideos.map(v => `
                <div class="video-card">
                    <div class="video-thumb-wrapper">
                        <img src="${v.thumb}" alt="${v.title}">
                    </div>
                    <div class="video-info">
                        <span class="video-category">${v.category || 'Sistema'}</span>
                        <h3>${v.title}</h3>
                        <a href="${v.url}" class="btn-watch-glow">Assistir Agora <i class="fa-solid fa-chevron-right"></i></a>
                    </div>
                </div>
            `).join('');
        } catch (err) {
            container.innerHTML = '<p class="error-msg">Não foi possível carregar as novidades em vídeo.</p>';
        }
    }

    async loadArticles() {
        const container = document.getElementById('articlesContainer');
        if (!container) return;

        try {
            const res = await fetch('config/home-content.json');
            if (!res.ok) return;
            const data = await res.json();
            
            if (data.articles) {
                container.innerHTML = data.articles.map(a => `
                    <article class="article-card">
                        <div class="article-content">
                            <h3>${a.title}</h3>
                            <p>${a.summary}</p>
                        </div>
                    </article>
                `).join('');
            }
        } catch (e) {
            // Falha silenciosa para não quebrar a página
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new HomeEngine());
