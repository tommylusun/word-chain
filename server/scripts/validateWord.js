import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const URL = (word) => `https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=${word}`;

const validateWord = async (word, chain) => {

    if (await validateChainRules(word, chain) !== 0) {
        return -1;
    }
    if (await verifyRealWord(word) !== 0) {
        return -2;
    }
    return 0;
};

const validateChainRules = async (word, chain) => {

    // Rule 1: More than 2 letters in length
    if (word.length < 3) {
        return -1;
    }
    // Rule 2: Cannot Repeat word
    for (let i = 0; i < chain.words.length; i++) {
        if (chain.words[i].value === word) {
            return -1;
        }
    }
    return 0;
}

const verifyRealWord = async (word) => {
    try {
        const ans = await axios.get(URL(word), { headers: { "X-RapidAPI-Key": RAPIDAPI_KEY } });
        if (ans.data.result_code && ans.data.result_code === '462') {
            return -1;
        }
    } catch (error) {
        console.log(error);
        return -1;
    }

    return 0;
}

export default validateWord;    