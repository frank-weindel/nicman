import Phaser, { Game } from 'phaser';
import assets from './assets/*.png';

let platforms, player, stars, score = 0, scoreText, bombs, gameOver;

const WIDTH = 800;
const HEIGHT = 608;
const THICKNESS = 32;


// 25 x 19 blocks
const levelMap = [
    "=========================",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "= ===================== =",
    "=                       =",
    "= ===================== =",
    "=                       =",
    "= ===================== =",
    "=                       =",
    "= ===================== =",
    "=...........o...........=",
    "=.=====================.=",
    "=.......................=",
    "=.=====================.=",
    "=*.....................*=",
    "=========================",
];

const blankLevelMap = [
    "=========================",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=                       =",
    "=========================",
]

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

        let playerAngle = this.playerSprite.rotation;

        if (this.justTurned) {
            if (this.direction === 'left') {
                if (this.player.body.touching.left) {
                    this.player.setX(Math.round((this.player.x - 16) / THICKNESS) * THICKNESS + 16);
                    this.player.setY(Math.round((this.player.y - 16) / THICKNESS) * THICKNESS + 16);
                }
                this.player.body.setVelocity(-160, 0);
            }
            else if (this.direction === 'right') {
                if (this.player.body.touching.right) {
                    this.player.setX(Math.round((this.player.x - 16) / THICKNESS) * THICKNESS + 16);
                    this.player.setY(Math.round((this.player.y - 16) / THICKNESS) * THICKNESS + 16);
                }
                this.player.body.setVelocity(160, 0);
            }
            else if (this.direction === 'up') {
                if (this.player.body.touching.up) {
                    this.player.setX(Math.round((this.player.x - 16) / THICKNESS) * THICKNESS + 16);
                    this.player.setY(Math.round((this.player.y - 16) / THICKNESS) * THICKNESS + 16);
                }
                this.player.body.setVelocity(0, -160);
            }
            else if (this.direction === 'down') {
                if (this.player.body.touching.down) {
                    this.player.setX(Math.round((this.player.x - 16) / THICKNESS) * THICKNESS + 16);
                    this.player.setY(Math.round((this.player.y - 16) / THICKNESS) * THICKNESS + 16);
                }
                this.player.body.setVelocity(0, 160);
            }
            this.justTurned = false;
        }

        if (this.direction !== 'left' && cursors.left.isDown && !this.physics.overlap(this.haloLeft, this.level)) {
            this.player.body.setVelocity(-160, 0);
            this.playerSprite.angle = 180;
            this.justTurned = true;
            this.direction = 'left';
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (this.direction !== 'right' && cursors.right.isDown && !this.physics.overlap(this.haloRight, this.level)) {
            this.player.body.setVelocity(160, 0);
            this.playerSprite.angle = 0;
            this.justTurned = true;
            this.direction = 'right';
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (this.direction !== 'up' && cursors.up.isDown && !this.physics.overlap(this.haloTop, this.level)) {
            this.player.body.setVelocity(0, -160);
            this.playerSprite.angle = 270;
            this.justTurned = true;
            this.direction = 'up';
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (this.direction !== 'down' && cursors.down.isDown && !this.physics.overlap(this.haloBottom, this.level)) {
            this.player.body.setVelocity(0, 160);
            this.playerSprite.angle = 90;
            this.justTurned = true;
            this.direction = 'down';
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
            // this.tweens.add({
            //     targets: this.playerSprite,
            //     duration: 200,
            //     rotation: Phaser.Math.Angle.RotateTo(playerAngle, Math.PI/2, 1)
            // });
        }

        this.posText.setText(
            `cur rounded - x: ${Math.round((this.player.x - 16) / THICKNESS) * THICKNESS + 16}, y: ${Math.round((this.player.y - 16) / THICKNESS) * THICKNESS + 16}\n` +
            `cur pos     - x: ${this.player.x}, y: ${this.player.y}\n` +
            `last turn   - ${this.lastTurnPos || ''}`
        );




    }

    preload() {
        this.load.image('sky', assets.sky);
        this.load.image('ground', assets.platform);
        this.load.image('star', assets.star);
        this.load.image('bomb', assets.bomb);
        this.load.spritesheet('nicman',
            assets.nicman,
            { frameWidth: 32, frameHeight: 32 }
        );
    }


    create() {
        let level = this.level = this.physics.add.staticGroup();

        let playerLevelPos = { x: 1, y: 1 };
        levelMap.forEach((levelLine, y) => {
            levelLine.split('').forEach((levelBlock, x) => {
                switch (levelBlock) {
                    case '=':
                        level.add(this.add.rectangle(x * THICKNESS, y * THICKNESS, THICKNESS, THICKNESS, 0x00aa00).setOrigin(0, 0));
                        break;
                    case '.':
                        // level.add(this.add.rectangle(x * THICKNESS + 16, y * THICKNESS + 16, 4, 4, 0xffffff));
                        break;
                    case '*':
                        break;
                    case 'o':
                        playerLevelPos.x = x;
                        playerLevelPos.y = y;
                }
            })
        });

        // // Border
        // level.add(this.add.rectangle(0, 0, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0));
        // level.add(this.add.rectangle(WIDTH - THICKNESS, 0, THICKNESS, HEIGHT, 0x00aa00).setOrigin(0, 0));
        // level.add(this.add.rectangle(0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0x00aa00).setOrigin(0, 0));
        // level.add(this.add.rectangle(0, 0, THICKNESS, HEIGHT, 0x00aa00).setOrigin(0, 0));

        // // Inneards
        // level.add(this.add.rectangle(0, THICKNESS+32, WIDTH-THICKNESS-32, THICKNESS, 0x00aa00).setOrigin(0, 0));
        // level.add(this.add.rectangle(THICKNESS+32, THICKNESS*2+32+32+1, WIDTH-THICKNESS-32, THICKNESS, 0x00aa00).setOrigin(0, 0));


        const SHOW_HALO = false;
        this.playerSprite = this.add.sprite(0, 0, 'nicman');
        this.haloTop = this.add.rectangle(0, -17, 32, 1, 0x0000ff).setAlpha(SHOW_HALO ? 1 : 0);
        this.haloRight = this.add.rectangle(17, 0, 1, 32, 0x0000ff).setAlpha(SHOW_HALO ? 1 : 0);
        this.haloBottom = this.add.rectangle(0, 17, 32, 1, 0x0000ff).setAlpha(SHOW_HALO ? 1 : 0);
        this.haloLeft = this.add.rectangle(-17, 0, 1, 32, 0x0000ff).setAlpha(SHOW_HALO ? 1 : 0);
        this.player = this.add.container(playerLevelPos.x * THICKNESS + 16, playerLevelPos.y * THICKNESS + 16, [
            this.haloTop,
            this.haloRight,
            this.haloBottom,
            this.haloLeft,
            this.playerSprite
        ]);
        this.player.setSize(32, 32);
        // this.player.
        this.physics.world.enable(this.player);
        this.physics.world.enable([this.haloTop, this.haloRight, this.haloBottom, this.haloLeft]);

        this.physics.add.collider(this.player, level);


        this.anims.create({
            key: 'right',
            frames: [
                ...this.anims.generateFrameNumbers('nicman', { start: 0, end: 4 }),
                ...this.anims.generateFrameNumbers('nicman', { start: 4, end: 0 })
            ],
            frameRate: 20,
            repeat: -1
        });

        this.playerSprite.anims.play('right');

        this.posText = this.add.text(16, 16, 'Score: 0', { fontSize: '20px', fill: '#fff' });

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
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: GameScene
};

let game = new Phaser.Game(config);

