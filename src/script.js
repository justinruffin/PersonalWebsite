// Light/Dark Mode

const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem("theme");

const themeToggle = document.querySelector(".theme-toggle");

// Languages & Tools logos
const githubLogo = document.querySelector(".github-logo");

// Index page project card images
const minefield = document.querySelector(".minefield-img");
const minefieldDark = document.querySelector(".minefield-dark-img");
const matching = document.querySelector(".matching-img");
const matchingDark = document.querySelector(".matching-dark-img");
const nfl = document.querySelector(".nfl-img");
const nflDark = document.querySelector(".nfl-dark-img");

// Left/Right click images for minefield page
const minefieldLeftLight = document.querySelector(".minefield-left-light");
const minefieldLeftDark = document.querySelector(".minefield-left-dark");
const minefieldRightLight = document.querySelector(".minefield-right-light");
const minefieldRightDark = document.querySelector(".minefield-right-dark");

// Left click for matching page
const matchingLeftLight = document.querySelector(".matching-left-light");
const matchingLeftDark = document.querySelector(".matching-left-dark");

// Applies theme on start and based on preference
function applyTheme() {
	if (currentTheme) {
		htmlElement.setAttribute("data-theme", currentTheme);

		let theme = htmlElement.getAttribute("data-theme");

		if (theme === "dark") {
			// Home Page
			if (window.location.href.includes("index.html")) {
				minefield.classList.add("hidden");
				minefieldDark.classList.remove("hidden");
				matching.classList.add("hidden");
				matchingDark.classList.remove("hidden");
				nfl.classList.add("hidden");
				nflDark.classList.remove("hidden");
			}

			// Minefield Page
			if (window.location.href.includes("minefield.html")) {
				minefieldLeftLight.classList.add("hidden");
				minefieldLeftDark.classList.remove("hidden");
				minefieldRightLight.classList.add("hidden");
				minefieldRightDark.classList.remove("hidden");
			}

			// Matching Page
			if (window.location.href.includes("matching.html")) {
				matchingLeftLight.classList.add("hidden");
				matchingLeftDark.classList.remove("hidden");
			}

			githubLogo.style.backgroundImage = `url("/src/resources/GitHub_Invertocat_White.svg")`;
		} else {
			// Home Page
			if (window.location.href.includes("index.html")) {
				minefield.classList.remove("hidden");
				minefieldDark.classList.add("hidden");
				matching.classList.remove("hidden");
				matchingDark.classList.add("hidden");
				nfl.classList.remove("hidden");
				nflDark.classList.add("hidden");
			}

			// Minefield Page
			if (window.location.href.includes("minefield.html")) {
				minefieldLeftLight.classList.remove("hidden");
				minefieldLeftDark.classList.add("hidden");
				minefieldRightLight.classList.remove("hidden");
				minefieldRightDark.classList.add("hidden");
			}

			// Matching Page
			if (window.location.href.includes("matching.html")) {
				matchingLeftLight.classList.remove("hidden");
				matchingLeftDark.classList.add("hidden");
			}

			githubLogo.style.backgroundImage = `url("/src/resources/GitHub_Invertocat_Black.svg")`;
		}
	}
}

// Switches images based on theme button click
function switchTheme() {
	let theme = htmlElement.getAttribute("data-theme");
	if (theme === "dark") {
		htmlElement.setAttribute("data-theme", "light");
		localStorage.setItem("theme", "light"); // Save preference

		// Home Page
		if (window.location.href.includes("index.html")) {
			minefield.classList.remove("hidden");
			minefieldDark.classList.add("hidden");
			matching.classList.remove("hidden");
			matchingDark.classList.add("hidden");
			nfl.classList.remove("hidden");
			nflDark.classList.add("hidden");
		}

		// Minefield Page
		if (window.location.href.includes("minefield.html")) {
			minefieldLeftLight.classList.remove("hidden");
			minefieldLeftDark.classList.add("hidden");
			minefieldRightLight.classList.remove("hidden");
			minefieldRightDark.classList.add("hidden");
		}

		// Matching Page
		if (window.location.href.includes("matching.html")) {
			matchingLeftLight.classList.remove("hidden");
			matchingLeftDark.classList.add("hidden");
		}

		githubLogo.style.backgroundImage = `url("/src/resources/GitHub_Invertocat_Black.svg")`;

		themeToggle.innerHTML = '<i class="fa-solid fa-moon fa-lg"></i>';
	} else {
		htmlElement.setAttribute("data-theme", "dark");
		localStorage.setItem("theme", "dark"); // Save preference

		// Home Page
		if (window.location.href.includes("index.html")) {
			minefield.classList.add("hidden");
			minefieldDark.classList.remove("hidden");
			matching.classList.add("hidden");
			matchingDark.classList.remove("hidden");
			nfl.classList.add("hidden");
			nflDark.classList.remove("hidden");
		}

		// Minefield Page
		if (window.location.href.includes("minefield.html")) {
			minefieldLeftLight.classList.add("hidden");
			minefieldLeftDark.classList.remove("hidden");
			minefieldRightLight.classList.add("hidden");
			minefieldRightDark.classList.remove("hidden");
		}

		// Matching Page
		if (window.location.href.includes("matching.html")) {
			matchingLeftLight.classList.add("hidden");
			matchingLeftDark.classList.remove("hidden");
		}

		githubLogo.style.backgroundImage = `url("/src/resources/GitHub_Invertocat_White.svg")`;

		themeToggle.innerHTML = '<i class="fa-solid fa-sun fa-lg"></i>';
	}
}

applyTheme();
