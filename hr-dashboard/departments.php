<?php
/**
 * Departments Management Page
 */
$pageTitle = 'Departments';
$activeNav = 'departments';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Department.php';

$db = getDBConnection();
$departmentModel = new Department($db);
$departments = $departmentModel->getAll();
$csrfToken = getCsrfToken();

require __DIR__ . '/includes/header.php';
?>

<div class="card">
  <div class="card-header">
    <div class="filter-bar" style="margin-bottom:0;">
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="deptSearch" class="form-control" placeholder="Search departments...">
      </div>
    </div>

    <button type="button" class="btn btn-primary" onclick="openCreateModal()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Department
    </button>
  </div>

  <div class="table-responsive">
    <table class="data-table" id="deptTable">
      <thead>
        <tr>
          <th class="sortable">ID</th>
          <th class="sortable">Department Name</th>
          <th class="sortable text-right">Assigned Employees</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($departments)): ?>
          <tr><td colspan="4" style="text-align:center; padding: 32px; color: var(--text-muted);">No records</td></tr>
        <?php else: ?>
          <?php foreach ($departments as $dept): ?>
            <tr>
              <td class="num">#<?= htmlspecialchars($dept['department_id']) ?></td>
              <td>
                <span class="dept-chip dept-<?= (int)$dept['department_id'] ?>">
                  <?= htmlspecialchars($dept['department_name']) ?>
                </span>
              </td>
              <td class="num text-right" style="font-weight: 600;">
                <?= (int)$dept['employee_count'] ?>
              </td>
              <td class="text-right">
                <div class="table-actions">
                  <button type="button" class="btn-icon" title="Edit"
                    onclick='openEditModal(<?= json_encode($dept, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>)'>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Delete" style="color: var(--accent-rose);"
                    onclick="openDeleteModal(<?= (int)$dept['department_id'] ?>, '<?= htmlspecialchars(addslashes($dept['department_name'])) ?>', <?= (int)$dept['employee_count'] ?>)">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Add / Edit Modal -->
<div class="modal-backdrop" id="deptModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">Add Department</h3>
      <button type="button" class="btn-icon" data-close-modal="deptModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/department_save.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="department_id" id="formDeptId" value="">

      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="department_name">Department Name *</label>
          <input type="text" name="department_name" id="formDeptName" class="form-control" required placeholder="e.g. Operations">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="deptModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveBtn">Save Department</button>
      </div>
    </form>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-backdrop" id="deleteModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Delete Department</h3>
      <button type="button" class="btn-icon" data-close-modal="deleteModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/department_delete.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="department_id" id="deleteDeptId" value="">

      <div class="modal-body">
        <p style="color: var(--text-secondary); line-height: 1.5;" id="deleteWarningText"></p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="deleteModal">Cancel</button>
        <button type="submit" class="btn btn-danger" id="confirmDeleteBtn">Confirm Delete</button>
      </div>
    </form>
  </div>
</div>

<script>
function openCreateModal() {
  document.getElementById('modalTitle').textContent = 'Add Department';
  document.getElementById('formDeptId').value = '';
  document.getElementById('formDeptName').value = '';
  document.getElementById('saveBtn').textContent = 'Save Department';
  ModalManager.open('deptModal');
}

function openEditModal(dept) {
  document.getElementById('modalTitle').textContent = 'Edit Department';
  document.getElementById('formDeptId').value = dept.department_id;
  document.getElementById('formDeptName').value = dept.department_name;
  document.getElementById('saveBtn').textContent = 'Update Department';
  ModalManager.open('deptModal');
}

function openDeleteModal(id, name, empCount) {
  document.getElementById('deleteDeptId').value = id;
  const warningText = document.getElementById('deleteWarningText');
  const confirmBtn = document.getElementById('confirmDeleteBtn');

  if (empCount > 0) {
    warningText.innerHTML = `Cannot delete <strong>${name}</strong> because it currently has <strong>${empCount}</strong> assigned employee(s). Please reassign them first.`;
    confirmBtn.disabled = true;
    confirmBtn.style.opacity = '0.5';
    confirmBtn.style.cursor = 'not-allowed';
  } else {
    warningText.innerHTML = `Are you sure you want to delete the department <strong>${name}</strong>? This action cannot be undone.`;
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
  }

  ModalManager.open('deleteModal');
}

document.addEventListener('DOMContentLoaded', () => {
  TableManager.initSearch('deptSearch', 'deptTable');
  TableManager.initSort('deptTable');
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
