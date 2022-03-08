const initalScreen = (() => {
  const startGame = () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      game.createPlayers();
      _hide();
    });
  };
  const _hide = () => {
    const screen = document.querySelector(".initial-screen");
    screen.classList.remove("active");
  };

  return {
    startGame,
  };
})();

const gameboard = (() => {
  const create = () => {
    const container = document.querySelector(".container");
    const gameboardContainer = document.createElement("div");
    gameboardContainer.classList.add("gameboard-container");
    for (i = 0; i < 9; i++) {
      const gameTile = document.createElement("div");
      gameTile.classList.add("game-tile");
      gameTile.setAttribute("data-index", `${i}`);
      gameboardContainer.append(gameTile);
    }
    container.append(gameboardContainer);
    _turnText();
    _bindClick();
  };

  const _bindClick = () => {
    const gameboardContainer = document.querySelector(".gameboard-container");
    gameboardContainer.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("game-tile") &&
        !gameboardContainer.classList.contains("end-board-animation") &&
        e.target.innerHTML === ""
      ) {
        const index = e.target.dataset.index;
        _update(index);
        game.updateArray(index);
        if (game.checkWin()) _displayWinner();
        else if (game.checkTie()) _displayTie();
        game.changeCurrentPlayer();
        _turnText();
      }
    });
  };

  const _update = (index) => {
    const currentTile = document.querySelector(`[data-index~="${index}"]`);
    currentTile.textContent = `${game.currentPlayerMark}`;
    currentTile.classList.add(game.currentPlayerMark);
  };

  const _displayWinner = () => {
    let winner = "";
    if (game.currentPlayerMark === player1.playerMark) winner = player1.name;
    else winner = player2.name;
    document.querySelector(".p1-result").textContent = `${winner} is the winner!`;
    document.querySelector(".p2-result").textContent = `Congrats!`;
    endAnimation();
  };

  const _displayTie = () => {
    document.querySelector(".p1-result").textContent = `It's a tie!`;
    document.querySelector(".p2-result").textContent = `Ready for another round?`;
    endAnimation();
  };

  const _turnText = () => {
    let currentTurnPlayer = "";
    if (game.currentPlayerMark === player1.playerMark) currentTurnPlayer = player1.name;
    else currentTurnPlayer = player2.name;
    document.querySelector(".turn").textContent = `Is ${currentTurnPlayer} turn`;
  };

  const endAnimation = () => {
    const gameboardContainer = document.querySelector(".gameboard-container");
    const turn = document.querySelector(".turn");
    const result = document.querySelector(".result");
    gameboardContainer.classList.add("end-board-animation");
    turn.classList.add("end-board-animation");
    result.classList.add("end-board-animation");
  };

  return {
    create,
  };
})();

const game = (() => {
  let array = new Array(9);
  let currentPlayerMark = "X";
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const updateArray = (index) => {
    array.splice(index, 1, currentPlayerMark);
  };

  const createPlayers = () => {
    player1Name = document.getElementById("player1").value;
    player2Name = document.getElementById("player2").value;
    if (player1Name === "") player1Name = "Player 1";
    if (player2Name === "") player2Name = "Player 2";
    player1 = new Player(player1Name, "X");
    player2 = new Player(player2Name, "O");
  };

  const changeCurrentPlayer = () => {
    if (currentPlayerMark === "X") currentPlayerMark = "O";
    else currentPlayerMark = "X";
  };

  const checkWin = () => {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return array[index] == currentPlayerMark;
      });
    });
  };

  const checkTie = () => {
    return !array.includes(undefined);
  };

  return {
    array,
    updateArray,
    createPlayers,
    checkWin,
    checkTie,
    changeCurrentPlayer,
    get currentPlayerMark() {
      return currentPlayerMark;
    },
    set currentPlayerMark(_) {},
  };
})();

class Player {
  constructor(name, playerMark) {
    this._name = name;
    this._playerMark = playerMark;
  }

  get name() {
    return this._name;
  }

  get playerMark() {
    return this._playerMark;
  }
}

initalScreen.startGame();
gameboard.create();
