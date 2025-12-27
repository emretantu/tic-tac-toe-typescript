var Player;
(function (Player) {
    Player["X"] = "X";
    Player["O"] = "O";
})(Player || (Player = {}));
;
var Status;
(function (Status) {
    Status["XWins"] = "X";
    Status["OWins"] = "O";
    Status["Tie"] = "TIE";
    Status["Ongoing"] = "ONGOING";
})(Status || (Status = {}));
const checkWinner = (gameState) => {
    const winnerPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [first, second, third] of winnerPatterns) {
        if (gameState.board[first] && (gameState.board[first] === gameState.board[second]) && (gameState.board[first] === gameState.board[third])) {
            const status = gameState.board[first];
            gameState.status = status;
            return [first, second, third];
        }
    }
    if (!gameState.board.includes(null)) {
        gameState.status = Status.Tie;
        return null;
    }
    gameState.status = Status.Ongoing;
    return null;
};
const modal = document.querySelector("dialog");
modal.showModal();
const createModalContent = (sub, message, button2Text, button1Text, button2Callback, button1Callback, status) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'modal-content';
    wrapper.innerHTML = `
    <div class="message ${status === "notr" ? "" : status}">
      ${sub ? '<p class="sub">${sub}</p>' : ""}
      <div class="main">
        <div class="img"></div>
        <p class="message-text">${message}</p>
      </div>
    </div>
      <div class="buttons">
      <button class="secondary-button-2">${button2Text}</button>
      <button class="secondary-button-1">${button1Text}</button>
    </div>
  `;
    const btn1 = wrapper.querySelector('.secondary-button-1');
    const btn2 = wrapper.querySelector('.secondary-button-2');
    btn1.addEventListener('click', () => button1Callback());
    btn2.addEventListener('click', () => button2Callback());
    return wrapper;
};
const openModal = (modalContent, modal) => {
    modal === null || modal === void 0 ? void 0 : modal.replaceChildren(modalContent);
};
const appElement = document.querySelector(".app");
const gridElement = document.querySelector(".app .grid");
const createCellElement = (id, isOMarked, isXMarked, isHighlighted) => {
    const element = document.createElement("div");
    element.dataset.cellId = id.toString();
    if (isOMarked && isXMarked) {
        throw new Error("A cell cannot contain both X and O.");
    }
    element.classList.add("cell");
    if (isOMarked) {
        element.classList.add("o-marked");
    }
    if (isXMarked) {
        element.classList.add("x-marked");
    }
    if (isHighlighted) {
        element.classList.add("highlighted");
    }
    return element;
};
const createCellElements = (gameState, previousCellElements, winnerPatterns) => {
    const cellElements = gameState.board.map((cell, index) => {
        let isHighlighted = false;
        if (winnerPatterns) {
            isHighlighted = winnerPatterns.includes(index);
        }
        let cellElement;
        if (cell === Player.X) {
            cellElement = createCellElement(index, false, true, isHighlighted);
        }
        else if (cell === Player.O) {
            cellElement = createCellElement(index, true, false, isHighlighted);
        }
        else {
            cellElement = createCellElement(index, false, false, isHighlighted);
        }
        cellElement.addEventListener("click", (event) => {
            const targetElement = event.target;
            let targetElementId = parseInt(targetElement.dataset.cellId);
            markCell(gameState, targetElementId, previousCellElements);
        });
        return cellElement;
    });
    previousCellElements = cellElements;
    return cellElements;
};
const drawBoard = (cellElements) => {
    const reversedElements = cellElements.reverse();
    reversedElements.forEach(cellElement => {
        gridElement === null || gridElement === void 0 ? void 0 : gridElement.prepend(cellElement);
    });
};
const clearBoard = (cellElements) => {
    cellElements.forEach(cellElement => {
        cellElement.remove();
    });
};
const markCell = (gameState, id, previousCellElements) => {
    if (gameState.status !== Status.Ongoing) {
        return;
    }
    if (gameState.board[id] === null) {
        gameState.board[id] = gameState.currentPlayer;
        gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
    }
    nextTurn(gameState, previousCellElements);
};
const setTurn = (whoseTurn) => {
    if (whoseTurn === Player.X) {
        appElement === null || appElement === void 0 ? void 0 : appElement.classList.remove("o-turn");
        appElement === null || appElement === void 0 ? void 0 : appElement.classList.add("x-turn");
    }
    else {
        appElement === null || appElement === void 0 ? void 0 : appElement.classList.remove("x-turn");
        appElement === null || appElement === void 0 ? void 0 : appElement.classList.add("o-turn");
    }
};
const xScoreElement = document.querySelector(".x-wins .count");
const oScoreElement = document.querySelector(".o-wins .count");
const tieScoreElement = document.querySelector(".ties .count");
const setScore = (gameState) => {
    xScoreElement.innerHTML = gameState.xScore.toString();
    oScoreElement.innerHTML = gameState.oScore.toString();
    tieScoreElement.innerHTML = gameState.tieScore.toString();
};
const nextRound = (gameState) => {
    gameState.board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    if (gameState.status === Status.XWins) {
        gameState.xScore++;
    }
    else if (gameState.status === Status.OWins) {
        gameState.oScore++;
    }
    else if (gameState.status === Status.Tie) {
        gameState.tieScore++;
    }
    gameState.status = Status.Ongoing;
    if ((gameState.xScore + gameState.oScore + gameState.tieScore) % 2 === 0) {
        gameState.currentPlayer = Player.X;
    }
    else {
        gameState.currentPlayer = Player.O;
    }
    setScore(gameState);
};
const nextTurn = (gameState, previousCellElements) => {
    const winnerPattern = checkWinner(gameState);
    if (previousCellElements.length > 0) {
        clearBoard(previousCellElements);
    }
    const cellElements = createCellElements(gameState, previousCellElements, winnerPattern);
    drawBoard(cellElements);
    setTurn(gameState.currentPlayer);
    if (gameState.status !== Status.Ongoing) {
        nextRound(gameState);
        nextTurn(gameState, cellElements);
    }
};
const startGame = () => {
    const gameState = {
        board: [
            null, null, null,
            null, null, null,
            null, null, null
        ],
        status: Status.Ongoing,
        currentPlayer: Player.X,
        xScore: 0,
        oScore: 0,
        tieScore: 0,
    };
    setScore(gameState);
    nextTurn(gameState, []);
};
startGame();
export {};
//# sourceMappingURL=game.js.map