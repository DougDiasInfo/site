/**
 * Engine de Carregamento da Home - Artigos & Inovações
 */
document.addEventListener('DOMContentLoaded', async () => {
    const articlesContainer = document.getElementById('articlesContainer');
    if (!articlesContainer) return;

    // Função de Fallback para gerar imagem SVG procedural caso a principal falhe
    window.handleImageError = function(img, category) {
        img.onerror = null; // Evita loop infinito
        // Gera um SVG dinâmico com gradiente dark/orange
        const svgFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23121212"/><circle cx="300" cy="200" r="120" fill="%23ff6b1a" opacity="0.2"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ff6b1a" font-family="sans-serif" font-size="20" font-weight="bold">${encodeURIComponent(category || 'HealthTech')}</text></svg>`;
        img.src = svgFallback;
    };

    async function loadHomeArticles() {
        const possiblePaths = ['config/home-content.json', 'dados/home-content.json', 'data/home-content.json'];
        let data = null;

        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    data = await response.json();
                    break;
                }
            } catch (e) {
                // Tenta o próximo caminho
            }
        }

        if (!data || !data.articles) {
            articlesContainer.innerHTML = '<p class="error-msg">Nenhum artigo disponível no momento.</p>';
            return;
        }

        // Renderização corrigida COM a tag de imagem e o fallback onerror
        articlesContainer.innerHTML = data.articles.map(article => `
            <article class="article-card">
                <div class="article-img-wrapper">
                    <img 
                        src="${article.image || article.thumb || ''}" 
                        alt="${article.title}" 
                        loading="lazy"
                        onerror="handleImageError(this, '${article.category || 'Artigo'}')"
                    >
                    <span class="article-tag">${article.category || 'Inovação'}</span>
                </div>
                <div class="article-content">
                    <span class="article-date">${article.date || ''}</span>
                    <h3>${article.title}</h3>
                    <p>${article.summary || ''}</p>
                    <a href="${article.link || '#'}" class="btn-read">
                        <span>Ler Artigo Completo</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }

    await loadHomeArticles();
});
