<?php
/**
 * Action: Export HR Report to CSV
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Report.php';

$filters = [
    'department_id' => !empty($_GET['department_id']) ? (int)$_GET['department_id'] : null,
    'status' => !empty($_GET['status']) ? trim($_GET['status']) : null,
    'start_date' => !empty($_GET['start_date']) ? trim($_GET['start_date']) : null,
    'end_date' => !empty($_GET['end_date']) ? trim($_GET['end_date']) : null,
    'search' => !empty($_GET['search']) ? trim($_GET['search']) : null,
];

$db = getDBConnection();
$reportModel = new Report($db);
$rows = $reportModel->getJoinedReport($filters);

$filename = 'hr_report_' . date('Y-m-d_His') . '.csv';

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Pragma: no-cache');
header('Expires: 0');

$output = fopen('php://output', 'w');

// UTF-8 BOM for Microsoft Excel compatibility
fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));

// CSV Header
fputcsv($output, [
    'Employee Name',
    'Department',
    'Email',
    'Basic Salary',
    'Bonus',
    'Total Compensation',
    'Attendance Date',
    'Status'
]);

// CSV Rows
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
exit;
