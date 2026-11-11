<?php
/**
 * Action: Delete Department
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Department.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../departments.php');
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('Invalid CSRF token.', 'error');
    header('Location: ../departments.php');
    exit;
}

$id = (int)($_POST['department_id'] ?? 0);
if ($id <= 0) {
    setFlash('Invalid department ID.', 'error');
    header('Location: ../departments.php');
    exit;
}

$db = getDBConnection();
$departmentModel = new Department($db);
$result = $departmentModel->delete($id);

setFlash($result['message'], $result['success'] ? 'success' : 'error');
header('Location: ../departments.php');
exit;
