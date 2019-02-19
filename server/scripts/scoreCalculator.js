

const FIRST_LETTERS = {
    'tais': 100,
    'owhbcm': 110,
    'mfpdrl': 120,
    'egnuk':140,
    'yvjqxz':200
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
    if (chainLength > 100) {
        multiplier = 1.1;
    }
    if (chainLength > 200) {
        multiplier = 1.2;
    }
    if (chainLength > 500) {
        multiplier = 1.5;
    }
    if (chainLength > 1000) {
        multiplier = 2;
    }

    return Math.floor(points*multiplier);
};

export default calculatePoints;    