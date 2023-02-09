import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String,
       trim: true, 
       required: true 
    },
    lastName: { 
      type: String,
      trim: true, 
      required: true 
    },
    userName: { 
      type: String,
      required: true, 
      unique: true 
    },
    email: { 
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "El email es requerido"],
    },
    password: { 
      type: String,
      trim: true, 
      required: true 
    },
    roles: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }]
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
}

userSchema.statics.comparePassword = (password, receivedPassword) => {
  return bcryptjs.compareSync(password, receivedPassword)
}

userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;
  return userObject;
}


const User = mongoose.model("User", userSchema);

export default User;