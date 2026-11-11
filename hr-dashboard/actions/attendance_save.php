<?php
/**
 * Action: Save Attendance (Create or Update)
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Attendance.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../attendance.php');
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('Invalid CSRF token.', 'error');
    header('Location: ../attendance.php');
    exit;
}

$id = !empty($_POST['attendance_id']) ? (int)$_POST['attendance_id'] : null;
$employeeId = (int)($_POST['employee_id'] ?? 0);
$attendanceDate = trim($_POST['attendance_date'] ?? '');
$status = trim($_POST['status'] ?? '');

$allowedStatuses = ['Present', 'Absent', 'Leave'];

if ($employeeId <= 0) {
    setFlash('Please select an employee.', 'error');
    header('Location: ../attendance.php');
    exit;
}

if (empty($attendanceDate) || !strtotime($attendanceDate)) {
    setFlash('Please enter a valid attendance date (YYYY-MM-DD).', 'error');
    header('Location: ../attendance.php');
    exit;
}

if (!in_array($status, $allowedStatuses, true)) {
    setFlash('Status must be Present, Absent, or Leave.', 'error');
    header('Location: ../attendance.php');
    exit;
}

$db = getDBConnection();
$attendanceModel = new Attendance($db);

if ($id) {
    $attendanceModel->update($id, $employeeId, $attendanceDate, $status);
    setFlash('Attendance updated successfully.', 'success');
} else {
    $attendanceModel->create($employeeId, $attendanceDate, $status);
    setFlash('Attendance recorded successfully.', 'success');
}

header('Location: ../attendance.php');
exit;
