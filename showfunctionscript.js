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
  }
}


function loadBooks(page = 1) {
  fetch(`../backend/crud.php?page=${page}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('bookTableBody').innerHTML = data.books;
      setupPagination(data.totalPages, page);
    })
    .catch(error => {
      document.getElementById('bookTableBody').innerHTML = "Error loading book list.";
      console.error("Error loading crud.php:", error);
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

  fetch('../backend/update_book.php', {
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

  fetch('../backend/add_book.php', {
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
  if (!confirm("Are you sure you want to delete this book?")) return;

  fetch(`../backend/delete_book.php?id=${bookId}`)
    .then(response => response.text())
    .then(data => {
      console.log(data);
      showPanel('books'); // Refresh the list after delete
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to delete the book.');
    });
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


// pending request
/*function getrequesttotal() {
  fetch('../backend/pending_total.php')
    .then(response => response.text())
    .then(total_pending => {
      document.querySelector('.num_req').textContent = total_pending;
    })
    .catch(error => {
      document.querySelector('.num_req').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
}*/
window.onload = function() {
 // getrequesttotal();
  getdashboard();
};
