<?php
session_start();
include 'connect.php';

// Send data to database -- TABLE NAME: Borrowrequest_logs
if (isset($_POST['form-name'], $_POST['form-yearandcourse'], $_POST['form-studentid'])) {
    // process form

    $user_id = $_SESSION['user_id'];
    $user_name = $_POST['form-name'];
    $user_course = $_POST['form-yearandcourse'];
    $user_number = $_POST['form-studentid'];
    $user_contactnum = $_POST['form-contact'];
    $borrow_booktitle = $_POST['form-booktitle'];
    $borrow_time = $_POST['form-borrowbookdate'];
    $borrow_return = $_POST['form-bookreturn'];

    $check_quantity = "SELECT bookquantity FROM booktry WHERE booktitle = '$borrow_booktitle'";
    $result = $conn->query($check_quantity);

    if ($result && $result->num_rows >= 1) {
        $row = $result->fetch_assoc();
        $quantity = $row['bookquantity'];

        if ($quantity >= 2) {
            $post_borrow_details = "INSERT INTO borrowrequest_logs (borrow_user_id, borrow_name, borrow_course, borrow_studentid, borrow_contact, borrow_booktitle, borrow_date, borrow_return_date)
                                VALUES ('$user_id', '$user_name', '$user_course', '$user_number', '$user_contactnum', '$borrow_booktitle', '$borrow_time', '$borrow_return')";
            $borrower_details = $conn->query($post_borrow_details);

            $update_quantity = "UPDATE booktry SET bookquantity = bookquantity - 1 WHERE booktitle = '$borrow_booktitle'";
            $conn->query($update_quantity);

            echo "BOOK BORROW SUCCESS"; //CHANGE THIS 
            
        } else {
            echo "BOOK CAN ONLY BORROW IF 2 or MORE QUANTITY";          // CHANGE THIS ERROR HANDLER
        }
    }
    else {
        echo "BOOK NOT ENOUGH COPY";
    }
}



// Get data from database for auto fill ng form
if (isset($_SESSION['user_id']) && isset($_SESSION['book_title'])) {
    $user_id = $_SESSION['user_id'];
    $book_title = $_SESSION['book_title'];

    $get_userdata = "SELECT fullname, yrcourse, studentid, contact FROM users WHERE id = $user_id";
    $result = $conn->query($get_userdata);
    $user_data = $result->fetch_assoc();

    $get_booktitle = "SELECT booktitle FROM booktry WHERE booktitle = '$book_title'";
    $result_book = $conn->query($get_booktitle);
    $book_data = $result_book->fetch_assoc();

    $formitems = [
        'user' => $user_data,
        'book' => $book_data
    ];
    echo json_encode($formitems);
}
?>