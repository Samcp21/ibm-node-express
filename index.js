const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the auth  enication mechanism here
  let token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Token not found" });
  token = token.split("Bearer ")[1];
  jwt.verify(token, "fingerprint_customer", (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid token" });
    req.body.username = decoded.username;
  });
  next();
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
