/**
 * Main Application Script (Counters, Toasts, Sidebar Drawer)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile Sidebar Drawer Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (menuToggle && sidebar && overlay) {
    const toggleSidebar = () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
  }

  // Count-up Animation for Stat Cards
  const countElements = document.querySelectorAll('[data-counter]');
  countElements.forEach(el => {
    const target = parseFloat(el.getAttribute('data-counter')) || 0;
    const isCurrency = el.getAttribute('data-currency') === 'true';
    const duration = 900; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = target * easedProgress;

      if (isCurrency) {
        el.textContent = '$' + currentVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        el.textContent = Math.round(currentVal).toLocaleString('en-US');
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        if (isCurrency) {
          el.textContent = '$' + target.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          el.textContent = target.toLocaleString('en-US');
        }
      }
    }

    requestAnimationFrame(updateCount);
  });

  // Auto-dismiss Flash Toasts
  const toasts = document.querySelectorAll('.toast');
  toasts.forEach(toast => {
    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 250ms forwards';
      setTimeout(() => toast.remove(), 250);
    }, 4000);
  });
});

/**
 * Trigger programmatically a toast message
 */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 250ms forwards';
    setTimeout(() => toast.remove(), 250);
  }, 4000);
}

window.showToast = showToast;
