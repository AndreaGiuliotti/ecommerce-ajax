function fetchData() {
    var tableBody = document.getElementById('productTable');
    tableBody.innerText = "";
    fetch('http://localhost:8080/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateTable(data.data);
        })
}

function populateTable(data) {
    var tableBody = document.getElementById('productTable');
    data.forEach(function (row) {
        var tr = document.createElement('tr');
        tr.id = row.id;
        tr.innerHTML = '<td>' + row.id + '</td>' +
            '<td>' + row.attributes.nome + '</td>' +
            '<td>' + row.attributes.marca + '</td>' +
            '<td>' + row.attributes.prezzo + '</td>' +
            '<td><button onclick="showProduct(' + row.id + ')" data-toggle="modal" data-target="productModal">Show</button></td>' +
            '<td><button onclick="editProduct(' + row.id + ')"  data-toggle="modal" data-target="productModal">Edit</button></td>' +
            '<td><button onclick="deleteProduct(' + row.id + ')"  data-toggle="modal" data-target="productModal">Delete</button></td>';
        tableBody.appendChild(tr);
    });
}

window.onload = function () {
    fetchData();
}

function find(id) {
    return fetch(`http://localhost:8080/products/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return data.data;
        });
}

var formModale;

function showProduct(id) {
    find(id)
        .then(product => {
            const modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>Product n°${product.id}</h2>
                <p>Nome: ${product.attributes.nome}</p>
                <p>Marca: ${product.attributes.marca}</p>
                <p>Prezzo: ${product.attributes.prezzo}</p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            document.getElementById('primario').hidden = true;
                this.hidden = true;
            document.getElementById('close').addEventListener('click', function() {
                // Chiudi il modal
                formModale.hide();
            });
            formModale.show();

        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}

function editProduct(id) {
    find(id)
        .then(product => {

        })
}

function deleteProduct(id) {
    find(id)
        .then(product => {
            const modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>Product n°${product.id}</h2>
                <p>Nome: ${product.attributes.nome}</p>
                <p>Marca: ${product.attributes.marca}</p>
                <p>Prezzo: ${product.attributes.prezzo}</p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            const deleteButton = document.getElementById('primario');
            deleteButton.hidden = false;
            deleteButton.setAttribute('onclick', `confirmDelete(${id})`);
            formModale.show();
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}

function confirmDelete(id) {
    fetch(`http://localhost:8080/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                window.alert('Prodotto eliminato');
            } else {
                window.alert("Errore durante l'eliminazione del prodotto");
            }
        })
        .finally(() => {
            formModale.hide(); // Nasconde la modale dopo l'eliminazione
            var deleted = document.getElementById(id);
            deleted.parentNode.removeChild(deleted);
        });
}