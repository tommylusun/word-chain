import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create the User Schema.
const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  words: [{
    type: Schema.Types.ObjectId,
    ref: 'Word'
  }]
});

const User = mongoose.model("User", UserSchema);

export default User;