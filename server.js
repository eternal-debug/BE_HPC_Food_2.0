const mongoose = require('mongoose');
const express = require('express');
const AuthRoute = require('./routes/auth');
const UserRoute = require('./routes/user');
const CategoryRoute = require('./routes/category');
const RestaurantRoute = require('./routes/restaurant');
const FoodRoute = require('./routes/food');
const RatingRoute = require('./routes/rating');
const AddressRoute = require('./routes/address');
const CartRoute = require('./routes/cart');
const OrderRoute = require('./routes/order');
const cowsay = require('cowsay');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('Kết nối MongoDB thất bại:', error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/', AuthRoute);
  app.use('/api/users', UserRoute);
  app.use('/api/category', CategoryRoute);
  app.use('/api/restaurants', RestaurantRoute);
  app.use('/api/foods', FoodRoute);
  app.use('/api/rating', RatingRoute);
  app.use('/api/address', AddressRoute);
  app.use('/api/cart', CartRoute);
  app.use('/api/order', OrderRoute);

  const port = process.env.PORT || 3000;
  app.listen(port, "0.0.0.0", () => {
    console.log(cowsay.say({
      text: `All hail on port ${port}`,
      f: 'yasuna_06',
    }));
  });
};

startServer();