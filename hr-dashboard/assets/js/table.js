/**
 * Table Search and Sort Utilities
 */
const TableManager = {
  initSearch(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    if (!input || !table) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const rows = table.querySelectorAll('tbody tr');

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  },

  initSort(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th.sortable');
    headers.forEach((th, colIndex) => {
      let ascending = true;
      th.addEventListener('click', () => {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((rowA, rowB) => {
          const cellA = rowA.children[colIndex]?.innerText.trim() || '';
          const cellB = rowB.children[colIndex]?.innerText.trim() || '';

          // Numeric check
          const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
          const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));

          if (!isNaN(numA) && !isNaN(numB)) {
            return ascending ? numA - numB : numB - numA;
          }

          return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        ascending = !ascending;
        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }
};

window.TableManager = TableManager;
