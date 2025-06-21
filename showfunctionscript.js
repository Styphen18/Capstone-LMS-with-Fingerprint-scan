/**pagination */
let currentPage = 1;

function showPanel(panelId) {
  // Hide all panels
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('active');
  });
  // Show the selected panel
  document.getElementById(panelId).classList.add('active');

  // Remove active class from all buttons
  document.querySelectorAll('.sidebar button').forEach(button => {
    button.classList.remove('active-btn');
  });


  const sidebarButtons = {
    'dashboard': 'Dashboard_btn',
    'borrowPanel': 'Borrow-btn',
    'returnPanel': 'Return_btn', 
    'employee': 'Employee_btn',
    'books': 'Books_btn',       
    'logsPanel': 'logs-btn'
  };

  const buttonId = sidebarButtons[panelId];
  if (buttonId) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.classList.add('active-btn');
    }
  }

  if (panelId === 'books') {
  loadBooks(currentPage);
} else if (panelId === 'employee') {
  loadUsers(currentPage);
}
}


function loadBooks(page = 1) {
  fetch(`../backend/book_management.php?page=${page}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('bookTableBody').innerHTML = data.books;
      setupPagination(data.totalPages, page);
    })
    .catch(error => {
      document.getElementById('bookTableBody').innerHTML = "Error loading book list.";
      console.error("Error loading book_management.php:", error);
    });
}


function setupPagination(totalPages, current) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === current ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      loadBooks(i);
    });
    pagination.appendChild(li);
  }
}
/*end of pagination*/

  // -------//
  function addBook() {
    dialogbox("Add Book button clicked!");
}

function openModal() {
  document.getElementById('addBookForm').reset();
  document.getElementById('bookId').value = ""; // Clear hidden ID field

  document.querySelector('#myModal h2').textContent = "Add Book";
  document.querySelector('#addBookForm button[type="submit"]').textContent = "Add";
  document.getElementById('addBookForm').onsubmit = submitBookForm;

  document.getElementById("myModal").style.display = "flex"; 
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
  document.getElementById('addBookForm').reset();
  document.getElementById('bookId').value = ""; // Clear ID
  document.getElementById('addBookForm').onsubmit = submitBookForm;
}

//for updating books
function openUpdateModal(id, title, author, published, quantity, genre) {
  document.getElementById('bookId').value = id;
  document.getElementById('bookTitle').value = title;
  document.getElementById('bookAuthor').value = author;
  document.getElementById('bookpublished').value = published;
  document.getElementById('quantity').value = quantity;
  document.getElementById('genre').value = genre;

  document.querySelector('#myModal h2').textContent = "Update Book";
  document.querySelector('#addBookForm button[type="submit"]').textContent = "Update";
  document.getElementById('addBookForm').onsubmit = submitUpdateForm;

  document.getElementById('myModal').style.display = "flex";
}

function submitUpdateForm(event) {
  event.preventDefault();

  const id = document.getElementById('bookId').value;
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const published = document.getElementById('bookpublished').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const genre = document.getElementById('genre').value.trim();

  fetch('../backend/book_management.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 
      'id=' + encodeURIComponent(id) +
      '&bookTitle=' + encodeURIComponent(title) +
      '&bookAuthor=' + encodeURIComponent(author) +
      '&bookpublished=' + encodeURIComponent(published) +
      '&bookquantity=' + encodeURIComponent(quantity) +
      '&genre=' + encodeURIComponent(genre) 
  })
  .then(response => response.text())
  .then(data => {
      console.log(data);
      closeModal();
      document.getElementById("addBookForm").reset();
      showPanel('books');
  })
  .catch(error => alert("Error: " + error));
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('update-btn')) {
    e.preventDefault();

    const btn = e.target;
    document.getElementById('bookId').value = btn.dataset.id;
    document.getElementById('bookTitle').value = btn.dataset.title;
    document.getElementById('bookAuthor').value = btn.dataset.author;
    document.getElementById('bookpublished').value = btn.dataset.published;
    document.getElementById('quantity').value = btn.dataset.quantity;
    document.getElementById('genre').value = btn.dataset.genre;

    document.querySelector('#myModal h2').textContent = "Update Book";
    document.querySelector('#addBookForm button[type="submit"]').textContent = "Update";
    document.getElementById('addBookForm').onsubmit = submitUpdateForm;
    document.getElementById('myModal').style.display = "flex";
  }
});
//end of update book

//save book
function submitBookForm(event) {
  event.preventDefault(); // Prevent page refresh

  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const published = document.getElementById('bookpublished').value.trim();
  const quantity = document.getElementById('quantity').value.trim();
  const genre = document.getElementById('genre').value.trim();
  const bookentry = new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (!title || !author || !published || !quantity || !genre) {
    alert("Please fill in all fields.");
    return;
  }

  fetch('../backend/book_management.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 
      'bookTitle=' + encodeURIComponent(title) +
      '&bookAuthor=' + encodeURIComponent(author) +
      '&bookpublished=' + encodeURIComponent(published) +
      '&bookquantity=' + encodeURIComponent(quantity) +
      '&genre=' + encodeURIComponent(genre) +
      '&bookentry=' + encodeURIComponent(bookentry)
  })
  .then(response => response.text())
  .then(data => {
      console.log(data); // Shows success or error message
      closeModal(); // Close the modal
      document.getElementById("addBookForm").reset(); 
      showPanel('books'); 
  })
  .catch(error => {
      alert("Error: " + error);
  });
}

// Delete
function deleteBook(bookId) {
  const dialog = document.getElementById('confirmDialog');
  dialog.style.display = 'block';

  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  yesBtn.onclick = null;
  noBtn.onclick = null;

  yesBtn.onclick = () => {
    dialog.style.display = 'none';

    fetch(`../backend/book_management.php?id=${bookId}`)
      .then(response => response.text())
      .then(data => {
        console.log(data);
        showPanel('books'); 
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete the book.');
      });
  };

  noBtn.onclick = () => {
    dialog.style.display = 'none';
  };
}
   


// DASHBOARD
function getdashboard() {
  fetch('../backend/total_book.php')
    .then(response => response.text())
    .then(total => {
      document.querySelector('.num_books').textContent = total;
    })
    .catch(error => {
      document.querySelector('.num_books').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
     fetch('../backend/pending_total.php')
    .then(response => response.text())
    .then(total_pending => {
      document.querySelector('.num_req').textContent = total_pending;
    })
    .catch(error => {
      document.querySelector('.num_req').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
     fetch('../backend/total_approved.php')
    .then(response => response.text())
    .then(total_approved => {
      document.querySelector('.num_approve').textContent = total_approved;
    })
    .catch(error => {
      document.querySelector('.num_approve').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
}
window.onload = function() {
 // getrequesttotal();
  getdashboard();
};


//user
function loadUsers(page = 1) {
  fetch(`../backend/account_management.php?page=${page}`) 
    .then(response => response.json())
    .then(data => {
      document.getElementById('userTableBody').innerHTML = data.users;
      setupUserPagination(data.totalPages, page);
    })
    .catch(error => {
      document.getElementById('userTableBody').innerHTML = "Error loading user list.";
      console.error("Error loading account_management.php:", error);
    });
}

//pagination for user
function setupUserPagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination-user');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i === currentPage) li.classList.add('active');

    const a = document.createElement('a');
    a.classList.add('page-link');
    a.href = '#';
    a.textContent = i;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      loadUsers(i);
    });

    li.appendChild(a);
    pagination.appendChild(li);
  }
}

// userrrrrrrrrrrrrrrrrrrrrrrrrrrr

function submitAddAccount(event) {
  event.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const yrcourse = document.getElementById('yrcourse').value.trim();
  const studentid = document.getElementById('studentid').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!fullname || !yrcourse || !studentid || !contact || !email || !password) {
    alert("Please fill in all required fields.");
    return;
  }

  fetch('../backend/account_management.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 
      'fullname=' + encodeURIComponent(fullname) +
      '&yrcourse=' + encodeURIComponent(yrcourse) +
      '&studentid=' + encodeURIComponent(studentid) +
      '&contact=' + encodeURIComponent(contact) +
      '&email=' + encodeURIComponent(email) +
      '&password=' + encodeURIComponent(password)
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    closeUserModal();
    document.getElementById("accForm").reset();
    showPanel('employee');
  })
  .catch(error => {
    alert("Error: " + error);
  });
}

function openUpdateModaluser(id, name, department, studentId, contact, email) {
  document.getElementById('userId').value = id;
  document.getElementById('fullname').value = name;
  document.getElementById('yrcourse').value = department;
  document.getElementById('studentid').value = studentId;
  document.getElementById('contact').value = contact;
  document.getElementById('email').value = email;
  document.getElementById('password').value = ""; // always empty

  document.querySelector('#userModal h2').textContent = "Update Account";
  document.querySelector('#accForm button[type="submit"]').textContent = "Update";
  document.getElementById('accForm').onsubmit = submitUpdateAccount;

  document.getElementById('userModal').style.display = "flex";
}

function submitUpdateAccount(event) {
  event.preventDefault();

  const id = document.getElementById('userId').value;
  const fullname = document.getElementById('fullname').value.trim();
  const yrcourse = document.getElementById('yrcourse').value.trim();
  const studentid = document.getElementById('studentid').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const body = 
    'id=' + encodeURIComponent(id) +
    '&fullname=' + encodeURIComponent(fullname) +
    '&yrcourse=' + encodeURIComponent(yrcourse) +
    '&studentid=' + encodeURIComponent(studentid) +
    '&contact=' + encodeURIComponent(contact) +
    '&email=' + encodeURIComponent(email) +
    '&password=' + encodeURIComponent(password);

  fetch('../backend/account_management.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    closeUserModal();
    document.getElementById("accForm").reset();
    showPanel('employee');
  })
  .catch(error => alert("Error: " + error));
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('update-btn-user')) {
    e.preventDefault();

    const btn = e.target;
    openUpdateModaluser(
  btn.dataset.id,
  btn.dataset.name,
  btn.dataset.department,
  btn.dataset.student_id,
  btn.dataset.contact,
  btn.dataset.email
);
  }
});

// Delete user
function deletuser(userId) {
  const dialog = document.getElementById('userdialog');
  dialog.style.display = 'block';

  const yesBtn = document.getElementById('users-yes'); 
  const noBtn = document.getElementById('users-no');   

  yesBtn.onclick = null;
  noBtn.onclick = null;

  yesBtn.onclick = (e) => {
    e.preventDefault(); 
    dialog.style.display = 'none';

    fetch(`../backend/account_management.php?id=${userId}`)
      .then(response => response.text())
      .then(data => {
        console.log(data);
        showPanel('employee'); // Reload the user table
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete the account.');
      });
  };

  noBtn.onclick = () => {
    dialog.style.display = 'none';
  };
}


function openUserModal() {
  document.getElementById('accForm').reset();
  document.getElementById('userId').value = "";

  document.querySelector('#userModal h2').textContent = "Add Account";
  document.querySelector('#accForm button[type="submit"]').textContent = "Add";
  document.getElementById('accForm').onsubmit = submitAddAccount;

  document.getElementById("userModal").style.display = "flex";
}

function closeUserModal() {
  document.getElementById('userModal').style.display = "none";
  document.getElementById('accForm').reset();
  document.getElementById('userId').value = "";
  document.getElementById('accForm').onsubmit = submitAddAccount;
}

