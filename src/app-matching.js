document.addEventListener("DOMContentLoaded", function () {
	const Difficultybuttons = document.querySelectorAll(".difficulty-btn");
	const matchingGameBoard = document.querySelector(".matching-game-board");
	const matchesLeft = document.querySelector("#matches-left");

	//Emoji bank uses to select game board icons from. To fully function array must have at least 18 to account for hard difficulty
	const emojiList = ["🔥", "✨", "🌤️", "🌋", "🏝️", "⚡", "❄️", "🪷", "🌸", "🦈", "🐬", "🐳", "🐦‍🔥", "🌷", "🪻", "🚀", "⚓", "🍇", "🍉", "🥭", "🍬", "🍭"];

	const boardSizeValues = new Map([
		["easy", [4, 4, "360px", "360px"]],
		["medium", [4, 6, "360px", "540px"]],
		["hard", [6, 6, "540px", "540px"]],
	]);

	let remaining = 0;
	let gameArray = [];

	let isGameOver = false;
	let boardLock = false;
	let difficulty = "medium";

	let card1, card2;

	const chooseDifficulty = (event) => {
		Difficultybuttons.forEach((button) => {
			button.classList.remove("active-difficulty");
		});
		difficulty = event.target.dataset.level;

		event.target.classList.add("active-difficulty");

		clearGame();
		createBoard(difficulty);
	};

	Difficultybuttons.forEach((button) => {
		button.addEventListener("click", chooseDifficulty);
	});

	function createBoard(difficulty = "medium") {
		const boardSize = boardSizeValues.get(difficulty);
		const boardHeightNum = boardSize[0];
		const boardWidthNum = boardSize[1];
		const boardHeight = boardSize[2];
		const boardWidth = boardSize[3];

		matchingGameBoard.style.height = boardHeight;
		matchingGameBoard.style.width = boardWidth;

		remaining = (boardHeightNum * boardWidthNum) / 2;
		matchesLeft.innerHTML = remaining;

		gameArray = fillGameArray(boardHeightNum, boardWidthNum);

		shuffle(gameArray);

		console.log(gameArray);

		for (let i = 0; i < boardHeightNum * boardWidthNum; i++) {
			const card = document.createElement("div");
			card.setAttribute("class", "gameCard card-front");
			card.setAttribute("id", i);
			card.setAttribute("data", gameArray[i]);
			card.innerHTML = "?";

			matchingGameBoard.append(card);

			card.addEventListener("mousedown", function (event) {
				if (event.button === 0) {
					checkCard(card);
				} else {
					event.preventDefault();
				}
			});

			card.addEventListener("contextmenu", function (event) {
				event.preventDefault();
			});
		}
	}

	//Takes game size and creates an array of random emojis from the emojiList array
	function fillGameArray(height, width) {
		let emojis = [...emojiList]; //Makes copy so the original array stays intact
		let filledArray = [];
		let arrayAmount = (height * width) / 2;

		for (let i = 0; i < arrayAmount; i++) {
			//Selects emojis at random
			let randomIndex = Math.floor(Math.random() * emojis.length);
			filledArray[i] = emojis.splice(randomIndex, 1)[0];
		}

		filledArray = [...filledArray, ...filledArray]; //Doubles the array size to have matching pairs

		return filledArray;
	}

	//Shuffles the game array using Fisher-Yates method
	function shuffle(array) {
		let current = array.length;

		while (current != 0) {
			let randomIndex = Math.floor(Math.random() * current);
			current--;

			[array[current], array[randomIndex]] = [array[randomIndex], array[current]];
		}
	}

	function checkCard(card) {
		if (boardLock || card.classList.contains("matched")) {
			return;
		}

		if (card1 == null) {
			card1 = card;
			card.classList.remove("card-front");
			card.classList.add("card-back");
			card.innerHTML = card.getAttribute("data");
		} else if (card2 == null) {
			card2 = card;
			if (card2 === card1) {
				card2 = null;
				return;
			}
			card.classList.remove("card-front");
			card.classList.add("card-back");
			card.innerHTML = card.getAttribute("data");
			checkMatch();
		} else {
			boardLock = true;
		}
	}

	function clearGame() {
		matchingGameBoard.innerHTML = "";
		gameArray = [];
		card1 = null;
		card2 = null;
		boardLock = false;
	}

	function checkMatch() {
		if (card1.getAttribute("data") === card2.getAttribute("data")) {
			card1.classList.add("matched");
			card2.classList.add("matched");
			card1 = null;
			card2 = null;
			boardLock = false;
			remaining--;
			matchesLeft.innerHTML = remaining;
			checkWin();
		} else {
			setTimeout(() => {
				card1.classList.remove("card-back");
				card1.classList.add("card-front");
				card1.innerHTML = "?";
				card2.classList.remove("card-back");
				card2.classList.add("card-front");
				card2.innerHTML = "?";
				card1 = null;
				card2 = null;
				boardLock = false;
			}, 1000);
		}
	}

	function checkWin() {
		if (remaining == 0) {
			Swal.fire({
				title: "Winner!",
				text: "Select a Difficulty to Play Again",
				icon: "success",
			});
		}
	}

	createBoard();
});
