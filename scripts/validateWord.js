import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const URL = (word) => `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`;

const validateWord = async(word) => {
    try {
        const ans = await axios.get(URL(word),{headers: {"X-RapidAPI-Key": RAPIDAPI_KEY}});
    } catch (error){
        console.log(error);
        return false
    }
    return true;
};

export default validateWord;    