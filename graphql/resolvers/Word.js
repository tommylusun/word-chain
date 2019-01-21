// The User schema.
import Word from "../../models/Word";
import WordChain from "../../models/WordChain";
import User from "../../models/User";

export default {
  Word: {
    wordChain: async(root) => {
      return await WordChain.findById(root.wordChain).populate().exec();
    },
    user: async(root) => {
      return await User.findById(root.user).populate().exec();
    }
  },
  Query: {
    word: async (root, args) => {
      return await Word.findOne(args).populate('WordChain').exec();
    },
    words: async (root, {}) => {
      return await Word.find({}).populate().exec();
    },
  },
  Mutation: {
    addWord: async (root, {id , value, userId}) => {
      const chain = await WordChain.findById(id);
      const user = await User.findById(userId);
      const lastLetter = chain.lastLetter;
      if (lastLetter !== '' && lastLetter !== value[0]){
        throw new Error("The word is invalid.");
      }
      chain.lastLetter = value[value.length-1];
      chain.lastIndex++;
      const word = new Word({
        wordChain: id, 
        value: value, 
        user: userId,
        sequence: chain.lastIndex
      });
      const savedWord = await word.save();
      await chain.words.push(savedWord._id);
      await user.words.push(savedWord._id);
      await chain.save();
      await user.save();
      return savedWord;
    }
  }
};