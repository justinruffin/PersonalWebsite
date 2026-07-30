document.addEventListener("DOMContentLoaded", function () {
	// Set listeners to gather desired difficulty level
	const Difficultybuttons = document.querySelectorAll(".difficulty-btn");
	const Themebuttons = document.querySelectorAll(".theme-btn");
	const grid = document.querySelector(".grid");
	const flagsLeft = document.querySelector("#flags-left");

	// Define themes
	const themeOptions = new Map([
		["default", "default"],
		["classic", "minefield-classic-theme"],
	]);

	// Set overall game theme
	const chooseTheme = (event) => {
		const theme = event.target.dataset.minefieldTheme;

		if (grid.classList.length > 1) {
			grid.classList.remove(grid.classList[1]);
			grid.classList.add(themeOptions.get(theme));
		} else {
			grid.classList.add(themeOptions.get(theme));
		}
	};

	Themebuttons.forEach((button) => {
		button.addEventListener("click", chooseTheme);
	});

	// Controls difficulty buttons, default set to Medium
	let difficulty = "medium";

	const chooseDifficulty = (event) => {
		Difficultybuttons.forEach((button) => {
			button.classList.remove("active-difficulty");
		});
		difficulty = event.target.dataset.level;

		event.target.classList.add("active-difficulty");

		clearGame();
		startGame(difficulty);
	};

	Difficultybuttons.forEach((button) => {
		button.addEventListener("click", chooseDifficulty);
	});

	// Set values for grid size to be used for creating the main grid
	const gridSize = new Map([
		["easy", [10, 10, 10]],
		["medium", [10, 10, 20]],
		["hard", [10, 10, 30]],
	]);

	let gridSizeArray = gridSize.get(difficulty);
	let height = gridSizeArray[0];
	let width = gridSizeArray[1];
	let bombAmount = gridSizeArray[2];

	// Set numbers to be added as classes later, used for CSS styling
	const nums = new Map([
		["1", "one"],
		["2", "two"],
		["3", "three"],
		["4", "four"],
		["5", "five"],
		["6", "six"],
		["7", "seven"],
		["8", "eight"],
	]);

	let size = 10;

	let flags = 0;
	let checkedAmount = 0;

	let isGameOver = false;

	let squares = [];

	// Reset values when new game is started, default to medium
	function startGame(difficulty = "medium") {
		isGameOver = false;
		flags = 0;
		checkedAmount = 0;
		gridSizeArray = gridSize.get(difficulty);
		height = gridSizeArray[0];
		width = gridSizeArray[1];
		bombAmount = gridSizeArray[2];

		createBoard(height, width, bombAmount);
	}

	// Used within difficulty selection to clear previous game info and to start clean
	function clearGame() {
		grid.innerHTML = "";
		squares = [];
		gameArray = [];
	}

	// Builds game board
	function createBoard(height, width, bombAmount) {
		flagsLeft.innerHTML = bombAmount;

		const bombArray = Array(bombAmount).fill("bomb");
		const emptyArray = Array(height * width - bombAmount).fill("valid");
		let gameArray = emptyArray.concat(bombArray);
		shuffle(gameArray);
		console.log(gameArray);

		// Creates each square and fills it with the necessary information
		for (let i = 0; i < size * size; i++) {
			const square = document.createElement("div");
			square.setAttribute("id", i);
			square.setAttribute("class", gameArray[i]);

			grid.appendChild(square);

			squares.push(square);

			// Controls hover over squares
			square.addEventListener("mouseenter", (event) => {
				if ((square.classList.contains("checked") && square.getAttribute("data") === "0") || isGameOver) return;
				square.classList.add("highlighted");
			});

			square.addEventListener("mouseleave", () => {
				square.classList.remove("highlighted");
			});

			// Controls left, right, and middle clicks
			square.addEventListener("mousedown", function (event) {
				if (event.button === 0) {
					leftClick(square);
				} else if (event.button === 2) {
					rightClick(square);
				} else {
					event.preventDefault();
					middleClick(square);
				}
			});

			// Helps with styling of squares when clicking squares, when mouse up is triggered the necessary styling takes place without needing to leave the square first
			square.addEventListener("mouseup", () => {
				if (square.classList.contains("checked") && square.getAttribute("data") !== "0") return;
				if (square.classList.contains("flag") || !square.classList.contains("checked")) return;
				square.classList.remove("highlighted");
			});

			// Removes default behavior from right and middle click
			square.addEventListener("contextmenu", function (event) {
				event.preventDefault();
			});
		}

		for (let i = 0; i < squares.length; i++) {
			let total = 0;

			// Defines left and right sides of the board
			const isLeftEdge = i % size === 0;
			const isRightEdge = i % size === size - 1;

			// Checks adjacent squares to add number as a data value in html element
			if (squares[i].classList.contains("valid")) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
				if (i > 9 && !isRightEdge && squares[i + 1 - size].classList.contains("bomb")) total++;
				if (i >= 10 && squares[i - size].classList.contains("bomb")) total++;
				if (i >= 11 && !isLeftEdge && squares[i - size - 1].classList.contains("bomb")) total++;
				if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
				if (i < 90 && !isLeftEdge && squares[i - 1 + size].classList.contains("bomb")) total++;
				if (i <= 88 && !isRightEdge && squares[i + 1 + size].classList.contains("bomb")) total++;
				if (i <= 89 && squares[i + size].classList.contains("bomb")) total++;
				squares[i].setAttribute("data", total);
			}
		}

		return squares;
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

	// Controls all left click behavior
	function leftClick(square) {
		if (isGameOver || square.classList.contains("checked") || square.classList.contains("flag")) return;

		if (square.classList.contains("bomb")) {
			square.classList.remove("bomb");
			square.classList.add("clickedBomb");
			gameOver();
		} else {
			let total = square.getAttribute("data");
			if (total != 0) {
				square.classList.add("checked");
				checkedAmount++;
				checkWin();
				square.classList.add(nums.get(total));
				square.innerHTML = total;
				return;
			}
			checkSquare(square);
		}
		square.classList.add("checked");
		checkedAmount++;
		checkWin();
	}

	// Controls right click behavior -- Sets/Removes flags
	function rightClick(square) {
		if (isGameOver) return;
		if (!square.classList.contains("checked")) {
			if (!square.classList.contains("flag")) {
				square.classList.add("flag");
				flags++;
				flagsLeft.innerHTML = bombAmount - flags;
			} else {
				square.classList.remove("flag");
				flags--;
				flagsLeft.innerHTML = bombAmount - flags;
			}
		}
		checkWin();
	}

	// Controls middle click behavior -- Allows use of middle square to clear numbers with equal number of adjacent flags
	function middleClick(square) {
		if (isGameOver || !square.classList.contains("checked")) return;
		if (square.classList.contains("checked") && square.getAttribute("data") === "0") return;

		const currentId = parseInt(square.id);
		const isLeftEdge = currentId % size === 0;
		const isRightEdge = currentId % size === size - 1;
		let surroundingFlags = 0;

		// Checks adjacent squares
		if (currentId > 0 && !isLeftEdge && squares[currentId - 1].classList.contains("flag")) surroundingFlags++;
		if (currentId > 9 && !isRightEdge && squares[currentId + 1 - size].classList.contains("flag")) surroundingFlags++;
		if (currentId >= 10 && squares[currentId - size].classList.contains("flag")) surroundingFlags++;
		if (currentId >= 11 && !isLeftEdge && squares[currentId - size - 1].classList.contains("flag")) surroundingFlags++;
		if (currentId < 99 && !isRightEdge && squares[currentId + 1].classList.contains("flag")) surroundingFlags++;
		if (currentId < 90 && !isLeftEdge && squares[currentId - 1 + size].classList.contains("flag")) surroundingFlags++;
		if (currentId <= 88 && !isRightEdge && squares[currentId + 1 + size].classList.contains("flag")) surroundingFlags++;
		if (currentId <= 89 && squares[currentId + size].classList.contains("flag")) surroundingFlags++;

		if (surroundingFlags === parseInt(square.getAttribute("data"))) {
			checkSquare(square);
		}
	}

	// Checks neighboring squares on click -- uses recursion to clear empty squares if found
	function checkSquare(square) {
		const currentId = square.id;
		const isLeftEdge = currentId % size === 0;
		const isRightEdge = currentId % size === size - 1;

		setTimeout(function () {
			if (currentId >= 0 && !isLeftEdge) {
				const newId = parseInt(currentId) - 1;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId > 9 && !isRightEdge) {
				const newId = parseInt(currentId) + 1 - size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId >= 10) {
				const newId = parseInt(currentId) - size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId >= 11 && !isLeftEdge) {
				const newId = parseInt(currentId) - 1 - size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId < 99 && !isRightEdge) {
				const newId = parseInt(currentId) + 1;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId < 90 && !isLeftEdge) {
				const newId = parseInt(currentId) - 1 + size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId <= 88 && !isRightEdge) {
				const newId = parseInt(currentId) + 1 + size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
			if (currentId <= 89) {
				const newId = parseInt(currentId) + size;
				const newSquare = document.getElementById(newId);
				leftClick(newSquare);
			}
		}, 10);
	}

	// Checks to see if the user has won -- Total flags = Bombs
	function checkWin() {
		if (checkedAmount === height * width - bombAmount) {
			squares.forEach(function (square) {
				if (square.classList.contains("bomb")) {
					square.classList.add("flag");
				}
			});
			flagsLeft.innerHTML = "0";

			outcomeAlert("win");

			isGameOver = true;
		}
	}

	// If game results in a loss, reveals all bomb locations
	function gameOver() {
		isGameOver = true;

		//Show all bombs
		squares.forEach(function (square) {
			if (square.classList.contains("bomb")) {
				if (square.classList.contains("flag")) {
					square.classList.remove("flag");
				}
				square.classList.add("checked");
				square.style.backgroundImage = "url(/src/resources/bomb.png)";
			}
		});

		outcomeAlert("lose");
	}


	// Use sweetalert2 library to provide message to user for win/loss
	function outcomeAlert(outcome) {
		//const currentTheme = localStorage.getItem("theme");

		if (outcome === "lose") {
			Swal.fire({
				title: "Better Luck Next Time!",
				text: "Select a Difficulty to Try Again",
				icon: "error",
				//theme: currentTheme,
			});
		} else {
			Swal.fire({
				title: "Winner!",
				text: "Select a Difficulty to Play Again",
				icon: "success",
				//theme: currentTheme,
			});
		}
	}

	startGame();
});
