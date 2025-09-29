const Image = require('../../domain/schemas/imageSchema').default;

class ImagesRepository {
  async saveImage({ content }) {
    const image = new Image({ content });
    return await image.save();
  }
  async findAll() {
    return await Image.find();
  }
  async deleteImageById(id) {
    return await Image.findByIdAndDelete(id);
  }
}

module.exports = new ImagesRepository();
