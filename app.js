const path = require("path");

const express = require("express"); //đặt biến cho thư viện
const bodyParser = require("body-parser");

const app = express(); // dùng app để chạy express dưới dạng hàm

app.set("view engine", "pug");
app.set("views", "views");

const adminRouters = require("./routes/admin");
const shopRouter = require("./routes/shop");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRouters);
app.use(shopRouter);

app.use(errorController.get404);

app.listen(5657);
