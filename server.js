require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // زيادة الحد الأقصى لحجم الطلب لاستيعاب الصور
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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

//schemas
//User Schema
const userShema = new mongoose.Schema({
  email:{type: String, required: true, unique: true},
  firstName:{type: String, required: true},
  lastName:{type: String, required: true},
  phoneNumber:{type: String, required: true, unique: true},
  password:{type: String, required: true}
})

//Product Schema - محدث لاستيعاب Base64
const productSchema = new mongoose.Schema({
  productTitle:{type:String,required:true},
  userId:{type: String,required : true},
  pic1:{type: String, required: true},
  pic2:{type: String},
  pic3:{type: String},
  pic4:{type: String},
  pic5:{type: String},
  pic6:{type: String},
  price:{type: String, required: true},
  currency:{type : String,required:true},
  category:{type:Number , required : true},
  subCategory:{type:Number , required : true},
  city:{type: String, required: true},
  region:{type: String, required: true},
  createDate:{type: Date, required: true},
  description:{type: String, required: true},
})
//index for productTitle and userId
productSchema.index({ productTitle: 1, userId: 1 }, { unique: true });

//Consts
const Product = mongoose.model('Product',productSchema)
const User = mongoose.model('User',userShema)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 10000;

// لا نحتاج إلى حفظ الملفات - سنخزن Base64 مباشرة في قاعدة البيانات

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
    let query = {};
    if (email) {
      query = { email };
    } else if (phoneNumber) {
      query = { phoneNumber };
    } else {
      return res.status(400).json({ message: 'يرجى إدخال البريد أو رقم الهاتف' });
    }

    const user = await User.findOne(query);
    if (!user) return res.status(400).json({ message: 'Invalid Info' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const token = jwt.sign(
      { userId: user._id, username: email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    

    res.status(200).json({ token, username: user.firstName + ' '+  user.lastName , email : user.email, userId:user._id});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// validate Token 
app.get('/api/auth/validate-token', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
});

//Products Urls 
//product add - تخزين Base64 في قاعدة البيانات مباشرة
app.post('/api/userProducts/add', async (req, res) => {
  try {
    const {
      productTitle,
      userId,
      price,
      currency,
      category,
      subCategory,
      city,
      region,
      createDate,
      description,
      images
    } = req.body;
    // التحقق من وجود البيانات المطلوبة
    if (!price || !currency || !category || !subCategory || !city || !region || !description) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    if (!images || images.length === 0) {
      return res.status(400).json({ message: 'يجب رفع صورة واحدة على الأقل' });
    }

    // إنشاء المنتج الجديد مع تخزين Base64 مباشرة
    const productData = {
      productTitle:productTitle,
      userId:userId,
      pic1: images[0] || null, // الصورة الأولى مطلوبة
      pic2: images[1] || null,
      pic3: images[2] || null,
      pic4: images[3] || null,
      pic5: images[4] || null,
      pic6: images[5] || null,
      price,
      currency,
      category: Number(category),
      subCategory: Number(subCategory),
      city,
      region,
      createDate: new Date(createDate),
      description
    };

    const newProduct = new Product(productData);
    await newProduct.save();
    
    res.status(201).json({ 
      message: 'تم استلام إعلانك بنجاح! سيتم مراجعته من قبل الإدارة ونشره في حال تحقق الشروط.', 
      product: {
        _id: newProduct._id,
        price: newProduct.price,
        currency: newProduct.currency,
        category: newProduct.category,
        subCategory: newProduct.subCategory,
        city: newProduct.city,
        region: newProduct.region,
        description: newProduct.description,
        createDate: newProduct.createDate,
        status: 'pending_review' // حالة الإعلان
      },
      imagesCount: images.length,
      note: 'الإعلان في انتظار المراجعة'
    });

  } catch (err) {
    console.error('خطأ في إضافة المنتج:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'بيانات غير صحيحة', details: err.message });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'هذا المنتج موجود بالفعل' });
    }
    
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
});

// get all products for User (paginated)
app.get('/api/userProducts/:userId', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const userIdFromParams = req.params.userId;
    const userIdFromToken = req.user.userId;

    if (!userIdFromParams) {
      return res.status(400).json({ message: 'userId مطلوب' });
    }

    if (userIdFromParams !== userIdFromToken) {
      return res.status(403).json({ message: 'غير مصرح لك بالوصول' });
    }

    const products = await Product.find({ userId: userIdFromParams })
      .sort({ createDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments({ userId: userIdFromParams });

    res.json({
      status: 'success',
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// route لاسترجاع منتج واحد مع الصور Base64
app.get('/api/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});