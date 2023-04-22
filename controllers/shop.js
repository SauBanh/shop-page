const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            prods: products,
            pageTitle: "My Shop",
            path: "/",
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            prods: products,
            pageTitle: "All Product",
            path: "/products",
        });
    });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, (product) => {
        res.render("shop/product-detail", {
            product: product,
            pageTitle: "All Product",
            path: "/products",
        });
    });
};

exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/cart", {
            prods: products,
            pageTitle: "Your Cart",
            path: "/cart",
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect("/cart");
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
