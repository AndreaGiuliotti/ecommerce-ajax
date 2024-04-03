//how to populate a table from a json response connecting to a database through ajax xml

window.onload = function () {
    // La seguente funzione viene eseguita quando la finestra si carica
    // La funzione loadProducts() verrà chiamata automaticamente in questo punto
    // Function to make AJAX request
    function fetchData() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8080/products', true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                var data = JSON.parse(xhr.responseText);
                var products = data.data;
                populateTable(products);
            } else {
                console.error('Request failed with status ' + xhr.status);
            }
        };

        xhr.onerror = function () {
            console.error('Request failed');
        };

        xhr.send();
    }

    // Function to populate the table with data
    function populateTable(data) {
        var tableBody = document.getElementById('productTable');
        data.forEach(function (row) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + row.id + '</td>' +
                '<td>' + row.attributes.nome + '</td>' +
                '<td>' + row.attributes.marca + '</td>' +
                '<td>' + row.attributes.prezzo + '</td>' +
                '<td><button onclick="showProduct(row.id)">Button 1</button></td>' +
                '<td><button onclick="editProduct(row.id)">Button 2</button></td>' +
                '<td><button onclick="deleteProduct(row.id)">Button 3</button></td>';
            tableBody.appendChild(tr);
        });
    }

    // Call fetchData function to initiate the AJAX request
    fetchData();
}

function find(id) {
    try {
        var response = fetch(`http:localhost:8080/products/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        var data = response.json();
        var product = data.data;
        // Assuming the response data is an object with 'id' attribute
        return product;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

function showProduct(id) {

}

function editProduct(id) {

}

function deleteProduct(id) {

}

/*
    function loadProducts() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                displayProducts(this.responseText);
            }
        };
        xmlhttp.open("GET", "localhost:8080/products", true);
        xmlhttp.send();
    }

    function displayProducts(response) {
        // Questa funzione visualizza i prodotti nella tabella HTML
        var data = JSON.parse(response);
        var products = data.data;
        var table = "<tr><th>ID</th><th>Nome</th><th>Marca</th><th>Prezzo</th></tr>";
        for (var i = 0; i < products.length; i++) {
            table += "<tr><td>" +
                products[i].id +
                "</td><td>" +
                products[i].attributes.nome +
                "</td><td>" +
                products[i].attributes.marca +
                "</td><td>" +
                products[i].attributes.prezzo +
                "</td>" +
                "<button onclick='showProduct(${product.id}})'>Show</button>" +
                "<button onclick='editProduct(${product.id})'>Edit</button>" +
                "<button onclick='deleteProduct(${product.id})'>Delete</button>" +
                "</tr>";
        }
        document.getElementById("productTable").innerHTML = table;
    }

    loadProducts(); // Chiamiamo la funzione loadProducts() al caricamento della pagina
};
    function find(id){
        return function(){
            function sendObject() {
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        returnProduct(this.responseText);
                    }
                };
                var url = "localhost:8080/products/" + id;
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
            }
            function returnProduct(response){
                var data = JSON.parse(response);
                return data.data;
            }
        }
    }


    function showProduct(id){
        var product = find(id);
        var modal = document.getElementById("myModal");
        var productDetailsContainer = document.getElementById("productDetails");

        // Popola il contenitore dei dettagli del prodotto con i dati passati
        var productDetailsHTML = `
        <p><strong>ID:</strong> ${product.id}</p>
        <p><strong>Nome:</strong> ${product.attributes.nome}</p>
        <p><strong>Marca:</strong> ${product.attributes.marca}</p>
        <p><strong>Prezzo:</strong> ${product.attributes.prezzo}</p>  `;
        productDetailsContainer.innerHTML = productDetailsHTML;

        // Mostra il modal
        modal.style.display = "block";
    }
    function editProduct(id){
        var product = find(id);
    }
    function deleteProduct(id){
        var product = find(id);

}
*/