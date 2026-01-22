"use strict"; //Strikt läge, förhindrar vanliga misstag man annars lätt gör

let oGameData = {}; //Samlar allt i ett objekt istället för en massa lösa variabler. Lättare att hålla ordning

//När sidan laddats startas spelet
window.addEventListener("load", () => {
	initGlobalObject(); //skapar startvärden
	prepGame(); //förbereder UI
});

function initGlobalObject() {
	//Spelplanen som består av 9 rutor, ser till att den är tom
	oGameData.gameField = ["", "", "", "", "", "", "", "", ""];

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

	//Referens till olika element
	oGameData.timeRef = document.querySelector("#errorMsg");
	oGameData.gameAreaRef = document.querySelector("#gameArea");
	oGameData.theFormRef = document.querySelector("#theForm");
	oGameData.tableRef = document.querySelector(".ml-auto");
	oGameData.jumboRef = document.querySelector(".jumbotron h1");
}

//Kollar om spelet är slut, returnerar de olika beroende på resultat av spelet
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

	//loopar igenom alla kombinationer
	for (let win of isWinner) {
		const [a, b, c] = win;
		//om alla tre rutorna innehåller samma spelare så är det vinst
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

//förbereder spelet innan start, döljer spelplanen och kopplar startknappen
function prepGame() {
	oGameData.gameAreaRef.classList.add("d-none");

	document.querySelector("#newGame").addEventListener("click", initiateGame);
}

//startar en ny match
function initiateGame() {
	//gömmer formuläret och visar spelplanen
	oGameData.theFormRef.classList.add("d-none");
	oGameData.gameAreaRef.classList.remove("d-none");

	document.querySelector("#errorMsg").textContent = "";

	//hämtar namn och färger från inputfälten
	oGameData.nickNamePlayerOne = document.querySelector("#nick1").value;
	oGameData.colorPlayerOne = document.querySelector("#color1").value;
	oGameData.nickNamePlayerTwo = document.querySelector("#nick2").value;
	oGameData.colorPlayerTwo = document.querySelector("#color2").value;

	//tömmer spelplanen visuellt och ser till att det är tomt
	const tds = oGameData.tableRef.querySelectorAll("td");
	tds.forEach((td) => {
		td.textContent = "";
		td.style.backgroundColor = "#ffffff";
	});

	let playerChar = "";
	let playerName = "";

	//slumpar fram vem som börjar
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
	//klick på spelplanen aktiverar ett drag
	oGameData.tableRef.addEventListener("click", executeMove);
}

//Körs varje gång en ruta klickas och lägger ut antingen X eller O
function executeMove(event) {
	//om inget td klickas
	if (event.target.tagName !== "TD") return;

	//vilket index i arrayen motsvarar rutan?
	const index = Number(event.target.getAttribute("data-id"));
	if (!Number.isInteger(index)) return;

	if (oGameData.gameField[index] !== "") return;

	//spara drag i arrayen
	oGameData.gameField[index] = oGameData.currentPlayer;

	//uppdatera UI och byt spelare
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
	//kollar om matchen är slut
	const result = checkForGameOver();
	if (result !== 0) gameOver(result);
}

//hanterar slutet av spelet
function gameOver(result) {
	//stoppa klick
	oGameData.tableRef.removeEventListener("click", executeMove);

	//visa formulär igen
	oGameData.theFormRef.classList.remove("d-none");
	oGameData.gameAreaRef.classList.add("d-none");

	//visa resultattext
	if (result === 1) {
		oGameData.jumboRef.textContent = `${oGameData.nickNamePlayerOne} vann! Spela igen?`;
	} else if (result === 2) {
		oGameData.jumboRef.textContent = `${oGameData.nickNamePlayerTwo} vann! Spela igen?`;
	} else {
		oGameData.jumboRef.textContent = `Oavgjort! Spela igen?`;
	}

	//återställ allt
	initGlobalObject();
}

// Nedanstående funktioner väntar vi med!
function validateForm() {}

function timer() {}
