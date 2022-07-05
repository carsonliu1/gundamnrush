const canvas = document.querySelector('canvas')
const scoreEle = document.querySelector('#scoreEle')
const startGameEle = document.querySelector('#startGameBtn')
const startModel = document.querySelector('#model')
const endGameScore = document.querySelector('#endGameScore')
const cornerScore = document.querySelector('#cornerScore')
const first = document.querySelector('#first')
const second = document.querySelector('#second')
const third = document.querySelector('#third')
const fourth = document.querySelector('#fourth')
const fifth = document.querySelector('#fifth')
const context = canvas.getContext('2d')
axios.get(`${window.location.hostname}:80/scores`)
  .then(res => {
    first.innerHTML = `${res.data[0].name}: ${res.data[0].score}`
    second.innerHTML = `${res.data[1].name}: ${res.data[1].score}`
    third.innerHTML = `${res.data[2].name}: ${res.data[2].score}`
    fourth.innerHTML = `${res.data[3].name}: ${res.data[3].score}`
    fifth.innerHTML = `${res.data[4].name}: ${res.data[4].score}`
  })
  .catch(err => alert(err))

const postScore = (name, score) => {
  axios.post(`${window.location.hostname}:80/scores`, {name, score})
    .then(res => alert('Your name and score has been added.'))
    .catch(err => alert(err))
}


canvas.width = innerWidth
canvas.height = innerHeight


class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0
    this.opacity = 1

    const image = new Image()
    image.src = './img/plane.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.30
      this.width = image.width * 0.25
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 40
      }
    }

  }

  draw() {
    // context.fillStyle = 'red'
    // context.fillRect(this.position.x, this.position.y, this.width, this.height)
    if(this.image) {
      context.save()
      context.globalAlpha = this.opacity
      context.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
      context.rotate(this.rotation)
      context.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
      context.restore()
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Enemy {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './img/enemy.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.9
      this.width = image.width * 0.9
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // context.fillStyle = 'red'
    // context.fillRect(this.position.x, this.position.y, this.width, this.height)
    if(this.image) {
      // context.save()
      // context.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
      // context.rotate(this.rotation)
      // context.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
      // context.restore()
    }
  }

  update({ velocity }) {
    if(this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(enemyProjectiles) {
    let speed
    if(Math.random() > 0.5) {
      speed =  Math.floor(Math.random() * 3)
    } else {
      speed = -(Math.floor(Math.random() * 3))
    }
    enemyProjectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
       velocity: {
        x: speed,
        y: Math.floor(Math.random() * 4) + 2
       }
    }))
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.enemies = []
    const cols = Math.floor(Math.random() * 5 + 5)
    const rows = Math.floor(Math.random() * 2 + 2)
    this.width = cols * 50
    for(let x = 0; x < cols; x++) {
      for(let y = 0; y < rows; y++) {
        this.enemies.push(new Enemy({
          position: {
            x: x * 50,
            y: y * 50
          }
        }))
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0
    if(this.position.x + this.width >= canvas.width || this.position.x <= 0 ) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 4
    const image = new Image()
    image.src = './img/projectile.png'
    image.onload = () => {
      this.image = image
      this.height = image.height
      this.width = image.width
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }




  draw() {
    // context.beginPath()
    // context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    // context.fillStyle = 'red'
    // context.fill()
    // context.closePath()
    if(this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    context.save()
    context.globalAlpha = this.opacity
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
    context.closePath()
    context.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if(this.fades) this.opacity -= 0.01
  }
}

class EnemyProjectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
    const image = new Image()
    image.src = './img/projectile2.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.8
      this.width = image.width * 1.2
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    // context.fillStyle = 'white'
    // context.fillRect(this.position.x, this.position.y, this.width, this.height)
    if(this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

let player = new Player()
let projectiles = []
let grids = []
let enemyProjectiles = []
let particles = []

const init = () => {
  player = new Player()
  projectiles = []
  grids = []
  enemyProjectiles = []
  game.over = false
  game.active = true
  keys.a.pressed = false
  keys.d.pressed = false
  keys.w.pressed = false
  keys.s.pressed = false
  score = 0
  scoreEle.innerHTML = score
  endGameScore.innerHTML = score
}

player.draw()
let keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500) + 500
let game = {
  over: false,
  active: true
}
let score = 0


for(let x = 0; x < 100; x++) {
  particles.push(new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    },
    velocity: {
      x: 5,
      y: 7
    },
    radius: 1.5,
    color: 'black'
  }))
}

const createParticles = ({ object, color, fades }) => {
  for(let x = 0; x < 15; x++) {
    particles.push(new Particle({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      radius: Math.random() * 3,
      color: color || 'orange',
      fades
    }))
  }
}

const death = new Audio('./bgm/death.mp3')
const bgm = new Audio('./bgm/megaman.mp3')
const audio = new Audio('./bgm/shootsound.mp3')


let animationId
const animate = () => {
  if(!game.active) {
    bgm.pause()
    startGameEle.innerHTML = 'Game Over! Restart'
    startModel.style.display = 'flex'
    endGameScore.innerHTML = score
    let char = prompt('Enter your name to save')
    postScore(char, score)
    return
  }
  if(score >= 100000) {
    bgm.pause()
    game.active = false
    game.over = true
    return alert('You win!')
  }
  // if(scoreEle.innerHTML === 200) return alert('aaa')
  animationId = requestAnimationFrame(animate)
  // context.fillStyle ='black'
  // context.fillRect(0, 0, canvas.width, canvas.height)
  const background = new Image()
  background.src = 'https://i.gifer.com/1ErA.gif'
  background.onload = () => {
    context.drawImage(background, 0, 0, canvas.width, canvas.height)
  }
  player.update()

  particles.forEach((particle, idx) => {
    if(particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }
    if(particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(idx, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  enemyProjectiles.forEach((enemyProjectile, idx) => {
    if(enemyProjectile.position.y + enemyProjectile.height === canvas.height - 15) {
      setTimeout(() => {
        enemyProjectiles.splice(idx, 1)
      }, 0)
    } else {
      enemyProjectile.update()
    }

    if(enemyProjectile.position.y + enemyProjectile.height >= player.position.y &&
       enemyProjectile.position.x + enemyProjectile.width >= player.position.x &&
       enemyProjectile.position.x <= player.position.x + player.width * 0.5 &&
       enemyProjectile.position.y <= player.position.y + player.height) {
        setTimeout(() => {
          enemyProjectiles.splice(idx, 1)
          player.opacity = 0
          game.over = true
        }, 0)
        setTimeout(() => {
          game.active = false
        }, 2000)
        createParticles({
          object: player,
          color: 'yellow',
          fades: true
        })
        death.volume = 0.1
        death.play()
      }
    })

  projectiles.forEach((ele, idx) => {
    if(ele.position.y + ele.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(idx, 1)
      }, 0)
    } else {
      ele.update()
    }
  })

  grids.forEach((grid, gridIdx) => {
    grid.update()

    if(frames % 32 === 0 && grid.enemies.length > 0) {
      grid.enemies[Math.floor(Math.random() * grid.enemies.length)].shoot(enemyProjectiles)
    }
    grid.enemies.forEach((enemy, idx) => {
      enemy.update({ velocity: grid.velocity })
      projectiles.forEach((projectile, idx2) => {
        if(
          projectile.position.y - projectile.radius <= enemy.position.y + enemy.height &&
          projectile.position.x + projectile.radius >= enemy.position.x &&
          projectile.position.x - projectile.radius <= enemy.position.x + enemy.width &&
          projectile.position.y + projectile.radius >= enemy.position.y) {
          setTimeout(() => {
            const enemyFound = grid.enemies.find(enemy2 => {
              return enemy2 === enemy
            })
            const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
            if(enemyFound && projectileFound) {
              score += 100
              scoreEle.innerHTML = score
              createParticles({
                object: enemy,
                fades: true
              })
              grid.enemies.splice(idx, 1)
              projectiles.splice(idx2, 1)

              if(grid.enemies.length > 0) {
                const firstEnemy = grid.enemies[0]
                const lastEnemy = grid.enemies[grid.enemies.length - 1]
                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                grid.position.x = firstEnemy.position.x
              } else {
                grids.splice(gridIdx, 1)
              }
            }
          }, 0)
        }
      })
    })
  })

  if(keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7
    player.rotation = - .15
  } else if(keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 7
    player.rotation = .15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  if(keys.w.pressed && player.position.y >= canvas.height - 270) {
    player.velocity.y = -7
  } else if(keys.s.pressed && player.position.y <= canvas.height - 75) {
    player.velocity.y = 7
  } else {
    player.velocity.y = 0
  }

  if(frames % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500) + 150
    frames = 0
  }

  frames++
}

addEventListener('keydown', ({ key }) => {
  if(game.over) return
  switch(key) {
    case 'a':
      keys.a.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case 'w':
      keys.w.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    // case ' ':
    //   projectiles.push(new Projectile({
    //     position: {
    //       x: player.position.x + player.width / 2,
    //       y: player.position.y
    //     },
    //     velocity: {
    //       x: 0,
    //       y: -7
    //     }
    //   }))
    //   break
  }
})

addEventListener('keyup', ({ key }) => {
  if(game.over) return
  switch(key) {
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    // case ' ':
    //   break
  }
})

addEventListener('keydown', (e) => {
  if(game.over) return
  if(e.repeat) return
  switch(e.key) {
    case ' ':
      audio.volume = 0.04
      audio.play()
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -7
        }
      }))
      break
  }
})

startGameEle.addEventListener('click', () => {
  bgm.loop = true
  bgm.volume = 0.13
  bgm.play()

  init()
  animate()
  startModel.style.display = 'none'
  cornerScore.style.display = 'flex'
})
cornerScore.style.display = 'none'
