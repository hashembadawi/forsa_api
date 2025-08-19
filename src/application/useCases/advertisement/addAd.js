const adRepository = require('../../../domain/repositories/adRepository');

const addAd = async (adData, userId) => {
  const requiredFields = [
    'userId', 'userPhone', 'userName', 'adTitle', 'price', 'currencyId',
    'currencyName', 'categoryId', 'categoryName', 'subCategoryId', 'subCategoryName',
    'cityId', 'cityName', 'regionId', 'regionName', 'images'
  ];

  const missingFields = requiredFields.filter(field => !adData[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (adData.images.length === 0) {
    throw new Error('At least one image is required');
  }
   
  const data = {
    ...adData,
    price: adData.price !== undefined ? parseFloat(adData.price) : adData.price,
    userId,
    createDate: new Date(),
    pic1: adData.images[0],
    pic2: adData.images[1] || '',
    pic3: adData.images[2] || '',
    pic4: adData.images[3] || '',
    pic5: adData.images[4] || '',
    pic6: adData.images[5] || '',
  };

  try {
    await adRepository.create(data);
    // Send WhatsApp notification to admin number
    const sendVerificationWhatsApp = require('../../useCases/user/sendVerificationWhatsApp');
    const adminPhone = '905510300730';
    const notificationMessage = `User ${adData.userName} (${adData.userPhone}) added a new advertisement: ${adData.adTitle}`;
    try {
      await sendVerificationWhatsApp(adminPhone, notificationMessage);
    } catch (whatsappError) {
      console.error('Failed to send WhatsApp notification to admin:', whatsappError);
      // Continue even if notification fails
    }
    return { message: 'Advertisement added successfully' };
  } catch (err) {
    if (err.code === 11000) {
      throw new Error('Advertisement already exists');
    }
    throw err;
  }
};

module.exports = addAd;