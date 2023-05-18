const path = require("path");

const express = require("express"); //đặt biến cho thư viện
const bodyParser = require("body-parser");

const mongoConnect = require("./util/database");

const app = express(); // dùng app để chạy express dưới dạng hàm

app.set("view engine", "pug");
app.set("views", "views");

// const adminRouters = require("./routes/admin");
// const shopRouter = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then((user) => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch((err) => console.log(err));
});

// app.use("/admin", adminRouters);
// app.use(shopRouter);

app.use(errorController.get404);

mongoConnect((client) => {
    console.log(client);
    app.listen(5657);
});
