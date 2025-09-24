import { connect } from 'mongoose';

async function connectDB() {
  await connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
}
export default connectDB;
