let board = [
    null, null, null,
    null, null, null,
    null, null, null
];
const makeMove = (board, player, coordinate) => {
    if (board[coordinate] !== null) {
        return board;
    }
    const nextBoard = [...board];
    nextBoard[coordinate] = player;
    return nextBoard;
};
console.log("First", board);
board = makeMove(board, "X", 8);
console.log("Last", board);
export {};
//# sourceMappingURL=game.js.map