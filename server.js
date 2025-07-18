require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String,required : true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationCode: String
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
  currencyId: { type: Number, required: true },
  currencyName: { type: String, required: true },
  categoryId: { type: Number, required: true },
  categoryName: { type: String, required: true },
  subCategoryId: { type: Number, required: true },
  subCategoryName: { type: String, required: true },
  cityId: { type: Number, required: true },
  cityName: { type: String, required: true },
  regionId: { type: Number, required: true },
  regionName: { type: String, required: true },
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

// Use environment variables for security

// Routes
// Register with phone
app.post('/api/auth/register-phone', async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName, password } = req.body;

    if (!phoneNumber || !firstName || !lastName || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newUser = new User({
      phoneNumber,
      firstName,
      lastName,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
    });

    await newUser.save();
    //await sendVerificationWhatsApp(phoneNumber, verificationCode);

    return res.status(201).json({ message: 'User registered successfully with phone' });
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

//Get Options Routes
app.get('/api/options', (req, res) => {
  const currencies = [
    { id: 1, name: 'دولار' },
    { id: 2, name: 'يورو' },
    { id: 3, name: 'ليرة سورية' }
  ];
  const categories = [
    { id: 1, name: 'مركبات' },
    { id: 2, name: 'عقارات' },
    { id: 3, name: 'الكترونيات' },
    { id: 4, name: 'أثاث' },
    { id: 5, name: 'معدات صناعية' },
    { id: 6, name: 'ملابس' },
    { id: 7, name: 'المجتمع' },
    { id: 8, name: 'حيوانات' },
    { id: 9, name: 'فرص عمل' }

  ];
  const subCategories = [
    { id: 1, name: 'سيارات سياحية', categoryId: 1 },
    { id: 2, name: 'سيارات كهربائية', categoryId: 1 },
    { id: 3, name: 'سيارات دفع رباعي', categoryId: 1 },
    { id: 4, name: 'سيارات بيك أب', categoryId: 1 },
    { id: 5, name: 'سيارات شحن', categoryId: 1 },
    { id: 6, name: 'ميكرو أو فان أو باصات', categoryId: 1 },
    { id: 7, name: 'اليات ثقيلة', categoryId: 1 },
    { id: 8, name: 'المركبات البحرية', categoryId: 1 },

    { id: 9, name: 'شقة', categoryId: 2 },
    { id: 10, name: 'اراضي', categoryId: 2 },
    { id: 11, name: 'محلات', categoryId: 2 },
    { id: 12, name: 'بناء كامل', categoryId: 2 },
    { id: 13, name: 'فيلا', categoryId: 2 },
    { id: 14, name: 'مزارع', categoryId: 2 },

    { id: 15, name: 'هواتف', categoryId: 3 },
    { id: 16, name: 'كمبيوتر ثابت', categoryId: 3 }, 
    { id: 17, name: 'لابتوب', categoryId: 3 },
    { id: 18, name: 'طائرات درون', categoryId: 3 },
    { id: 19, name: 'شاشات', categoryId: 3 },
    { id: 20, name: 'ألواح طاقة', categoryId: 3 },
    { id: 21, name: 'سيارات أطفال', categoryId: 4 },
    { id: 22, name: 'اكسسوارات', categoryId: 4 },

    { id: 23, name: 'غرف نوم', categoryId: 4 },
    { id: 24, name: 'غرف جلوس', categoryId: 4 },
    { id: 26, name: 'غرف ضيوف', categoryId: 4 },
    { id: 27, name: 'أثاث مكتب', categoryId: 4 },
    { id: 28, name: 'اكسسوارات و صمديات', categoryId: 4 },
    { id: 29, name: 'كهربائيات منزل', categoryId: 4 },
    { id: 30, name: 'أواني مطبخ', categoryId: 4 },
    { id: 31, name: 'أثاثات أخرى', categoryId: 4 },

    { id: 32, name: 'مطاعم و افران', categoryId: 5 },
    { id: 33, name: 'معامل بلاستيك و حديد', categoryId: 5 },
    { id: 34, name: 'معامل خياطة', categoryId: 5 },
    { id: 35, name: 'مولدات', categoryId: 5 },
    { id: 36, name: 'ديكورات محلات', categoryId: 5 },
    { id: 37, name: 'هنكارات', categoryId: 5 },
    { id: 38, name: 'معدات زراعية', categoryId: 5 },
    { id: 39, name: 'معدات أخرى', categoryId: 5 },

    { id: 40, name: 'ملابس رجالية', categoryId: 6 },
    { id: 41, name: 'ملابس نسائية', categoryId: 6 },
    { id: 42, name: 'ملابس أطفال', categoryId: 6 },

    { id: 43, name: 'ألعاب أطفال', categoryId: 6 },
    { id: 44, name: 'أدوات رياضية', categoryId: 6 },
    { id: 45, name: 'أدوات موسيقية', categoryId: 6 },
    { id: 46, name: 'كتب و مجلات', categoryId: 6 },
    { id: 47, name: 'أدوات منزلية', categoryId: 6 },
    { id: 48, name: 'اكسسوارات نسائية', categoryId: 6 },
    { id: 49, name: 'اكسسوارات رجالية', categoryId: 6 },

    { id: 50, name: 'محلات صيانة', categoryId: 7 },
    { id: 51, name: 'محلات غذائية', categoryId: 7 },
    { id: 52, name: 'مطاعم و كافيتريات', categoryId: 7 },
    { id: 53, name: 'محلات تجارية', categoryId: 7 },
    { id: 54, name: 'خدمات طبية', categoryId: 7 },
    { id: 55, name: 'خدمات استشارية', categoryId: 7 },
    { id: 56, name: 'خدمات عامة', categoryId: 7 },
    { id: 57, name: 'أماكن ترفيه', categoryId: 7},
    { id: 58, name: 'هدايا و العاب', categoryId: 7 },

    { id: 59, name: 'حيوانات أليفة', categoryId: 8 },
    { id: 60, name: 'أبقار', categoryId: 8 },
    { id: 61, name: 'طيور', categoryId: 8 },
    { id: 62, name: 'أسماك', categoryId: 8 },
    { id: 63, name: 'غنم و ماعز', categoryId: 8 },
    { id: 64, name: 'خيول', categoryId: 8 },
    { id: 65, name: 'أدوات حيوانات', categoryId: 8 },

    { id: 66, name: 'وظائف بدوام كامل', categoryId: 9 },
    { id: 67, name: 'وظائف بدوام جزئي', categoryId: 9 },
    { id: 68, name: 'وظائف حرة', categoryId:  9 },
    { id: 69, name: 'وظائف موسمية', categoryId: 9 },
    { id: 70, name: 'وظائف عن بعد', categoryId: 9 },
    { id: 71, name: 'وظائف تدريبية', categoryId: 9 }, 
    { id: 72, name: 'وظائف إدارية', categoryId: 9 },
    { id: 73, name: 'وظائف تقنية', categoryId: 9 },
    { id: 74, name: 'وظائف تعليمية', categoryId: 9 },
    { id: 75, name: 'وظائف صحية', categoryId: 9 }
  ];

  const Province = [
    { id: 1, name: 'الحسكة'},
    { id: 2, name: 'الرقة' },
    { id: 3, name: 'حلب'},
    { id: 4, name: 'إدلب'},
    { id: 5, name: 'اللاذقية'},
    { id: 6, name: 'طرطوس'},
    { id: 7, name: 'دير الزور'},
    { id: 8, name: 'حماة'},
    { id: 9, name: 'حمص'},
    { id: 10, name: 'ريف دمشق'},
    { id: 11, name: 'دمشق'},
    { id: 12, name: 'السويداء'},
    { id: 13, name: 'درعا'},
    { id: 14, name: 'القنيطرة'}
  ];

  const majorAreas = [
  { id: 1, name: 'الحسكة', ProvinceId: 1 },
  { id: 2, name: 'القامشلي', ProvinceId: 1 },
  { id: 3, name: 'رأس العين', ProvinceId: 1 },
  { id: 4, name: 'المالكية', ProvinceId: 1 },

  { id: 5, name: 'الرقة', ProvinceId: 2 },
  { id: 6, name: 'الثورة', ProvinceId: 2 },
  { id: 7, name: 'تل أبيض', ProvinceId: 2 },

  { id: 8, name: 'حلب', ProvinceId: 3 }, 
  { id: 9, name: 'عفرين', ProvinceId: 3 },
  { id: 10, name: 'اعزاز', ProvinceId: 3 },
  { id: 11, name: 'الباب', ProvinceId: 3 },
  { id: 12, name: 'منبج', ProvinceId: 3 },

  { id: 13, name: 'رام حمدان', ProvinceId: 4 },
  { id: 14, name: 'معرتمصرين', ProvinceId: 4 },
  { id: 15, name: 'كفر يحمول', ProvinceId: 4 },
  { id: 16, name: 'زردنا', ProvinceId: 4 },
  { id: 17, name: 'إدلب', ProvinceId: 4 },
  { id: 18, name: 'جسر الشغور', ProvinceId: 4 },
  { id: 19, name: 'أريحا', ProvinceId: 4 },
  { id: 20, name: 'معرة النعمان', ProvinceId: 4 },

  { id: 21, name: 'اللاذقية', ProvinceId: 5 },
  { id: 22, name: 'جبلة', ProvinceId: 5 },
  { id: 23, name: 'القرداحة', ProvinceId: 5 },
  { id: 24, name: 'الحفة', ProvinceId: 5 },

  { id: 25, name: 'طرطوس', ProvinceId: 6 },
  { id: 26, name: 'بانياس', ProvinceId: 6 },
  { id: 27, name: 'صافيتا', ProvinceId: 6 },
  { id: 28, name: 'الشيخ بدر', ProvinceId: 6 },

  { id: 29, name: 'دير الزور', ProvinceId: 7 },
  { id: 30, name: 'الميادين', ProvinceId: 7 },
  { id: 31, name: 'البوكمال', ProvinceId: 7 },

  { id: 32, name: 'حماة', ProvinceId: 8 },
  { id: 33, name: 'محردة', ProvinceId: 8 },
  { id: 34, name: 'مصياف', ProvinceId: 8 },
  { id: 35, name: 'السلمية', ProvinceId: 8 },

  { id: 36, name:'حمص' ,ProvinceId: 9 },
  { id: 37, name: 'تدمر', ProvinceId: 9 },
  { id: 38, name: 'القصير', ProvinceId: 9 },
  { id: 39, name: 'الرستن', ProvinceId: 9 },

  { id: 40, name: 'دوما', ProvinceId: 10 },
  { id: 41, name: 'داريا', ProvinceId: 10 },
  { id: 42, name: 'القطيفة', ProvinceId: 10 },
  { id: 43, name: 'الزبداني', ProvinceId: 10 },
  { id: 44, name: 'يبرود', ProvinceId: 10 },

  { id: 45, name: 'دمشق', ProvinceId: 11 },
  { id: 46, name: 'المزة', ProvinceId: 11 },
  { id: 47, name: 'كفرسوسة', ProvinceId: 11 },
  { id: 48, name: 'المالكي', ProvinceId: 11 },

  { id: 49, name: 'السويداء', ProvinceId: 12 },
  { id: 50, name: 'شهبا', ProvinceId: 12 },
  { id: 51, name: 'صلخد', ProvinceId: 12 },

  { id: 52, name: 'درعا', ProvinceId: 13 },
  { id: 53, name: 'بصرى', ProvinceId: 13 },
  { id: 54, name: 'الحراك', ProvinceId: 13 },
  { id: 55, name: 'إزرع', ProvinceId: 13 },

  { id: 56, name: 'القنيطرة', ProvinceId: 14 }
];

  res.json({ 
    currencies, 
    categories, 
    subCategories,
    Province,
    majorAreas
  });
});
// Product Routes
app.post('/api/userProducts/add', authenticateToken, async (req, res) => {
  try {
    const requiredFields = [
      'userId','userPhone','userName',
      'productTitle', 'price', 'currencyId','currencyName', 'categoryId', 'categoryName',
      'subCategoryId','subCategoryName', 'cityId','cityName', 'regionId','regionName', 'description', 'images'
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
    console.log('Fetching products with pagination');
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

// Search products by cityId and regionId
app.get('/api/products/search', async (req, res) => {
  try {
    const { cityId, regionId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (cityId) filter.cityId = Number(cityId);
    if (regionId) filter.regionId = Number(regionId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
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

// Search products by categoryId and subCategoryId
app.get('/api/products/search-by-category', async (req, res) => {
  try {
    const { categoryId, subCategoryId, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (categoryId) filter.categoryId = Number(categoryId);
    if (subCategoryId) filter.subCategoryId = Number(subCategoryId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
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

// Search products by part of productTitle (case-insensitive)
app.get('/api/products/search-by-title', async (req, res) => {
  try {
    const { title, page = 1, limit = 20 } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'title query parameter is required' });
    }

    const regex = new RegExp(title, 'i'); // 'i' for case-insensitive
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find({ productTitle: regex })
        .sort({ createDate: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments({ productTitle: regex })
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