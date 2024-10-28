const mongoose = require('mongoose');
const express = require('express');
const CategoryRoute = require('./routes/category');
const RestaurantRoute = require('./routes/restaurant');
const cowsay = require('cowsay');
const dotenv = require('dotenv');
const app = express();


dotenv.config();
mongoose.connect(process.env.DB_URL)
.then(() => { console.log('MongoDB connected'); })
.catch((error) => { console.log('Kết nối MongoDB thất bại:', error.message); });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/category', CategoryRoute);
app.use('/api/restaurants', RestaurantRoute);


app.listen(process.env.PORT || 3000, "0.0.0.0", () => {       
    console.log(cowsay.say({
        text : `All hail on port ${process.env.PORT}`,
        f: 'yasuna_06',
    }));
});
