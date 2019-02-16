// The User schema.
import Word from "../../models/Word";
import WordChain from "../../models/WordChain";
import User from "../../models/User";
import validateWord from "../../scripts/validateWord";
import { PubSub, withFilter } from 'apollo-server-express';
import calculatePoints from '../../scripts/scoreCalculator';
const pubsub = new PubSub();

const WORD_ADDED = 'WORD_ADDED';


export default {
  Word: {
    wordChain: async (root) => {
      return await WordChain.findById(root.wordChain).populate().exec();
    },
    user: async (root) => {
      return await User.findById(root.user).populate().exec();
    }
  },
  Query: {
    word: async (root, args) => {
      return await Word.findOne(args).populate('WordChain').exec();
    },
    words: async (root, { }) => {
      return await Word.find({}).populate().exec();
    },
  },
  Mutation: {
    addWord: async (root, { id, value },{user}) => {
      // make sure user is logged in
      if (!user) {
        throw new Error('You are not logged in!')
      }
      value = value.trim().toLowerCase();
      const chain = await WordChain.findById(id).populate('words').exec();
      const currentUser = await User.findById(user.id);
      const lastLetter = chain.lastLetter;

      const valid = await validateWord(value, chain);
      if (valid === -2) {
        throw new Error("Invalid: Not a real word!");
      }
      else if (valid === -1) {
        throw new Error("Invalid: You broke the rules!")
      }

      chain.lastLetter = value[value.length - 1];
      chain.lastIndex++;
      const points = await calculatePoints(value,chain);
      const word = new Word({
        wordChain: id,
        value: value,
        user: user.id,
        sequence: chain.lastIndex,
        points: points
      });
      const savedWord = await word.save();
      await chain.words.push(savedWord._id);
      await currentUser.words.push(savedWord._id);
      await chain.save();
      await currentUser.save();
      console.log(savedWord);
      await pubsub.publish(WORD_ADDED, { wordAdded: savedWord });
      return chain;
    }
  },
  Subscription: {
    wordAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('WORD_ADDED'),
        (payload, variables) => {

          if (payload.wordAdded.wordChain.toString() === variables.wordChainId){
          }
          return payload.wordAdded.wordChain.toString() === variables.wordChainId;
        },
      )
    }
  }
};