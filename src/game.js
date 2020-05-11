import Phaser, { Game } from 'phaser';
import assets from './assets/*.png';

let platforms, player, stars, score = 0, scoreText, bombs, gameOver;

const WIDTH = 800;
const HEIGHT = 600;

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            active: false,
            visible: false,
            key: 'Game',
        });
    }

    update() {
        let cursors = this.input.keyboard.createCursorKeys();

        
        if (cursors.left.isDown && !this.physics.overlap(this.haloLeft, this.level)) {
            this.player.body.setVelocity(-160, 0);
            //player.anims.play('left', true);
        }
        else if (cursors.right.isDown && !this.physics.overlap(this.haloRight, this.level)) {
            this.player.body.setVelocity(160, 0);
            //player.anims.play('right', true);
        }
        else if (cursors.up.isDown && !this.physics.overlap(this.haloTop, this.level)) {
            this.player.body.setVelocity(0, -160);
        }
        else if (cursors.down.isDown && !this.physics.overlap(this.haloBottom, this.level)) {
            this.player.body.setVelocity(0, 160)
        }
        // this.player.body
        // else {
        //     this.player.setVelocityX(0);
        //     //player.anims.play('turn');
        // }

        // if (cursors.up.isDown && player.body.touching.down) {
        //     player.setVelocityY(-660);
        // }
    }

    preload() {
        this.load.image('sky', assets.sky);
        this.load.image('ground', assets.platform);
        this.load.image('star', assets.star);
        this.load.image('bomb', assets.bomb);
        this.load.spritesheet('dude', 
            assets.dude,
            { frameWidth: 32, frameHeight: 32 }
        );
    }



    create() {
        const THICKNESS = 20;
        let level = this.level = this.physics.add.staticGroup();
        // Border
        level.add(this.add.rectangle(0, 0, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0));
        level.add(this.add.rectangle(WIDTH - THICKNESS, 0, THICKNESS, HEIGHT, 0x00aa00).setOrigin(0, 0));
        level.add(this.add.rectangle(0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0));
        level.add(this.add.rectangle(0, 0, THICKNESS, HEIGHT, 0x00aa00).setOrigin(0, 0));

        // Inneards
        level.add(this.add.rectangle(0, THICKNESS+32, WIDTH-THICKNESS-32, THICKNESS, 0x00aa00).setOrigin(0, 0));
        level.add(this.add.rectangle(THICKNESS+32, THICKNESS*2+32+32, WIDTH-THICKNESS-32, THICKNESS, 0x00aa00).setOrigin(0, 0));

        let playerSprite = this.add.sprite(0, 0, 'dude');
        this.haloTop = this.add.rectangle(0, -17, 32, 1, 0x0000ff);
        this.haloRight = this.add.rectangle(17, 0, 1, 32, 0x0000ff);
        this.haloBottom = this.add.rectangle(0, 17, 32, 1, 0x0000ff);
        this.haloLeft = this.add.rectangle(-17, 0, 1, 32, 0x0000ff);
        this.player = this.add.container(THICKNESS + 16, THICKNESS + 16, [
            this.haloTop,
            this.haloRight,
            this.haloBottom,
            this.haloLeft,
            playerSprite
        ]);
        this.player.setSize(32, 32);
        // this.player.
        this.physics.world.enable(this.player);
        this.physics.world.enable([this.haloTop, this.haloRight, this.haloBottom, this.haloLeft]);
    
        this.physics.add.collider(this.player, level);

        
        // level.add.rectangle(0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0);
        // level.add.rectangle(0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0);
        // level.add.rectangle(0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0);
        // this.add.image(400, 300, 'sky');

        // platforms = this.physics.add.staticGroup();

        // platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        // platforms.create(600, 400, 'ground');
        // platforms.create(50, 250, 'ground');
        // platforms.create(750, 220, 'ground');

        
        // player.setBounce(0.2);
        // player.setCollideWorldBounds(true);
        // player.body.setGravityY(300)

        // this.physics.add.collider(player, platforms);

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // this.anims.create({
        //     key: 'turn',
        //     frames: [ { key: 'dude', frame: 4 }],
        //     frameRate: 20
        // });

        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        //     frameRate: 10,
        //     repeat: -1
        // });

        // stars = this.physics.add.group({
        //     key: 'star',
        //     repeat: 11,
        //     setXY: { x: 12, y: 0, stepX: 70 }
        // });

        // stars.children.iterate(child => {
        //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        // });

        // this.physics.add.collider(stars, platforms);

        // this.physics.add.overlap(player, stars, this.collectStar, null, this);

        // bombs = this.physics.add.group();

        // this.physics.add.collider(bombs, platforms);

        // this.physics.add.collider(player, bombs, this.hitBomb, null, this);

        // scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    // hitBomb(player, bomb) {
    //     this.physics.pause();
    
    //     player.setTint(0xff0000);
    
    //     player.anims.play('turn');
    
    //     gameOver = true;
    // }
    
    // collectStar(player, star) {
    //     star.disableBody(true, true);
    
    //     score += 10;
    //     scoreText.setText('Score: ' + score);
    
    //     if (stars.countActive(true) === 0) {
    //         stars.children.iterate(child => {
    //             child.enableBody(true, child.x, 0, true, true);
    //         });
    
    //         let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
    //         let bomb = bombs.create(x, 16, 'bomb');
    //         bomb.setBounce(1);
    //         bomb.setCollideWorldBounds(true);
    //         bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    //     }
    // }  
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: GameScene
};

let game = new Phaser.Game(config);

