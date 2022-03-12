const DomElement = (() => {
  const form = document.querySelector("form");
  const container = document.querySelector(".container");
  const gameboardContainer = document.querySelector(".gameboard-container");
  const screen = document.querySelector(".initial-screen");
  const p1Result = document.querySelector(".p1-result");
  const p2Result = document.querySelector(".p2-result");
  const turn = document.querySelector(".turn");
  const result = document.querySelector(".result");
  const player1Mark = document.querySelector(".p1-mark");
  const player2Mark = document.querySelector(".p2-mark");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const swapMarksButton = document.getElementById("swap-marks");
  const changeNames = document.getElementById("change-names");
  const restartButton = document.getElementById("restart");

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
    tiles
  };
})();

const bindEvents = (() => {
  DomElement.form.addEventListener("submit", (e) => {
    e.preventDefault();
    InitalScreen.hide();
    game.createPlayers();
    gameboard.displayTurn();
    gameboard.displayButton("remove");
    gameboard.clear();
  });
  DomElement.swapMarksButton.addEventListener("click", () => {
    if (!DomElement.player1Mark.classList.contains("swap")){
      DisplayAnimation.swap();
      setTimeout(InitalScreen.swapMarks, 400);
    }
  });
  DomElement.gameboardContainer.addEventListener("click", (e) => {
    if (!DomElement.gameboardContainer.classList.contains("end") &&
      e.target.classList.contains("game-tile") &&
      e.target.innerHTML === "") {
      if (!game.array.includes("X") && !game.array.includes("O")) gameboard.displayButton("add");
      gameboard.tileClick(e.target.dataset.index);
    }
  });
  DomElement.changeNames.addEventListener("click", () => {
    InitalScreen.show();
    game.restart();
  });
  DomElement.restartButton.addEventListener("click", () => {
    setTimeout(gameboard.clear, 1000);
    setTimeout(DisplayAnimation.tile, 800);
    DisplayAnimation.restart();
    gameboard.displayButton("remove");
    game.restart();
  });
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
    DomElement.player1Input.value = value = "";
    DomElement.player2Input.value = value = "";
  };

  const hide = () => {
    DomElement.screen.classList.remove("active");
  };

  return {
    swapMarks,
    show,
    hide
  };
})();

const gameboard = (() => {
  const tileClick = (index) => {
    _update(index);
    game.updateArray(index);
    if (game.checkWin()) _displayWin();
    else if (game.checkTie()) _displayTie();
    game.changeCurrentPlayer();
    displayTurn();
  };

  const _update = (index) => {
    const currentTile = document.querySelector(`[data-index~="${index}"]`);
    currentTile.textContent = `${game.currentPlayer.mark}`;
  };

  const displayTurn = () => {
    DomElement.turn.textContent = `Is ${game.currentPlayer.name} turn`;
  };

  const _displayWin = () => {
    DomElement.p1Result.textContent = `${game.currentPlayer.name} is the winner!`;
    DomElement.p2Result.textContent = game.winMessage[Math.floor(Math.random()*game.winMessage.length)];
    DisplayAnimation.end();
  };

  const _displayTie = () => {
    DomElement.p1Result.textContent = `It's a tie!`;
    DomElement.p2Result.textContent = game.tieMessage[Math.floor(Math.random()*game.tieMessage.length)];
    DisplayAnimation.end();
  };

  const displayButton = (action) => {
    if (action === "add") {
      DomElement.restartButton.classList.add("active");
      DomElement.changeNames.classList.add("active");
    } else {
      DomElement.restartButton.classList.remove("active");
      DomElement.changeNames.classList.remove("active");
    }
  }

  const clear = () => {
    DomElement.tiles.forEach(tile => {
      tile.textContent = "";
    });
  }

  return {
    tileClick,
    displayTurn,
    clear,
    displayButton
  };
})();

const game = (() => {
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
  const winMessage = ["Congrats!", "I always known you were the best", "What? Can someone win this game?", "Enjoy this imaginary price"]
  const tieMessage = ["Ready for another round?", "Rematch?", "What a bummer...", "The true tic-tac-toe experience"]

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
  }

  return {
    array,
    winMessage,
    tieMessage,
    updateArray,
    createPlayers,
    checkWin,
    checkTie,
    changeCurrentPlayer,
    restart,
    get currentPlayer() {
      return currentPlayer;
    },
    get array() {
      return array;
    }
  };
})();

const DisplayAnimation = (() => {
  const end = () => {
    [DomElement.gameboardContainer, DomElement.turn, DomElement.result].forEach((item) => {
      item.classList.add("end");
    });
  };

  const _removeEnd = () => {
    [DomElement.gameboardContainer, DomElement.turn, DomElement.result].forEach((item) => {
      item.classList.remove("end");
    });
  }

  const restart = () => {
    [DomElement.gameboardContainer, DomElement.turn, DomElement.result].forEach((item) => {
      item.classList.add("restart");
    });
    setTimeout(_removeRestart, 1000);
    setTimeout(_removeEnd, 2000);
  };

  const _removeRestart = () => {
    [DomElement.gameboardContainer, DomElement.turn, DomElement.result].forEach((item) => {
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
  }

  const _removeTile = () => {
    DomElement.tiles.forEach((item) => {
      item.classList.remove("restart");
    });
  };

  return {
    restart,
    end,
    swap,
    tile
  };
})();

function Player (name, mark) {
  this.name = name;
  this.mark = mark;
}
