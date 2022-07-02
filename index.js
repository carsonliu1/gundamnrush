const canvas = document.querySelector('canvas')
const scoreEle = document.querySelector('#scoreEle')
const context = canvas.getContext('2d')

canvas.width = 1366
canvas.height = 768


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
      this.height = image.height * 0.40
      this.width = image.width * 0.40
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
    enemyProjectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
       velocity: {
        x: 0,
        y: 13
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
    const rows = Math.floor(Math.random() * 5 + 2)
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

const player = new Player()
const projectiles = []
const grids = []
const enemyProjectiles = []
const particles = []

player.draw()
const keys = {
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



const animate = () => {
  if(!game.active) return alert('GET GOOD')
  if(score >= 100000) return alert('WIN')
  // if(scoreEle.innerHTML === 200) return alert('aaa')
  requestAnimationFrame(animate)
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
    if(enemyProjectile.position.y + enemyProjectile.height >= canvas.height) {
      setTimeout(() => {
        enemyProjectiles.splice(idx, 1)
      }, 0)
    } else {
      enemyProjectile.update()
    }


    if(enemyProjectile.position.y + enemyProjectile.height >= player.position.y &&
       enemyProjectile.position.x + enemyProjectile.width >= player.position.x &&
       enemyProjectile.position.x <= player.position.x + player.width) {
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
          color: 'lightblue',
          fades: true
        })
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

    if(frames % 27 === 0 && grid.enemies.length > 0) {
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

  if(keys.w.pressed && player.position.y >= canvas.height - 300) {
    player.velocity.y = -7
  } else if(keys.s.pressed && player.position.y <= canvas.height - 130) {
    player.velocity.y = 7
  } else {
    player.velocity.y = 0
  }

  if(frames % randomInterval === 0) {
    grids.push(new Grid())
    randomInterval = Math.floor(Math.random() * 500) + 300
    frames = 0
  }

  frames++
}
animate()


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
    case ' ':
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
    case ' ':
      break
  }
})