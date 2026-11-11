/**
 * Modal Manager
 */
const ModalManager = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
    if (firstInput) firstInput.focus();
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  init() {
    // Backdrop click dismiss
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          ModalManager.close(modal.id);
        }
      });
    });

    // Close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        ModalManager.close(modalId);
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
          ModalManager.close(modal.id);
        });
      }
    });
  }
};

window.ModalManager = ModalManager;
document.addEventListener('DOMContentLoaded', () => ModalManager.init());
