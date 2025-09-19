const Image = require('../../domain/schemas/imageSchema').default;

class ImagesRepository {
  async saveImage({ content }) {
    const image = new Image({ content });
    return await image.save();
  }
  async findAll(offset = 0, limit = 20) {
    return await Image.find().skip(offset).limit(limit);
  }
}

module.exports = new ImagesRepository();
