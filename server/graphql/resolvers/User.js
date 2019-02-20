// The User schema.
import User from "../../models/User";
import Word from "../../models/Word";
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default {
  User: {
    words: async (root) => {
      return await Word.find({user: root._id}).populate().exec();
    }
  },
  Query: {
    user: async (root, args) => {
      return await User.findOne(args).exec();
    },
    users: async () => {
      return await User.find({}).populate().exec();
    }
  },
  Mutation: {
    registerUser: async (root, { username, email, password }) => {

      const newUser = new User({ 
        username, 
        email, 
        password: await bcrypt.hash(password, 10)
      });
      let checkUser = await User.find({ username: username});
      if (checkUser.length > 0) {
        throw new Error("Name already taken");
      }
      checkUser = await User.find({ email: email});
      if (checkUser.length > 0) {
        throw new Error("Account with this email already exist");
      }
      const user = await newUser.save();

      // return json web token
      return jsonwebtoken.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );
    },
    loginUser: async (root, {email, password}) => {
      const user = await User.findOne({email}).populate().exec();
      if (!user) {
        throw new Error('No user with that email')
      }
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password')
      }
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );
    },
    editUser: async (root, { id, name, email }) => {
      return await User.findOneAndUpdate({ id }, { $set: { name, email } }).exec();
    },
    deleteUser: async (root, args) => {
      return await User.findOneAndRemove(args).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
    }
  }
};