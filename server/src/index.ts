import mongoose from "mongoose";
import express from "express";
import * as dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import AuthRouter from "./routes/auth.routes";
import OrderRouter from './routes/order.routes';
import ProductRouter from './routes/product.routes';
import UserRouter from './routes/user.routes';

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_DB_URL!)
  .then(() => {
    console.log("CONNECTED TO DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use("/api/auth", AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/order', OrderRouter);
app.use('/api/product', ProductRouter);
app.use(errorHandler);

app.listen(+process.env.PORT!, "0.0.0.0", () => {
  console.log("CONNECTED TO BACKEND SERVER");
});
