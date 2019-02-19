// The User schema.
import WordChain from "../../models/WordChain";
import Word from "../../models/Word"

export default {
  WordChain: {
    words: async (root, {limit, offset}) => {
      return await Word.find({ wordChain: root._id })
      .populate()
      .sort({sequence: -1})
      .limit(limit)
      .skip(offset)
      .exec();
    }
  },
  Query: {
    wordChains: async () => {
      return await WordChain.find({}).populate().exec();
    },
    wordChain: async (root, { id }) => {
      const chain = await WordChain.findOne({_id: id}).exec();
      return chain;
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