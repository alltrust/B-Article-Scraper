import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  username: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    minlength: 2,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 4,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model<IUser>("User", UserSchema);
