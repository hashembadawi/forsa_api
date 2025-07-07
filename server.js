require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const productSchema = new mongoose.Schema({
  productTitle: { type: String, required: true },
  userId: { type: String, required: true },
  userName:{type :String,required:true},
  userPhone:{type :String,required:true},
  pic1: { type: String, required: true },
  pic2: { type: String },
  pic3: { type: String },
  pic4: { type: String },
  pic5: { type: String },
  pic6: { type: String },
  price: { type: String, required: true },
  currency: { type: String, required: true },
  category: { type: Number, required: true },
  subCategory: { type: Number, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  createDate: { type: Date, required: true },
  description: { type: String, required: true }
});

productSchema.index({ productTitle: 1, userId: 1 }, { unique: true });

// Models
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// Middleware for JWT Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token missing.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper Functions
const handleServerError = (res, err) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, firstName, lastName, phoneNumber, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email or phone number' });
    }

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
    handleServerError(res, err);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    
    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    const query = email ? { email } : { phoneNumber };
    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      token, 
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userId: user._id,
      userPhone: user.phoneNumber
    });
  } catch (err) {
    handleServerError(res, err);
  }
});

app.get('/api/auth/validate-token', authenticateToken, (req, res) => {
  res.status(200).json({ valid: true, user: req.user });
});

// Product Routes
app.post('/api/userProducts/add', authenticateToken, async (req, res) => {
  try {
    const requiredFields = [
      'userId','userPhone','userName',
      'productTitle', 'price', 'currency', 'category',
      'subCategory', 'city', 'region', 'description', 'images'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields
      });
    }

    if (req.body.images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    const productData = {
      ...req.body,
      userId: req.body.userId,
      userName:req.body.userName,
      userPhone:req.body.userPhone,
      createDate: new Date(),
      pic1: req.body.images[0],
      pic2: req.body.images[1] || '',
      pic3: req.body.images[2] || '',
      pic4: req.body.images[3] || '',
      pic5: req.body.images[4] || '',
      pic6: req.body.images[5] || '',
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    
    res.status(201).json({ message: 'Product added successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Product already exists' });
    }
    handleServerError(res, err);
  }
});

app.get('/api/userProducts/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    
    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      Product.find({ userId })
        .sort({ createDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments({ userId })
    ]);

    const mappedProducts = products.map(p => ({
      ...p,
      images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean)
    }));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products: mappedProducts
    });
  } catch (err) {
    handleServerError(res, err);
  }
});

app.delete('/api/userProducts/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    handleServerError(res, err);
  }
});

app.put('/api/userProducts/update/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this product' });
    }

    const { productTitle, price, currency, description } = req.body;
    const updates = {
      productTitle: productTitle || product.productTitle,
      price: price || product.price,
      currency: currency || product.currency,
      description: description || product.description
    };

    await Product.findByIdAndUpdate(req.params.id, updates);
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    handleServerError(res, err);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ createDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments()
    ]);

    const mappedProducts = products.map(p => ({
      ...p,
      images: [p.pic1, p.pic2, p.pic3, p.pic4, p.pic5, p.pic6].filter(Boolean)
    }));

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products: mappedProducts
    });
  } catch (err) {
    handleServerError(res, err);
  }
});

// Server Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});