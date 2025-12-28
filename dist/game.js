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
var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["Noob"] = 1] = "Noob";
    Difficulty[Difficulty["Easy"] = 2] = "Easy";
    Difficulty[Difficulty["Medium"] = 4] = "Medium";
    Difficulty[Difficulty["Hard"] = 16] = "Hard";
    Difficulty[Difficulty["Imposible"] = 0] = "Imposible";
})(Difficulty || (Difficulty = {}));
const checkWinner = (board) => {
    const winnerPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (const [first, second, third] of winnerPatterns) {
        if (board[first] && (board[first] === board[second]) && (board[first] === board[third])) {
            const status = board[first];
            return { status, winnerPattern: [first, second, third] };
        }
    }
    if (!board.includes(null)) {
        return { status: Status.Tie, winnerPattern: null };
    }
    return { status: Status.Ongoing, winnerPattern: null };
};
const modal = document.querySelector("dialog");
var ModalStatus;
(function (ModalStatus) {
    ModalStatus["Notr"] = "notr";
    ModalStatus["XTakes"] = "x-takes";
    ModalStatus["OTakes"] = "o-takes";
})(ModalStatus || (ModalStatus = {}));
const createModalContent = (sub, message, button2Text, button1Text, button2Callback, button1Callback, modalStatus) => {
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
    const btn1 = wrapper.querySelector('.secondary-button-1');
    const btn2 = wrapper.querySelector('.secondary-button-2');
    btn1.addEventListener('click', () => button1Callback());
    btn2.addEventListener('click', () => button2Callback());
    return wrapper;
};
const openModal = (modalContent, modal) => {
    modal === null || modal === void 0 ? void 0 : modal.replaceChildren(modalContent);
    modal.showModal();
};
const closeModal = (modal) => {
    modal === null || modal === void 0 ? void 0 : modal.close();
};
const appElement = document.querySelector(".app");
const gridElement = document.querySelector(".app .grid");
const restartButtonElement = document.querySelector(".app .restart");
const startElement = document.querySelector(".start");
const xSelectionElement = document.querySelector(".start .x-selection");
const oSelectionElement = document.querySelector(".start .o-selection");
const humanVsCpuButtonElement = document.querySelector(".start .human-vs-cpu");
const difficultySelectionElement = document.querySelector(".start .difficulty-selection");
const multiplayerButtonElement = document.querySelector(".start .multiplayer");
const handleBeforeUnload = (event) => {
    const hasUnsavedChanges = true;
    if (hasUnsavedChanges) {
        event.preventDefault();
        return "";
    }
};
let interruptEventListener;
const interruptClosing = () => {
    interruptEventListener = window.addEventListener("beforeunload", handleBeforeUnload);
};
const allowClosing = () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
};
restartButtonElement === null || restartButtonElement === void 0 ? void 0 : restartButtonElement.addEventListener("click", () => {
    openModal(createModalContent("", "RESTART GAME?", "NO, CANCEL", "YES, RESTART", () => closeModal(modal), () => {
        openStartScreen();
        closeModal(modal);
    }, ModalStatus.Notr), modal);
});
const openStartScreen = () => {
    appElement === null || appElement === void 0 ? void 0 : appElement.classList.add("hide");
    startElement === null || startElement === void 0 ? void 0 : startElement.classList.remove("hide");
    allowClosing();
};
xSelectionElement === null || xSelectionElement === void 0 ? void 0 : xSelectionElement.addEventListener("click", () => {
    oSelectionElement === null || oSelectionElement === void 0 ? void 0 : oSelectionElement.classList.remove("selected");
    xSelectionElement.classList.add("selected");
});
oSelectionElement === null || oSelectionElement === void 0 ? void 0 : oSelectionElement.addEventListener("click", () => {
    xSelectionElement === null || xSelectionElement === void 0 ? void 0 : xSelectionElement.classList.remove("selected");
    oSelectionElement.classList.add("selected");
});
const getPlayer = () => {
    return (xSelectionElement === null || xSelectionElement === void 0 ? void 0 : xSelectionElement.classList.contains("selected")) ? Player.X : Player.O;
};
humanVsCpuButtonElement === null || humanVsCpuButtonElement === void 0 ? void 0 : humanVsCpuButtonElement.addEventListener("click", () => {
    let difficulty = Difficulty.Medium;
    switch (difficultySelectionElement === null || difficultySelectionElement === void 0 ? void 0 : difficultySelectionElement.value) {
        case "noob":
            difficulty = Difficulty.Noob;
            break;
        case "easy":
            difficulty = Difficulty.Easy;
            break;
        case "medium":
            difficulty = Difficulty.Medium;
            break;
        case "hard":
            difficulty = Difficulty.Hard;
            break;
        case "impossible":
            difficulty = Difficulty.Imposible;
            break;
    }
    startGame(false, getPlayer(), difficulty);
});
multiplayerButtonElement === null || multiplayerButtonElement === void 0 ? void 0 : multiplayerButtonElement.addEventListener("click", () => {
    startGame(true, getPlayer());
});
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
const createCellElements = (gameState, winnerPatterns, isClickable) => {
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
        if (isClickable) {
            cellElement.addEventListener("click", (event) => {
                const targetElement = event.target;
                let targetElementId = parseInt(targetElement.dataset.cellId);
                markCell(gameState, targetElementId);
            });
        }
        return cellElement;
    });
    return cellElements;
};
let previousCellElements = [];
const drawBoard = (cellElements) => {
    clearBoard(previousCellElements);
    previousCellElements = cellElements;
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
const markCell = (gameState, id) => {
    if (gameState.status !== Status.Ongoing) {
        return;
    }
    if (gameState.board[id] === null) {
        gameState.board[id] = gameState.currentPlayer;
        gameState.currentPlayer = gameState.currentPlayer === Player.X ? Player.O : Player.X;
    }
    nextTurn(gameState);
};
const MAX_DEPTH = 9;
const BASE_SCORE = MAX_DEPTH + 1;
const evaluateBoard = (board, humanPlayer) => {
    const { status } = checkWinner(board);
    switch (status) {
        case Status.Tie: return 0;
        case Status.OWins: return humanPlayer === Player.X ? BASE_SCORE : -BASE_SCORE;
        case Status.XWins: return humanPlayer === Player.X ? -BASE_SCORE : BASE_SCORE;
    }
    return null;
};
const minimax = (board, depth, isMaximizer, humanPlayer) => {
    let score = evaluateBoard(board, humanPlayer);
    if (score !== null) {
        if (score > 0)
            return score - depth;
        if (score < 0)
            return score + depth;
        return score;
    }
    let bestValue;
    if (isMaximizer) {
        bestValue = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                const newBoard = [...board];
                newBoard[i] = humanPlayer === Player.X ? Player.O : Player.X;
                bestValue = Math.max(bestValue, minimax(newBoard, depth + 1, false, humanPlayer));
            }
        }
    }
    else {
        bestValue = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                const newBoard = [...board];
                newBoard[i] = humanPlayer;
                bestValue = Math.min(bestValue, minimax(newBoard, depth + 1, true, humanPlayer));
            }
        }
    }
    return bestValue;
};
const makeCpuMove = (gameState, imposible) => {
    var _a, _b;
    if (gameState.status !== Status.Ongoing) {
        return;
    }
    let bestValues = [];
    let depth = gameState.board.filter(cell => cell !== null).length;
    for (let i = 0; i < gameState.board.length; i++) {
        if (gameState.board[i] === null) {
            const controlBoard = [...gameState.board];
            controlBoard[i] = gameState.humanPlayer === Player.X ? Player.O : Player.X;
            const value = minimax(controlBoard, depth, false, gameState.humanPlayer);
            bestValues.push({ value: value, coordinate: i });
        }
    }
    bestValues.sort((a, b) => b.value - a.value);
    if (gameState.difficulty === Difficulty.Imposible) {
        console.log("You can’t beat the minimax algorithm 😈");
        markCell(gameState, (_a = bestValues[0]) === null || _a === void 0 ? void 0 : _a.coordinate);
    }
    else {
        const randomChoice = Math.floor(bestValues.length * Math.random() ** gameState.difficulty);
        markCell(gameState, (_b = bestValues[randomChoice]) === null || _b === void 0 ? void 0 : _b.coordinate);
    }
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
const xPlayerNameElement = document.querySelector(".x-wins .name");
const oPlayerNameElement = document.querySelector(".o-wins .name");
const setPlayerName = (gameState) => {
    xPlayerNameElement.innerHTML = `X (${gameState.xPlayer})`;
    oPlayerNameElement.innerHTML = `O (${gameState.oPlayer})`;
};
const xScoreElement = document.querySelector(".x-wins .count");
const oScoreElement = document.querySelector(".o-wins .count");
const tieScoreElement = document.querySelector(".ties .count");
const setScore = (gameState) => {
    xScoreElement.innerHTML = gameState.xScore.toString();
    oScoreElement.innerHTML = gameState.oScore.toString();
    tieScoreElement.innerHTML = gameState.tieScore.toString();
};
const resolveRoundEnd = (gameState) => {
    const button2Callback = () => {
        nextRound(gameState);
        nextTurn(gameState);
        closeModal(modal);
    };
    const button1Callback = () => {
        openStartScreen();
        closeModal(modal);
    };
    const button2Text = "QUIT";
    const button1Text = "NEXT ROUND";
    let sub = "";
    let message = "";
    let modalStatus = ModalStatus.Notr;
    switch (gameState.status) {
        case Status.Tie:
            sub = "";
            message = "ROUND TIED";
            modalStatus = ModalStatus.Notr;
            break;
        case Status.XWins:
            if (gameState.multiplayer) {
                sub = gameState.xPlayer.toUpperCase() + " WINS!";
            }
            else {
                if (gameState.humanPlayer === Player.X) {
                    sub = "YO WON!";
                }
                else {
                    sub = "OH NO, YOU LOST...";
                }
            }
            message = "TAKES THE ROUND";
            modalStatus = ModalStatus.XTakes;
            break;
        case Status.OWins:
            if (gameState.multiplayer) {
                sub = gameState.oPlayer.toUpperCase() + " WINS!";
                ;
            }
            else {
                if (gameState.humanPlayer === Player.O) {
                    sub = "YO WON!";
                }
                else {
                    sub = "OH NO, YOU LOST...";
                }
            }
            message = "TAKES THE ROUND";
            modalStatus = ModalStatus.OTakes;
            break;
    }
    openModal(createModalContent(sub, message, button2Text, button1Text, button1Callback, button2Callback, modalStatus), modal);
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
const nextTurn = (gameState) => {
    const { status, winnerPattern } = checkWinner(gameState.board);
    gameState.status = status;
    let cellElements;
    if (gameState.multiplayer) {
        cellElements = createCellElements(gameState, winnerPattern, true);
        drawBoard(cellElements);
    }
    else {
        const humanTurn = gameState.humanPlayer === gameState.currentPlayer;
        cellElements = createCellElements(gameState, winnerPattern, humanTurn);
        drawBoard(cellElements);
        if (!humanTurn) {
            appElement === null || appElement === void 0 ? void 0 : appElement.classList.add("ignore-hover");
            setTimeout(() => {
                makeCpuMove(gameState, false);
                appElement === null || appElement === void 0 ? void 0 : appElement.classList.remove("ignore-hover");
            }, 500);
        }
    }
    setTurn(gameState.currentPlayer);
    if (gameState.status !== Status.Ongoing) {
        resolveRoundEnd(gameState);
    }
};
const startGame = (multiplayer, player1, difficulty) => {
    startElement === null || startElement === void 0 ? void 0 : startElement.classList.add("hide");
    appElement === null || appElement === void 0 ? void 0 : appElement.classList.remove("hide");
    let xPlayer = "";
    let oPlayer = "";
    if (multiplayer) {
        xPlayer = player1 === Player.X ? "P1" : "P2";
        oPlayer = player1 === Player.O ? "P1" : "P2";
    }
    else {
        xPlayer = player1 === Player.X ? "YOU" : "CPU";
        oPlayer = player1 === Player.O ? "YOU" : "CPU";
    }
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
        xPlayer,
        oPlayer,
        multiplayer,
        humanPlayer: !multiplayer ? player1 : undefined,
        difficulty: !multiplayer ? difficulty : undefined
    };
    setPlayerName(gameState);
    setScore(gameState);
    nextTurn(gameState);
    interruptClosing();
};
openStartScreen();
export {};
//# sourceMappingURL=game.js.map