var Player;
(function (Player) {
    Player["X"] = "X";
    Player["Y"] = "Y";
})(Player || (Player = {}));
;
var Status;
(function (Status) {
    Status["XWins"] = "X";
    Status["YWins"] = "Y";
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
export {};
//# sourceMappingURL=game.js.map