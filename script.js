(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // --- Intersection Observer para animações de revelação ---
    const initIntersectionObserver = () => {
      const revealElements = document.querySelectorAll('.reveal');
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
      } else {
        revealElements.forEach(el => el.classList.add('visible'));
      }
    };

    // --- Botão "Voltar ao Topo" ---
    const initBackToTopButton = () => {
      const backToTopButton = document.getElementById('back-to-top');
      if (!backToTopButton) return;
      
      window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.add('show');
        } else {
          backToTopButton.classList.remove('show');
        }
      });

      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    };
    
    // --- Lógica do Modal dos Projetos ---
    const initModal = () => {
      const modalContainer = document.getElementById('modal-container');
      const overlay = document.querySelector('.modal-overlay');
      const openModalButtons = document.querySelectorAll('[data-modal-target]');
      
      if (!modalContainer || !overlay || openModalButtons.length === 0) return;
      
      const modalData = {
        modal1: { title: 'Projeto A', content: 'Detalhes completos sobre o Projeto A, uma plataforma de e-commerce construída com foco na experiência do usuário e performance.' },
        modal2: { title: 'Projeto B', content: 'Análise do Projeto B, uma aplicação SaaS inovadora. O desafio foi criar uma interface intuitiva para um sistema complexo.' },
        modal3: { title: 'Projeto C', content: 'Case study do Projeto C, a landing page para um grande evento de tecnologia que resultou em um aumento de 300% nas inscrições.' }
      };

      const createModal = (id) => {
        if (!modalData[id]) return;
        const modalHTML = `
          <div class="modal" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${id}-title">
            <button class="modal-close" aria-label="Fechar modal">&times;</button>
            <h2 id="${id}-title">${modalData[id].title}</h2>
            <p>${modalData[id].content}</p>
            <a href="#" class="btn btn-secondary">Ver ao vivo</a>
          </div>
        `;
        modalContainer.innerHTML = modalHTML;
        return document.getElementById(id);
      };

      const openModal = (modal) => {
        if (modal == null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('modal-open');
      };

      const closeModal = () => {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal == null) return;
        activeModal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => { modalContainer.innerHTML = ''; }, 300);
      };

      openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
          const modalId = button.dataset.modalTarget;
          const modal = createModal(modalId);
          openModal(modal);
        });
      });

      overlay.addEventListener('click', closeModal);
      modalContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close')) {
          closeModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.querySelector('.modal.active')) {
          closeModal();
        }
      });
    };
    
    // --- Lógica do Acordeão (Sanfona) ---
    const initAccordion = () => {
      const detailsElements = document.querySelectorAll('.accordion-item');
      detailsElements.forEach((targetDetail) => {
        targetDetail.addEventListener('toggle', () => {
          if (targetDetail.open) {
            detailsElements.forEach((detail) => {
              if (detail !== targetDetail) {
                detail.open = false;
              }
            });
          }
        });
      });
    };

    // --- Lógica do Painel Deslizante Mobile ---
    const initSlideDownPanel = () => {
      if (window.innerWidth >= 1024) return;

      const panel = document.getElementById('slide-down-panel');
      const overlay = document.getElementById('panel-overlay');
      if (!panel || !overlay) return;
      let touchStartY = 0;

      const openPanel = () => {
        panel.classList.add('is-open');
        overlay.classList.add('is-open');
        document.body.classList.add('modal-open');
      };

      const closePanel = () => {
        panel.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.classList.remove('modal-open');
      };

      overlay.addEventListener('click', closePanel);
      panel.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
          closePanel();
        }
      });

      document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        const touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;

        if (touchStartY < 40 && window.scrollY === 0 && deltaY > 50) {
          if (!panel.classList.contains('is-open')) {
            openPanel();
          }
        }
      }, { passive: true });
    };

    // --- Lógica do Formulário de Contato Final (WhatsApp) ---
    const initWhatsappForm = () => {
      const form = document.getElementById('contact-form');
      if (!form) return;

      const nameInput = document.getElementById('form-name');
      const instaInput = document.getElementById('form-insta');
      const whatsappButton = document.getElementById('whatsapp-button');

      const updateWhatsappLink = () => {
        const myNumber = '5594992173050';
        const name = nameInput.value.trim();
        const insta = instaInput.value.trim();
        
        if (name === '') {
          whatsappButton.classList.add('disabled');
          whatsappButton.href = '#';
          return;
        }
        
        whatsappButton.classList.remove('disabled');
        
        let message = `Olá! Vi seu portfólio e quero apresentar meu projeto para fecharmos negócio. Meu nome é ${name}`;
        if (insta) {
          message += `, e meu Instagram é @${insta}.`;
        } else {
          message += `.`;
        }

        const encodedMessage = encodeURIComponent(message);
        whatsappButton.href = `https://wa.me/${myNumber}?text=${encodedMessage}`;
      };

      // Adiciona o "escutador" de clique no botão
      whatsappButton.addEventListener('click', (e) => {
        // Se o botão estiver desabilitado...
        if (whatsappButton.classList.contains('disabled')) {
          e.preventDefault(); // Impede que o link '#' seja seguido
          
          const nameFieldGroup = nameInput.parentElement;
          nameFieldGroup.classList.add('form-error'); // Adiciona a classe de erro
          
          // Remove a classe de erro após a animação para que ela possa ser reativada
          setTimeout(() => {
            nameFieldGroup.classList.remove('form-error');
          }, 400);
        }
      });

      updateWhatsappLink();
      form.addEventListener('input', updateWhatsappLink);
    };
    
    // --- Injeção do Schema JSON-LD para SEO ---
    const injectSchema = () => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'JG',
        'jobTitle': 'Desenvolvedor e Designer de Experiências Digitais',
        'url': window.location.href,
        'sameAs': ['https://github.com/seu-usuario']
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    // --- Inicializa todas as funções ---
    initIntersectionObserver();
    initBackToTopButton();
    initModal();
    initAccordion();
    initSlideDownPanel();
    initWhatsappForm();
    injectSchema();
  });
})();