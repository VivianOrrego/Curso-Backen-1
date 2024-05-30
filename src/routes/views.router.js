import { Router } from "express";
const router = Router();

import ProductsManager  from '../managers/products.manager.js';
const productsManager = new ProductsManager('./src/data/products.json');

router.get('/', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('home', {products}) 
})

router.get('/products', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('home', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await productsManager.getProducts();
    res.render('realtimeproducts', {products})
})

router.get('/socket', (req, res) => {
    res.render('websocket')
})


export default router 
