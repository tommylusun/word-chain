

const FIRST_LETTERS = {
    'tais': 100,
    'owhbcm': 110,
    'mfpdrl': 120,
    'egnyuk':140,
    'vjqxz':200
};

const calculatePoints = async (word, chain) => {

    let points = 0;
    let chainLength = chain.words.length;
    let firstLetter = word[0];
    let multiplier = 1;
    for (let key of Object.keys(FIRST_LETTERS)){
        if (key.includes(firstLetter)){
            points = FIRST_LETTERS[key];
            break;
        }
    }

    return points;
};

export default calculatePoints;    