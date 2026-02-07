import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  watchedAsteroids: string[]; // Array of Asteroid IDs
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  watchedAsteroids: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);