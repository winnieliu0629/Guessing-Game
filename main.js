function generateWinningNumber(){
    return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array){
    return array.sort(() => Math.random() - 0.5);
}

function newGame(){
    let game = {
        playersGuess: null,
        pastGuesses: [],
        winningNumber: generateWinningNumber(),
        difference: function() {
            return Math.abs(this.winningNumber - this.playersGuess);
        },
        isLower: function() {
            return this.playersGuess < this.winningNumber;            
        },
        playersGuessSubmission: function(num) {
            this.playersGuess = num;
            if (num > 100 || num < 1 || isNaN(num)) {
                return "That is an invalid guess."
            } else{
                return this.checkGuess(num);
            }

        },
        checkGuess: function(num) {
            // if (num === this.winningNumber) {
            if (this.difference() == 0) {
                return `You Win! The winning number is ${this.winningNumber}.`;
            } else if (this.pastGuesses.includes(num)) {
                return "You have already guessed that number.";
            } else {
                this.pastGuesses.push(num);
                if (this.pastGuesses.length >= 5) {
                    return `You Lose. The winning number is ${this.winningNumber}.`;
                } else if (this.difference() < 10) {
                    return "You're burning up!" ;
                } else if (this.difference() < 25) {
                    return "You're lukewarm.";
                } else if (this.difference() < 50) {
                    return "You're a bit chilly.";
                } else {
                    return "You're ice cold!";
                }
            }
        },
        provideHint: function() {
            let arr = [];
            arr.push(this.winningNumber);
            arr.push(generateWinningNumber());
            while (arr[0] == arr[1]) {
                arr.pop(generateWinningNumber());
            }
            arr.push(generateWinningNumber());
            while (arr[0] == arr[2] || arr[1] == arr[2]) {
                arr.pop(generateWinningNumber());
            }            
            shuffle(arr);
            return arr;
        }
    };
    return game;
}

let game = newGame();

const input = document.querySelector('input');
const preguesses = document.querySelectorAll('.guess');
const h1 = document.querySelector('h1');
const hintText = document.querySelector('.hintText');
const guessbtn = document.querySelector('.guessbtn');
const resetbtn = document.querySelector('.resetbtn');
const hintbtn = document.querySelector('.hintbtn');

input.addEventListener('input',function(event) {
    game.playersGuess = event.target.value.replace(/^0/, "");
});

input.addEventListener('keypress', function (event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        guessbtn.click();
    }
});

guessbtn.addEventListener("click",function() {
    input.value = "";
    let msg = game.playersGuessSubmission(game.playersGuess);
    h1.textContent = msg;
    if (msg == "That is an invalid guess.") {
        hintText.textContent = "Guess a number between 1-100!";
    } else if (game.difference(game.playersGuess) == 0 || game.pastGuesses.length >= 5) {
        hintText.textContent = "Reset to play again!";
    } else {
        let hint = game.isLower(game.playersGuess);
        if (hint) {
            hintText.textContent = "Guess Higher!";
        } else {
            hintText.textContent = "Guess Lower!";
        }
    }
    for (let i = 0; i < game.pastGuesses.length; i++) {
        preguesses[i].textContent = game.pastGuesses[i];
    }
});

resetbtn.addEventListener("click",function() {
    h1.textContent = "The Guessing Game";
    hintText.textContent = "Guess a number between 1-100.";
    input.value = "";
    preguesses.forEach(item => {
        item.textContent = '-';
    });
    game = newGame();
});

hintbtn.addEventListener("click",function() {
    let hintArr = game.provideHint();
    let hintMsg = "";
    for (let i = 0; i < hintArr.length; i++) {
        if (i != 0) {
            hintMsg += ", ";
        }
        hintMsg += hintArr[i];
    }
    hintText.textContent = `The winning number is either ${hintMsg}`;
});
