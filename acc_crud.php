<?php
include 'connect.php';
header('Content-Type: application/json; charset=UTF-8');

function safeAttr($value) {
    return htmlspecialchars(trim(str_replace(["\n", "\r"], '', $value)), ENT_QUOTES);
}

// Pagination variables
$limit = 10; // Items per page
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$page = max($page, 1); // Prevent negative or zero page
$offset = ($page - 1) * $limit;


$totalQuery = $conn->query("SELECT COUNT(*) AS total FROM users");
$totalRow = $totalQuery->fetch_assoc();
$totalUser = $totalRow['total'];
$totalPages = ceil($totalUser / $limit);

// Fetch paginated user
$sql = "SELECT * FROM users ORDER BY id DESC LIMIT $offset, $limit";
$result = $conn->query($sql);

// Build user row
$userRows = "";
while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $name = safeAttr($row['fullname']);
    $course_department = safeAttr($row['yrcourse']);
    $student_faculty_id = safeAttr($row['studentid']);
    $contact = safeAttr($row['contact']);
    $role = safeAttr($row['role']);
    $Email = safeAttr($row['email']);
    $Pass = safeAttr($row['password']);

    $userRows .= "
    <tr id='user-row-{$id}'>
        <td>{$id}</td>
        <td>{$name}</td>
        <td>{$course_department}</td>
        <td>{$student_faculty_id}</td>
        <td>{$contact}</td>
        <td>{$role}</td>
        <td>{$Email}</td>
       
        <td>
            <a href='#' class='btn btn-primary btn-sm update-btn-user'
               data-id='{$id}'
               data-name=\"{$name}\"
               data-department=\"{$course_department}\"
               data-student_id=\"{$student_faculty_id}\"
               data-contact=\"{$contact}\"
               data-email=\"{$Email}\"
              >Update</a>
            <a href='#' class='btn btn-danger btn-sm' onclick='deleteBook(\"{$id}\")'>Delete</a>
        </td>
    </tr>
    ";
}

// Return JSON
echo json_encode([
    'users' => $userRows,
    'totalPages' => $totalPages
]);
?>