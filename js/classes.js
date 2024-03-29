class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesHold = 20,
        offset = {x: 0, y: 0}
    }) {
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
            sprites,
            hitBox = {
                offset: {},
                width: undefined,
                height: undefined
            },
            attackBox = {
                offset: {},
                width: undefined,
                height: undefined
            }
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
            this.hitBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset: hitBox.offset,
                width: hitBox.width,
                height: hitBox.height
            }
            this.attackBox = {
                position: {
                    x: this.position.x,
                    y: this.position.y
                },
                offset: attackBox.offset,
                width: attackBox.width,
                height: attackBox.height
            }
            this.color = color
            this.isAttacking
            this.health = 100
            this.framesCurrent = 0
            this.framesElapsed = 0
            this.sprites = sprites
            this.dead = false

            for (const sprite in sprites) {
                sprites[sprite].image = new Image()
                sprites[sprite].image.src = sprites[sprite].imageSrc
            }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrame()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y
        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 141) {
            this.velocity.y = 0
            this.position.y = 573
        } else this.velocity.y += gravity
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 10
        if (this.health <= 0) this.switchSprite('death')
        else this.switchSprite('takeHit')
    }

    spriteHandler(sprite) {
        if (this.image !== this.sprites[sprite].image) {
            console.log(`Switched to ${sprite} sprite`)
            this.image = this.sprites[sprite].image
            this.framesMax = this.sprites[sprite].framesMax
            this.framesCurrent = 0
        }
    }

    switchSprite(sprite) {
        // override if dead
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }
        // override other animations with attack animation
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return
        // override other animations with takeHit animation
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return
        switch(sprite) {
            case (sprite):
                this.spriteHandler(sprite)
                break
        }
    }
}