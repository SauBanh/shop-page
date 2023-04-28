const path = require("path");

const express = require("express"); //đặt biến cho thư viện
const bodyParser = require("body-parser");

const app = express(); // dùng app để chạy express dưới dạng hàm

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.set("view engine", "pug");
app.set("views", "views");

const adminRouters = require("./routes/admin");
const shopRouter = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => console.log(err));
});

app.use("/admin", adminRouters);
app.use(shopRouter);

app.use(errorController.get404);

// 1 product thuộc về 1 user thong qua khóa ngoại
Product.belongsTo(User, { constrains: true, onDelete: "CASCADE" });
// 1 user có thể có nhiều sản phẩm
User.hasMany(Product);
// 1 user chỉ có 1 giỏ hàng
User.hasOne(Cart);
// 1 giỏ hàng chỉ thuộc về 1 user
Cart.belongsTo(User);
// 1 giỏ hàng có thể có nhiều sản phầm
Cart.belongsToMany(Product, { through: CartItem });
// 1 sản phẩm có thể có trong nhiều giỏ hàng
Product.belongsToMany(Cart, { through: CartItem });
// 1 đơn hàng chỉ có thể của 1 user
Order.belongsTo(User);
// 1 người dùng thì có thể có nhiều đơn đặt hàng
User.hasMany(Order);
// một đơn hàng có thể có nhiều sản phẩm khác nhau
Order.belongsToMany(Product, { through: OrderItem });
// một sản phầm có thể có ở nhiều đơn hàng khác nhau
// Product.belongsTo(Order, { through: OrderItem });

sequelize
    // .sync({ force: true }) // xóa các bản cũ và ghi đè các thông tin lên
    .sync()
    .then((result) => {
        return User.findByPk(1);
        // console.log(result);
    })
    .then((user) => {
        if (!user) {
            return User.create({
                name: "Nguyễn Tuấn Anh",
                email: "saubanh05062001@gmail.com",
            });
        }
        return user;
    })
    .then((user) => {
        // console.log(result);
        return user.createCart();
    })
    .then((result) => {
        app.listen(5657);
    })
    .catch((err) => console.log(err));
