

const FIRST_LETTERS = {
    'tais': 100,
    'owhbcm': 125,
    'mfpdrl': 150,
    'egnyuk':200,
    'vjqxz':400
};

const calculatePoints = async (word, chain) => {

    let points = 0;
    let chainLength = chain.words.length;
    let firstLetter = word[0];
    let multiplier = 1;

    for (key in Object.keys(FIRST_LETTERS)){
        if (key.includes(firstLetter)){
            points = FIRST_LETTERS[key];
            break;
        }
    }

    return points;
};

export default calculatePoints;    