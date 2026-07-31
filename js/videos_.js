// ============================================
// VARIÁVEL GLOBAL
// ============================================
let listaVideos = [];

// ============================================
// VÍDEOS DE EXEMPLO (FALLBACK)
// ============================================
const VIDEOS_EXEMPLO = [
    { titulo: "Introdução ao Sistema", categoria: "Treinamento", link: "https://youtu.be/dQw4w9WgXcQ" },
    { titulo: "Como configurar impressora", categoria: "Suporte", link: "https://youtu.be/abc123456" },
    { titulo: "Novidades do sistema", categoria: "Novidades", link: "https://www.youtube.com/watch?v=xyz987654" },
    { titulo: "Como instalar o sistema", categoria: "Treinamento", link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { titulo: "Configuração de impressora", categoria: "Suporte", link: "https://youtu.be/abc123456" },
    { titulo: "Atualização 2026", categoria: "Novidades", link: "https://www.youtube.com/watch?v=xyz987654" }
];

// ============================================
// CONVERTER URL DO YOUTUBE
// ============================================
function converterYoutube(url) {
    if (!url) return "";
    url = url.trim();
    
    // Remover parâmetros extras
    const cleanUrl = url.split('?')[0];
    
    // Padrões para diferentes formatos
    const patterns = [
        /youtube\.com\/watch\?v=([^&\n?#]+)/i,
        /youtu\.be\/([^&\n?#]+)/i,
        /youtube\.com\/embed\/([^&\n?#]+)/i,
        /youtube\.com\/v\/([^&\n?#]+)/i,
        /youtube\.com\/shorts\/([^&\n?#]+)/i
    ];
    
    for (let pattern of patterns) {
        const match = cleanUrl.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return "";
}

// ============================================
// CARREGAR VÍDEOS DO JSON
// ============================================
function carregarVideos() {
    const caminhoArquivo = 'dados/videos.json';
    
    console.log(`📁 Tentando carregar: ${caminhoArquivo}`);
    console.log(`📍 URL atual: ${window.location.href}`);
    
    // Verificar se está rodando localmente (file://)
    if (window.location.protocol === 'file:') {
        console.warn("⚠️ Modo local detectado (file://). Usando dados embutidos.");
        console.log("📹 Para usar o arquivo JSON, use um servidor local (Live Server, Python, etc.)");
        usarExemplos();
        mostrarAvisoLocal();
        return;
    }
    
    fetch(caminhoArquivo)
        .then(res => {
            console.log(`📊 Status: ${res.status} ${res.statusText}`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(dados => {
            console.log('✅ Arquivo JSON carregado com sucesso!');
            console.log(`📄 ${dados.length} vídeos encontrados`);
            processarDadosVideos(dados);
            removerAviso();
        })
        .catch(error => {
            console.error('❌ Erro ao carregar JSON:', error.message);
            console.log('📹 Usando vídeos de exemplo como fallback');
            usarExemplos();
            
            // Mostrar aviso apenas se não for GitHub Pages
            if (!window.location.hostname.includes('github.io')) {
                mostrarAviso();
            }
        });
}

// ============================================
// PROCESSAR DADOS DO JSON
// ============================================
function processarDadosVideos(dados) {
    if (!Array.isArray(dados) || dados.length === 0) {
        console.warn('⚠️ JSON inválido ou vazio. Usando vídeos de exemplo.');
        usarExemplos();
        return;
    }
    
    listaVideos = dados.map(item => ({
        titulo: item.titulo || item.title || 'Vídeo sem título',
        categoria: item.categoria || item.category || 'Geral',
        link: item.link || item.url || ''
    })).filter(video => video.link); // Remove vídeos sem link
    
    console.log(`🎬 ${listaVideos.length} vídeos carregados`);
    
    if (listaVideos.length === 0) {
        console.warn('⚠️ Nenhum vídeo válido encontrado. Usando vídeos de exemplo.');
        usarExemplos();
        return;
    }
    
    mostrarVideos(listaVideos);
    atualizarContador(listaVideos.length);
}

// ============================================
// USAR VÍDEOS DE EXEMPLO
// ============================================
function usarExemplos() {
    console.log('📹 Usando vídeos de exemplo');
    listaVideos = VIDEOS_EXEMPLO;
    mostrarVideos(listaVideos);
    atualizarContador(listaVideos.length);
}

// ============================================
// MOSTRAR AVISO (ARQUIVO NÃO ENCONTRADO)
// ============================================
function mostrarAviso() {
    const area = document.getElementById("listaVideos");
    if (!area) return;
    
    removerAviso();
    
    const aviso = document.createElement("div");
    aviso.id = "aviso-arquivo";
    aviso.style.cssText = `
        grid-column: 1 / -1;
        background: #1a0a00;
        border: 2px solid #ff6b1a;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
    `;
    aviso.innerHTML = `
        <div style="color: #ff6b1a; font-size: 20px; margin-bottom: 5px;">ℹ️</div>
        <div style="color: #fff; font-size: 14px;">
            Arquivo <strong style="color: #ff6b1a;">videos.json</strong> não encontrado.
            Mostrando vídeos de exemplo.
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">
            Coloque o arquivo em: <strong style="color: #888;">dados/videos.json</strong>
        </div>
        <div style="color: #666; font-size: 11px; margin-top: 10px; background: #111; padding: 8px; border-radius: 6px; word-break: break-all;">
            📍 Caminho atual: <span style="color: #888;">${window.location.pathname}</span>
        </div>
    `;
    
    area.prepend(aviso);
}

// ============================================
// MOSTRAR AVISO (MODO LOCAL)
// ============================================
function mostrarAvisoLocal() {
    const area = document.getElementById("listaVideos");
    if (!area) return;
    
    removerAviso();
    
    const aviso = document.createElement("div");
    aviso.id = "aviso-arquivo";
    aviso.style.cssText = `
        grid-column: 1 / -1;
        background: #0a1a2a;
        border: 2px solid #4a9eff;
        padding: 15px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
    `;
    aviso.innerHTML = `
        <div style="color: #4a9eff; font-size: 20px; margin-bottom: 5px;">🚀</div>
        <div style="color: #fff; font-size: 14px; font-weight: bold;">
            Modo Local Detectado
        </div>
        <div style="color: #999; font-size: 13px; margin-top: 8px; line-height: 1.6;">
            Para carregar o arquivo <strong style="color: #fff;">videos.json</strong>, use um servidor local:
        </div>
        <div style="color: #888; font-size: 12px; margin-top: 10px; background: #111; padding: 10px; border-radius: 6px; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
            📌 <strong style="color: #fff;">VS Code:</strong> Live Server<br>
            📌 <strong style="color: #fff;">Python:</strong> python -m http.server 8000<br>
            📌 <strong style="color: #fff;">Node:</strong> npx serve
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 10px;">
            Mostrando vídeos de exemplo enquanto isso...
        </div>
    `;
    
    area.prepend(aviso);
}

// ============================================
// REMOVER AVISO
// ============================================
function removerAviso() {
    const aviso = document.getElementById("aviso-arquivo");
    if (aviso) {
        aviso.remove();
    }
}

// ============================================
// MOSTRAR VÍDEOS
// ============================================
function mostrarVideos(videos) {
    let area = document.getElementById("listaVideos");
    if (!area) return;
    
    // Remover cards antigos
    const cards = area.querySelectorAll('.video-card');
    cards.forEach(card => card.remove());
    
    if (!videos || videos.length === 0) {
        const msg = document.createElement("div");
        msg.className = "sem-resultados";
        msg.textContent = "🔍 Nenhum vídeo encontrado";
        area.appendChild(msg);
        return;
    }
    
    const fragment = document.createDocumentFragment();
    let videosValidos = 0;
    
    videos.forEach(video => {
        let id = converterYoutube(video.link);
        if (!id) return;
        
        videosValidos++;
        
        let card = document.createElement("div");
        card.className = "video-card";
        
        card.innerHTML = `
            <img 
                src="https://img.youtube.com/vi/${id}/hqdefault.jpg"
                alt="${escapeHTML(video.titulo)}"
                loading="lazy"
                onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22180%22%3E%3Crect fill=%22%23333%22 width=%22320%22 height=%22180%22/%3E%3Ctext x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23666%22 font-family=%22Arial%22 font-size=%2220%22%3E%F0%9F%8E%AC%20Indispon%C3%ADvel%3C/text%3E%3C/svg%3E'"
            >
            <div class="video-info">
                <h3>${escapeHTML(video.titulo)}</h3>
                <span class="categoria-badge">${escapeHTML(video.categoria)}</span>
                <button onclick="abrirVideo('${escapeHTML(video.link)}')">
                    Assistir →
                </button>
            </div>
        `;
        
        fragment.appendChild(card);
    });
    
    area.appendChild(fragment);
    
    // Atualizar contador com vídeos válidos
    if (videosValidos > 0) {
        atualizarContador(videosValidos);
    }
}

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function escapeHTML(texto) {
    if (!texto) return "";
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function abrirVideo(link) {
    if (!link) return;
    window.open(link, "_blank");
}

function atualizarContador(total) {
    const contador = document.getElementById("contadorVideos");
    if (contador) {
        contador.textContent = `${total} vídeos disponíveis`;
    }
}

// ============================================
// FILTRAR POR CATEGORIA
// ============================================
function filtrar(categoria) {
    document.querySelectorAll('.categorias button').forEach(btn => {
        btn.classList.remove('ativo');
        if (btn.textContent.trim() === categoria) {
            btn.classList.add('ativo');
        }
    });
    
    if (categoria === "Todos") {
        mostrarVideos(listaVideos);
        return;
    }
    
    let resultado = listaVideos.filter(v => v.categoria === categoria);
    mostrarVideos(resultado);
}

// ============================================
// BUSCA COM DEBOUNCE
// ============================================
let timeoutBusca;

function configurarBusca() {
    const input = document.getElementById("buscaVideo");
    if (!input) return;
    
    input.addEventListener("input", function() {
        clearTimeout(timeoutBusca);
        
        timeoutBusca = setTimeout(() => {
            let texto = this.value.toLowerCase().trim();
            
            if (texto === "") {
                mostrarVideos(listaVideos);
                return;
            }
            
            let resultado = listaVideos.filter(v => 
                v.titulo.toLowerCase().includes(texto) ||
                v.categoria.toLowerCase().includes(texto)
            );
            
            mostrarVideos(resultado);
        }, 300);
    });
    
    // Suporte para tecla Enter
    input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            clearTimeout(timeoutBusca);
            let texto = this.value.toLowerCase().trim();
            
            if (texto === "") {
                mostrarVideos(listaVideos);
                return;
            }
            
            let resultado = listaVideos.filter(v => 
                v.titulo.toLowerCase().includes(texto) ||
                v.categoria.toLowerCase().includes(texto)
            );
            
            mostrarVideos(resultado);
        }
    });
}

// ============================================
// INICIALIZAR
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Inicializando DM Informática Vídeos");
    console.log(`🌐 Protocolo: ${window.location.protocol}`);
    console.log(`🌐 Hostname: ${window.location.hostname}`);
    carregarVideos();
    configurarBusca();
});

// Expor funções globalmente
window.filtrar = filtrar;
window.abrirVideo = abrirVideo;
window.usarExemplos = usarExemplos;
window.listaVideos = listaVideos;
