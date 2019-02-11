import mongoose from "mongoose";

import {WordSchema} from './Word';
const Schema = mongoose.Schema;

// Create the User Schema.
const WordChainSchema = new Schema({
  lastIndex: {
    type: Number,
    required: true
  },
  lastLetter: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  words: [{
    type: Schema.Types.ObjectId,
    ref: 'Word'
  }]
});

const WordChain = mongoose.model("WordChain", WordChainSchema);

export default WordChain;