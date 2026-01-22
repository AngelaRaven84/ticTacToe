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

	oGameData.nick1Ref = document.querySelector("#nick1");
	oGameData.nick2Ref = document.querySelector("#nick2");
	oGameData.color1Ref = document.querySelector("#color1");
	oGameData.color2Ref = document.querySelector("#color2");
}

//Kollar om spelet är slut, returnerar de olika beroende på resultat av spelet
function checkForGameOver() {
	if (checkWinner(oGameData.playerOne)) return 1;
	if (checkWinner(oGameData.playerTwo)) return 2;
	if (checkForDraw()) return 3;
	return 0;
}

const winningCombos = [
	//alla möjliga vinstkombinationer (8st)
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

// ska kontrollera om spelaren har 3 i rad, antingen är det true eller false
function checkWinner(playerIn) {
	//loopar igenom alla kombinationer
	for (const [a, b, c] of winningCombos) {
		//om alla tre rutorna innehåller samma spelare så är det vinst
		if (
			oGameData.gameField[a] === playerIn &&
			oGameData.gameField[b] === playerIn &&
			oGameData.gameField[c] === playerIn
		)
			return true;
	}
	return false;
}

//Kontrollera om alla platser i oGameData.gameField är fyllda. Om sant returnera true, annars false.
function checkForDraw() {
	return oGameData.gameField.every((cell) => cell !== "");
}

//förbereder spelet innan start, döljer spelplanen och kopplar startknappen
function prepGame() {
	oGameData.gameAreaRef.classList.add("d-none");

	document.querySelector("#newGame").addEventListener("click", (e) => {
		e.preventDefault();
		initiateGame();
	});
}

//startar en ny match
function initiateGame() {
	//gömmer formuläret och visar spelplanen
	oGameData.theFormRef.classList.add("d-none");
	oGameData.gameAreaRef.classList.remove("d-none");

	//stoppa klick
	oGameData.tableRef.removeEventListener("click", executeMove);

	oGameData.timeRef.textContent = "";

	//hämtar namn och färger från inputfälten
	oGameData.nickNamePlayerOne = oGameData.nick1Ref.value;
	oGameData.colorPlayerOne = oGameData.color1Ref.value;
	oGameData.nickNamePlayerTwo = oGameData.nick2Ref.value;
	oGameData.colorPlayerTwo = oGameData.color2Ref.value;

	//Säkerställer att arrayen är ordentligt nollställd
	oGameData.gameField = ["", "", "", "", "", "", "", "", ""];
	//tömmer spelplanen visuellt och ser till att det är tomt
	const tds = oGameData.tableRef.querySelectorAll("td");
	tds.forEach((td) => {
		td.textContent = "";
		td.style.backgroundColor = "#ffffff";
	});

	let playerName = "";

	//slumpar fram vem som börjar
	const rand = Math.random();
	if (rand < 0.5) {
		playerName = oGameData.nickNamePlayerOne;
		oGameData.currentPlayer = oGameData.playerOne;
	} else {
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
