const Image = require('../../domain/schemas/imageSchema').default;

class ImagesRepository {
  async saveImage({ content }) {
    const image = new Image({ content });
    return await image.save();
  }
}

module.exports = new ImagesRepository();
