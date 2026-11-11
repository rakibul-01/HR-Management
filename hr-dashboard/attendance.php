<?php
/**
 * Attendance Management Page
 */
$pageTitle = 'Attendance';
$activeNav = 'attendance';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Attendance.php';
require_once __DIR__ . '/models/Employee.php';

$db = getDBConnection();
$attendanceModel = new Attendance($db);
$employeeModel = new Employee($db);

$filters = [
    'employee_id' => !empty($_GET['employee_id']) ? (int)$_GET['employee_id'] : null,
    'status' => !empty($_GET['status']) ? trim($_GET['status']) : null,
    'start_date' => !empty($_GET['start_date']) ? trim($_GET['start_date']) : null,
    'end_date' => !empty($_GET['end_date']) ? trim($_GET['end_date']) : null,
];

$records = $attendanceModel->getAll($filters);
$employees = $employeeModel->getAll();
$csrfToken = getCsrfToken();

require __DIR__ . '/includes/header.php';
?>

<div class="card">
  <div class="card-header">
    <!-- Filter Form -->
    <form method="GET" action="attendance.php" class="filter-bar" style="margin-bottom:0;">
      <!-- Employee Filter -->
      <select name="employee_id" class="form-control" style="width: auto; min-width: 170px;" onchange="this.form.submit()">
        <option value="">All Employees</option>
        <?php foreach ($employees as $emp): ?>
          <option value="<?= (int)$emp['employee_id'] ?>" <?= ($filters['employee_id'] == $emp['employee_id']) ? 'selected' : '' ?>>
            <?= htmlspecialchars($emp['employee_name']) ?>
          </option>
        <?php endforeach; ?>
      </select>

      <!-- Status Filter -->
      <select name="status" class="form-control" style="width: auto; min-width: 130px;" onchange="this.form.submit()">
        <option value="">All Statuses</option>
        <option value="Present" <?= ($filters['status'] === 'Present') ? 'selected' : '' ?>>Present</option>
        <option value="Absent" <?= ($filters['status'] === 'Absent') ? 'selected' : '' ?>>Absent</option>
        <option value="Leave" <?= ($filters['status'] === 'Leave') ? 'selected' : '' ?>>Leave</option>
      </select>

      <!-- Date Range -->
      <input type="date" name="start_date" class="form-control" style="width: auto;" value="<?= htmlspecialchars($filters['start_date'] ?? '') ?>" title="From Date">
      <input type="date" name="end_date" class="form-control" style="width: auto;" value="<?= htmlspecialchars($filters['end_date'] ?? '') ?>" title="To Date">
      
      <button type="submit" class="btn btn-secondary">Filter</button>
      <?php if (!empty($filters['employee_id']) || !empty($filters['status']) || !empty($filters['start_date']) || !empty($filters['end_date'])): ?>
        <a href="attendance.php" class="btn btn-secondary" style="color: var(--text-muted);">Reset</a>
      <?php endif; ?>
    </form>

    <button type="button" class="btn btn-primary" onclick="openCreateModal()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Record Attendance
    </button>
  </div>

  <div class="table-responsive">
    <table class="data-table" id="attendanceTable">
      <thead>
        <tr>
          <th class="sortable">ID</th>
          <th class="sortable">Employee Name</th>
          <th class="sortable">Department</th>
          <th class="sortable">Date</th>
          <th class="sortable">Status</th>
          <th class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($records)): ?>
          <tr><td colspan="6" style="text-align:center; padding: 32px; color: var(--text-muted);">No attendance records found</td></tr>
        <?php else: ?>
          <?php foreach ($records as $row): ?>
            <tr>
              <td class="num">#<?= htmlspecialchars($row['attendance_id']) ?></td>
              <td><strong><?= htmlspecialchars($row['employee_name']) ?></strong></td>
              <td>
                <span class="dept-chip dept-default">
                  <?= htmlspecialchars($row['department_name'] ?? 'Unassigned') ?>
                </span>
              </td>
              <td class="num"><?= htmlspecialchars($row['attendance_date']) ?></td>
              <td>
                <?php $statusLower = strtolower($row['status']); ?>
                <span class="badge-status <?= $statusLower ?>">
                  <?= htmlspecialchars($row['status']) ?>
                </span>
              </td>
              <td class="text-right">
                <div class="table-actions">
                  <button type="button" class="btn-icon" title="Edit"
                    onclick='openEditModal(<?= json_encode($row, JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) ?>)'>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button type="button" class="btn-icon" title="Delete" style="color: var(--accent-rose);"
                    onclick="openDeleteModal(<?= (int)$row['attendance_id'] ?>, '<?= htmlspecialchars(addslashes($row['employee_name'])) ?>', '<?= htmlspecialchars($row['attendance_date']) ?>')">
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
<div class="modal-backdrop" id="attendanceModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title" id="modalTitle">Record Attendance</h3>
      <button type="button" class="btn-icon" data-close-modal="attendanceModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/attendance_save.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="attendance_id" id="formAttendanceId" value="">

      <div class="modal-body">
        <div class="form-group">
          <label class="form-label" for="employee_id">Employee *</label>
          <select name="employee_id" id="formEmployeeId" class="form-control" required>
            <option value="">Select Employee</option>
            <?php foreach ($employees as $emp): ?>
              <option value="<?= (int)$emp['employee_id'] ?>">
                <?= htmlspecialchars($emp['employee_name']) ?>
              </option>
            <?php endforeach; ?>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="attendance_date">Date *</label>
          <input type="date" name="attendance_date" id="formAttendanceDate" class="form-control" required value="<?= date('Y-m-d') ?>">
        </div>

        <div class="form-group">
          <label class="form-label" for="status">Status *</label>
          <select name="status" id="formStatus" class="form-control" required>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-close-modal="attendanceModal">Cancel</button>
        <button type="submit" class="btn btn-primary" id="saveBtn">Save Record</button>
      </div>
    </form>
  </div>
</div>

<!-- Delete Confirmation Modal -->
<div class="modal-backdrop" id="deleteModal">
  <div class="modal-dialog">
    <div class="modal-header">
      <h3 class="modal-title">Delete Attendance</h3>
      <button type="button" class="btn-icon" data-close-modal="deleteModal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <form action="actions/attendance_delete.php" method="POST">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrfToken) ?>">
      <input type="hidden" name="attendance_id" id="deleteAttendanceId" value="">

      <div class="modal-body">
        <p style="color: var(--text-secondary); line-height: 1.5;">
          Are you sure you want to delete the attendance record for <strong id="deleteEmployeeName"></strong> on <span id="deleteAttendanceDate"></span>?
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
  document.getElementById('modalTitle').textContent = 'Record Attendance';
  document.getElementById('formAttendanceId').value = '';
  document.getElementById('formEmployeeId').value = '';
  document.getElementById('formAttendanceDate').value = '<?= date('Y-m-d') ?>';
  document.getElementById('formStatus').value = 'Present';
  document.getElementById('saveBtn').textContent = 'Save Record';
  ModalManager.open('attendanceModal');
}

function openEditModal(record) {
  document.getElementById('modalTitle').textContent = 'Edit Attendance';
  document.getElementById('formAttendanceId').value = record.attendance_id;
  document.getElementById('formEmployeeId').value = record.employee_id;
  document.getElementById('formAttendanceDate').value = record.attendance_date;
  document.getElementById('formStatus').value = record.status;
  document.getElementById('saveBtn').textContent = 'Update Record';
  ModalManager.open('attendanceModal');
}

function openDeleteModal(id, name, date) {
  document.getElementById('deleteAttendanceId').value = id;
  document.getElementById('deleteEmployeeName').textContent = name;
  document.getElementById('deleteAttendanceDate').textContent = date;
  ModalManager.open('deleteModal');
}

document.addEventListener('DOMContentLoaded', () => {
  TableManager.initSort('attendanceTable');
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
