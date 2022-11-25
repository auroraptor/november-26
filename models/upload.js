import { Schema, model } from 'mongoose';

const UploadSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
});

export default model('upload', UploadSchema);
