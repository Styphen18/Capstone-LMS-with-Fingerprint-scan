// Listen for form submission
document.getElementById("borrowForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Stop default form behavior

    const formData = new FormData(this);

    fetch("../backend/borrowbooks.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log("Server Response:", data);

        if (data.includes("BOOK BORROW SUCCESS")) {
            const modal = new bootstrap.Modal(document.getElementById('requestSuccessModal'));
            modal.show();

        } else {
            alert("Failed to borrow book:\n" + data);
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("An unexpected error occurred.");
    });
});
function backtohome() {
    
    window.location.href = "../pages/homepage01.html";
}
function autofillform(){
    fetch("../backend/user_type.php")
    .then(response => response.json())
    .then(data => {
        // Borrow book date
        const today = new Date();
        const borrowdate = new Date().toISOString().split('T')[0];
        // Return book date
        const returnDateObj = new Date(today);

        if (data.usertype == "student") {
            returnDateObj.setDate(today.getDate() + 2);
        } else {
            returnDateObj.setDate(today.getDate() + 3);
        }
        const returndate = returnDateObj.toISOString().split('T')[0];
    

        fetch("../backend/borrowbooks.php")
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                document.getElementById("form-name").value = data.user.fullname || "";
                document.getElementById("form-yearandcourse").value = data.user.yrcourse || "";
                document.getElementById("form-studentid").value = data.user.studentid || "";
                document.getElementById("form-contact").value = data.user.contact || "";
                document.getElementById("form-borrowbookdate").value = borrowdate;
                document.getElementById("form-bookreturn").value = returndate;
            }
            if (data.book) {
                document.getElementById("form-booktitle").value = data.book.booktitle || "";
            }
        });
    })
}

function autofillbooktitle(){
    fetch("../backend/borrowbooks.php")
        .then(response => response.json())
        .then(data => {
            document.getElementById("form-booktitle").value = data.booktitle;
        });
}

function DOMContentAutoLoad(){
    autofillform();
    autofillbooktitle();
}
document.addEventListener("DOMContentLoaded", DOMContentAutoLoad);

