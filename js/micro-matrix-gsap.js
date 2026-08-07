/**
 * Controller GSAP para a Matriz Espacial de Micro-Cards
 * Orquestra rotações 3D, efeito Parallax suave e atualização de status
 */
class MicroMatrixController {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') return;

        const cards = this.container.querySelectorAll('.micro-card');

        cards.forEach(card => {
            const flipper = card.querySelector('.micro-card-flipper');
            const icon = card.querySelector('.micro-icon');
            const backInfo = card.querySelector('.micro-back-info');

            // Efeito Micro-Parallax no movimento do mouse
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);

                gsap.to(card, {
                    rotationY: x * 0.08,
                    rotationX: -y * 0.08,
                    duration: 0.2,
                    ease: "power1.out"
                });
            });

            // Reseta posição ao sair
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            // Animação de entrada do conteúdo do verso no Hover
            card.addEventListener('mouseenter', () => {
                gsap.fromTo(backInfo.children, 
                    { opacity: 0, y: 8 },
                    { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power1.out", delay: 0.15 }
                );
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MicroMatrixController('.micro-matrix-grid');
});