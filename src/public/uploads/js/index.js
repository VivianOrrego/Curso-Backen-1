const socket = io();
//levanta la conexion del websocket el socket del cliente 

socket.on('saludoDesdeBack', (message)=>{
    console.log(message);

    socket.emit('respuestaDesdeFront', 'Muchas Gracias');
})


const form = document.getElementById('form')
const inputName = document.getElementById('name')
const inputPrice = document.getElementById('price')
const productsList = document.getElementById('products')

// form.onsubmit = (e) => {
//     e.preventDefault();
//     const name = inputName.value;
//     const price = inputPrice.value;
//     const product = {
//         name, 
//         price
//     };
//     socket.emit('newProduct', product);
// }

// socket.on('products', (products) => {
//     let infoProducts = '';
//     products.forEach((prod) => {
//         infoProducts += `${prod.name} - ${prod.price} <br>`;
//     })
//     productsList.innerHTML = infoProducts;
// })

socket.on("products",  (products) => {
    try {
        console.log("recibido evento products");
        const productCards = products.map((product) => {
            return `
                <div class="card">
                    <h2>${product.title}</h2>
                    <p>${product.description}</p>
                    <div><p>$${product.price} - Stock: ${product.stock}</p></div>
                    <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                </div>
            `;
        }).join(" ");

        document.getElementById("card-container").innerHTML = productCards;

        // botones de eliminar -.-"

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const idProduct = event.target.getAttribute('data-id');
                eliminarProducto(idProduct);
            });
        });
    } catch (error) {
        console.error(error);
    }
});


// form para agregar un nuevo producto
document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value, 10)
    }

    socket.emit('newProduct', newProduct);

    document.getElementById('form').reset();
});

// función para eliminar un producto
const eliminarProducto =  (id) => {
    socket.emit('deleteProduct', id);
}

