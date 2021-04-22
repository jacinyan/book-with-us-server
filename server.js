const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");

const { connectDB } = require("./db");
const { readdirSync } = require("fs");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const itemRoutes = require ('./routes/itemsRoutes.js')
const userRoutes = require ('./routes/userRoutes.js')
const orderRoutes = require ('./routes/orderRoutes.js')
const uploadRoutes = require ('./routes/uploadRoutes.js')

require("dotenv").config({ path: ".env" });
require("colors");

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  // dynamic routing
  readdirSync(path.join(__dirname, "routes")).forEach((fileName) =>
    app.use("/api", require(path.join(__dirname, "routes") + `/${fileName}`))
  );
} else {
  app.use('api/', itemRoutes)
  app.use('api/', userRoutes)
  app.use('api/', orderRoutes)
  app.use('api/', uploadRoutes)
}

//paypal
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use(notFound);
// catch-all
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    );
  }
});
