// The User schema.
import Word from "../../models/Word";
import WordChain from "../../models/WordChain";
import User from "../../models/User";
import validateWord from "../../scripts/validateWord";

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
      //value = value.trim();
      const chain = await WordChain.findById(id);
      const user = await User.findById(userId);
      const lastLetter = chain.lastLetter;
      if (lastLetter !== '' && lastLetter !== value[0]){
        throw new Error("The word is invalid.");
      }
      
      const valid = await validateWord(value);
      if (!valid){
        throw new Error("The word is not a real word");
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