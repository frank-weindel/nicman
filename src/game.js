import Phaser from 'phaser';
import assets from './assets/*.png';

const WIDTH = 800;
const HEIGHT = 608;
const THICKNESS = 32;


// 25 x 19 blocks
const levelMap = [
    "=========================",
    "=                       =",
    "= =  =  =  ==  =  =  =  =",
    "= =  =  =  ==  =  =  =  =",
    "= =  =  =  ==  =  =  =  =",
    "= =  =  =  ==  =  =  =  =",
    "=                       =",
    "=                       =",
    "= = ===== ===== ===== = =",
    "= ===   ===   ===   === =",
    "=                       =",
    "=                       =",
    "= ===================== =",
    "=           o           =",
    "=                       =",
    "= ===================== =",
    "= =   =   =   =   =   = =",
    "=   =   =   =   =   =   =",
    "=========================",
];

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


        if (cursors.left.isDown) {
            this.player.body.setVelocity(-160, 0);
            this.player.angle = 180;
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (cursors.right.isDown) {
            this.player.body.setVelocity(160, 0);
            this.player.angle = 0;
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (cursors.up.isDown) {
            this.player.body.setVelocity(0, -160);
            this.player.angle = 270;
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }
        else if (cursors.down.isDown) {
            this.player.body.setVelocity(0, 160);
            this.player.angle = 90;
            this.lastTurnPos = `x: ${this.player.x}, y: ${this.player.y}`
        }

        this.posText.setText(
            `cur pos     - x: ${Math.round(this.player.x)}, y: ${Math.round(this.player.y)}`
        );
    }

    preload() {
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

        this.player = this.add.sprite(playerLevelPos.x * THICKNESS + 16, playerLevelPos.y * THICKNESS + 16, 'nicman');
        this.player.setSize(32, 32);

        this.physics.world.enable(this.player);

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

        this.player.anims.play('right');

        this.posText = this.add.text(16, 16, '', { fontSize: '20px', fill: '#fff' });
    }
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

