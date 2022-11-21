import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  createJWT: () => string;
  comparePasswords: (candidatePassword: string)=> Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Please provide username"],
    trim: true,
    unique:true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    select: false
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function (): string | undefined {
  let jwtString: string;
  if (process.env.JWT_SECRET) {
    jwtString = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return jwtString;
  }
};

UserSchema.methods.comparePasswords = async function(candidatePassword:string):Promise<boolean>{
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch

}

export default model<IUser>("User", UserSchema);
