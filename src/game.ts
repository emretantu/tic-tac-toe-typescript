enum Player {
  X = "X",
  O = "O"
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
  OWins = Player.O,
  Tie = "TIE",
  Ongoing = "ONGOING"
} 
type GameState = {
  board: Board,
  status: Status,
  currentPlayer: Player,
  xScore: number,
  oScore: number,
  tieScore: number,
  xPlayer: string,
  oPlayer: string,
  multiplayer: boolean,
  humanPlayer: Player | undefined
}

// const makeMove = (
//   board: Board,
//   player: Player,
//   coordinate: Coordinates
// ): Board => {
//   if (board[coordinate] !== null) {
//     return board; // same object/reference
//   }
//   const nextBoard: Board = [...board];
//   nextBoard[coordinate] = player;
//   return nextBoard;
// };

const checkWinner = (
  gameState: GameState
): [Coordinates, Coordinates, Coordinates] | null => {
  const winnerPatterns: [Coordinates, Coordinates, Coordinates][] = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
    [0, 4, 8], [2, 4, 6] // Diagonal
  ]
  for (const [first, second, third] of winnerPatterns) {
    if (gameState.board[first] && (gameState.board[first] === gameState.board[second]) && (gameState.board[first] === gameState.board[third])) {
      const status = gameState.board[first] as unknown as Status;
      gameState.status = status;
      return [first, second, third]
    }
  }
  if (!gameState.board.includes(null)) {
    gameState.status = Status.Tie;
    return null;
  }
  gameState.status = Status.Ongoing;
  return null;
};

// UI/UX

const modal = document.querySelector<HTMLDialogElement>("dialog");

enum ModalStatus {
  Notr = "notr",
  XTakes = "x-takes",
  OTakes = "o-takes"
}

const createModalContent = (
  sub: string,
  message: string,
  button2Text: string,
  button1Text: string,
  button2Callback: Function,
  button1Callback: Function,
  modalStatus: ModalStatus
): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.className = 'modal-content';


  wrapper.innerHTML = `
    <div class="message ${modalStatus === "notr" ? "" : modalStatus}">
      ${sub ? `<p class="sub">${sub}</p>` : ""}
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

  const btn1 = wrapper.querySelector('.secondary-button-1') as HTMLButtonElement;
  const btn2 = wrapper.querySelector('.secondary-button-2') as HTMLButtonElement;

  btn1.addEventListener('click', () => button1Callback());
  btn2.addEventListener('click', () => button2Callback());

  return wrapper;
}

const openModal = (modalContent: HTMLElement, modal: HTMLDialogElement) => {
  modal?.replaceChildren(modalContent);
  modal.showModal();
}

const closeModal = (modal: HTMLDialogElement | null) => {
  modal?.close();
}


const appElement = document.querySelector<HTMLElement>(".app");
const gridElement = document.querySelector<HTMLElement>(".app .grid");
const startElement = document.querySelector<HTMLElement>(".start");
const xSelectionElement = document.querySelector<HTMLElement>(".start .x-selection");
const oSelectionElement = document.querySelector<HTMLElement>(".start .o-selection");
const humanVsCpuButtonElement = document.querySelector<HTMLElement>(".start .human-vs-cpu");
const multiplayerButtonElement = document.querySelector<HTMLElement>(".start .multiplayer");


const openStartScreen = () => {
  appElement?.classList.add("hide")
  startElement?.classList.remove("hide");
}

xSelectionElement?.addEventListener("click", () => {
  oSelectionElement?.classList.remove("selected");
  xSelectionElement.classList.add("selected");
});

oSelectionElement?.addEventListener("click", () => {
  xSelectionElement?.classList.remove("selected");
  oSelectionElement.classList.add("selected");
});

const getPlayer = (): Player => {
  return xSelectionElement?.classList.contains("selected") ? Player.X : Player.O;
}

humanVsCpuButtonElement?.addEventListener("click", () => {
    startGame(false, getPlayer());
});

multiplayerButtonElement?.addEventListener("click", () => {
    startGame(true, getPlayer());
});

const createCellElement = (
  id: number,
  isOMarked: boolean,
  isXMarked: boolean,
  isHighlighted: boolean
): HTMLElement => {
  const element = document.createElement("div");
  element.dataset.cellId = id.toString();
  if (isOMarked && isXMarked) {
    throw new Error("A cell cannot contain both X and O.")
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
}

const createCellElements = (
  gameState: GameState,
  winnerPatterns: [Coordinates, Coordinates, Coordinates] | null,
  isClickable: boolean
): HTMLElement[] => {
  const cellElements = gameState.board.map((cell, index) => {
    let isHighlighted: boolean = false;
    if (winnerPatterns) {
      isHighlighted = winnerPatterns.includes(index as Coordinates);
    }
    let cellElement;
    if (cell === Player.X) {
      cellElement = createCellElement(index, false, true, isHighlighted);
    }
    else if (cell === Player.O) {
      cellElement = createCellElement(index, true, false, isHighlighted);
    } else {
      cellElement = createCellElement(index, false, false, isHighlighted);
    }
    if (isClickable) {
      cellElement.addEventListener("click", (event) => {
        const targetElement = event.target as HTMLElement;
        let targetElementId: number = parseInt(targetElement.dataset.cellId as string);
        markCell(gameState, targetElementId);
      });
    }
    return cellElement;
  });
  return cellElements;
}

let previousCellElements: HTMLElement[] = [];
const drawBoard = (cellElements: HTMLElement[]): void => {
  clearBoard(previousCellElements);
  previousCellElements = cellElements;
  const reversedElements = cellElements.reverse();
  reversedElements.forEach(cellElement => {
    gridElement?.prepend(cellElement);
  });
}

const clearBoard = (cellElements: HTMLElement[]): void => {
  cellElements.forEach(cellElement => {
    cellElement.remove();
  })
}

const markCell = (gameState: GameState, id: number): void => {
  if (gameState.status !== Status.Ongoing) {
    return;
  }
  if (gameState.board[id] === null) {
    gameState.board[id] = gameState.currentPlayer;
    gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
  }
  nextTurn(gameState);
}

const makeCpuMove = (gameState: GameState): void => {
  if (gameState.status !== Status.Ongoing) {
    return;
  }
  while (true) {
    const randomCoordinate = Math.floor(Math.random() * 10);
    if (gameState.board[randomCoordinate] === null) {
      markCell(gameState, randomCoordinate)
      break;
    }
  }
}

const setTurn = (whoseTurn: Player): void => {
  if (whoseTurn === Player.X) {
    appElement?.classList.remove("o-turn");
    appElement?.classList.add("x-turn");
  } else {
    appElement?.classList.remove("x-turn");
    appElement?.classList.add("o-turn");
  }
}

const xPlayerNameElement = document.querySelector<HTMLElement>(".x-wins .name");
const oPlayerNameElement = document.querySelector<HTMLElement>(".o-wins .name");
const setPlayerName = (gameState: GameState) => {
  xPlayerNameElement!.innerHTML = `X (${gameState.xPlayer})`;
  oPlayerNameElement!.innerHTML = `O (${gameState.oPlayer})`;
}

const xScoreElement = document.querySelector<HTMLElement>(".x-wins .count");
const oScoreElement = document.querySelector<HTMLElement>(".o-wins .count");
const tieScoreElement = document.querySelector<HTMLElement>(".ties .count");
const setScore = (gameState: GameState) => {
  xScoreElement!.innerHTML = gameState.xScore.toString();
  oScoreElement!.innerHTML = gameState.oScore.toString();
  tieScoreElement!.innerHTML = gameState.tieScore.toString();
}

const resolveRoundEnd = (gameState: GameState) => {
  const button2Callback = () => {
    nextRound(gameState);
    nextTurn(gameState);
    closeModal(modal);
  }
  const button1Callback = () => {
    openStartScreen();
    closeModal(modal);
  }
  const button2Text = "QUIT";
  const button1Text = "NEXT ROUND";
  let sub = "";
  let message = "";
  let modalStatus = ModalStatus.Notr;

  switch (gameState.status) {
    case Status.Tie:
      sub = "";
      message = "ROUND TIED";
      modalStatus = ModalStatus.Notr
      break;

    case Status.XWins:
      sub = gameState.xPlayer.toUpperCase() + " WINS!";
      message = "TAKES THE ROUND";
      modalStatus = ModalStatus.XTakes
      break;

    case Status.OWins:
      sub = gameState.oPlayer.toUpperCase() + " WINS!";;
      message = "TAKES THE ROUND";
      modalStatus = ModalStatus.OTakes
      break;
  }

  openModal(
    createModalContent(
      sub, 
      message, 
      button2Text, 
      button1Text, 
      button1Callback, 
      button2Callback, 
      modalStatus
    ),
    modal as HTMLDialogElement
  );
}

const nextRound = (gameState: GameState): void => {
  gameState.board = [
    null, null, null,
    null, null, null,
    null, null, null
  ];
  if (gameState.status === Status.XWins) {
    gameState.xScore++;
  } else if (gameState.status === Status.OWins) {
    gameState.oScore++;
  } else if (gameState.status === Status.Tie) {
    gameState.tieScore++;
  }
  gameState.status = Status.Ongoing;
  if ((gameState.xScore + gameState.oScore + gameState.tieScore) % 2 === 0) {
    gameState.currentPlayer = Player.X;
  } else {
    gameState.currentPlayer = Player.O;
  }
  setScore(gameState);
}

const nextTurn = (
  gameState: GameState,
): void => {
  const winnerPattern = checkWinner(gameState);

  let cellElements;
  if (gameState.multiplayer) {
    cellElements = createCellElements(gameState, winnerPattern, true);
    drawBoard(cellElements);
  } else {
    const humanTurn = gameState.humanPlayer === gameState.currentPlayer;
    cellElements = createCellElements(gameState, winnerPattern, humanTurn);
    drawBoard(cellElements);
    if (!humanTurn) {
      appElement?.classList.add("ignore-hover"); // Ignore human's hover
      setTimeout(() => {
        makeCpuMove(gameState);
        appElement?.classList.remove("ignore-hover");
      }, 500);
    }
  }

  setTurn(gameState.currentPlayer);
  
  if (gameState.status !== Status.Ongoing) {
    resolveRoundEnd(gameState);
  }
}

const startGame = (multiplayer: boolean, player1: Player): void => {
  startElement?.classList.add("hide");
  appElement?.classList.remove("hide");

  let xPlayer = "";
  let oPlayer = "";
  
  if (multiplayer) {
    xPlayer = player1 === Player.X ? "P1" : "P2";
    oPlayer = player1 === Player.O ? "P1" : "P2";
  } else {
    xPlayer = player1 === Player.X ? "YOU" : "CPU";
    oPlayer = player1 === Player.O ? "YOU" : "CPU";
  }

  const gameState: GameState = {
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
    xPlayer,
    oPlayer,
    multiplayer,
    humanPlayer: !multiplayer ? player1 : undefined
  }
  setPlayerName(gameState);
  setScore(gameState);
  nextTurn(gameState);
}

openStartScreen();