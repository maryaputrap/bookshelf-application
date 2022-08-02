const books = [];
const RENDER_EVENT = "render-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKS_DATA";

function generateId() {
  return +new Date();
}

function generateBooksObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function findBooks(booksId) {
  for (const booksItem of books) {
    if (booksItem.id === booksId) {
      return booksItem;
    }
  }
  return null;
}

function findBooksIndex(booksId) {
  for (const index in books) {
    if (books[index].id === booksId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function createBooks(booksObject) {
  const { id, title, author, year, isCompleted } = booksObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author: " + author;

  const numberYear = document.createElement("p");
  numberYear.innerText = "Publication Year: " + year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, numberYear);

  const container = document.createElement("div");
  container.classList.add("item");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");
    trashButton.addEventListener("click", function () {
      removeBook(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBooks() {
  const textBookTitle = document.getElementById("inputBookTitle").value;
  const textBookAuthor = document.getElementById("inputBookAuthor").value;
  const numberBookYear = document.getElementById("inputBookYear").value;
  const checkBox = document.getElementById("inputBookIsComplete");

  const generatedId = generateId();
  if (checkBox.checked == true) {
    const booksObject = generateBooksObject(
      generatedId,
      textBookTitle,
      textBookAuthor,
      numberBookYear,
      true
    );

    alert("Successfully Adding Readed Book Data");
    books.push(booksObject);
  } else {
    const booksObject = generateBooksObject(
      generatedId,
      textBookTitle,
      textBookAuthor,
      numberBookYear,
      false
    );

    alert("Successfully Adding Unread Book Data");
    books.push(booksObject);
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(booksId) {
  const bookTarget = findBooks(booksId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBook(booksId) {
  const bookTarget = findBooksIndex(booksId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(booksId) {
  const bookTarget = findBooks(booksId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBooks = document.getElementById("inputBuku");

  submitBooks.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBooksList = document.getElementById(
    "uncompletedBookshelfList"
  );
  const booksListCompleted = document.getElementById("completedBookshelfList");

  uncompletedBooksList.innerHTML = "";
  booksListCompleted.innerHTML = "";

  for (const booksItem of books) {
    const bookElement = createBooks(booksItem);
    if (booksItem.isCompleted) {
      booksListCompleted.append(bookElement);
    } else {
      uncompletedBooksList.append(bookElement);
    }
  }
});
