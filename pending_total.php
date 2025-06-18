<?php
include 'connect.php';

// Assuming there's a 'status' column and 'pending' means status = 'pending'
$sql = "SELECT COUNT(*) AS total_pending FROM borrowrequest_logs WHERE status = 'Pending'";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo $row['total_pending'];
} else {
    echo 0;
}
?>