import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const URL = (word) => `https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=${word}`;


const ERROR_MESSAGES = {
    FIRST_LETTER_MISMATCH: "The first letter does not match the previous word's last letter!",
    DUPE_WORD: "Word has already been used!",
    WORD_LENGTH_TOO_SHORT: "Word is too short!"
}
const validateWord = async (word, chain) => {
    const rulesValid = await validateChainRules(word, chain);
    if ( rulesValid !== 0) {
        return rulesValid;
    }
    if (await verifyRealWord(word) !== 0) {
        return -2;
    }
    return 0;
};

const validateChainRules = async (word, chain) => {


    if (chain.lastLetter !== '' && chain.lastLetter !== word[0]) {
        return ERROR_MESSAGES.FIRST_LETTER_MISMATCH;
    }

    // Rule 1: More than 2 letters in length
    if (word.length < 3) {
        return ERROR_MESSAGES.WORD_LENGTH_TOO_SHORT;
    }
    // Rule 2: Cannot Repeat word
    for (let i = 0; i < chain.words.length; i++) {
        if (chain.words[i].value === word) {
            return ERROR_MESSAGES.DUPE_WORD;
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