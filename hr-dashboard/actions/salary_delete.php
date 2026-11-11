<?php
/**
 * Action: Delete Salary
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Salary.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../salaries.php');
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    setFlash('Invalid CSRF token.', 'error');
    header('Location: ../salaries.php');
    exit;
}

$id = (int)($_POST['salary_id'] ?? 0);
if ($id <= 0) {
    setFlash('Invalid salary record ID.', 'error');
    header('Location: ../salaries.php');
    exit;
}

$db = getDBConnection();
$salaryModel = new Salary($db);
$success = $salaryModel->delete($id);

if ($success) {
    setFlash('Salary record deleted successfully.', 'success');
} else {
    setFlash('Failed to delete salary record.', 'error');
}

header('Location: ../salaries.php');
exit;
