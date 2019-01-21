// The User schema.
import WordChain from "../../models/WordChain";
import Word from "../../models/Word"

export default {
  WordChain: {
    words: async (root) => {
      return await Word.find({wordChain: root._id}).populate().exec();
    }
  },
  Query: {
    wordChains: async () => {
      console.log(await WordChain.find({}).populate().exec());
      return await WordChain.find({}).populate().exec();
    },
    wordChain: async (root, {id}) => {
      return await WordChain.findById(id).populate().exec();
    }
  },
  Mutation: {
    createNewChain: async () => {  
      const newChain = new WordChain({
        lastIndex: 0,
        lastLetter: '',
        date: new Date().toDateString(),
        words: []
      });
      return await newChain.save();
    }
  }
  
};