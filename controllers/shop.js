const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "My Shop",
                path: "/",
            });
        })
        .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "All Product",
                path: "/products",
            });
        })
        .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    // Product.findAll({ where: { id: prodId } })
    //     .then((products) => {
    //         res.render("shop/product-detail", {
    //             product: products[0],
    //             pageTitle: "All Product",
    //             path: "/products",
    //         });
    //     })
    //     .catch((err) => console.log(err));
    Product.findByPk(prodId)
        .then((product) => {
            // console.log(product);
            res.render("shop/product-detail", {
                product: product,
                pageTitle: "All Product",
                path: "/products",
            });
        })
        .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            // console.log(cart);
            return cart
                .getProducts()
                .then((products) => {
                    // console.log(products[0].cartItem.quantity);
                    res.render("shop/cart", {
                        prods: products,
                        pageTitle: "Your Cart",
                        path: "/cart",
                    });
                })
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let newQuantity = 1;
    let fetchCart;
    req.user
        .getCart()
        .then((cart) => {
            fetchCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then((product) => {
            return fetchCart.addProduct(product, {
                through: { quantity: newQuantity },
            });
        })
        .then(() => {
            res.redirect("back");
        })
        .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then((products) => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then((result) => {
            res.redirect("/cart");
        })
        .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts();
        })
        .then((products) => {
            req.user
                .createOrder()
                .then((order) => {
                    return order.addProducts(
                        products.map((product) => {
                            product.orderItem = {
                                quantity: product.cartItem.quantity,
                            };
                            return product;
                        })
                    );
                })
                .catch((err) => console.log(err));
        })
        .then((result) => {
            result.redirect("/orders");
        })
        .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        pageTitle: "Your Order",
        path: "/orders",
    });
};

exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/cart", {
            prods: products,
            pageTitle: "Checkout",
        });
    });
};
