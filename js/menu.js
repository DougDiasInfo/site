/**
 * Controladora da barra de navegação interativa (Magic Menu)
 * Gerencia a detecção da rota ativa e feedback tátil em dispositivos móveis.
 */
document.addEventListener('DOMContentLoaded', () => {
    const listItems = document.querySelectorAll('.navigation .list');

    // Sync automático de rota baseado na URL da página atual
    function syncActiveRouteWithURL() {
        const currentPath = window.location.pathname.split("/").pop() || 'index.html';

        listItems.forEach(item => {
            item.classList.remove('active');
            const link = item.querySelector('a');
            if (link) {
                const href = link.getAttribute('href');
                if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                    item.classList.add('active');
                }
            }
        });
    }

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