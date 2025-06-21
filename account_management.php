<?php
include 'connect.php';
header('Content-Type: application/json; charset=UTF-8');

// Function to clean output
function safeAttr($value) {
    return htmlspecialchars(trim(str_replace(["\n", "\r"], '', $value)), ENT_QUOTES);
}

// If deletion is requested via GET
if (isset($_GET["id"])) {
    $id = intval($_GET["id"]);

    $checkStmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        $checkStmt->close();

        $deleteStmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $deleteStmt->bind_param("i", $id);

        if ($deleteStmt->execute()) {
            echo json_encode(["message" => "Account deleted successfully."]);
        } else {
            echo json_encode(["error" => "Delete failed: " . $deleteStmt->error]);
        }

        $deleteStmt->close();
    } else {
        echo json_encode(["error" => "Account not found."]);
    }

    $conn->close();
    exit;
}

// Else: handle pagination (default behavior)
$limit = 10; // Items per page
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$page = max($page, 1);
$offset = ($page - 1) * $limit;

// Count total users
$totalQuery = $conn->query("SELECT COUNT(*) AS total FROM users");
$totalRow = $totalQuery->fetch_assoc();
$totalUser = $totalRow['total'];
$totalPages = ceil($totalUser / $limit);

// Fetch paginated users
$sql = "SELECT * FROM users ORDER BY id DESC LIMIT $offset, $limit";
$result = $conn->query($sql);

$userRows = "";
while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $name = safeAttr($row['fullname']);
    $course_department = safeAttr($row['yrcourse']);
    $student_faculty_id = safeAttr($row['studentid']);
    $contact = safeAttr($row['contact']);
    $role = safeAttr($row['role']);
    $Email = safeAttr($row['email']);

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
            <a href='#' class='btn btn-danger btn-sm' onclick='deletuser({$id})'>Delete</a>
        </td>
    </tr>
    ";
}

echo json_encode([
    'users' => $userRows,
    'totalPages' => $totalPages
]);

$conn->close();
?>
