const DomElement = (() => {
  const form = document.querySelector("form");
  const container = document.querySelector(".container");
  const gameboardContainer = document.querySelector(".gameboard-container");
  const screen = document.querySelector(".initial-screen");
  const p1Result = document.querySelector(".p1-result");
  const p2Result = document.querySelector(".p2-result");
  const turn = document.querySelector(".turn");
  const result = document.querySelector(".result");
  const buttons = document.querySelector(".buttons");
  const player1Mark = document.querySelector(".p1-mark");
  const player2Mark = document.querySelector(".p2-mark");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const swapMarksButton = document.getElementById("swap-marks");
  const changeNames = document.getElementById("change-names");
  const restartButton = document.getElementById("restart");
  const startButton = document.getElementById("start");

  for (i = 0; i < 9; i++) {
    const gameTile = document.createElement("div");
    gameTile.classList.add("game-tile");
    gameTile.setAttribute("data-index", `${i}`);
    gameboardContainer.append(gameTile);
  }
  const tiles = document.querySelectorAll(".game-tile");

  return {
    form,
    container,
    gameboardContainer,
    screen,
    p1Result,
    p2Result,
    turn,
    result,
    player1Input,
    player2Input,
    player1Mark,
    player2Mark,
    swapMarksButton,
    changeNames,
    restartButton,
    tiles,
    buttons,
    startButton,
  };
})();

const BindEvents = (() => {
  DomElement.form.addEventListener("submit", (e) => {
    e.preventDefault();
    DisplayAnimation.removeEnd();
    InitalScreen.hide();
    Game.createPlayers();
    Gameboard.displayTurn();
    Gameboard.hideRestartButton();
    Gameboard.clear();
  });

  DomElement.swapMarksButton.addEventListener("click", () => {
    if (!DomElement.player1Mark.classList.contains("swap")) {
      DisplayAnimation.swap();
      setTimeout(InitalScreen.swapMarks, 300);
    }
  });

  DomElement.gameboardContainer.addEventListener("click", (e) => {
    if (
      !DomElement.gameboardContainer.classList.contains("end") &&
      e.target.classList.contains("game-tile") &&
      e.target.innerHTML === ""
    ) {
      Gameboard.showRestartButton();
      Gameboard.tileClick(e.target.dataset.index);
    }
  });

  DomElement.changeNames.addEventListener("click", () => {
    InitalScreen.show();
    Game.restart();
  });

  DomElement.restartButton.addEventListener("click", () => {
    setTimeout(Gameboard.clear, 1000);
    setTimeout(DisplayAnimation.tile, 800);
    DisplayAnimation.restart();
    Gameboard.hideRestartButton();
    Game.restart();
    Gameboard.displayTurn();
  });
})();

const BindKeyboard = (() => {
  window.onkeydown = function (e) {
    if (e.keyCode == 32 && InitalScreen.isActive()) {
      DomElement.swapMarksButton.classList.add("click");
        DomElement.swapMarksButton.click();
        setTimeout(function() {DomElement.swapMarksButton.classList.remove("click");}, 600)
    }
    if (e.keyCode == 13 && InitalScreen.isActive()) {
      DomElement.startButton.classList.add("click");
        DomElement.startButton.click();
    } 
    if (e.keyCode == 13 && !InitalScreen.isActive() && Game.isNotEmpty()){
      DomElement.restartButton.classList.add("click");
      DomElement.restartButton.click();
    }
    if (e.keyCode == 8 && !InitalScreen.isActive()) {
      DomElement.changeNames.classList.add("click");
        DomElement.changeNames.click();
    }
    if (e.keyCode == 82 && !InitalScreen.isActive() && Game.isNotEmpty()) {
      DomElement.restartButton.classList.add("click");
        DomElement.restartButton.click();
    }
    if (e.code.includes("Numpad") && !InitalScreen.isActive() && !DomElement.gameboardContainer.classList.contains("end")){
      const index = [6, 7, 8, 3, 4, 5, 0, 1, 2][e.code.slice(-1) - 1];
      currentTile = document.querySelector(`[data-index~="${index}"]`);
      if (currentTile.innerHTML === "") {
        currentTile.classList.add("click");
        Gameboard.showRestartButton();
        Gameboard.tileClick(index);
        setTimeout(function() {currentTile.classList.remove("click");}, 150);
      }
    }
  };
  window.onkeyup = function (e) {
    DomElement.startButton.classList.remove("click");
    DomElement.changeNames.classList.remove("click");
    DomElement.restartButton.classList.remove("click");
  };
})();

const InitalScreen = (() => {
  const swapMarks = () => {
    if (DomElement.player1Mark.innerText === "X") {
      DomElement.player1Mark.textContent = "O";
      DomElement.player2Mark.textContent = "X";
    } else {
      DomElement.player1Mark.textContent = "X";
      DomElement.player2Mark.textContent = "O";
    }
  };

  const show = () => {
    DomElement.screen.classList.add("active");
    DomElement.player1Input.value = "";
    DomElement.player2Input.value = "";
  };

  const hide = () => {
    DomElement.screen.classList.remove("active");
  };

  const isActive = () => {
    return DomElement.screen.classList.contains("active");
  }

  return {
    swapMarks,
    show,
    hide,
    isActive
  };
})();

const Gameboard = (() => {
  const tileClick = (index) => {
    _update(index);
    Game.updateArray(index);
    if (Game.checkWin()) _displayWin();
    else if (Game.checkTie()) _displayTie();
    Game.changeCurrentPlayer();
    displayTurn();
  };

  const _update = (index) => {
    document.querySelector(`[data-index~="${index}"]`).textContent = `${Game.currentPlayer.mark}`;
  };

  const displayTurn = () => {
    DomElement.turn.textContent = `It's ${Game.currentPlayer.name}'s turn`;
  };

  const _displayWin = () => {
    DomElement.p1Result.textContent = `${Game.currentPlayer.name} is the winner!`;
    DomElement.p2Result.textContent =
      Game.winMessages[Math.floor(Math.random() * Game.winMessages.length)];
    DisplayAnimation.end();
  };

  const _displayTie = () => {
    DomElement.p1Result.textContent = `It's a tie!`;
    DomElement.p2Result.textContent =
      Game.tieMessages[Math.floor(Math.random() * Game.tieMessages.length)];
    DisplayAnimation.end();
  };

  const showRestartButton = () => {
    DomElement.restartButton.classList.add("active");
    DomElement.changeNames.classList.add("active");
  };

  const hideRestartButton = () => {
    DomElement.restartButton.classList.remove("active");
    DomElement.changeNames.classList.remove("active");
  };

  const clear = () => {
    DomElement.tiles.forEach((tile) => {
      tile.textContent = "";
    });
  };

  return {
    tileClick,
    displayTurn,
    clear,
    showRestartButton,
    hideRestartButton,
  };
})();

const Game = (() => {
  let array = [".", ".", ".", ".", ".", ".", ".", ".", "."];
  let currentPlayer;
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
  const winMessages = [
    "Congrats!",
    "I always known you were the best",
    "What? Can someone win this game?",
    "Enjoy this imaginary price",
  ];
  const tieMessages = [
    "Ready for another round?",
    "Rematch?",
    "What a bummer...",
    "The true tic-tac-toe experience",
  ];

  const createPlayers = () => {
    player1Name = DomElement.player1Input.value;
    player2Name = DomElement.player2Input.value;
    if (player1Name === "") player1Name = "Player 1";
    if (player2Name === "") player2Name = "Player 2";
    player1 = new Player(player1Name, DomElement.player1Mark.innerText);
    player2 = new Player(player2Name, DomElement.player2Mark.innerText);
    currentPlayer = player1;
  };

  const updateArray = (index) => {
    array.splice(index, 1, currentPlayer.mark);
  };

  const changeCurrentPlayer = () => {
    if (currentPlayer === player1) currentPlayer = player2;
    else currentPlayer = player1;
  };

  const checkWin = () => {
    return winningCombinations.some((combination) => {
      return combination.every((index) => {
        return array[index] == currentPlayer.mark;
      });
    });
  };

  const checkTie = () => {
    return !array.includes(".");
  };

  const restart = () => {
    array = [".", ".", ".", ".", ".", ".", ".", ".", "."];
    currentPlayer = player1;
  };

  const isNotEmpty = () => {
  return (Game.array.includes("X") || Game.array.includes("O"))
  };

  return {
    array,
    winMessages,
    tieMessages,
    updateArray,
    createPlayers,
    checkWin,
    checkTie,
    changeCurrentPlayer,
    restart,
    isNotEmpty,
    get currentPlayer() {
      return currentPlayer;
    },
    get array() {
      return array;
    },
  };
})();

const DisplayAnimation = (() => {
  const elementsArray = [
    DomElement.gameboardContainer,
    DomElement.turn,
    DomElement.result,
    DomElement.turn,
    DomElement.buttons,
  ];
  const end = () => {
    elementsArray.forEach((item) => {
      item.classList.add("end");
    });
  };

  const removeEnd = () => {
    elementsArray.forEach((item) => {
      item.classList.remove("end");
    });
  };

  const restart = () => {
    elementsArray.forEach((item) => {
      item.classList.add("restart");
    });
    setTimeout(removeRestart, 2000);
    setTimeout(removeEnd, 2000);
  };

  const removeRestart = () => {
    elementsArray.forEach((item) => {
      item.classList.remove("restart");
    });
  };

  const swap = () => {
    DomElement.player1Mark.classList.add("swap");
    DomElement.player2Mark.classList.add("swap");
    setTimeout(_removeSwap, 800);
  };

  const _removeSwap = () => {
    DomElement.player1Mark.classList.remove("swap");
    DomElement.player2Mark.classList.remove("swap");
  };

  const tile = () => {
    DomElement.tiles.forEach((item) => {
      item.classList.add("restart");
    });
    setTimeout(_removeTile, 200);
  };

  const _removeTile = () => {
    DomElement.tiles.forEach((item) => {
      item.classList.remove("restart");
    });
  };

  return {
    restart,
    end,
    swap,
    tile,
    removeEnd,
    restart,
  };
})();

function Player(name, mark) {
  this.name = name;
  this.mark = mark;
}
