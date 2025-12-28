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
const appElement = document.querySelector(".app");
const gridElement = document.querySelector(".app .grid");
const startElement = document.querySelector(".start");
const xSelectionElement = document.querySelector(".start .x-selection");
const oSelectionElement = document.querySelector(".start .o-selection");
const humanVsCpuButtonElement = document.querySelector(".start .human-vs-cpu");
const multiplayerButtonElement = document.querySelector(".start .multiplayer");
const openStartScreen = () => {
    appElement === null || appElement === void 0 ? void 0 : appElement.classList.add("hide");
    startElement === null || startElement === void 0 ? void 0 : startElement.classList.remove("hide");
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
    startGame(false, getPlayer());
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
const makeCpuMove = (gameState) => {
    if (gameState.status !== Status.Ongoing) {
        return;
    }
    while (true) {
        const randomCoordinate = Math.floor(Math.random() * 10);
        if (gameState.board[randomCoordinate] === null) {
            markCell(gameState, randomCoordinate);
            break;
        }
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
        modal === null || modal === void 0 ? void 0 : modal.close();
    };
    const button1Callback = () => {
        modal === null || modal === void 0 ? void 0 : modal.close();
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
            sub = gameState.xPlayer.toUpperCase() + " WINS!";
            message = "TAKES THE ROUND";
            modalStatus = ModalStatus.XTakes;
            break;
        case Status.OWins:
            sub = gameState.oPlayer.toUpperCase() + " WINS!";
            ;
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
    const winnerPattern = checkWinner(gameState);
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
            setTimeout(() => makeCpuMove(gameState), 500);
        }
    }
    setTurn(gameState.currentPlayer);
    if (gameState.status !== Status.Ongoing) {
        resolveRoundEnd(gameState);
    }
};
const startGame = (multiplayer, player1) => {
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
        humanPlayer: !multiplayer ? player1 : undefined
    };
    setPlayerName(gameState);
    setScore(gameState);
    nextTurn(gameState);
};
openStartScreen();
export {};
//# sourceMappingURL=game.js.map