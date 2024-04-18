function fetchData() {
    var tableBody = document.getElementById('productBody');
    tableBody.innerText = "";
    fetch('http://localhost:10000/products')
        .then(response => {
            if (!response.ok) {
                window.alert("Errore durante la ricerca dei prodotti")
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

window.onload = function () {
    fetchData();
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
                <p>Nome : <input type="text" id="nome" placeholder="Nome"></p>
                <p>Marca : <input type="text" id="marca" placeholder="Marca"></p>
                <p>Prezzo : <input type="number" id="prezzo" placeholder="Prezzo" step="0.01"></p>
            `;

    formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
    var postButton = document.getElementById('primario');
    postButton.hidden = true;
    postButton.setAttribute('onclick', `postProduct()`);
    document.getElementById('close').setAttribute('onclick', "closeModal()")

    var inputNome = document.getElementById("nome");
    var inputMarca = document.getElementById("marca");
    var inputPrezzo = document.getElementById("prezzo");
    inputNome.setAttribute("onkeyup", `controllaCampi()`);
    inputMarca.setAttribute("onkeyup", "controllaCampi()");
    inputPrezzo.setAttribute("onkeyup", "controllaCampi()");
    openModal()
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
                window.alert('Errore durante la richiesta POST');
            }
            else{
                return response.json();
            }
        })
        .then(data => {
            var tableBody = document.getElementById('productBody');
            var product = data.data;
            var tr = document.createElement('tr');
            fillARow(tr, product, tableBody)
            closeModal()
        })
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

function controllaCampi() {
    var campo1 = document.getElementById("nome");
    var campo2 = document.getElementById("marca");
    var campo3 = document.getElementById("prezzo");
    var button = document.getElementById("primario");

    // Controlla se tutti e tre i campi sono stati compilati
    if (campo1.value !== "" && campo2.value !== "" && campo3.value !== "") {
        // Mostra il bottone di conferma
        button.hidden = false;
    } else {
        // Nascondi il bottone di conferma
        button.hidden = true;
    }
}

function openModal() {
    formModale.show()
}

function closeModal() {
    formModale.hide()
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
            document.getElementById('close').setAttribute('onclick', "closeModal()")
            openModal()
        })
        .catch(error => {
            window.alert("Error fetching product");
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
                <p>Marca : <input type="text" id="marca" placeholder="Marca" value="${product.attributes.marca}"></p>
                <p>Prezzo : <input type="number" id="prezzo" placeholder="Prezzo" step="0.01" value="${product.attributes.prezzo}"></p>
            `;
            formModale = new bootstrap.Modal(document.getElementById('modalProduct'));
            var patchButton = document.getElementById('primario');
            patchButton.hidden = false;
            patchButton.setAttribute('onclick', `editProduct(${product.id})`);
            document.getElementById('close').setAttribute('onclick', "closeModal()")

            var inputNome = document.getElementById("nome");
            var inputMarca = document.getElementById("marca");
            var inputPrezzo = document.getElementById("prezzo");
            inputNome.setAttribute("onkeyup", `controllaCampi()`);
            inputMarca.setAttribute("onkeyup", "controllaCampi()");
            inputPrezzo.setAttribute("onkeyup", "controllaCampi()");
            openModal()
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
                closeModal();
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
            document.getElementById('close').setAttribute('onclick', "closeModal()")
            openModal()
        })
        .catch(error => {
            window.alert("Error fetching product");
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
                closeModal()
                var deleted = document.getElementById(id);
                deleted.parentNode.removeChild(deleted);
            } else {
                window.alert("Errore durante l'eliminazione del prodotto");
            }
        });
}