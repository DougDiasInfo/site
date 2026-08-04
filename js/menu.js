// js/menu.js - Autodetecção de rota e destaque do item ativo
document.addEventListener('DOMContentLoaded', () => {
    // Captura o nome da página atual na URL (ex: "videos.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Seleciona todos os links do menu (suporta tanto a doca flutuante quanto menus padrão)
    const navLinks = document.querySelectorAll('.dock-item, .navigation ul li a');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Remove estado ativo prévio
        link.classList.remove('active');
        if (link.parentElement.classList.contains('list')) {
            link.parentElement.classList.remove('active');
        }

        // Verifica equivalência da rota atual
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
            
            // Se estiver usando o menu antigo (.navigation ul li)
            if (link.parentElement.classList.contains('list')) {
                link.parentElement.classList.add('active');
            }
        }
    });
});

    // Aplicação do efeito Haptic Feedback no clique (dispositivos móveis/touch)
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            listItems.forEach(el => el.classList.remove('active'));
            this.classList.add('active');

            if ('vibrate' in navigator) {
                navigator.vibrate(15); // Pequeno pulso de vibração tátil
            }
        });
    });

    syncActiveRouteWithURL();
});
