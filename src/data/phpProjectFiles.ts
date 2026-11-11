export interface ProjectFile {
  path: string;
  name: string;
  category: 'Pages' | 'Config' | 'Includes' | 'Actions' | 'Models' | 'CSS' | 'JS' | 'Database' | 'Docs';
  language: 'php' | 'sql' | 'css' | 'javascript' | 'markdown';
  content: string;
}

export const PHP_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'index.php',
    name: 'index.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
/**
 * Root Entry Point
 * Redirects to dashboard
 */
header('Location: dashboard.php');
exit;`
  },
  {
    path: 'dashboard.php',
    name: 'dashboard.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
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
  <div class="stat-card accent-indigo">
    <div>
      <div class="stat-label">Total Employees</div>
      <div class="stat-value" data-counter="<?= $totalEmployees ?>">0</div>
    </div>
    <div class="stat-icon-wrap"><svg>...</svg></div>
  </div>
  <div class="stat-card accent-emerald">
    <div>
      <div class="stat-label">Departments</div>
      <div class="stat-value" data-counter="<?= $totalDepartments ?>">0</div>
    </div>
    <div class="stat-icon-wrap"><svg>...</svg></div>
  </div>
  <div class="stat-card accent-amber">
    <div>
      <div class="stat-label">Total Payroll</div>
      <div class="stat-value" data-counter="<?= $totalPayroll ?>" data-currency="true">$0.00</div>
    </div>
    <div class="stat-icon-wrap"><svg>...</svg></div>
  </div>
  <div class="stat-card accent-sky">
    <div>
      <div class="stat-label">Present Today</div>
      <div class="stat-value" data-counter="<?= $presentToday ?>">0</div>
    </div>
    <div class="stat-icon-wrap"><svg>...</svg></div>
  </div>
</div>
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'employees.php',
    name: 'employees.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
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
<!-- Employees Table, Search, Add/Edit Modal, Delete Confirm Dialog -->
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'departments.php',
    name: 'departments.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
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
<!-- Departments Table, Employee counts, CRUD Modals -->
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'salaries.php',
    name: 'salaries.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
$pageTitle = 'Salaries';
$activeNav = 'salaries';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Salary.php';
require_once __DIR__ . '/models/Employee.php';

$db = getDBConnection();
$salaryModel = new Salary($db);
$salaries = $salaryModel->getAll();
$csrfToken = getCsrfToken();

require __DIR__ . '/includes/header.php';
?>
<!-- Salaries Table, Computed Total Salary (Basic + Bonus) -->
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'attendance.php',
    name: 'attendance.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
$pageTitle = 'Attendance';
$activeNav = 'attendance';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Attendance.php';
require_once __DIR__ . '/models/Employee.php';

$db = getDBConnection();
$attendanceModel = new Attendance($db);
$records = $attendanceModel->getAll($_GET);
$csrfToken = getCsrfToken();

require __DIR__ . '/includes/header.php';
?>
<!-- Attendance Table, Date & Status filters, Modal CRUD -->
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'report.php',
    name: 'report.php',
    category: 'Pages',
    language: 'php',
    content: `<?php
$pageTitle = 'HR Report';
$activeNav = 'report';

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/Report.php';
require_once __DIR__ . '/models/Department.php';

$db = getDBConnection();
$reportModel = new Report($db);
$records = $reportModel->getJoinedReport($_GET);

require __DIR__ . '/includes/header.php';
?>
<!-- Joined Report: employee_name, department_name, email, basic_salary, bonus, attendance_date, status -->
<!-- Export CSV (actions/report_export.php) and Print button -->
<?php require __DIR__ . '/includes/footer.php'; ?>`
  },
  {
    path: 'config/database.php',
    name: 'database.php',
    category: 'Config',
    language: 'php',
    content: `<?php
define('DB_HOST', 'localhost');
define('DB_NAME', 'hr_management');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

function getDBConnection(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function getCsrfToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCsrfToken(?string $token): bool {
    return !empty($token) && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function setFlash(string $message, string $type = 'success'): void {
    $_SESSION['flash'] = ['message' => $message, 'type' => $type];
}

function getFlash(): ?array {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}`
  },
  {
    path: 'database/schema.sql',
    name: 'schema.sql',
    category: 'Database',
    language: 'sql',
    content: `CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

CREATE TABLE Department (
  department_id INT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL
);

CREATE TABLE Employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_name VARCHAR(100) NOT NULL,
  department_id INT,
  email VARCHAR(100),
  FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

CREATE TABLE Salary (
  salary_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  basic_salary DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id INT,
  attendance_date DATE NOT NULL,
  status VARCHAR(50),
  FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);`
  },
  {
    path: 'database/seed.sql',
    name: 'seed.sql',
    category: 'Database',
    language: 'sql',
    content: `USE hr_management;

INSERT INTO Department (department_id, department_name) VALUES
(1,'Human Resources'),(2,'Finance'),(3,'IT'),(4,'Marketing');

INSERT INTO Employee (employee_id, employee_name, department_id, email) VALUES
(101,'Alice Smith',1,'alice@company.com'),
(102,'Bob Johnson',2,'bob@company.com'),
(103,'Charlie Brown',3,'charlie@company.com'),
(104,'Diana Prince',4,'diana@company.com'),
(105,'Edward Norton',3,'edward@company.com');

INSERT INTO Salary (salary_id, employee_id, basic_salary, bonus) VALUES
(1,101,50000.00,5000.00),(2,102,60000.00,6000.00),(3,103,70000.00,7000.00),
(4,104,55000.00,5500.00),(5,105,72000.00,7500.00);

INSERT INTO Attendance (attendance_id, employee_id, attendance_date, status) VALUES
(1,101,'2025-04-01','Present'),(2,101,'2025-04-02','Present'),
(3,102,'2025-04-01','Absent'),(4,102,'2025-04-02','Present'),
(5,103,'2025-04-01','Leave'),(6,103,'2025-04-02','Present'),
(7,104,'2025-04-01','Present'),(8,105,'2025-04-01','Absent');`
  },
  {
    path: 'models/Report.php',
    name: 'Report.php',
    category: 'Models',
    language: 'php',
    content: `<?php
class Report {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function getJoinedReport(array $filters = []): array {
        $sql = "
            SELECT e.employee_name, d.department_name, e.email,
                   s.basic_salary, s.bonus, (COALESCE(s.basic_salary, 0) + COALESCE(s.bonus, 0)) AS total_compensation,
                   a.attendance_date, a.status
            FROM Employee e
            LEFT JOIN Department d ON e.department_id = d.department_id
            LEFT JOIN Salary s     ON e.employee_id   = s.employee_id
            LEFT JOIN Attendance a ON e.employee_id   = a.employee_id
            WHERE 1=1
        ";
        $params = [];

        if (!empty($filters['department_id'])) {
            $sql .= " AND e.department_id = ?";
            $params[] = (int)$filters['department_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND a.status = ?";
            $params[] = $filters['status'];
        }
        if (!empty($filters['start_date'])) {
            $sql .= " AND a.attendance_date >= ?";
            $params[] = $filters['start_date'];
        }
        if (!empty($filters['end_date'])) {
            $sql .= " AND a.attendance_date <= ?";
            $params[] = $filters['end_date'];
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (e.employee_name LIKE ? OR e.email LIKE ? OR d.department_name LIKE ?)";
            $term = '%' . trim($filters['search']) . '%';
            $params[] = $term; $params[] = $term; $params[] = $term;
        }

        $sql .= " ORDER BY e.employee_name ASC, a.attendance_date ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }
}`
  },
  {
    path: 'actions/report_export.php',
    name: 'report_export.php',
    category: 'Actions',
    language: 'php',
    content: `<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Report.php';

$db = getDBConnection();
$reportModel = new Report($db);
$rows = $reportModel->getJoinedReport($_GET);

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="hr_report_' . date('Y-m-d') . '.csv"');

$output = fopen('php://output', 'w');
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

fputcsv($output, ['Employee Name', 'Department', 'Email', 'Basic Salary', 'Bonus', 'Total Compensation', 'Attendance Date', 'Status']);

foreach ($rows as $row) {
    fputcsv($output, [
        $row['employee_name'] ?? 'N/A',
        $row['department_name'] ?? 'Unassigned',
        $row['email'] ?? 'N/A',
        isset($row['basic_salary']) ? number_format((float)$row['basic_salary'], 2, '.', '') : '0.00',
        isset($row['bonus']) ? number_format((float)$row['bonus'], 2, '.', '') : '0.00',
        isset($row['total_compensation']) ? number_format((float)$row['total_compensation'], 2, '.', '') : '0.00',
        $row['attendance_date'] ?? 'N/A',
        $row['status'] ?? 'N/A'
    ]);
}
fclose($output);
exit;`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Docs',
    language: 'markdown',
    content: `# HR Management Dashboard (PHP 8+ & MySQL)

## Quick Start
1. Import database: \`mysql -u root < database/schema.sql && mysql -u root hr_management < database/seed.sql\`
2. Configure credentials in \`config/database.php\`
3. Run: \`php -S localhost:8000\`
4. Open http://localhost:8000 in your browser.`
  }
];
