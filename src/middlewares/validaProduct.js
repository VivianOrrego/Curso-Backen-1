export const middlewareProducts = (req, res, next) => {
    if (req.body.title === "" || req.body.description === "" || req.body.price <= 0 || req.body.code === "" ||  req.body.stock <= 0 || req.body.category === "" )
        return res.status(400).json({ msg: '(title, description, price, code, stock, category) Todos los campos son obligatorios' });
    next();
}