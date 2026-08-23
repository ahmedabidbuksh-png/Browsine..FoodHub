// ================= BOOK DATA =================

const books = [
    {
        id: 1,
        title: "The Silent Ocean",
        author: "James Wilson",
        category: "fiction",
        icon: "fa-water"
    },
    {
        id: 2,
        title: "The World of Science",
        author: "Dr. Robert Smith",
        category: "science",
        icon: "fa-atom"
    },
    {
        id: 3,
        title: "Ancient Civilizations",
        author: "Michael Brown",
        category: "history",
        icon: "fa-landmark"
    },
    {
        id: 4,
        title: "Future Technology",
        author: "Alex Johnson",
        category: "technology",
        icon: "fa-microchip"
    },
    {
        id: 5,
        title: "The Last Kingdom",
        author: "Daniel Moore",
        category: "fiction",
        icon: "fa-crown"
    },
    {
        id: 6,
        title: "Secrets of Space",
        author: "Emma Davis",
        category: "science",
        icon: "fa-rocket"
    }
];


// ================= BORROWED BOOKS =================

let borrowedBooks =
    JSON.parse(localStorage.getItem("bookNestBooks")) || [];


// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    updateBorrowedBooks();

    updateBorrowCount();

    setupSearch();

});


// ================= SEARCH =================

function setupSearch() {

    const searchInput =
        document.getElementById("bookSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", function () {

        const searchText =
            this.value.toLowerCase().trim();

        const cards =
            document.querySelectorAll(".book-card");

        cards.forEach(function (card) {

            const name =
                card.dataset.name.toLowerCase();

            const category =
                card.dataset.category.toLowerCase();

            if (
                name.includes(searchText) ||
                category.includes(searchText)
            ) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    });

}


// ================= FILTER BOOKS =================

function filterBooks(category, button) {

    const cards =
        document.querySelectorAll(".book-card");

    const buttons =
        document.querySelectorAll(
            ".filter-buttons button"
        );


    // Update active button

    buttons.forEach(function (btn) {

        btn.classList.remove("active");

    });


    if (button) {

        button.classList.add("active");

    }


    // Filter cards

    cards.forEach(function (card) {

        const cardCategory =
            card.dataset.category;

        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });


    // Scroll to books section

    const booksSection =
        document.getElementById("books");

    if (booksSection) {

        booksSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ================= BORROW BOOK =================

function borrowBook(bookId) {

    const book =
        books.find(function (item) {

            return item.id === bookId;

        });


    if (!book) {
        return;
    }


    // Check if already borrowed

    const alreadyBorrowed =
        borrowedBooks.some(function (item) {

            return item.id === bookId;

        });


    if (alreadyBorrowed) {

        showMessage(
            "You already borrowed this book."
        );

        return;
    }


    borrowedBooks.push(book);


    saveBorrowedBooks();

    updateBorrowedBooks();

    updateBorrowCount();


    showMessage(
        '"' + book.title + '" added to My Books!"
    );

}


// ================= SAVE LOCAL STORAGE =================

function saveBorrowedBooks() {

    localStorage.setItem(
        "bookNestBooks",
        JSON.stringify(borrowedBooks)
    );

}


// ================= UPDATE COUNT =================

function updateBorrowCount() {

    const count =
        document.getElementById("borrowCount");

    const text =
        document.getElementById("borrowText");


    if (count) {

        count.textContent =
            borrowedBooks.length;

    }


    if (text) {

        text.textContent =
            borrowedBooks.length +
            (
                borrowedBooks.length === 1
                    ? " book"
                    : " books"
            );

    }

}


// ================= UPDATE BORROWED BOOKS =================

function updateBorrowedBooks() {

    const container =
        document.getElementById("borrowItems");


    if (!container) {
        return;
    }


    if (borrowedBooks.length === 0) {

        container.innerHTML = `

            <div class="empty-borrow">

                <i class="fa-solid fa-book-open"></i>

                <h3>No books borrowed</h3>

                <p>
                    Choose a book from the collection.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    borrowedBooks.forEach(function (book) {

        const item =
            document.createElement("div");

        item.className = "borrow-item";


        item.innerHTML = `

            <div class="borrow-item-cover">

                <i class="fa-solid ${book.icon}"></i>

            </div>


            <div class="borrow-item-info">

                <h4>
                    ${escapeHTML(book.title)}
                </h4>

                <p>
                    ${escapeHTML(book.author)}
                </p>

            </div>


            <button
                class="return-btn"
                onclick="returnBook(${book.id})">

                <i class="fa-solid fa-rotate-left"></i>
                Return

            </button>

        `;


        container.appendChild(item);

    });

}


// ================= RETURN BOOK =================

function returnBook(bookId) {

    const book =
        borrowedBooks.find(function (item) {

            return item.id === bookId;

        });


    borrowedBooks =
        borrowedBooks.filter(function (item) {

            return item.id !== bookId;

        });


    saveBorrowedBooks();

    updateBorrowedBooks();

    updateBorrowCount();


    if (book) {

        showMessage(
            '"' + book.title + '" returned successfully!"
        );

    }

}


// ================= CLEAR ALL =================

function clearBorrowedBooks() {

    if (borrowedBooks.length === 0) {

        showMessage(
            "There are no borrowed books."
        );

        return;
    }


    const confirmClear =
        confirm(
            "Are you sure you want to return all books?"
        );


    if (!confirmClear) {
        return;
    }


    borrowedBooks = [];


    saveBorrowedBooks();

    updateBorrowedBooks();

    updateBorrowCount();


    showMessage(
        "All borrowed books have been returned."
    );

}


// ================= OPEN MY BOOKS =================

function openBorrowList() {

    const panel =
        document.getElementById("borrowPanel");

    const overlay =
        document.getElementById("borrowOverlay");


    if (panel) {

        panel.classList.add("show");

    }


    if (overlay) {

        overlay.classList.add("show");

    }


    document.body.style.overflow =
        "hidden";

}


// ================= CLOSE MY BOOKS =================

function closeBorrowList() {

    const panel =
        document.getElementById("borrowPanel");

    const overlay =
        document.getElementById("borrowOverlay");


    if (panel) {

        panel.classList.remove("show");

    }


    if (overlay) {

        overlay.classList.remove("show");

    }


    document.body.style.overflow =
        "";

}


// ================= MOBILE MENU =================

function toggleMenu() {

    const menu =
        document.getElementById("navMenu");


    if (menu) {

        menu.classList.toggle("open");

    }

}


// ================= CLOSE MOBILE MENU =================

document.addEventListener(
    "click",
    function (event) {

        const menu =
            document.getElementById("navMenu");

        const toggle =
            document.querySelector(".menu-toggle");


        if (
            menu &&
            menu.classList.contains("open") &&
            !menu.contains(event.target) &&
            !toggle.contains(event.target)
        ) {

            menu.classList.remove("open");

        }

    }
);


// ================= NOTIFICATION =================

function showMessage(message) {

    const notification =
        document.createElement("div");


    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.right =
        "25px";

    notification.style.zIndex =
        "5000";

    notification.style.background =
        "#252b48";

    notification.style.color =
        "#ffffff";

    notification.style.padding =
        "13px 18px";

    notification.style.borderRadius =
        "8px";

    notification.style.fontSize =
        "11px";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.2)";


    document.body.appendChild(
        notification
    );


    setTimeout(function () {

        notification.remove();

    }, 2500);

}


// ================= HTML SECURITY =================

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// ================= ESC KEY =================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeBorrowList();

        }

    }
);