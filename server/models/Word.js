import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create the User Schema.
export const WordSchema = new Schema({
  value: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  wordChain: {
    type: Schema.Types.ObjectId,
    ref: 'WordChain'
  },
  points: {
    type: Number,
    required: true
  }
});

const Word = mongoose.model("Word", WordSchema);
export default Word;