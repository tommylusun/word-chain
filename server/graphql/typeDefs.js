import { mergeTypes } from "merge-graphql-schemas";

import User from "./types/User";
import Word from "./types/Word";
import WordChain from "./types/WordChain";

const typeDefs = [User, Word, WordChain];

export default mergeTypes(typeDefs, { all: true });