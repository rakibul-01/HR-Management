<?php
/**
 * HR Comprehensive Report Page
 */
$pageTitle = 'HR Report';
$activeNav = 'report';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Report.php';
require_once __DIR__ . '/models/Department.php';

$db = getDBConnection();
$reportModel = new Report($db);
$departmentModel = new Department($db);

$departments = $departmentModel->getAll();

$filters = [
    'department_id' => !empty($_GET['department_id']) ? (int)$_GET['department_id'] : null,
    'status' => !empty($_GET['status']) ? trim($_GET['status']) : null,
    'start_date' => !empty($_GET['start_date']) ? trim($_GET['start_date']) : null,
    'end_date' => !empty($_GET['end_date']) ? trim($_GET['end_date']) : null,
    'search' => !empty($_GET['search']) ? trim($_GET['search']) : null,
];

$records = $reportModel->getJoinedReport($filters);

// Build export query string
$exportQuery = http_build_query($filters);

require __DIR__ . '/includes/header.php';
?>

<div class="card">
  <div class="card-header">
    <!-- Filter Form -->
    <form method="GET" action="report.php" class="filter-bar" style="margin-bottom:0;">
      <!-- Search Input -->
      <div class="search-input-wrap" style="min-width: 200px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" name="search" class="form-control" placeholder="Search name or email..." value="<?= htmlspecialchars($filters['search'] ?? '') ?>">
      </div>

      <!-- Department Filter -->
      <select name="department_id" class="form-control" style="width: auto; min-width: 160px;" onchange="this.form.submit()">
        <option value="">All Departments</option>
        <?php foreach ($departments as $dept): ?>
          <option value="<?= (int)$dept['department_id'] ?>" <?= ($filters['department_id'] == $dept['department_id']) ? 'selected' : '' ?>>
            <?= htmlspecialchars($dept['department_name']) ?>
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
      <?php if (!empty($filters['department_id']) || !empty($filters['status']) || !empty($filters['start_date']) || !empty($filters['end_date']) || !empty($filters['search'])): ?>
        <a href="report.php" class="btn btn-secondary" style="color: var(--text-muted);">Reset</a>
      <?php endif; ?>
    </form>

    <div style="display: flex; gap: 10px;">
      <!-- Export CSV Button -->
      <a href="actions/report_export.php?<?= $exportQuery ?>" class="btn btn-primary" download>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Export CSV
      </a>

      <!-- Print Button -->
      <button type="button" class="btn btn-secondary" onclick="window.print()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print
      </button>
    </div>
  </div>

  <div class="table-responsive">
    <table class="data-table" id="reportTable">
      <thead>
        <tr>
          <th class="sortable">Employee Name</th>
          <th class="sortable">Department</th>
          <th class="sortable">Email</th>
          <th class="sortable text-right">Basic Salary</th>
          <th class="sortable text-right">Bonus</th>
          <th class="sortable text-right">Total Salary</th>
          <th class="sortable">Attendance Date</th>
          <th class="sortable">Status</th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($records)): ?>
          <tr><td colspan="8" style="text-align:center; padding: 36px; color: var(--text-muted);">No records matching the filter criteria</td></tr>
        <?php else: ?>
          <?php foreach ($records as $row): ?>
            <tr>
              <td><strong><?= htmlspecialchars($row['employee_name'] ?? '—') ?></strong></td>
              <td>
                <span class="dept-chip dept-default">
                  <?= htmlspecialchars($row['department_name'] ?? 'Unassigned') ?>
                </span>
              </td>
              <td style="color: var(--text-secondary);"><?= htmlspecialchars($row['email'] ?? '—') ?></td>
              <td class="num text-right">
                <?= isset($row['basic_salary']) ? '$' . number_format((float)$row['basic_salary'], 2) : '—' ?>
              </td>
              <td class="num text-right" style="color: var(--accent-emerald);">
                <?= isset($row['bonus']) ? '+$' . number_format((float)$row['bonus'], 2) : '—' ?>
              </td>
              <td class="num text-right" style="font-weight: 600;">
                <?= isset($row['total_compensation']) ? '$' . number_format((float)$row['total_compensation'], 2) : '—' ?>
              </td>
              <td class="num"><?= htmlspecialchars($row['attendance_date'] ?? '—') ?></td>
              <td>
                <?php if (!empty($row['status'])): ?>
                  <?php $statusLower = strtolower($row['status']); ?>
                  <span class="badge-status <?= $statusLower ?>">
                    <?= htmlspecialchars($row['status']) ?>
                  </span>
                <?php else: ?>
                  <span style="color: var(--text-muted);">—</span>
                <?php endif; ?>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  TableManager.initSort('reportTable');
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
