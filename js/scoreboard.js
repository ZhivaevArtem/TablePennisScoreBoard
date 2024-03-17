export class Game {
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
   */
  constructor(serve) {
    this.#serve = serve
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
