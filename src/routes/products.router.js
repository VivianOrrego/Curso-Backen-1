import { Router } from 'express';
import colors from 'colors/safe.js';
import { upload } from '../middlewares/multer.js';
import { middlewareProducts } from '../middlewares/validaProduct.js';
import __dirname from '../utils.js';

const router = Router();

import ProductsManager  from '../managers/products.manager.js';
const productManager = new ProductsManager(`${__dirname}/data/products.json`);



router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const product = await productManager.getProducts(limit);
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.get('/:idProduct', async (req, res) => {
  try {
    const { idProduct } = req.params;
    const product = await productManager.getProductById(idProduct);
    if (!product) {
      res.status(204).json({ msg: 'Product not found' });
    } else {
      res.status(200).json({ product });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.post('/', middlewareProducts, upload.single('thumbnails'), async (req, res) => {
  try {
    const productBody = req.body;
    console.log(productBody)
    if (req.file) productBody.thumbnails = req.file.path;
    const product = await productManager.createProduct(productBody);
    console.log(product);
    res.status(201).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
})

router.put("/:id", upload.single('thumbnails'), async (req, res) => {
  try {
    const id = req.params.id; // Obtén el ID del parámetro de la URL
    const updatedProduct = req.body; // Obtén el cuerpo de la solicitud
    if (req.file) {
      updatedProduct.thumbnails = req.file.path; // Asigna la nueva ruta de la imagen si se proporciona
    }

    const response = await productManager.updateProduct(id, updatedProduct);
    
    if (!response) res.status(404).json({ msg: 'Error updating product' });
    else res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:idProduct", async (req, res) => {
  try {
    const { idProduct } = req.params;
    const response = await productManager.deleteProduct(idProduct);
    if (!response) res.status(404).json({ msg: 'Error delete product' });
    else res.status(200).json({ response });
    console.log(colors.red(response));
  } catch (error) {
    console.log(colors.red(error));
    res.status(500).json({ error: error.message });
  }
});

export default router