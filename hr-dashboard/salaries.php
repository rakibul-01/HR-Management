<?php
/**
 * Salaries Management Page
 */
$pageTitle = 'Salaries';
$activeNav = 'salaries';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Salary.php';
require_once __DIR__ . '/models/Employee.php';

$db = getDBConnection();
$salaryModel = new Salary($db);
$employeeModel = new Employee($db);

$salaries = $salaryModel->getAll();
$employees = $employeeModel->getAll();
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
        <input type="text" id="salarySearch" class="form-control" placeholder="Search salaries...">
      </div>
    </div>

    <button type="button" class="btn btn-primary" onclick="openCreateModal()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Salary
    </button>
  </div>

  <div class="table-responsive">
    <table class="data-table" id="salariesTable">
      <thead>
        <tr>
          <th class="sortable">ID</th>
          <th class="sortable">Employee</th>
          <th class="sortable">Department</th>
          <th class="sortable text-right">Basic Salary</th>
          <th class="sortable text-right">Bonus</th>
          <th class="sortable text-right">Total Salary</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($salaries)): ?>
          <tr><td colspan="7" style="text-align:center; padding: 32px; color: var(--text-muted);">No records</td></tr>
        <?php else: ?>
          <?php foreach ($salaries as $sal): ?>
            <tr>
              <td class="num">#<?= htmlspecialchars($sal['salary_id']) ?></td>
              <td><strong><?= htmlspecialchars($sal['employee_name']) ?></strong></td>
              <td>
                <span class="dept-chip dept-default">
                  <?= htmlspecialchars($sal['department_name'] ?? 'Unassigned') ?>
                </span>
              </td>
              <td class="num text-right">$<?= number_format((float)$sal['basic_salary'], 2) ?></td>
              <td class="num text-right" style="color: var(--accent-emerald);">
                +$<?= number_format((float)($sal['bonus'] ?? 0), 2) ?>
              </td>
              <td class="num text-right" style="font-weight: 700; color: var(--text-main);">
                $<?= number_format((float)$sal['total_salary'], 2) ?>
              </td>
              <td class="text-right">
                <div class="table-actions">
                  <button type="button" class="btn-icon" title="Edit"
                    onclick='openEditModal(<?= json_encode($sal, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>)'>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Delete" style="color: var(--accent-rose);"
                    onclick="openDeleteModal(<?= (int)$sal['salary_id'] ?>, '<?= htmlspecialchars(addslashes($sal['employee_name'])) ?>')">
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
<div class="modal-backdrop" id="salaryModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">Add Salary</h3>
      <button type="button" class="btn-icon" data-close-modal="salaryModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/salary_save.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="salary_id" id="formSalaryId" value="">

      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="employee_id">Employee *</label>
          <select name="employee_id" id="formEmployeeId" class="form-control" required>
            <option value="">Select Employee</option>
            <?php foreach ($employees as $emp): ?>
              <option value="<?= (int)$emp['employee_id'] ?>">
                <?= htmlspecialchars($emp['employee_name']) ?> (ID: #<?= (int)$emp['employee_id'] ?>)
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="basic_salary">Basic Salary ($) *</label>
          <input type="number" step="0.01" min="0" name="basic_salary" id="formBasicSalary" class="form-control" required placeholder="50000.00">
        </div>

        <div class="form-group">
          <label class="form-label" for="bonus">Bonus ($)</label>
          <input type="number" step="0.01" min="0" name="bonus" id="formBonus" class="form-control" placeholder="0.00">
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="salaryModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveBtn">Save Salary</button>
      </div>
    </form>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-backdrop" id="deleteModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Delete Salary</h3>
      <button type="button" class="btn-icon" data-close-modal="deleteModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/salary_delete.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="salary_id" id="deleteSalaryId" value="">

      <div class="modal-body">
        <p style="color: var(--text-secondary); line-height: 1.5;">
          Are you sure you want to delete the salary record for <strong id="deleteEmployeeName"></strong>?
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
  document.getElementById('modalTitle').textContent = 'Add Salary';
  document.getElementById('formSalaryId').value = '';
  document.getElementById('formEmployeeId').value = '';
  document.getElementById('formBasicSalary').value = '';
  document.getElementById('formBonus').value = '';
  document.getElementById('saveBtn').textContent = 'Save Salary';
  ModalManager.open('salaryModal');
}

function openEditModal(sal) {
  document.getElementById('modalTitle').textContent = 'Edit Salary';
  document.getElementById('formSalaryId').value = sal.salary_id;
  document.getElementById('formEmployeeId').value = sal.employee_id;
  document.getElementById('formBasicSalary').value = sal.basic_salary;
  document.getElementById('formBonus').value = sal.bonus || '0';
  document.getElementById('saveBtn').textContent = 'Update Salary';
  ModalManager.open('salaryModal');
}

function openDeleteModal(id, name) {
  document.getElementById('deleteSalaryId').value = id;
  document.getElementById('deleteEmployeeName').textContent = name;
  ModalManager.open('deleteModal');
}

document.addEventListener('DOMContentLoaded', () => {
  TableManager.initSearch('salarySearch', 'salariesTable');
  TableManager.initSort('salariesTable');
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
