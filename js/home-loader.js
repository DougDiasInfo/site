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
