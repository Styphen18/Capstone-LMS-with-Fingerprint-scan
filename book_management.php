<?php
include 'connect.php';
//delete book
if (isset($_GET["id"])) {
    $id = $_GET["id"];

   
    $checkStmt = $conn->prepare("SELECT bookquantity FROM booktry WHERE id = ?");
    $checkStmt->bind_param("i", $id);
    $checkStmt->execute();
    $checkStmt->bind_result($quantity);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($quantity > 1) {
        // If quantity is more than 1, subtract 1
        $updateStmt = $conn->prepare("UPDATE booktry SET bookquantity = bookquantity - 1 WHERE id = ?");
        $updateStmt->bind_param("i", $id);
        if ($updateStmt->execute()) {
            echo "1 copy removed from book (Remaining: " . ($quantity - 1) . ")";
        } else {
            echo "Failed to update quantity: " . $updateStmt->error;
        }
        $updateStmt->close();
    } else {
        // If quantity is 1 or less, delete the book
        $deleteStmt = $conn->prepare("DELETE FROM booktry WHERE id = ?");
        $deleteStmt->bind_param("i", $id);
        if ($deleteStmt->execute()) {
            echo "Book deleted as quantity was 1.";
        } else {
            echo "Delete failed: " . $deleteStmt->error;
        }
        $deleteStmt->close();
    }

    $conn->close();
    exit;
}


if($_SERVER["REQUEST_METHOD"] === "POST"){

    // add_book
date_default_timezone_set('Asia/Manila');

if (!isset($_POST['bookTitle']) || !isset($_POST['bookAuthor'])) {
    die("Missing data: " . json_encode($_POST));
}
$title = $_POST['bookTitle'];
$author = $_POST['bookAuthor'];
$published = $_POST['bookpublished'];
$quantity = $_POST['bookquantity'];
$genre = $_POST['genre'];
$bookentry = date('Y-m-d H:i:s');

$sql_check_booktitle = "SELECT booktitle FROM booktry WHERE booktitle = '$title'";
$result = $conn->query($sql_check_booktitle);

if ($result && $result->num_rows == 0) {
    $sql = "INSERT INTO booktry (booktitle, bookauthor, bookpublished, bookquantity, genre, bookentry) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sssiss", $title, $author, $published, $quantity, $genre, $bookentry);

    if ($stmt->execute()) {
        echo "success"; 
    } else {
        echo "Execute failed: " . $stmt->error;
    }
    $stmt->close();
} else {
    alert(" The Book is already in database, Update the Quantity instead.");            // FIX THIS CHANGE THE ERROR HANDLER
}

$conn->close();
exit;

}

//update book

if($_SERVER["REQUEST_METHOD"] === "POST"){
$id = $_POST['id'];
$title = $_POST['bookTitle'];
$author = $_POST['bookAuthor'];
$published = $_POST['bookpublished'];
$quantity = $_POST['bookquantity'];
$genre = $_POST['genre'];

$sql = "UPDATE booktry SET booktitle=?, bookauthor=?, bookpublished=?, bookquantity=?, genre=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssisi", $title, $author, $published, $quantity, $genre, $id);

if ($stmt->execute()) {
    echo "Book updated successfully.";
} else {
    echo "Update failed: " . $stmt->error;
}

$stmt->close();
$conn->close();
exit;
}


// table pagination
if($_SERVER["REQUEST_METHOD"] === "POST"){

header('Content-Type: application/json; charset=UTF-8');

function safeAttr($value) {
    return htmlspecialchars(trim(str_replace(["\n", "\r"], '', $value)), ENT_QUOTES);
}

// Pagination 
$limit = 10; 
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$page = max($page, 1); 
$offset = ($page - 1) * $limit;


$totalQuery = $conn->query("SELECT COUNT(*) AS total FROM booktry");
$totalRow = $totalQuery->fetch_assoc();
$totalBooks = $totalRow['total'];
$totalPages = ceil($totalBooks / $limit);


$sql = "SELECT * FROM booktry ORDER BY id DESC LIMIT $offset, $limit";
$result = $conn->query($sql);


$bookRows = "";
while ($row = $result->fetch_assoc()) {
    $id = $row['id'];
    $title = safeAttr($row['booktitle']);
    $author = safeAttr($row['bookauthor']);
    $published = safeAttr($row['bookpublished']);
    $quantity = safeAttr($row['bookquantity']);
    $genre = safeAttr($row['genre']);
    $entry = safeAttr($row['bookentry']);

    $bookRows .= "
    <tr id='book-row-{$id}'>
        <td>{$id}</td>
        <td>{$title}</td>
        <td>{$author}</td>
        <td>{$published}</td>
        <td>{$quantity}</td>
        <td>{$genre}</td>
        <td>{$entry}</td>
        <td>
            <a href='#' class='btn btn-primary btn-sm update-btn'
               data-id='{$id}'
               data-title=\"{$title}\"
               data-author=\"{$author}\"
               data-published=\"{$published}\"
               data-quantity=\"{$quantity}\"
               data-genre=\"{$genre}\">Update</a>
            <a href='#' class='btn btn-danger btn-sm' onclick='deleteBook(\"{$id}\")'>Delete</a>
        </td>
    </tr>
    ";
}

// Return JSON
echo json_encode([
    'books' => $bookRows,
    'totalPages' => $totalPages
]);}
?>  


