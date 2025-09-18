import { Schema, model } from 'mongoose';
const imageSchema = new Schema({
    content: { type: String, required: true }
});
export default model('Image', imageSchema);