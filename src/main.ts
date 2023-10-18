import Phaser from 'phaser';
import Scenes from './scenes';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'app',
    physics: {
        default: 'matter',
        matter: {
            debug:true,
            gravity: {
                y: 2,
            }
        },
    },
    scene: Scenes,
};

new Phaser.Game(config);
