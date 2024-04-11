class Game {
  #scoreLeft = 0
  #scoreRight = 0
  /**
   * @type {'left' | 'right'}
   */
  #serve

  #winScore = 11

  /**
   * @type {{scoreLeft: number, scoreRight: number, serve: 'left' | 'right'}[]}
   */
  #history = []

  /**
   * @param serve {'left' | 'right'}
   * @param winScore {number=}
   */
  constructor(serve, winScore) {
    this.#serve = serve
    if (winScore && winScore >= 1 && winScore <= 99)
      this.#winScore = winScore
  }

  #changeServe() {
    this.#serve = this.#serve === 'left' ? 'right' : 'left'
  }

  /**
   * @return {'left' | 'right' | null}
   */
  checkWin() {
    if (this.#scoreRight >= this.#winScore - 1 && this.#scoreLeft >= this.#winScore - 1) {
      const diff = this.#scoreLeft - this.#scoreRight
      if (diff >= 2) return 'left'
      if (diff <= -2) return 'right'
      return null
    }

    if (this.#scoreLeft >= this.#winScore) {
      return 'left'
    }
    if (this.#scoreRight >= this.#winScore) {
      return 'right'
    }

    return null
  }

  /**
   * @param side {'left' | 'right'}
   */
  addScore(side) {
    this.#history.push({
      serve: this.#serve,
      scoreLeft: this.#scoreLeft,
      scoreRight: this.#scoreRight,
    })
    switch (side) {
      case "left":
        this.#scoreLeft++
        break
      case "right":
        this.#scoreRight++
        break
    }

    if (this.#scoreLeft >= this.#winScore - 1 && this.#scoreRight >= this.#winScore - 1
      || ((this.#scoreRight + this.#scoreLeft) & 1) === 0) {
      this.#changeServe()
    }
  }

  getScoreLeft() {
    return this.#scoreLeft
  }

  getScoreRight() {
    return this.#scoreRight
  }

  /**
   * @return {'left' | 'right'}
   */
  whoServe() {
    return this.#serve
  }

  undo() {
    if (this.#history.length === 0) return false

    const snapshot = this.#history.pop()
    this.#scoreRight = snapshot.scoreRight
    this.#scoreLeft = snapshot.scoreLeft
    this.#serve = snapshot.serve

    return true
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scoreLeftButton = document.getElementById('add-score-left')
  const scoreRightButton = document.getElementById('add-score-right')

  const scoreLeftField = document.getElementById('score-left')
  const scoreRightField = document.getElementById('score-right')

  const serveIndicator = document.getElementById('serve-indicator')

  const restartButton = document.getElementById('reset')
  const undoButton = document.getElementById('undo')
  const winScoreInput = document.getElementById('win-score-input')

  const winLeft = document.getElementById('win-left')
  const winRight = document.getElementById('win-right')

  const resetConfirmationModal = document.getElementById('reset-confirm')
  const resetConfirmationModalWindow = document.getElementById('reset-confirm-window')
  const resetConfirmationModalOk = document.getElementById('reset-confirm-ok')
  const resetConfirmationModalCancel = document.getElementById('reset-confirm-cancel')

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
      winScoreInput.removeAttribute('disabled')
    } else {
      scoreLeftField.textContent = String(state.game.getScoreLeft())
      scoreRightField.textContent = String(state.game.getScoreRight())
      serveIndicator.classList.remove('serve-right', 'serve-left')
      serveIndicator.classList.add(state.game.whoServe() === 'left' ? 'serve-left' : 'serve-right')
      winScoreInput.setAttribute('disabled', 'true')

      const win = state.game.checkWin()
      if (win === 'left') {
        winLeft.hidden = false
        scoreLeftField.hidden = true
      } else if (win === 'right') {
        winRight.hidden = false
        scoreRightField.hidden = true
      } else {
        winRight.hidden = true
        winLeft.hidden = true
        scoreRightField.hidden = false
        scoreLeftField.hidden = false
      }
    }
  }

  function getWinScoreFromInput() {
    let winScore = parseInt(winScoreInput.value)
    if (isNaN(winScore) || winScore < 1 || winScore > 99) return 11
    return winScore
  }

  function leftClick() {
    if (state.game == null) {
      state.game = new Game('left', getWinScoreFromInput())
    } else if (!state.game.checkWin()) {
      state.game.addScore('left')
    }
    update()
  }

  function rightClick() {
    if (state.game == null) {
      state.game = new Game('right', getWinScoreFromInput())
    } else if (!state.game.checkWin()) {
      state.game.addScore('right')
    }
    update()
  }

  function openResetConfirmationModal() {
    resetConfirmationModal.hidden = false
    setTimeout(() => document.addEventListener('click', resetConfirmationModalOutsideClick))
  }

  function closeResetConfirmationModal() {
    document.removeEventListener('click', resetConfirmationModalOutsideClick)
    resetConfirmationModal.hidden = true
  }

  function confirmReset() {
    openResetConfirmationModal()
  }

  function confirmResetOk() {
    init()
    closeResetConfirmationModal()
  }

  function confirmResetCancel() {
    closeResetConfirmationModal()
  }

  function resetConfirmationModalOutsideClick(click) {
    resetConfirmationModalWindow.contains(click.target) || closeResetConfirmationModal()
  }

  function keyDownHandler(event) {
    if (document.activeElement === winScoreInput) {
      return
    }
    switch (event.key) {
      case 'ArrowLeft':
        leftClick()
        break
      case 'ArrowRight':
        rightClick()
        break
      case 'ArrowDown':
        confirmReset()
        break
      case 'ArrowUp':
        undo()
        break
      case 'Escape':
        confirmResetCancel()
        break
      case 'Enter':
        setTimeout(() => confirmResetOk())
        break
    }
  }

  restartButton.addEventListener('click', confirmReset)
  undoButton.addEventListener('click', undo)

  resetConfirmationModalOk.addEventListener('click', confirmResetOk)
  resetConfirmationModalCancel.addEventListener('click', confirmResetCancel)

  scoreLeftButton.addEventListener('click', leftClick)
  scoreRightButton.addEventListener('click', rightClick)

  document.addEventListener('keydown', keyDownHandler)
})
