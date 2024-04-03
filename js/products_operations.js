window.onload = function () {
    function fetchData() {
        fetch('http://localhost:8080/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                var products = data.data;
                populateTable(products);
            })
    }

    function populateTable(data) {
        var tableBody = document.getElementById('productTable');
        data.forEach(function (row) {
            var tr = document.createElement('tr');
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
var modal = new bootstrap.Modal(document.getElementById('modalProduct'));
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
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}


function editProduct(id) {
    find(id)
        .then(product => {

        });
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
            modal.show();
            const deleteButton = document.getElementById('primario');
            deleteButton.addEventListener('click', function() {
                fetch(`http://localhost:8080/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        window.prompt('Product deleted successfully');
                        // You can perform additional actions after successful deletion
                    })
                modal.hide(); // Hide the modal after deleting
            });
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}