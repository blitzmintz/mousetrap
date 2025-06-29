const board = document.getElementById('board');
const startButton = document.getElementById('start-btn');
const resetButton = document.getElementById('reset-btn');
const okButton = document.getElementById('ok-btn');
const message = document.getElementById('message');


let setTrapsPhase = false;
let guessTrapsPhase = false;
let resetOk = false;
let selectOk = false;

let trapCount = 0;
let trapList = [];
let successCount = 0;
let failCount = 0;

const successSound = new Audio('https://cdn.pixabay.com/audio/2022/11/21/audio_1b7f7e3ca3.mp3');
const failSound = new Audio('https://cdn.pixabay.com/audio/2022/01/18/audio_39de828c91.mp3');


for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    board.appendChild(square);
    square.id = i; // lazy man's id
    square.className = 'square';
}
startButton.addEventListener('click', () => start());
okButton.addEventListener('click', () => nextPlayer());
resetButton.addEventListener('click', () => resetGame());
message.textContent = 'welcome to official mouse cheese trap guess game. click start !!';

let gameBoard = [0,0,0,0,0,0,0,0,0]

board.addEventListener('click', squareSelected, false);
document.getElementById('start-btn').disabled = false;

function start() {
    console.log('game starting...');
    setTrapsPhase = true;
    selectOk = true;
    document.getElementById('start-btn').disabled = true;
    message.textContent = 'pick your evil squares! don\'t show your friend otherwise they will know where the traps are :(';
}

function nextPlayer() {
    if (trapCount !== 2) {
        message.textContent = 'nice try, pick two traps or im stealing something from your house';
    } else {
        console.log('passing to next player...');
        setTrapsPhase = false;
        toggleTraps();
        guessTrapsPhase = true;
        message.textContent = 'ok so you must be player two... hi.. well now you must guess where the cheese is';
        document.getElementById('ok-btn').hidden = true;
    }
}

function resetGame() {
    if (resetOk) {
        guessTrapsPhase = false;
        setTrapsPhase = false;

        for (let i = 0; i < 9; i++) {
            gameBoard[i] = 0;
        }
        var resetSquares = document.getElementsByClassName('square');
        for (let j = 0; j < resetSquares.length; j++) {
            resetSquares[j].style.setProperty('background', '#799090')
        }

        trapCount = 0;
        failCount = 0;
        successCount = 0;

        trapList = [];
        guessList = [];

        console.log('game has been reset');
        message.textContent = 'game reset, click start if you dare to play more';
        resetOk = false;
        document.getElementById('start-btn').disabled = false;
        document.getElementById('reset-btn').disabled = true;

    }
}


function toggleTraps() {
    for (let i = 0; i < trapList.length; i++) {
        document.getElementById(trapList[i]).style.setProperty('background', '#799090');
    }
}

let guessList = [];

function squareSelected(e) {
    if (selectOk) {
        if (e.target !== e.currentTarget) {
            if (setTrapsPhase) {
                if (trapCount < 2) {
                    let trap = e.target.id;
                    if (gameBoard[trap] === 1) {
                        message.textContent = 'are you crazy? you can\'t have more than one trap in one square. try again, think harder this time...'
                    } else {
                        document.getElementById('start-btn').disabled = true;
                        gameBoard[trap] = 1;
                        trapList.push(e.target.id);
                        console.log('trap list' + trapList);
                        e.target.style.setProperty('background-color', 'rgba(144,92,85,0.95)');
                        trapCount++;
                        if (trapCount === 2) {
                            message.textContent = 'ok you chose them, press the button below and  pass to the next player';
                            document.getElementById('ok-btn').hidden = false;
                        }
                    }
                }
            } else if (guessTrapsPhase) {
                let guess = e.target.id;
                if (failCount < 2) {
                    if (gameBoard[guess] === 0) {
                        if (guessList.includes(e.target.id)) {
                            message.textContent = 'wtf, you already guessed that square, we been knew this is cheese'
                        } else {
                            guessList.push(e.target.id);
                            console.log('guess list' + guessList);
                            message.textContent = 'that was a cheese :)';
                            e.target.style.setProperty('background-color', 'rgba(120,131,175,0.95)');
                            e.target.style.backgroundImage = 'url(assets/cheese2.webp)';
                            e.target.style.backgroundSize = 'cover';
                            playSound(successSound);
                            successCount++;
                            if (successCount === 7) {
                                console.log('player two wins')
                                resetOk = true;
                                document.getElementById('reset-btn').disabled = false;
                                message.textContent = 'you won!! you escaped the traps with both legs intact! you must be mouse... press reset to play again!'
                                selectOk = false;
                            }
                        }

                    }

                    if (gameBoard[guess] === 1) {
                        if (guessList.includes(e.target.id)) {
                            message.textContent = 'why would you pick the same trap twice, do you want to lose both legs one by one?';
                        } else {
                            guessList.push(e.target.id);
                            message.textContent = 'that was a trap :(';
                            e.target.style.setProperty('background-color', 'rgba(144,92,85,0.95)');
                            playSound(failSound);
                            e.target.style.backgroundImage = 'url(assets/trap.png)';
                            e.target.style.backgroundSize = 'contain';
                            failCount++;
                            if (failCount === 2) {
                                console.log('player one wins')
                                resetOk = true;
                                document.getElementById('reset-btn').disabled = false;
                                message.textContent = 'you lose :( you lost your legs one by one to each trap :( press reset to try again, that is if you want to lose your arms...'
                                selectOk = false;
                            }
                        }
                    }

                }
            }
        }
        e.stopPropagation();
    }
}
function playSound(soundType) {
    const clonedAudio = soundType.cloneNode();
    clonedAudio.play();
}
