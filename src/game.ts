enum Player {
  X = "X",
  Y = "Y"
};
type Coordinates = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Cell = Player | null;
type Board = [
  Cell, Cell, Cell,
  Cell, Cell, Cell,
  Cell, Cell, Cell
];
enum Status {
  XWins = Player.X,
  YWins = Player.Y,
  Tie = "TIE",
  Ongoing = "ONGOING"
} 
type GameState = { board: Board, status: Status, currentPlayer: Player }

const makeMove = (
  board: Board,
  player: Player,
  coordinate: Coordinates
): Board => {
  if (board[coordinate] !== null) {
    return board; // same object/reference
  }
  const nextBoard: Board = [...board];
  nextBoard[coordinate] = player;
  return nextBoard;
};

const checkWinner = (
  board: Board
): Status  => {
  const winnerPatterns: [Coordinates, Coordinates, Coordinates][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
  ]
  for (const [first, second, third] of winnerPatterns) {
    if (board[first] && (board[first] === board[second]) && (board[first] === board[third])) {
      return board[first] as unknown as Status;
    }
  }
  if (!board.includes(null)) {
    return Status.Tie;
  }
  return Status.Ongoing;
};