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
const board = [
    Player.X, null, null,
    null, null, Player.O,
    null, null, null
];
let status = Status.Ongoing;
let currentPlayer = Player.X;
const gameState = { board, status, currentPlayer };
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
const cellElements = board.map((cell, index) => {
    if (cell === Player.X) {
        return createCellElement(index, false, true, false);
    }
    if (cell === Player.O) {
        return createCellElement(index, true, false, false);
    }
    return createCellElement(index, false, false, false);
});
cellElements.forEach(cellElement => {
    gridElement === null || gridElement === void 0 ? void 0 : gridElement.prepend(cellElement);
});
export {};
//# sourceMappingURL=game.js.map