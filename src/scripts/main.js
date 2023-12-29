'use strict';

window.addEventListener('load', () => {
  const buttonStart = document.querySelector('.button.start');
  const table = document.querySelector('table tbody');
  const scoreElem = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');
  const arrowDown = 'ArrowDown';
  const arrowLeft = 'ArrowLeft';
  const arrowRight = 'ArrowRight';
  const arrowUp = 'ArrowUp';
  const restart = 'Restart';

  class Board {
    constructor() {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.score = 0;
      this.start = false;
    }

    appendOneBox() {
      if (!this.start) {
        return;
      }

      if (this.occupiedPlaces().length < 16) {
        const ShouldAdd4 = Math.random() < 0.1;
        let xRandomIndex = Math.floor(Math.random() * this.board.length);
        let yRandomIndex = Math.floor(Math.random() * this.board[0].length);

        const occupiedPlaces = this.occupiedPlaces();

        while (
          occupiedPlaces.some(
            (cell) => cell.y === xRandomIndex && cell.x === yRandomIndex
          )
        ) {
          xRandomIndex = Math.floor(Math.random() * this.board.length);

          yRandomIndex = Math.floor(Math.random() * this.board[0].length);
        }

        this.board[xRandomIndex][yRandomIndex] = ShouldAdd4 ? 4 : 2;

        this.render();
      }

      if (this.occupiedPlaces().length === 16 && !this.availableMoves()) {
        messageLose.classList.remove('hidden');
      }
    }

    availableMoves() {
      const move = this.occupiedPlaces().some(({ y, x }) => {
        return (
          this.getBoardField(y, x - 1) === this.getBoardField(y, x)
          || this.getBoardField(y, x + 1) === this.getBoardField(y, x)
          || this.getBoardField(y + 1, x) === this.getBoardField(y, x)
          || this.getBoardField(y - 1, x) === this.getBoardField(y, x)
        );
      });

      return move;
    }

    getBoardField(y, x) {
      return (this.board[y] && this.board[y][x]) || null;
    }

    check2048() {
      if (this.board.flat().some((elem) => elem === 2048)) {
        messageWin.classList.toggle('hidden');
      }
    }

    updateScore(addedScore) {
      this.score += addedScore;
      scoreElem.textContent = this.score.toString();
    }

    occupiedPlaces() {
      const occupiedPlaces = [];

      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (this.board[y][x] !== 0) {
            occupiedPlaces.push({
              y: y,
              x: x,
            });
          }
        }
      }

      return occupiedPlaces;
    }

    render() {
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          const cell = this.board[y][x];

          table.children[y].children[x].textContent = '';
          table.children[y].children[x].className = 'field-cell';

          if (cell !== 0) {
            table.children[y].children[x].textContent = `${cell}`;
            table.children[y].children[x].classList.add(`field-cell--${cell}`);
          }
        }
      }
    }

    moveRight(x = 0, y = 0) {
      if (y < this.board.length) {
        if (x < this.board.length - 1) {
          const temp = this.board[y][x];
          const isTheSameNumber = this.board[y][x + 1] === temp;

          if ((temp !== 0 && this.board[y][x + 1] === 0) || isTheSameNumber) {
            this.board[y][x + 1] = isTheSameNumber ? temp * 2 : temp;
            this.board[y][x] = 0;

            if (isTheSameNumber) {
              this.updateScore(temp * 2);
            }
          }

          return this.moveRight(x + 1, y);
        } else {
          return this.moveRight(0, y + 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveLeft(x = this.board.length - 1, y = 0) {
      if (y < this.board.length) {
        if (x > 0) {
          const temp = this.board[y][x];
          const isTheSameNumber = this.board[y][x - 1] === temp;

          if ((temp !== 0 && this.board[y][x - 1] === 0) || isTheSameNumber) {
            this.board[y][x - 1] = isTheSameNumber ? temp * 2 : temp;
            this.board[y][x] = 0;

            if (isTheSameNumber) {
              this.updateScore(temp * 2);
            }
          }

          return this.moveLeft(x - 1, y);
        } else {
          return this.moveLeft(this.board.length - 1, y + 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveUp(x = 0, y = this.board.length - 1) {
      if (x < this.board.length) {
        if (y > 0) {
          const temp = this.board[y][x];
          const isTheSameNumber = this.board[y - 1][x] === temp;

          if ((temp !== 0 && this.board[y - 1][x] === 0) || isTheSameNumber) {
            this.board[y - 1][x] = isTheSameNumber ? temp * 2 : temp;
            this.board[y][x] = 0;

            if (isTheSameNumber) {
              this.updateScore(temp * 2);
            }
          }

          return this.moveUp(x, y - 1);
        } else {
          return this.moveUp(x + 1, this.board.length - 1);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }

    moveDown(x = 0, y = 0) {
      if (x < this.board.length) {
        if (y < this.board.length - 1) {
          const temp = this.board[y][x];
          const isTheSameNumber = this.board[y + 1][x] === temp;

          if ((temp !== 0 && this.board[y + 1][x] === 0) || isTheSameNumber) {
            this.board[y + 1][x] = isTheSameNumber ? temp * 2 : temp;
            this.board[y][x] = 0;

            if (isTheSameNumber) {
              this.updateScore(temp * 2);
            }
          }

          return this.moveDown(x, y + 1);
        } else {
          return this.moveDown(x + 1, 0);
        }
      }

      this.appendOneBox();
      this.occupiedPlaces();
      this.check2048();
    }
  }

  const htmlBoard = new Board();

  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
      case arrowLeft:
        htmlBoard.moveLeft();
        break;
      case arrowRight:
        htmlBoard.moveRight();
        break;
      case arrowUp:
        ev.preventDefault();
        htmlBoard.moveUp();
        break;
      case arrowDown:
        ev.preventDefault();
        htmlBoard.moveDown();
        break;
      default:
        throw new Error('wrong button');
    }
  });
  buttonStart.addEventListener('click', startToReset);

  function startToReset() {
    if (buttonStart.classList.contains('start')) {
      htmlBoard.start = true;
      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
    }

    buttonStart.classList.add('restart');
    buttonStart.classList.remove('start');
    messageStart.classList.add('hidden');

    if (buttonStart.textContent === restart) {
      htmlBoard.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      messageLose.classList.add('hidden');
      htmlBoard.appendOneBox();
      htmlBoard.appendOneBox();
      htmlBoard.score = 0;
      scoreElem.textContent = '0';
    }

    buttonStart.textContent = restart;
  }
});
