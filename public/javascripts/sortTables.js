const getCellValue = (tr, index) => tr.children[index].innerText || tr.children[index].textContent;

const comparer = (index, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, index), getCellValue(asc ? b : a, index));

document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
    const tbody = th.parentElement.parentElement.nextElementSibling;
    Array.from(tbody.querySelectorAll('tr'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr) );
})));
