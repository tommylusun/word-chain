import { merge } from 'lodash';

import User from "./resolvers/User";
import Word from "./resolvers/Word";
import WordChain from "./resolvers/WordChain";


const resolvers = merge(User,Word,WordChain);

export default resolvers;