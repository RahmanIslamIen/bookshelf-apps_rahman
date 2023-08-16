document.addEventListener("DOMContentLoaded", function () {
  const inputBookTitle = document.getElementById("inputBookTitle");
  const inputBookAuthor = document.getElementById("inputBookAuthor");
  const inputBookYear = document.getElementById("inputBookYear");
  const inputBookIsComplete = document.getElementById("inputBookIsComplete");
  const bookSubmitButton = document.getElementById("bookSubmit");

  bookSubmitButton.addEventListener("click", function (event) {
    event.preventDefault();

    const id = +new Date();
    const title = inputBookTitle.value;
    const author = inputBookAuthor.value;
    const year = inputBookYear.value;
    const isComplete = inputBookIsComplete.checked;

    const book = {
      id,
      title,
      author,
      year: parseInt(year),
      isComplete,
    };

    if (isComplete) {
      addBookToStorage("completeBooks", book);
    } else {
      addBookToStorage("incompleteBooks", book);
    }

    clearForm();
    renderBookshelf();
  });

  function addBookToStorage(storageKey, book) {
    let books = getBooksFromStorage(storageKey);
    books.push(book);
    localStorage.setItem(storageKey, JSON.stringify(books));
  }

  function getBooksFromStorage(storageKey) {
    const books = localStorage.getItem(storageKey);
    if (books) {
      return JSON.parse(books);
    }
    return [];
  }

  function clearForm() {
    inputBookTitle.value = "";
    inputBookAuthor.value = "";
    inputBookYear.value = "";
    inputBookIsComplete.checked = false;
  }

  function renderBookshelf() {
    renderIncompleteBookshelf();
    renderCompleteBookshelf();
  }

  function renderIncompleteBookshelf() {
    const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    const incompleteBooks = getBooksFromStorage("incompleteBooks");

    incompleteBookshelfList.innerHTML = "";
    for (const book of incompleteBooks) {
      const bookElement = createBookElement(book, false);
      incompleteBookshelfList.appendChild(bookElement);
    }
  }

  function renderCompleteBookshelf() {
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );
    const completeBooks = getBooksFromStorage("completeBooks");

    completeBookshelfList.innerHTML = "";
    for (const book of completeBooks) {
      const bookElement = createBookElement(book, true);
      completeBookshelfList.appendChild(bookElement);
    }
  }

  function createBookElement(book, isComplete) {
    const bookElement = document.createElement("article");
    bookElement.classList.add("book_item");

    const titleElement = document.createElement("h3");
    titleElement.innerText = book.title;

    const authorElement = document.createElement("p");
    authorElement.innerText = `Penulis: ${book.author}`;

    const yearElement = document.createElement("p");
    yearElement.innerText = `Tahun: ${book.year}`;

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add(isComplete ? "green" : "red");
    toggleButton.innerText = isComplete
      ? "Belum selesai di Baca"
      : "Selesai dibaca";

    toggleButton.addEventListener("click", function () {
      toggleBookStatus(book);
      renderBookshelf();
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus buku";

    deleteButton.addEventListener("click", function () {
      deleteBook(book, isComplete);
      renderBookshelf();
    });

    actionContainer.appendChild(toggleButton);
    actionContainer.appendChild(deleteButton);

    bookElement.appendChild(titleElement);
    bookElement.appendChild(authorElement);
    bookElement.appendChild(yearElement);
    bookElement.appendChild(actionContainer);

    return bookElement;
  }

  function toggleBookStatus(book) {
    if (book.isComplete) {
      book.isComplete = false;
      moveBookToStorage("completeBooks", "incompleteBooks", book);
    } else {
      book.isComplete = true;
      moveBookToStorage("incompleteBooks", "completeBooks", book);
    }
  }

  function moveBookToStorage(fromStorageKey, toStorageKey, book) {
    const fromBooks = getBooksFromStorage(fromStorageKey);
    const toBooks = getBooksFromStorage(toStorageKey);

    const updatedFromBooks = fromBooks.filter((b) => b.id !== book.id);
    const updatedToBooks = [...toBooks, book];

    localStorage.setItem(fromStorageKey, JSON.stringify(updatedFromBooks));
    localStorage.setItem(toStorageKey, JSON.stringify(updatedToBooks));
  }

  function deleteBook(book, isComplete) {
    const storageKey = isComplete ? "completeBooks" : "incompleteBooks";
    const books = getBooksFromStorage(storageKey);
    const updatedBooks = books.filter((b) => b.id !== book.id);
    localStorage.setItem(storageKey, JSON.stringify(updatedBooks));
  }

  const searchForm = document.getElementById("searchBook");
  const searchInput = document.getElementById("searchBookTitle");
  const searchButton = document.getElementById("searchSubmit");

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = searchInput.value.toLowerCase();
    const incompleteBooks = getBooksFromStorage("incompleteBooks");
    const completeBooks = getBooksFromStorage("completeBooks");

    const filteredIncompleteBooks = filterBooksByTitle(
      incompleteBooks,
      searchTerm
    );
    const filteredCompleteBooks = filterBooksByTitle(completeBooks, searchTerm);

    renderFilteredBookshelf(filteredIncompleteBooks, filteredCompleteBooks);
  });

  function filterBooksByTitle(books, searchTerm) {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
  }

  function renderFilteredBookshelf(
    filteredIncompleteBooks,
    filteredCompleteBooks
  ) {
    const incompleteBookshelfList = document.getElementById(
      "incompleteBookshelfList"
    );
    const completeBookshelfList = document.getElementById(
      "completeBookshelfList"
    );

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of filteredIncompleteBooks) {
      const bookElement = createBookElement(book, false);
      incompleteBookshelfList.appendChild(bookElement);
    }

    for (const book of filteredCompleteBooks) {
      const bookElement = createBookElement(book, true);
      completeBookshelfList.appendChild(bookElement);
    }
  }

  renderBookshelf();
});
