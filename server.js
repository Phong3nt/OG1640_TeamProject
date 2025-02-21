require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/db');

const app = express();
connectDB();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use(express.static('public'));

// const userRoutes = require('./src/routes/userRoutes');
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
