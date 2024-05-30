import express from 'express';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/products.router.js';
import __dirname from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';
import  handlebars  from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import ProductsManager from './managers/products.manager.js';


const productManager = new ProductsManager(`${__dirname}/data/products.json`);
const app = express();


app.set('trust proxy', true);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');
app.use('/', viewsRouter);

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.use(errorHandler);

const httpServer = app.listen(8080, () => {
console.log("Server running on port 8080");
});

const socketServer = new Server(httpServer); 
//conexion del lado del servidor

const products = [];

socketServer.on('connection', (socket) => { //aviso de coneccion de un nuevo cliente, recibiendo el socket del cliente

    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log("usuario desconectado");
    })

    socket.emit('saludoDesdeBack', 'Bienvenido a Websockets')

    socket.on('respuestaDesdeFront', (message)=>{
        console.log(message);
    })

    // socket.on('newProduct', (product)=>{
    //     products.push(product);
    //     socketServer.emit('products', products);
    // })

    socket.on('newProduct', async (newProduct) => {

        productManager.createProduct(newProduct);
        // const products = await productManager.getProducts();
       // products.push(products);
        socketServer.emit('products', products);
    });

    //
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        console.log("Product deleted");
        const products = await productManager.getProducts();
        socketServer.emit('products', products);
    });

})