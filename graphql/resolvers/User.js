// The User schema.
import User from "../../models/User";
import Word from "../../models/Word";

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
    addUser: async (root, { name, email }) => {
      const newUser = new User({ name, email });
      return await newUser.save();
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