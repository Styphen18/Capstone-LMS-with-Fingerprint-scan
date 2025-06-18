<?php
include 'connect.php';

// Assuming there's a 'status' column and 'pending' means status = 'pending'
$sql = "SELECT COUNT(*) AS total_approved FROM borrowrequest_logs WHERE status = 'Approved'";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo $row['total_approved'];
} else {
    echo 0;
}
?>