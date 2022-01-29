import backgroundImage from './assets/scene/bg.png'
import planeSprite from './assets/sprite/plane.png'
import fuelSprite from './assets/sprite/fuel.png'

const canvas = document.querySelector('#viewport')

const WIDTH = canvas.clientWidth
const HEIGHT = canvas.clientHeight

let gameOver = false

const ctx = canvas.getContext('2d')

let bgReady = false
const background = new Image()
background.onload = () => {
  bgReady = true
}
background.src = backgroundImage

// Plane

let planeReady = false
const planeImage = new Image()
planeImage.onload = () => {
  planeReady = true
}
planeImage.src = planeSprite

const plane = {
  x: WIDTH / 2 - 16,
  y: HEIGHT / 2 - 16,
}

// Fuel

let fuelReady = false
const fuelImage = new Image()
fuelImage.onload = () => {
  fuelReady = true
}
fuelImage.src = fuelSprite

const fuel = {
  x: 0,
  y: 0,
}

let direction = 'up'

const setDirection = (key) => {
  switch (key) {
    case 'w':
      direction = 'up'
      break
    case 'a':
      direction = 'left'
      break
    case 's':
      direction = 'down'
      break
    case 'd':
      direction = 'right'
      break
    default:
      break
  }
}

document.addEventListener(
  'keydown',
  (e) => {
    setDirection(e.key)
  },
  false
)

document.addEventListener(
  'keyup',
  (e) => {
    setDirection(e.key)
  },
  false
)

// score
let fuelTanksCollected = 0
let playerSpeed = 1

let fuelLevel = 100

// Reset the game when the player catches a fuel tank
const reset = () => {
  fuel.x = 16 + Math.random() * (WIDTH - 64)
  fuel.y = 16 + Math.random() * (HEIGHT - 64)
}

const update = (modifier) => {
  switch (direction) {
    case 'left':
      plane.x -= playerSpeed
      break
    case 'down':
      plane.y += playerSpeed
      break
    case 'right':
      plane.x += playerSpeed
      break
    case 'up':
    default:
      plane.y -= playerSpeed
      break
  }

  fuelLevel -= 0.1

  // Check if plane collides with fuel tank
  if (
    plane.x <= fuel.x + 16 &&
    fuel.x <= plane.x + 16 &&
    plane.y <= fuel.y + 16 &&
    fuel.y <= plane.y + 16
  ) {
    ++fuelTanksCollected
    fuelLevel = 100
    reset()
  }
}

const render = () => {
  if (gameOver) {
    if (bgReady) {
      ctx.drawImage(background, 0, 0)
    }
    ctx.fillStyle = '#FF0000'
    ctx.font = '32px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('Game Over', WIDTH / 2, HEIGHT / 2)
  } else {
    const sx = {
      up: 0,
      left: 32,
      down: 64,
      right: 96,
    }

    if (fuelLevel <= 0) {
      gameOver = true
    }

    if (bgReady) {
      ctx.drawImage(background, 0, 0)
    }
    if (planeReady) {
      ctx.drawImage(
        planeImage,
        sx[direction],
        0,
        32,
        32,
        plane.x,
        plane.y,
        32,
        32
      )
    }
    if (fuelReady) {
      ctx.drawImage(fuelImage, fuel.x, fuel.y)
    }

    // draw fuel gauge
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, 10, 250, 35)

    const fuelLevelPercentage = (240 / 100) * fuelLevel

    ctx.fillStyle =
      fuelLevelPercentage > 120
        ? 'rgba(0, 255, 0, 0.7)'
        : fuelLevelPercentage > 60
        ? 'rgba(255, 255, 0, 0.7)'
        : 'rgba(255, 0, 0, 0.7)'
    ctx.fillRect(15, 15, fuelLevelPercentage, 10)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('Fuel Level', 15, 30)
  }
}

const mainLoop = (then) => {
  let now = Date.now()
  let delta = now - then

  update(delta / 1000)
  render()

  then = now

  requestAnimationFrame(mainLoop)
}

let then = Date.now()
reset()
mainLoop(then)
