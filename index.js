const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1536
canvas.height = 864

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background-x1.5.png'
})

const shop = new Sprite({
    position: {
        x: 940,
        y: 208
    },
    imageSrc: './img/shop-x4.png',
    scale: 1,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x:0,
        y:0
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle-x2.5.png',
    scale: 1,
    framesMax: 8,
    framesHold: 14,
    offset: {
        x: 100,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle-x2.5.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './img/samuraiMack/Run-x2.5.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump-x2.5.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall-x2.5.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/samuraiMack/Attack1-x2.5.png',
            framesMax: 6,
        },
        takeHit: {
            imageSrc: './img/samuraiMack/TakeHit-x2.5.png',
            framesMax: 4,
        },
        death: {
            imageSrc: './img/samuraiMack/Death-x2.5.png',
            framesMax: 6,
        }
    },
    attackBox: {
        offset: {
            x: 170,
            y: 20
        },
        width: 200,
        height: 130
    }
})

const enemy = new Fighter({
    position: {
        x:1200,
        y:100
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/IdleKenji.png',
    scale: 1,
    framesMax: 4,
    framesHold: 24,
    offset: {
        x: 100,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/IdleKenji.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/RunKenji.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/JumpKenji.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/FallKenji.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1Kenji.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/TakeHitKenji.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/DeathKenji.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset: {
            x: -70,
            y: 20
        },
        width: 200,
        height: 130
    }
})

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
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'green'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else if (player.velocity.x === 0  && player.velocity.y === 0) {
        player.switchSprite('idle')
    }

    // player jump
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy player movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else if (enemy.velocity.x === 0  && enemy.velocity.y === 0) {
        enemy.switchSprite('idle')
    }

    // enemy jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    // detect for player collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // detect for enemy collision
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 1
    ) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 1) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -20
                break
            case 'Enter':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    // enemy controls
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})