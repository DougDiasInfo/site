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
    
    const cleanUrl = url.split('?')[0];
    
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
// CARREGAR VÍDEOS
// ============================================
function carregarVideos() {
    const caminhoArquivo = 'dados/videos.txt';
    
    console.log(`📁 Tentando carregar: ${caminhoArquivo}`);
    console.log(`📍 URL atual: ${window.location.href}`);
    
    fetch(caminhoArquivo)
        .then(res => {
            console.log(`📊 Status: ${res.status} ${res.statusText}`);
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.text();
        })
        .then(texto => {
            console.log('✅ Arquivo carregado com sucesso!');
            console.log('📄 Conteúdo:', texto);
            processarTextoVideos(texto);
            removerAviso();
        })
        .catch(error => {
            console.error('❌ Erro:', error.message);
            console.log('📹 Usando vídeos de exemplo');
            listaVideos = VIDEOS_EXEMPLO;
            mostrarVideos(listaVideos);
            atualizarContador(listaVideos.length);
            mostrarAviso();
        });
}

// ============================================
// PROCESSAR TEXTO DO ARQUIVO
// ============================================
function processarTextoVideos(texto) {
    listaVideos = [];
    
    let linhas = texto.split("\n");
    console.log(`📄 ${linhas.length} linhas encontradas`);
    
    linhas.forEach((linha, index) => {
        linha = linha.replace(/\r/g, '').trim();
        
        if (linha === "") {
            console.log(`⏭️ Linha ${index + 1}: vazia`);
            return;
        }
        
        let dados = linha.split("|");
        if (dados.length < 3) {
            console.warn(`⚠️ Linha ${index + 1} inválida:`, linha);
            return;
        }
        
        listaVideos.push({
            titulo: dados[0].trim(),
            categoria: dados[1].trim(),
            link: dados[2].trim()
        });
    });
    
    console.log(`🎬 ${listaVideos.length} vídeos carregados`);
    
    if (listaVideos.length === 0) {
        listaVideos = VIDEOS_EXEMPLO;
    }
    
    mostrarVideos(listaVideos);
    atualizarContador(listaVideos.length);
}

// ============================================
// MOSTRAR AVISO
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
            Arquivo <strong style="color: #ff6b1a;">videos.txt</strong> não encontrado.
            Mostrando vídeos de exemplo.
        </div>
        <div style="color: #666; font-size: 12px; margin-top: 5px;">
            Coloque o arquivo em: <strong style="color: #888;">dados/videos.txt</strong>
        </div>
        <div style="color: #666; font-size: 11px; margin-top: 10px; background: #111; padding: 8px; border-radius: 6px;">
            📍 Caminho atual: <span style="color: #888;">${window.location.pathname}</span>
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
    
    videos.forEach(video => {
        let id = converterYoutube(video.link);
        if (!id) return;
        
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
}

// ============================================
// INICIALIZAR
// ============================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Inicializando DM Informática Vídeos");
    carregarVideos();
    configurarBusca();
});

// Expor funções globalmente
window.filtrar = filtrar;
window.abrirVideo = abrirVideo;
