import express from 'express';
import cartRouter from './routes/cart.router.js';
import productRouter from './routes/products.router.js';
import __dirname from './utils.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.set('trust proxy', true);

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

app.use(errorHandler);


const PORT = 8080;
app.listen(PORT, () => console.log("Server running on: http://localhost:"+PORT));