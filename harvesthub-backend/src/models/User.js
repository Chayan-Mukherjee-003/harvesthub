import { Schema, model } from 'mongoose';
const userSchema = new Schema({
  name: String,
  email: { type:String, unique:true },
  password: String,
  role: { type:String, enum:['farmer','retailer'] },
  fssaiNumber: String,
  isVerified: { type:Boolean, default:false }
});
export default model('User', userSchema);
