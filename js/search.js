const searchInput = document.querySelector("#searchBookTitle");
const searchButton = document.querySelector("#searchSubmit");

searchButton.addEventListener("click", function (e) {
  //   return console.log(searchInput.value);
  e.preventDefault();
  const word = searchInput.value.trim();
  if (localStorage.getItem(STORAGE_KEY) == "") {
    alert("Tidak ada data buku");
    return location.reload();
  } else {
    const getByTitle = getData().filter(
      (a) => a.title.toLowerCase() == word.toLowerCase()
    );
    if (getByTitle.length == 0) {
      const getByAuthor = getData().filter(
        (a) => a.author.toLowerCase() == word.toLowerCase()
      );
      if (getByAuthor.length == 0) {
        const getByYear = getData().filter(
          (a) => a.year.toLowerCase() == word.toLowerCase()
        );
        if (getByYear.length == 0) {
          alert(`Data yang anda cari tidak ditemukan`);
          return location.reload();
        } else {
          showSearchResult(getByYear);
        }
      } else {
        showSearchResult(getByAuthor);
      }
    } else {
      showSearchResult(getByTitle);
    }
  }

  searchInput.value = "";
});

function showSearchResult(books) {
  const searchResult = document.querySelector("#searchResult");

  searchResult.innerHTML = "";

  books.forEach((book) => {
    let el = `
        <div class="item-search">
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun terbit buku: ${book.year}</p>
            <p class="ket">Keterangan: <span>${
              book.isCompleted ? "Sudah dibaca" : "Belum selesai dibaca"
            }</span></p>
        </div>
        `;

    searchResult.innerHTML += el;
  });
}

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}
