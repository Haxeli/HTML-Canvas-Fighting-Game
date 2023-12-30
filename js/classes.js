class Sprite {
    constructor({position, imageSrc, scale = 1, framesMax = 1, framesHold = 20, offset = {x: 0, y: 0}}) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.imageLoaded = false
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.offset = offset

        this.image.onload = () => this.imageLoaded = true
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrame() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax -1) this.framesCurrent++
            else this.framesCurrent = 0
        }
    }

    update() {
        if (this.imageLoaded) {
            this.draw()
            this.animateFrame()
        }
    }
}

class Fighter extends Sprite {
    constructor({
            position,
            velocity,
            color = 'red',
            imageSrc,
            scale = 1,
            framesMax = 1,
            framesHold = 20,
            offset = {x: 0, y: 0},
            sprites
        }) {
            super({
                position,
                imageSrc,
                scale,
                framesMax,
                framesHold,
                offset
            })
            this.position = position
            this.velocity = velocity
            this.width = 50
            this.height = 150
            this.lastKey
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset,
                width: 100,
                height: 50
            }
            this.color = color
            this.isAttacking
            this.health = 100
            this.framesCurrent = 0
            this.framesElapsed = 0
            this.sprites = sprites

            for (const sprite in sprites) {
                sprites[sprite].image = new Image()
                sprites[sprite].image.src = sprites[sprite].imageSrc
                sprites[sprite].image.onload = function() {
                    console.log(sprite + ' image loaded')
                }
            }
    }

    update() {
        this.draw()
        this.animateFrame()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 141) {
            this.velocity.y = 0
        } else this.velocity.y += gravity
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

    switchSprite(sprite) {
        switch(sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.frameMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.frameMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if ( this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.frameMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    console.log('Switching sprite to jump')
                    console.log('image: ' + this.sprites.jump.imageSrc)
                }
                break
        }
    }
}