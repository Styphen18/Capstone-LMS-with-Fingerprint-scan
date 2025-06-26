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
    'logsPanel': 'logs-btn',
    'DeleteBook': 'Del-btn'
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
  } else if (panelId === 'borrowPanel'){
    loadBorrowingLogs(currentPage);
  } else if (panelId === 'returnPanel'){
    loadBorrowingLogs_return(currentPage)
  } else if (panelId === 'logsPanel') {
    loadBorrowingLogs_logs(currentPage)
  }
  else if (panelId === 'DeleteBook') {
    loadBorrowingLogs_logs(currentPage)
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
  const pagination = document.getElementById('bookpagination');
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

  function addBook() {
    dialogbox("Add Book button clicked!");
}

// =============================================== MODAL FOR BOOK  
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

// =============================================== UPDATE FUNCTION FOR BOOKS 
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
 

// =============================================== SAVE FUNCTION FOR BOOK 
function submitBookForm(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const accNo = document.getElementById('accNo').value.trim();
  const author = document.getElementById('author').value.trim();
  const title = document.getElementById('title').value.trim();
  const isbn = document.getElementById('isbn').value.trim();
  const callNo = document.getElementById('callNo').value.trim();
  const classNo = document.getElementById('classNo').value.trim();
  const cutterNo = document.getElementById('cutterNo').value.trim();
  const year = document.getElementById('year').value.trim();
  const copyNo = document.getElementById('copyNo').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const pages = document.getElementById('pages').value.trim();
  const publisher = document.getElementById('publisher').value.trim();
  const place = document.getElementById('place').value.trim();
  const bookentry = new Date().toISOString().slice(0, 19).replace('T', ' ');

  // Basic validation
  if (!accNo || !author || !title || !isbn || !year || !copyNo || !pages || !publisher || !place) {
    alert("Please fill in all required fields.");
    return;
  }

  const formData =
    'accNo=' + encodeURIComponent(accNo) +
    '&bookAuthor=' + encodeURIComponent(author) +
    '&bookTitle=' + encodeURIComponent(title) +
    '&isbn=' + encodeURIComponent(isbn) +
    '&callNo=' + encodeURIComponent(callNo) +
    '&classNo=' + encodeURIComponent(classNo) +
    '&cutterNo=' + encodeURIComponent(cutterNo) +
    '&bookpublished=' + encodeURIComponent(year) +
    '&bookquantity=' + encodeURIComponent(copyNo) +
    '&subject_heading=' + encodeURIComponent(subject) +
    '&pages=' + encodeURIComponent(pages) +
    '&publisher=' + encodeURIComponent(publisher) +
    '&place_of_publication=' + encodeURIComponent(place);
  fetch('../backend/add_book.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    console.log(data); // Debugging log; remove in production
    closeModal(); // Close the modal
    document.getElementById("addBookForm").reset(); 
    showPanel('books'); // Refresh or re-display the book list
  })
  .catch(error => {
    alert("Error: " + error);
  });
}

// =============================================== DELETE FUNCTION FOR BOOK 
// Delete
function loadDeletedBooks() {
  fetch('../backend/load_deleted_books.php')
    .then(res => res.text())
    .then(html => {
      document.getElementById('book_deletion').innerHTML = html;
    });
}

// Call this once on page load too
loadDeletedBooks();

function deleteBook(bookId) {
  const dialog = document.getElementById('confirmDialog');
  dialog.style.display = 'block';

  const yesBtn = document.getElementById('confirmYes');
  const noBtn = document.getElementById('confirmNo');

  yesBtn.onclick = null;
  noBtn.onclick = null;

  yesBtn.onclick = (e) => {
    e.preventDefault();

    const details = document.getElementById('details').value.trim();
    if (details === '') {
      alert('Please select a return issue (e.g. damage, lost, replace).');
      return;
    }

    fetch(`../backend/report_issue.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `book_id=${encodeURIComponent(bookId)}&issue_type=${encodeURIComponent(details)}`
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);

      // Hide dialog and reset
      dialog.style.display = 'none';
      document.getElementById('details').value = '';

      // ✅ Remove the row from the table
      const row = document.getElementById(`user-row-${bookId}`);
      if (row) row.remove();

      alert('Issue recorded and row deleted successfully.');

      // ✅ Reload the deleted books list (see next step)
      loadDeletedBooks();
    });
  };

  noBtn.onclick = () => {
    dialog.style.display = 'none';
    document.getElementById('details').value = '';
  };
}

//close dialog delete
function closeDialog() {
  const dialog = document.getElementById('confirmDialog');
  dialog.style.display = 'none';
}
// =============================================== DASHBOARD okay okay
function getbooktotal() {
  fetch('../backend/dashboard/total_book.php')
    .then(response => response.json())
    .then(data => {
      document.querySelector('.num_books').textContent = data.total;
    })
    .catch(error => {
      document.querySelector('.num_books').textContent = "Error";
      console.error("Fetch error:", error);
    });
}

function gettotalbook_pending() {
  fetch('../backend/dashboard/total_book_pending.php')
    .then(response => response.text())
    .then(pending => {
      document.querySelector('.num_request').textContent = pending;
    })
    .catch(error => {
      document.querySelector('.num_request').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
}

function gettotalbook_approved() {
  fetch('../backend/dashboard/total_book_approved.php')
    .then(response => response.text())
    .then(approved => {
      document.querySelector('.num_approved').textContent = approved;
    })
    .catch(error => {
      document.querySelector('.num_approved').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
}

function gettotal_users() {
  fetch('../backend/dashboard/total_user.php')
    .then(response => response.text())
    .then(users => {
      document.querySelector('.num_user').textContent = users;
    })
    .catch(error => {
      document.querySelector('.num_user').textContent = "Error loading";
      console.error("Fetch error:", error);
    });
}
 function piechart() {
  fetch('../backend/get_piechart.php')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById('bookStatusChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Returned', 'Unreturned', 'Issue'],
          datasets: [{
            data: [data.returned, data.unreturned, data.issue],
            backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Books by Status'
            }
          }
        }
      });
    })
    .catch(err => console.error('Chart data fetch error:', err));
}

window.addEventListener('DOMContentLoaded', piechart);



// =========================================== end of dashboard

window.onload = function() {
  getbooktotal();
  gettotalbook_pending();
  gettotalbook_approved();
  gettotal_users();
  loadDeletedBooks();
  piechart();
};
