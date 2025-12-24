type Player = "X" | "O";
type Coordinates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Cell = Player | null;
type Board = [
  Cell, Cell, Cell,
  Cell, Cell, Cell,
  Cell, Cell, Cell
];

let board: Board = [
  null, null, null,
  null, null, null,
  null, null, null
]

const makeMove = (
  board: Board,
  player: Player,
  coordinate: Coordinates
): Board => {
  if (board[coordinate] !== null) {
    return board; // ??? NULL? STATUS?
  }
  const nextBoard: Board = [...board];
  nextBoard[coordinate] = player;
  return nextBoard;
};

console.log("First", board);

board = makeMove(board, "X", 8);

console.log("Last", board);