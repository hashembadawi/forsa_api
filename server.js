require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access denied. Token missing.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// connect to mongo db
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

//shchemas
//User Schema
const userShema = new mongoose.Schema({
  email:{type: String, required: true, unique: true},
  firstName:{type: String, required: true},
  lastName:{type: String, required: true},
  phoneNumber:{type: String, required: true, unique: true},
  password:{type: String, required: true}
})
//Product Schema
const productSchema = new mongoose.Schema({
  pic1:{type: String, required: true},
  pic2:{type: String},
  pic3:{type: String},
  pic4:{type: String},
  pic5:{type: String},
  pic6:{type: String},
  price:{type: String, required: true},
  category:{type:Number , required : true},
  subCategory:{type:Number , required : true},
  city:{type: String, required: true},
  region:{type: String, required: true, unique: true},
  createDate:{type: Date, required: true},
  description:{type: String, required: true, unique: true},
})

//Consts
const Product = mongoose.model('Product',productSchema)
const User = mongoose.model('User',userShema)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 10000;

//register url
app.post('/api/auth/register', async (req, res) => {
  const { email,firstName,lastName,phoneNumber,password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});
//Login Url
app.post('/api/auth/login', async (req, res) => {
  const { email,phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: email },
        { phoneNumber: phoneNumber }
      ]
    });
    if (!user) return res.status(400).json({ message: 'Invalid Info' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Products Urls 
//product add
app.post('/api/product/add', async (req, res) => {
  const { pic1,pic2,pic3,pic4,pic5,pic6,price,category,subCategory,city,region,createDate,description } = req.body;

  try {
    const newProduct = new Product({
      pic1,pic2,pic3,pic4,pic5,pic6,
      price,
      category,subCategory,
      city,region,
      createDate,
      description
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});
// start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});