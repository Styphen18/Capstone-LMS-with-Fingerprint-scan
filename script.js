function registerbtn() {
    
    window.location.href = "../login/register.html";
}
// sabi ni cha yan sa wrong email and password
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); 

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("../backend/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `signIn=true&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.text())
  .then(data => {
    if (data.includes("Incorrect password") || data.includes("User not found")) {
      document.getElementById("errorMsg").innerText = data;
    } else if (data.includes("Location")) {
     
      if (data.includes("admin.html")) {
        window.location.href = "../admin/admin.html";
      } else {
        window.location.href = "../pages/homepage01.html";
      }
    } else {
      document.getElementById("errorMsg").innerText = "Unexpected response.";
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("errorMsg").innerText = "Something went wrong. Please try again.";
  });
});

// ---------------- Voice Search ------------ 
function startVoiceSearch() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        let voicetypequery = event.results[0][0].transcript;
        
        document.getElementById('result').innerText = "Searching for: " + voicetypequery;
        fetchBooks(voicetypequery);
    };
    recognition.start();
}

function fetchBooks(voicetypequery) {
    fetch(`../backend/search.php?GETvoicesearch=${voicetypequery}`)
    .then(response => response.json())
    .then(data => {
        let bookList = document.getElementById("bookList");
        bookList.innerHTML = "";
        
        if (data.length > 0) {
            data.forEach(book => {
                let li = document.createElement("li");
                li.textContent = `${book.title} by ${book.author} [${book.category}] ${book.pub_year}`;

                const borrowBtn  = document.createElement("button");
                borrowBtn.textContent = "Borrow";
                borrowBtn.dataset.title = book.title;

                borrowBtn.addEventListener("click", () => {
                    handleBorrowClick(book.title);
                });
                li.appendChild(borrowBtn);
                bookList.appendChild(li);
                });

        } else {
            bookList.innerHTML = "<li>No books found</li>";
        }
    })
    .catch(error => console.error("Error:", error));
}

// -------- Text Search -------------
function textsearch() {
    const textsearchquery = document.getElementById("textsearch").value;  
    if (textsearchquery.trim() !== "") {
        fetchtextsearch(textsearchquery);    
    } else {
        document.getElementById("result").innerText = "Please enter a search term!";
    }
}

function fetchtextsearch(textsearchquery) {
    fetch(`../backend/search.php?GETtextsearch=${textsearchquery}`)
        .then(response => response.json())
        .then(fulltextbooks => {
            let textsearch_result = document.getElementById('textbookList');
            textsearch_result.innerHTML = ""; // Clear previous results

            if (fulltextbooks.length > 0) {
                fulltextbooks.forEach(textbook => {
                    const list = document.createElement('li');
                    list.textContent = `${textbook.text_title} by ${textbook.text_author} [${textbook.text_genre}] ${textbook.text_pubyear}`;

                    const borrowBtn = document.createElement("button");
                    borrowBtn.textContent = "Borrow";
                    borrowBtn.dataset.title = textbook.text_title;

                    borrowBtn.addEventListener("click", () => {
                        handleBorrowClick(textbook.text_title);
                    });
                    list.appendChild(borrowBtn);
                    textsearch_result.appendChild(list);
                });
                
            } else {
                textsearch_result.innerHTML = "<li>No books found</li>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// -------------- Borrow Handler -------------- 
function handleBorrowClick(selectedTitle) {
    fetch("../backend/get_booktitle.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `selected_book_title=${encodeURIComponent(selectedTitle)}`
    })
    .then(() => {
        return fetch("../backend/check_session.php");
    })
    .then(response => response.json())
    .then(data => {
        if (data.logged_in) {
            window.location.href = "../pages/book_borrow.html";
        } else {
            window.location.href = "../login/signin.html";
        }
    })
    .catch(error => {
        console.error("Borrow flow failed:", error);
        alert("Something went wrong.");
    });
}

 function togglePassword() {
        const pwd = document.getElementById("password");
        const icon = document.getElementById("eyeIcon");
  
        if (pwd.type === "password") {
          pwd.type = "text";
          icon.className = "bi bi-eye-fill";
        } else {
          pwd.type = "password";
          icon.className = "bi bi-eye-slash-fill";
        }
      }


// function fetchtextsearch(textsearchquery){

//     fetch(`../backend/search.php?GETtextsearch=${textsearchquery}`)
//     .then(response => response.json())
//     .then(fulltextbooks => {

//         let textsearch_result = document.getElementById('textbookList')
//         textsearch_result.innerHTML = "";

//         if(fulltextbooks.length > 0) {
//             fulltextbooks.forEach(textbook => {

//                 let list = document.createElement('li');
//                 list.textContent = `${textbook.text_title} by ${textbook.text_author} [${textbook.text_genre}] ${textbook.text_pubyear}`;
//                 textsearch_result.appendChild(list);
//                 // Create btn
//                 const create_borrowbtn = document.createElement("button");
//                 create_borrowbtn.textContent = "Borrow";                
//                 create_borrowbtn.id = "borrowbook-btn";                         
//                 document.body.appendChild(create_borrowbtn );

//                 // Set title book as data that can retrieveeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
//                 create_borrowbtn.setAttribute("data-title", textbook.text_title);

//                 create_borrowbtn.addEventListener("click", function () {
//                     const selectedTitle = this.getAttribute("data-title");

//                     fetch ("../backend/get_booktitle.php", {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/x-www-form-urlencoded"
//                         },
//                         body: `selected_book_title=${encodeURIComponent(selectedTitle)}`
//                     }) 
//                     .then (response => response.text())
//                     .then(() => {
//                         fetch("../backend/check_session.php")
//                         .then(response => response.json())
//                         .then(data => {
//                         if (data.logged_in) {
//                             window.location.href = "../pages/book_borrow.html";
//                         } else {
//                             window.location.href = "../login/signin.html";
//                         }
//                     })
//                     .catch(error => {
//                         console.error("Session check failed:", error);
//                         alert(error);
//                     });
//                 })
//                 .catch (error => {
//                     echo (error);
//                 });
//             });     
//         });
//         } else {
//             textsearch_result.innerHTML = "<li>No books found</li>";
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error); 
//     });
// }

