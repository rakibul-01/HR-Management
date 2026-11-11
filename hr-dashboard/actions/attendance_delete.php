<?php
/**
 * Action: Delete Attendance
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

$id = (int)($_POST['attendance_id'] ?? 0);
if ($id <= 0) {
    setFlash('Invalid attendance record ID.', 'error');
    header('Location: ../attendance.php');
    exit;
}

$db = getDBConnection();
$attendanceModel = new Attendance($db);
$success = $attendanceModel->delete($id);

if ($success) {
    setFlash('Attendance record deleted successfully.', 'success');
} else {
    setFlash('Failed to delete attendance record.', 'error');
}

header('Location: ../attendance.php');
exit;
