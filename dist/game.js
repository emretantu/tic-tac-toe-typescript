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
const nextRound = (gameState) => {
    gameState.board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];
    if (gameState.status === Status.XWins) {
        gameState.XScore++;
    }
    else if (gameState.status === Status.OWins) {
        gameState.OScore++;
    }
    else if (gameState.status === Status.Tie) {
        gameState.TieScore++;
    }
    gameState.status = Status.Ongoing;
    if ((gameState.XScore + gameState.OScore + gameState.TieScore) % 2 === 0) {
        gameState.currentPlayer = Player.X;
    }
    else {
        gameState.currentPlayer = Player.O;
    }
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
        setTimeout(() => alert("Next Round"), 0);
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
        XScore: 0,
        OScore: 0,
        TieScore: 0,
    };
    nextTurn(gameState, []);
};
startGame();
export {};
//# sourceMappingURL=game.js.map