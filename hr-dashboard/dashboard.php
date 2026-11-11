<?php
/**
 * Dashboard Page
 * HR Management Dashboard
 */
$pageTitle = 'Dashboard';
$activeNav = 'dashboard';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Employee.php';
require_once __DIR__ . '/models/Department.php';
require_once __DIR__ . '/models/Salary.php';
require_once __DIR__ . '/models/Attendance.php';

$db = getDBConnection();
$employeeModel = new Employee($db);
$departmentModel = new Department($db);
$salaryModel = new Salary($db);
$attendanceModel = new Attendance($db);

$totalEmployees = $employeeModel->count();
$totalDepartments = $departmentModel->count();
$totalPayroll = $salaryModel->getTotalPayroll();
$presentToday = $attendanceModel->getPresentCount();

$deptCounts = $employeeModel->getCountsByDepartment();
$latestAttendance = $attendanceModel->getLatest(6);

require __DIR__ . '/includes/header.php';
?>

<!-- 4 Stat Cards Grid -->
<div class="stat-grid">
  <!-- Total Employees -->
  <div class="stat-card accent-indigo">
    <div>
      <div class="stat-label">Total Employees</div>
      <div class="stat-value" data-counter="<?= $totalEmployees ?>">0</div>
    </div>
    <div class="stat-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    </div>
  </div>

  <!-- Departments -->
  <div class="stat-card accent-emerald">
    <div>
      <div class="stat-label">Departments</div>
      <div class="stat-value" data-counter="<?= $totalDepartments ?>">0</div>
    </div>
    <div class="stat-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    </div>
  </div>

  <!-- Total Payroll -->
  <div class="stat-card accent-amber">
    <div>
      <div class="stat-label">Total Payroll</div>
      <div class="stat-value" data-counter="<?= $totalPayroll ?>" data-currency="true">$0.00</div>
    </div>
    <div class="stat-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    </div>
  </div>

  <!-- Present Today -->
  <div class="stat-card accent-sky">
    <div>
      <div class="stat-label">Present Today</div>
      <div class="stat-value" data-counter="<?= $presentToday ?>">0</div>
    </div>
    <div class="stat-icon-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </div>
  </div>
</div>

<!-- Grid Layout: Chart + Latest Attendance -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">
  <!-- Department Distribution Chart -->
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Employees per Department</h2>
    </div>
    <div class="card-body" style="height: 320px; display: flex; align-items: center; justify-content: center; position: relative;">
      <canvas id="deptChart"></canvas>
    </div>
  </div>

  <!-- Latest Attendance Records -->
  <div class="card">
    <div class="card-header">
      <h2 class="card-title">Latest Attendance</h2>
      <a href="attendance.php" class="btn btn-secondary" style="font-size: 12px; padding: 6px 12px;">View All</a>
    </div>
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <?php if (empty($latestAttendance)): ?>
            <tr><td colspan="4" style="text-align:center; padding: 32px; color: var(--text-muted);">No records found</td></tr>
          <?php else: ?>
            <?php foreach ($latestAttendance as $row): ?>
              <tr>
                <td><strong><?= htmlspecialchars($row['employee_name']) ?></strong></td>
                <td>
                  <span class="dept-chip dept-<?= (int)$row['department_id'] ?>">
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
              </tr>
            <?php endforeach; ?>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('deptChart');
  if (!ctx) return;

  const labels = <?= json_encode(array_column($deptCounts, 'department_name')) ?>;
  const data = <?= json_encode(array_map('intval', array_column($deptCounts, 'total'))) ?>;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#6366F1', // Indigo (HR)
          '#10B981', // Emerald (Finance)
          '#0EA5E9', // Sky (IT)
          '#F59E0B', // Amber (Marketing)
          '#EC4899', // Pink
          '#8B5CF6'  // Purple
        ],
        borderWidth: 2,
        borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#111827' : '#FFFFFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 16,
            font: { family: 'Inter', size: 12 }
          }
        }
      }
    }
  });
});
</script>

<?php require __DIR__ . '/includes/footer.php'; ?>
