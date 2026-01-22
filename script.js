"use strict";

/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};

window.addEventListener("load", () => {
	initGlobalObject();
	prepGame();
});

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
function initGlobalObject() {
	//Datastruktur för vilka platser som är lediga respektive har brickor
	//Genom at fylla i här med antingen X eler O kan ni testa era rättningsfunktioner
	oGameData.gameField = ["", "", "", "", "", "", "", "", ""];

	/* Testdata för att testa rättningslösning */
	//oGameData.gameField = ['X', 'X', 'X',
	//                        '', '', '',
	//                        '', '', ''];
	//oGameData.gameField = ['X', '', '',
	//                       'X', '', '',
	//                       'X', '', ''];
	//oGameData.gameField = ['X', '', '',
	//                       '', 'X', '',
	//                       '', '', 'X'];
	//oGameData.gameField = ['', '', 'O',
	//                       '', 'O', '',
	//                       'O', '', ''];
	//oGameData.gameField = ['X', 'O', 'X',
	//                       '0', 'X', 'O',
	//                       'O', 'X', 'O'];

	//Indikerar tecknet som skall användas för spelare ett.
	oGameData.playerOne = "X";

	//Indikerar tecknet som skall användas för spelare två.
	oGameData.playerTwo = "O";

	//Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
	oGameData.currentPlayer = "";

	//Nickname för spelare ett som tilldelas från ett formulärelement,
	oGameData.nickNamePlayerOne = "";

	//Nickname för spelare två som tilldelas från ett formulärelement.
	oGameData.nickNamePlayerTwo = "";

	//Färg för spelare ett som tilldelas från ett formulärelement.
	oGameData.colorPlayerOne = "";

	//Färg för spelare två som tilldelas från ett formulärelement.
	oGameData.colorPlayerTwo = "";

	//Antalet sekunder för timerfunktionen
	oGameData.seconds = 5;

	//Timerns ID
	oGameData.timerId = null;

	//Från start är timern inaktiverad
	oGameData.timerEnabled = false;

	//Referens till element för felmeddelanden
	oGameData.timeRef = document.querySelector("#errorMsg");
	oGameData.gameAreaRef = document.querySelector("#gameArea");
	oGameData.theFormRef = document.querySelector("#theForm");
	oGameData.tableRef = document.querySelector(".ml-auto");
	oGameData.jumboRef = document.querySelector(".jumbotron h1");
}

//console.log(oGameData.gameField);

/**
 * Kontrollerar för tre i rad genom att anropa funktionen checkWinner() och checkForDraw().
 * Returnerar 0 om spelet skall fortsätta,
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */
function checkForGameOver() {
	if (checkWinner(oGameData.playerOne)) {
		return 1;
	} else if (checkWinner(oGameData.playerTwo)) {
		return 2;
	} else if (checkForDraw()) {
		return 3;
	} else {
		return 0;
	}
}

// Säg till om ni vill få pseudokod för denna funktion
// Viktigt att funktionen returnerar true eller false baserat på om den inskickade spelaren är winner eller ej
function checkWinner(playerIn) {
	// ska kontrollera om spelaren har 3 i rad, antingen är det true eller false

	const isWinner = [
		//alla möjliga vinstkombinationer, det finns 8 totalt, och om hela fältet är ifyllt. Den visar enbart vart fältet är ifyllt, inte vem som fyllt i det.
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let win of isWinner) {
		const [a, b, c] = win;
		if (
			oGameData.gameField[a] === playerIn &&
			oGameData.gameField[b] === playerIn &&
			oGameData.gameField[c] === playerIn
		) {
			return true;
		}
	}
	return false;
}
//Kontrollera om alla platser i oGameData.GameField är fyllda. Om sant returnera true, annars false.
function checkForDraw() {
	if (oGameData.gameField.every((index) => index !== "")) {
		return true;
	} else {
		return false;
	}
}
function prepGame() {
	oGameData.gameAreaRef.classList.add("d-none");

	document.querySelector("#newGame").addEventListener("click", initiateGame);
	//console.log(prepGame);
}

function initiateGame() {
	oGameData.theFormRef.classList.add("d-none");
	oGameData.gameAreaRef.classList.remove("d-none");

	document.querySelector("#errorMsg").textContent = "";

	oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
	oGameData.colorPlayerOne = document.querySelector("#color1").value;
	oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;
	oGameData.colorPlayerTwo = document.querySelector("#color2").value;

	oGameData.gameField = ["", "", "", "", "", "", "", "", ""];
	const tds = oGameData.tableRef.querySelectorAll("td");
	tds.forEach((td) => {
		td.textContent = "";
		td.style.backgroundColor = "#ffffff";
	});

	let playerChar = "";
	let playerName = "";

	const rand = Math.random();
	if (rand < 0.5) {
		playerChar = oGameData.playerOne;
		playerName = oGameData.nickNamePlayerOne;
		oGameData.currentPlayer = oGameData.playerOne;
	} else {
		playerChar = oGameData.playerTwo;
		playerName = oGameData.nickNamePlayerTwo;
		oGameData.currentPlayer = oGameData.playerTwo;
	}

	oGameData.jumboRef.textContent = `Aktuell spelare är ${playerName}`;
	oGameData.tableRef.addEventListener("click", executeMove);
}

function executeMove(event) {
	if (event.target.tagName !== "TD") return;

	const index = Number(event.target.getAttribute("data-id"));
	if (!Number.isInteger(index)) return;

	if (oGameData.gameField[index] !== "") return;

	oGameData.gameField[index] = oGameData.currentPlayer;

	if (oGameData.currentPlayer === oGameData.playerOne) {
		event.target.textContent = oGameData.playerOne;
		event.target.style.backgroundColor = oGameData.colorPlayerOne;

		oGameData.currentPlayer = oGameData.playerTwo;
		oGameData.jumboRef.textContent = `Aktuell spelare är ${oGameData.nickNamePlayerTwo}`;
	} else {
		event.target.textContent = oGameData.playerTwo;
		event.target.style.backgroundColor = oGameData.colorPlayerTwo;

		oGameData.currentPlayer = oGameData.playerOne;
		oGameData.jumboRef.textContent = `Aktuell spelare är ${oGameData.nickNamePlayerOne}`;
	}
	const result = checkForGameOver();
	if (result !== 0) gameOver(result);
}

function gameOver(result) {
	oGameData.tableRef.removeEventListener("click", executeMove);

	oGameData.theFormRef.classList.remove("d-none");
	oGameData.gameAreaRef.classList.add("d-none");

	if (result === 1) {
		oGameData.jumboRef.textContent = `${oGameData.nickNamePlayerOne} vann! Spela igen?`;
	} else if (result === 2) {
		oGameData.jumboRef.textContent = `${oGameData.nickNamePlayerTwo} vann! Spela igen?`;
	} else {
		oGameData.jumboRef.textContent = `Oavgjort! Spela igen?`;
	}

	initGlobalObject();
}

// Nedanstående funktioner väntar vi med!
function validateForm() {}

function timer() {}
