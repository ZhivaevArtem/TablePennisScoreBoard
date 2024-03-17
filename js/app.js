import {Game} from "./scoreboard";

document.addEventListener('DOMContentLoaded', () => {
  const scoreLeftButton = document.getElementById('add-score-left')
  const scoreRightButton = document.getElementById('add-score-right')

  const scoreLeftField = document.getElementById('score-left')
  const scoreRightField = document.getElementById('score-right')

  const serveIndicator = document.getElementById('serve-indicator')

  const restartButton = document.getElementById('reset')
  const undoButton = document.getElementById('undo')

  const winLeft = document.getElementById('win-left')
  const winRight = document.getElementById('win-right')

  /**
   *
   * @type {{game: Game | null}}
   */
  const state = {game: null}

  function init() {
    state.game = null
    update()
  }

  function undo() {
    if (state.game) {
      if (state.game.undo()) {
        update()
      } else {
        init()
      }
    }
  }

  function update() {
    if (state.game == null) {
      scoreLeftField.textContent = '0'
      scoreRightField.textContent = '0'
      serveIndicator.classList.remove('serve-right', 'serve-left')
      winRight.hidden = true
      winLeft.hidden = true
      scoreLeftField.hidden = false
      scoreRightField.hidden = false
    } else {
      scoreLeftField.textContent = String(state.game.getScoreLeft())
      scoreRightField.textContent = String(state.game.getScoreRight())
      serveIndicator.classList.remove('serve-right', 'serve-left')
      serveIndicator.classList.add(state.game.whoServe() === 'left' ? 'serve-left' : 'serve-right')

      const win = state.game.checkWin()
      if (win === 'left') {
        winLeft.hidden = false
        scoreLeftField.hidden = true
      }
      if (win === 'right') {
        winRight.hidden = false
        scoreRightField.hidden = true
      }
    }
  }

  function leftClick() {
    if (state.game == null) {
      state.game = new Game('left')
    } else if (!state.game.checkWin()) {
      state.game.addScore('left')
    }
    update()
  }

  function rightClick() {
    if (state.game == null) {
      state.game = new Game('right')
    } else if (!state.game.checkWin()) {
      state.game.addScore('right')
    }
    update()
  }

  restartButton.addEventListener('click', init)
  undoButton.addEventListener('click', undo)

  scoreLeftButton.addEventListener('click', leftClick)
  scoreRightButton.addEventListener('click', rightClick)
})
