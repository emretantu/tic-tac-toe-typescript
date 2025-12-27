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
const makeMove = (board, player, coordinate) => {
    if (board[coordinate] !== null) {
        return board;
    }
    const nextBoard = [...board];
    nextBoard[coordinate] = player;
    return nextBoard;
};
const checkWinner = (board) => {
    const winnerPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [first, second, third] of winnerPatterns) {
        if (board[first] && (board[first] === board[second]) && (board[first] === board[third])) {
            return board[first];
        }
    }
    if (!board.includes(null)) {
        return Status.Tie;
    }
    return Status.Ongoing;
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
        console.log("Elementi yarattım, x-marked'ı verdim.");
    }
    if (isHighlighted) {
        element.classList.add("highlighted");
    }
    return element;
};
const createCellElements = (gameState, previousCellElements) => {
    const cellElements = gameState.board.map((cell, index) => {
        let cellElement;
        if (cell === Player.X) {
            console.log("x'i gördüm, elementi yaratıyorum");
            cellElement = createCellElement(index, false, true, false);
        }
        else if (cell === Player.O) {
            cellElement = createCellElement(index, true, false, false);
        }
        else {
            cellElement = createCellElement(index, false, false, false);
        }
        cellElement.addEventListener("click", (event) => {
            const targetElement = event.target;
            let targetElementId = parseInt(targetElement.dataset.cellId);
            const newGameState = markCell(gameState, targetElementId, previousCellElements);
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
    console.log(cellElements);
    cellElements.forEach(cellElement => {
        cellElement.remove();
    });
};
const markCell = (gameState, id, previousCellElements) => {
    if (gameState.board[id] === null) {
        gameState.board[id] = gameState.currentPlayer;
        gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
    }
    console.log(gameState);
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
const nextTurn = (gameState, previousCellElements) => {
    const cellElements = createCellElements(gameState, previousCellElements);
    if (previousCellElements.length > 0) {
        clearBoard(previousCellElements);
    }
    drawBoard(cellElements);
    setTurn(gameState.currentPlayer);
};
const startGame = () => {
    const gameState = {
        board: [
            null, null, null,
            null, null, null,
            null, null, null
        ],
        status: Status.Ongoing,
        currentPlayer: Player.X
    };
    nextTurn(gameState, []);
};
startGame();
export {};
//# sourceMappingURL=game.js.map