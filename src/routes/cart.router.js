import { Router } from 'express';
const router = Router();
import CartManager from '../managers/cart.manager.js';

import __dirname from '../utils.js';
const cartManager = new CartManager(`${__dirname}/data/carts.json`);

router.post('/:idCart/products/:idProduct', async (req, res, next) => {
    try {
        const { idCart } = req.params;
        const { idProduct } = req.params;
        const response = await cartManager.saveProductToCart(idCart, idProduct);
        return res.json(response);
    } catch (error) {
        next(error)
    }    
});

router.post('/', async (req, res, next) => {
    try {
        res.json(await cartManager.createCart());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get ('/:idCart', async (req, res, next) => {
    try {
        const { idCart } = req.params;
        res.json(await cartManager.getCartById(idCart));
    } catch (error) {
        console.log(error)
    }
    
})

export default router