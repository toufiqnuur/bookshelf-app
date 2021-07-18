let books = [];


window.addEventListener('load', () => {
  books = JSON.parse(localStorage.getItem('book')) || [], updateUI(books);
  
  $('form').onsubmit = addBook;
  
  $('.toolbar>.form-input').onchange = searchData;
  
  $('#isComplete').onclick = (e) => {
    $('form>button').innerText = e.target.checked ? 'Simpan as sudah dibaca' : 'Simpan as belum dibaca';
  };
  
  $('#tambahBuku').onclick = () => {
    const isEdit  = $('form').id;
    const isShown = !$('.input-data').classList.contains('hide');
    if(isShown && isEdit) {
      if(confirm('Yakin gak jadi edit data?')) {
        $('.input-data>h3').innerText = 'Tambah Data';
        $('form').removeAttribute('id');
        $('form').reset();
      }
    } else {
      $('.input-data').classList.toggle('hide');
    }
  };
});


function updateUI(books) {
  const finished   = $('.dah-dibaca'), 
        unfinished = $('.lom-dibaca');
        
  finished.innerHTML = '', unfinished.innerHTML = '';
  
  for(let book of books) {
    let item   = $new('div', { id: book.id, css: ['buku'] });
    let title  = $new('h4', { text: `${book.title}` });
    let author = $new('p', { text: `Penulis: ${book.author}` });
    let year   = $new('p', { text: `Tahun: ${book.year}` });
    let group  = $new('button', { css: ['button', 'button-success'], text: `${ book.isComplete ? 'Belum selesai' : 'Udah dibaca'}`, action: moveGroup });
    let remove = $new('button', { css: ['button', 'button-danger'], text: 'Hapus', action: removeBook });
    let edit   = $new('button', { css: ['button', 'button-warning'], text: 'Edit', action: editBook });
    
    [title, author, year, group, remove, edit].forEach(e => {
      item.appendChild(e);
    });
    
    book.isComplete ? finished.appendChild(item) : unfinished.appendChild(item);
  }
  
  !finished.hasChildNodes() ? finished.innerHTML = 'Empty' : 0;
  !unfinished.hasChildNodes() ? unfinished.innerHTML = 'Empty' : 0;
}


function moveGroup(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  books[position].isComplete = !books[position].isComplete;
  saveData();
  updateUI(books);
}


function removeBook(e) {
  if(confirm('Serius nih, mau dihapus?')) {
    const position = books.findIndex(i => i.id == e.target.parentNode.id);
    books.splice(position, 1);
    saveData();
    updateUI(books);
  }
}


function editBook(e) {
  const position = books.findIndex(i => i.id == e.target.parentNode.id);
  
  $('#title').value  = books[position].title;
  $('#author').value = books[position].author;
  $('#year').value   = books[position].year;
  $('#isComplete').checked = books[position].isComplete;
  
  $('form').id = position;
  
  $('.input-data>h3').innerText = 'Edit Data';
  $('.input-data').classList.remove('hide');
  $('.input-data').scrollIntoView();
  
  $('#title').focus();
}


function addBook() {
  const position = $('form').id;
  
  let model = {
    id: +new Date(),
    title: $('#title').value,
    author: $('#author').value,
    year: $('#year').value,
    isComplete: $('#isComplete').checked
  }
  
  if(position) {
    books[position].title  = model.title;
    books[position].author = model.author;
    books[position].year   = model.year;
    books[position].isComplete = model.isComplete;
  } else {
    books.push(model);
  }
  
  saveData();
  updateUI(books);
}


function searchData(e) {
  e = e.target.value;
  
  updateUI(books.filter(book => {
    return book.title.toLowerCase().includes(e.toLowerCase());
  }));
}


function saveData() {
  localStorage.setItem('book', JSON.stringify(books));
}


function $new(e,a) {
  e = document.createElement(e);
  a.id ? e.id = a.id : 0;
  a.text ? e.innerText = a.text : 0;
  a.action ? e.addEventListener('click', a.action) : 0;
  a.css ? a.css.forEach(css => e.classList.add(css)) : 0;
  return e;
}


function $(e) {
  e = document.querySelectorAll(e);
  return e.length >= 1 ? e[0] : e;
}