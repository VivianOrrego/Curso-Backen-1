import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductsManager from "./products.manager.js";
import __dirname from "../utils.js";

const productsManager = new ProductsManager(`${__dirname}/data/products.json`);

export default class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getAllCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cart = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(cart);
                return carts
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    async createCart() {
        try {
            const cart = { id: uuidv4(), products: [] };
            const carts = await this.getAllCarts();
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts));
            return cart;
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getAllCarts();
            const cart = carts.find((cart) => cart.id === id);
            if (!cart) return "Cart not found", null;
            return cart;
        } catch (error) {
            console.log(error);
        }
    }
    async saveProductToCart(cartId, productId) {
        try {
            const productExist = await productsManager.getProductById(productId);
            if (!productExist) throw new Error("Product not found");

            let carts = await this.getAllCarts();
            const cartExist = await this.getCartById(cartId);
            if (!cartExist) throw new Error("Cart not found");

            const existProdInCart = cartExist.products.find((prod) => prod.productId === productId);

            if (!existProdInCart) {
                const productToAdd = {
                    productId: productId,
                    quantity: 1
                };
                cartExist.products.push(productToAdd);
            } else {
                existProdInCart.quantity += 1;
            }

            const updatedCarts = carts.map((cart) => {
                if (cart.id === cartId) {
                    return cartExist;
                }
                return cart;
            });

            await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
            return cartExist;
        } catch (error) {
            console.log(error);
        }
    }

}