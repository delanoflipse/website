const INTRO_STRING = "MY NAME IS DELANO, I DO ";
const LOOP = INTRO_STRING + "FRONTEND--------_NODE.JS-------_";
const JUMPINDEX = INTRO_STRING.length;
let index = 0;
let currentString = "";

let $h1 = document.querySelector(".text");

function step() {
    let char = LOOP[index];

    let timeOut = index < JUMPINDEX ? 100 : 300;

    switch (char) {
        case '-':
            currentString = currentString.substring(0, currentString.length - 1);
            timeOut = 100;
            break;

        case '_':
            timeOut = 500;
            break;
    
        default:
            currentString += char;
            break;
    }

    $h1.innerText = currentString;

    index++;
    if (index == LOOP.length)
        index = JUMPINDEX;
    
    setTimeout(() => step(), timeOut);
}

step();