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
    words: async (root, args) => {
      return await Word.find(args).exec();
    },
  },
  Mutation: {
    addWord: async (root, { chainId, value }, { user }) => {
      // make sure user is logged in
      if (!user) {
        throw new Error('You are not logged in!')
      }
      value = value.trim().toLowerCase();
      return await validateAndSaveWord(chainId, value, user);
    }
  },
  Subscription: {
    wordAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(WORD_ADDED),
        (payload, variables) => {
          if (payload.wordAdded.word.wordChain.toString() === variables.wordChainId) {
          }
          return payload.wordAdded.word.wordChain.toString() === variables.wordChainId;
        },
      )
    }
  }
};

const validateAndSaveWord = async (chainId, value, user) => {
  const chain = await WordChain.findById(chainId).populate('words').exec();

  const valid = await validateWord(value, chain);
  if (valid === -2) {
    throw new Error("Invalid: Not a real word!");
  }
  else if (valid !== 0) {
    throw new Error(valid);
  }

  chain.lastLetter = value[value.length - 1];
  chain.lastIndex++;
  const points = await calculatePoints(value, chain);
  const word = new Word({
    wordChain: chainId,
    value: value,
    user: user.id,
    sequence: chain.lastIndex,
    points: points
  });
  // Try to fix concurrency issue by checking __v property
  const newChain = await WordChain.findOneAndUpdate({ __v: chain.__v, _id: chainId }, { lastLetter: chain.lastLetter, __v: chain.__v + 1 });
  if (!newChain) {
    throw new Error("Too slow! Someone else got it!");
  }
  const leaderboardLength = chain.leaderboard.length;
  let found = false;
  for (let i = 0; i < leaderboardLength; i++) {
    if (chain.leaderboard[i].username === user.username) {
      chain.leaderboard[i].score += points;
      found = true;
      break;
    }
  }
  if (!found) {
    chain.leaderboard.push({ username: user.username, score: points });
  }

  const currentUser = await User.findById(user.id);
  const savedWord = await word.save();
  await chain.words.push(savedWord._id);
  await currentUser.words.push(savedWord._id);
  await chain.save();
  await currentUser.save();
  const sub = await pubsub.publish(WORD_ADDED, { wordAdded: { word: savedWord, leaderboard: chain.leaderboard } });
  return chain;
};