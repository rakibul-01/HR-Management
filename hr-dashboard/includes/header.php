<?php
/**
 * Layout Header
 * HR Management Dashboard
 */
if (!isset($pageTitle)) {
    $pageTitle = 'Dashboard';
}
if (!isset($activeNav)) {
    $activeNav = 'dashboard';
}

require_once __DIR__ . '/../config/database.php';
$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($pageTitle) ?> | HR Management</title>
  
  <!-- Inter Font -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="assets/css/variables.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/animations.css">

  <!-- Chart.js via CDN for Dashboard -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Prevent Theme Flash -->
  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem('hr_dashboard_theme');
        var theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
    })();
  </script>
</head>
<body>
<div class="app-container">
  <?php require __DIR__ . '/sidebar.php'; ?>
  <div class="main-wrapper">
    <?php require __DIR__ . '/topbar.php'; ?>
    <main class="content-viewport">
      <?php if ($flash): ?>
        <div class="toast-container">
          <div class="toast toast-<?= htmlspecialchars($flash['type']) ?>">
            <span><?= htmlspecialchars($flash['message']) ?></span>
          </div>
        </div>
      <?php endif; ?>
