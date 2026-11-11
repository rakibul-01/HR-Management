<?php
/**
 * Action: Save Department (Create or Update)
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

$id = !empty($_POST['department_id']) ? (int)$_POST['department_id'] : null;
$name = trim($_POST['department_name'] ?? '');

if (empty($name)) {
    setFlash('Department name is required.', 'error');
    header('Location: ../departments.php');
    exit;
}

$db = getDBConnection();
$departmentModel = new Department($db);

if ($id) {
    $departmentModel->update($id, $name);
    setFlash('Department updated successfully.', 'success');
} else {
    $departmentModel->create($name);
    setFlash('Department created successfully.', 'success');
}

header('Location: ../departments.php');
exit;
