var countdownNumber = 30;
var countdownNumberChosen = 30;
var score = 0;
var tries = 0;
var countWord = null;
var initialWord = null;
var scrambledWord = null;
const url = 'https://random-word-form.herokuapp.com/random/adjective';
var countdownTimeout = null;

// this function runs when the page loads for the first time. And initializes the "score" and "tries" elements to 0 as well as contain a function to get random word from an api
window.onload = function () {
	document.getElementById('score-number').innerHTML = score;
	document.getElementById('tries-number').innerHTML = tries;

	getInitialWord();
};

// this function gets a random adjective from an api, shuffles it, generates input elements for each letter and begins countdown.
const getInitialWord = () => {
	axios
		.get(url)
		.then((response) => {
			data = response.data;
			word = data[0];
			initialWord = word.toUpperCase();
			console.log(initialWord);
			countWord = word.length;
			scrambledWord = shuffleInitialWord(initialWord);
			scrambledWord = scrambledWord.toUpperCase();
			document.getElementById('scrambled-word').innerHTML = scrambledWord;
			generateInputs();
			countdownTimeout = setInterval(countdown, 1000);
		})
		.catch((err) => {
			console.log(err);
			alert('Something went wrong');
			window.location.reload();
		});
};

// this function decrements countdown by one and displays an alert when countdown has expired
function countdown() {
	if (countdownNumber < 1) {
		var scrambleFormShake = document.getElementById('scramble-form-shake');
		scrambleFormShake.setAttribute('class', 'scramble-form-shake-wrong');
		setTimeout(function () {
			scrambleFormShake.removeAttribute('class');
		}, 2000);
		alert(
			`Your countdown has expired. Your score is ${score}. Session will now restart`,
		);
		window.location.reload();
	}
	document.getElementById('countdown-number').innerHTML = countdownNumber;
	countdownNumber -= 1;
}

//this function sets the countdown interval to a number chosen by the player, and reset scores and tries for a new game
function setCountdown(number) {
	alert('Session will now restart with the new countdown');
	countdownNumber = number;
	countdownNumberChosen = number;
	tries = 0;
	document.getElementById('tries-number').innerHTML = tries;
	score = 0;
	document.getElementById('score-number').innerHTML = score;
}

// this function shuffles the random word gotten from the api, and is called in the "getInitialWord" function
const shuffleInitialWord = (initialWord) => {
	var shuffledWord = '';
	initialWord = initialWord.split('');
	while (initialWord.length > 0) {
		shuffledWord += initialWord.splice(
			(initialWord.length * Math.random()) << 0,
			1,
		);
	}

	if (shuffledWord != initialWord) {
		return shuffledWord;
	} else {
		shuffleInitialWord(initialWord);
	}
};

//this functions generates inputs elements for the number of letters in the word.
const generateInputs = () => {
	for (i = 0; i < countWord; i++) {
		var input = document.createElement('input');
		input.setAttribute('type', 'text');
		input.setAttribute('class', 'scramble-form-inputs');
		inputID = 'scramble-form-input-' + i.toString();
		input.setAttribute('id', inputID);
		input.setAttribute('maxlength', '1');
		input.setAttribute('oninput', 'movetoNext(this)');
		input.setAttribute('required', '');
		document.getElementById('scramble-form-container').appendChild(input);
	}
	var scrambleButton = document.createElement('button');
	var scrambleButtonText = document.createTextNode('SKRAMBULL');
	scrambleButton.appendChild(scrambleButtonText);
	scrambleButton.setAttribute('type', 'submit');
	scrambleButton.setAttribute('id', 'scramble-button');
	document
		.getElementById('scramble-form-container')
		.appendChild(scrambleButton);
};

//this function runs when player submits a word and check if players input is correct. If correct it gets a new word, and if not, it clears inputs for another try
const scrambleButton = (event) => {
	event.preventDefault();
	userInput = '';
	for (i = 0; i < countWord; i++) {
		id = 'scramble-form-input-' + i.toString();
		userInput = userInput + document.getElementById(id).value;
	}

	initialWordLower = initialWord.toLowerCase();
	userInput = userInput.toLowerCase();

	// if player word is not correct
	if (initialWordLower != userInput && countdown != 0) {
		tries++;
		document.getElementById('tries-number').innerHTML = tries;
		var scrambleFormShake = document.getElementById('scramble-form-shake');
		scrambleFormShake.setAttribute('class', 'scramble-form-shake-wrong');
		setTimeout(function () {
			scrambleFormShake.removeAttribute('class');
		}, 2000);
		for (i = 0; i < countWord; i++) {
			id = 'scramble-form-input-' + i.toString();
			document.getElementById(id).value = '';
		}
	}

	// if player word is correct
	if (initialWordLower == userInput) {
		score++;
		document.getElementById('score-number').innerHTML = score;
		var scrambleFormShake = document.getElementById('scramble-form-shake');
		scrambleFormShake.setAttribute('class', 'scramble-form-shake-correct');
		setTimeout(function async() {
			scrambleFormShake.removeAttribute('class');
			var scrambleForm = document.getElementById('scramble-form-container');
			scrambleForm.innerHTML = '';
			countdownNumber = countdownNumberChosen;
			clearTimeout(countdownTimeout);
			getInitialWord();
			tries = 0;
			document.getElementById('tries-number').innerHTML = tries;
		}, 2000);
	}
};

//this function automatically moves on to the next input after use fills a current input
function movetoNext(current) {
	if (
		current.getAttribute &&
		current.value.length == current.getAttribute('maxlength')
	) {
		// console.log(current.getAttribute('id'));
		splitID = current.getAttribute('id').split('-');
		a = parseInt(splitID[3]);
		if (a == countWord - 1) {
			document.getElementById('scramble-button').focus();
		} else {
			i = a + 1;
			nextInput = 'scramble-form-input-' + i.toString();
			// console.log(nextInput);
			document.getElementById(`${nextInput}`).focus();
		}
	}
}
