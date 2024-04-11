function fetchData() {
    var tableBody = document.getElementById('productBody');
    tableBody.innerText = "";
    fetch('http://localhost:10000/products')
        .then(response => {
            if (!response.ok) {
                window.alert("Errore durante l'eliminazione del prodotto");
            } else {
                return response.json();
            }
        })
        .then(data => {
            populateTable(data.data);
        })
}

function populateTable(data) {
    var tableBody = document.getElementById('productBody');
    data.forEach(function (row) {
        var tr = document.createElement('tr');
        fillARow(tr, row, tableBody)
    });
}

window.onload = function () {
    fetchData();
}

function fillARow(row, product, body) {
    row.id = product.id;
    row.innerHTML = '<td>' + product.id + '</td>' +
        '<td>' + product.attributes.nome + '</td>' +
        '<td>' + product.attributes.marca + '</td>' +
        '<td>' + product.attributes.prezzo + '</td>' +
        '<td><button onclick="showProduct(' + product.id + ')" data-toggle="modal" data-target="productModal">Show</button></td>' +
        '<td><button onclick="formEdit(' + product.id + ')"  data-toggle="modal" data-target="productModal">Edit</button></td>' +
        '<td><button onclick="formDelete(' + product.id + ')"  data-toggle="modal" data-target="productModal">Delete</button></td>';
    body.appendChild(row);
}

function find(id) {
    return fetch(`http://localhost:10000/products/${id}`)
        .then(response => {
            if (!response.ok) {
                window.alert("Errore durante l'eliminazione del prodotto");
            } else {
                return response.json();
            }
        })
        .then(data => {
            return data.data;
        })
}

var formModale;
var modalContent;

function formPost() {
    modalContent = document.getElementById('modalBody');
    modalContent.innerHTML = `
                <h2>Crea Prodotto</h2>
                <p>Nome : <input type="text" id="nome" placeholder="Nome" required></p>
                <p>Marca : <input type="text" id="marca" placeholder="Marca" required></p>
                <p>Prezzo : <input type="number" id="prezzo" placeholder="Prezzo" step="0.01" required></p>
            `;
    formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
    var postButton = document.getElementById('primario');
    postButton.hidden = false;
    postButton.setAttribute('onclick', `postProduct()`);
    document.getElementById('close').addEventListener('click', function () {
        // Chiudi il modal
        formModale.hide();
    });
    formModale.show();
}

function getJsonApi(idP = null, nomeP, marcaP, prezzoP) {
    return {
        data: [
            {
                id: idP,
                type: "products",
                attributes: {
                    nome: nomeP,
                    marca: marcaP,
                    prezzo: prezzoP
                }
            }
        ]
    };
}

function postProduct() {
    var data = getJsonApi(null, document.getElementById("nome").value, document.getElementById("marca").value, document.getElementById("prezzo").value)
    fetch(`http://localhost:10000/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore durante la richiesta POST');
            }
            return response.json();
        })
        .then(data => {
            var tableBody = document.getElementById('productBody');
            var product = data.data;
            var tr = document.createElement('tr');
            fillARow(tr, product, tableBody)
            formModale.hide();
        })
        .catch(error => {
            console.error('Errore durante la richiesta POST:', error);
        });
}

function showProduct(id) {
    find(id)
        .then(product => {
            modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>Product n°${product.id}</h2>
                <p>Nome: ${product.attributes.nome}</p>
                <p>Marca: ${product.attributes.marca}</p>
                <p>Prezzo: ${product.attributes.prezzo}</p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            document.getElementById('primario').hidden = true;
            this.hidden = true;
            document.getElementById('close').addEventListener('click', function () {
                // Chiudi il modal
                formModale.hide();
            });
            formModale.show();
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}

function formEdit(id) {
    find(id)
        .then(product => {
            modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>Modifica Prodotto n° ${product.id}</h2>
                <input type="hidden" id="productid" value="${product.id}">
                <p>Nome : <input type="text" id="nome" placeholder="Nome" value="${product.attributes.nome}"></p>
                <p>Marca : <input type="text" id="marca" placeholder="Marca" value="${product.attributes.marca}" required></p>
                <p>Prezzo : <input type="number" id="prezzo" placeholder="Prezzo" step="0.01" value="${product.attributes.prezzo}" required></p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            var patchButton = document.getElementById('primario');
            patchButton.hidden = false;
            patchButton.setAttribute('onclick', `editProduct(${product.id})`);
            document.getElementById('close').addEventListener('click', function () {
                // Chiudi il modal
                formModale.hide();
            });
            formModale.show();
        })
}

function editProduct() {
    var data = getJsonApi(document.getElementById("productid").value, document.getElementById("nome").value, document.getElementById("marca").value, document.getElementById("prezzo").value)
    fetch(`http://localhost:10000/products/${document.getElementById("productid").value}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                window.alert("Errore durante l'eliminazione del prodotto");
            } else {
                formModale.hide();
                return response.json();
            }
        })
        .then(data => {
            var product = data.data;
            var riga = document.getElementById(`${product.id}`);

            riga.cells[1].innerText = product.attributes.nome;
            riga.cells[2].innerText = product.attributes.marca;
            riga.cells[3].innerText = product.attributes.prezzo;
        })
        .catch(error => {
            // Gestisci gli errori durante la richiesta
            console.error('Errore durante la richiesta PATCH:', error);
        });
}

function formDelete(id) {
    find(id)
        .then(product => {
            modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>Product n°${product.id}</h2>
                <p>Nome: ${product.attributes.nome}</p>
                <p>Marca: ${product.attributes.marca}</p>
                <p>Prezzo: ${product.attributes.prezzo}</p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            const deleteButton = document.getElementById('primario');
            deleteButton.hidden = false;
            deleteButton.setAttribute('onclick', `deleteProduct(${id})`);
            formModale.show();
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}

function deleteProduct(id) {
    fetch(`http://localhost:10000/products/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                window.alert('Prodotto eliminato');
                formModale.hide();
                var deleted = document.getElementById(id);
                deleted.parentNode.removeChild(deleted);
            } else {
                window.alert("Errore durante l'eliminazione del prodotto");
            }
        });
}
