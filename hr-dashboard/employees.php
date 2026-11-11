<?php
/**
 * Employees Management Page
 */
$pageTitle = 'Employees';
$activeNav = 'employees';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Employee.php';
require_once __DIR__ . '/models/Department.php';

$db = getDBConnection();
$employeeModel = new Employee($db);
$departmentModel = new Department($db);

$employees = $employeeModel->getAll();
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
        <input type="text" id="employeeSearch" class="form-control" placeholder="Search employees...">
      </div>
    </div>

    <button type="button" class="btn btn-primary" onclick="openCreateModal()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Employee
    </button>
  </div>

  <div class="table-responsive">
    <table class="data-table" id="employeesTable">
      <thead>
        <tr>
          <th class="sortable">ID</th>
          <th class="sortable">Employee Name</th>
          <th class="sortable">Department</th>
          <th class="sortable">Email</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($employees)): ?>
          <tr><td colspan="5" style="text-align:center; padding: 32px; color: var(--text-muted);">No records</td></tr>
        <?php else: ?>
          <?php foreach ($employees as $emp): ?>
            <tr>
              <td class="num">#<?= htmlspecialchars($emp['employee_id']) ?></td>
              <td><strong><?= htmlspecialchars($emp['employee_name']) ?></strong></td>
              <td>
                <span class="dept-chip dept-<?= (int)$emp['department_id'] ?>">
                  <?= htmlspecialchars($emp['department_name'] ?? 'Unassigned') ?>
                </span>
              </td>
              <td style="color: var(--text-secondary);"><?= htmlspecialchars($emp['email'] ?? '—') ?></td>
              <td class="text-right">
                <div class="table-actions">
                  <button type="button" class="btn-icon" title="Edit"
                    onclick='openEditModal(<?= json_encode($emp, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>)'>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Delete" style="color: var(--accent-rose);"
                    onclick="openDeleteModal(<?= (int)$emp['employee_id'] ?>, '<?= htmlspecialchars(addslashes($emp['employee_name'])) ?>')">
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
<div class="modal-backdrop" id="employeeModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">Add Employee</h3>
      <button type="button" class="btn-icon" data-close-modal="employeeModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/employee_save.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="employee_id" id="formEmployeeId" value="">

      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="employee_name">Full Name *</label>
          <input type="text" name="employee_name" id="formEmployeeName" class="form-control" required placeholder="e.g. Sarah Connor">
        </div>

        <div class="form-group">
          <label class="form-label" for="department_id">Department *</label>
          <select name="department_id" id="formDepartmentId" class="form-control" required>
            <option value="">Select Department</option>
            <?php foreach ($departments as $dept): ?>
              <option value="<?= (int)$dept['department_id'] ?>">
                <?= htmlspecialchars($dept['department_name']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email Address *</label>
          <input type="email" name="email" id="formEmail" class="form-control" required placeholder="e.g. name@company.com">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="employeeModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveBtn">Save Employee</button>
      </div>
    </form>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-backdrop" id="deleteModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Delete Employee</h3>
      <button type="button" class="btn-icon" data-close-modal="deleteModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/employee_delete.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="employee_id" id="deleteEmployeeId" value="">

      <div class="modal-body">
        <p style="color: var(--text-secondary); line-height: 1.5;">
          Are you sure you want to delete <strong id="deleteEmployeeName"></strong>? All associated salary and attendance records will also be removed.
        </p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="deleteModal">Cancel</button>
        <button type="submit" class="btn btn-danger">Confirm Delete</button>
      </div>
    </form>
  </div>
</div>

<script>
function openCreateModal() {
  document.getElementById('modalTitle').textContent = 'Add Employee';
  document.getElementById('formEmployeeId').value = '';
  document.getElementById('formEmployeeName').value = '';
  document.getElementById('formDepartmentId').value = '';
  document.getElementById('formEmail').value = '';
  document.getElementById('saveBtn').textContent = 'Save Employee';
  ModalManager.open('employeeModal');
}

function openEditModal(emp) {
  document.getElementById('modalTitle').textContent = 'Edit Employee';
  document.getElementById('formEmployeeId').value = emp.employee_id;
  document.getElementById('formEmployeeName').value = emp.employee_name;
  document.getElementById('formDepartmentId').value = emp.department_id || '';
  document.getElementById('formEmail').value = emp.email || '';
  document.getElementById('saveBtn').textContent = 'Update Employee';
  ModalManager.open('employeeModal');
}

function openDeleteModal(id, name) {
  document.getElementById('deleteEmployeeId').value = id;
  document.getElementById('deleteEmployeeName').textContent = name;
  ModalManager.open('deleteModal');
}

document.addEventListener('DOMContentLoaded', () => {
  TableManager.initSearch('employeeSearch', 'employeesTable');
  TableManager.initSort('employeesTable');
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
