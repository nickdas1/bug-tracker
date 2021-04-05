const searchBar = document.querySelector('#searchBar');
const searchBar2 = document.querySelector('#searchBar2');

const filterTable = (input) => {
  const table = input.nextElementSibling;
  const rows = table.querySelectorAll('tr');
  const filter = input.value.toUpperCase();
  if (table.nextElementSibling) {
    const displayedRows = table.nextElementSibling.querySelector('#displayedRows');
  }


  for (let i = 1; i < rows.length; i++) {
    let textValue = rows[i].textContent;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      rows[i].style.display = '';
    } else {
      rows[i].style.display = 'none';
    }
  }

  if (table.nextElementSibling) {
    let numRows = table.querySelectorAll('tr:not([style*="display: none"])').length - 1;
    displayedRows.innerText = numRows;
  }
}


if (searchBar) {
  searchBar.addEventListener('keyup', () => { filterTable(searchBar) });
}

if (searchBar2) {
  searchBar2.addEventListener('keyup', () => { filterTable(searchBar2) });
}



