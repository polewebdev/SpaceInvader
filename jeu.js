import Accueil from "./Acceuil.js"

const LARGEUR_FENETRE = 750; // Définition de la largeur de la fenêtre du jeu
const HAUTEUR_FENETRE = 600; // Définition de la hauteur de la fenêtre du jeu
var VELOCITE_LATERAL_VAISSEAU = 300; // Définition de la vitesse latérale (horizontale) du vaisseau du joueur
var VELOCITE_HORIZONTALE_VAISSEAU = 250; // Définition de la vitesse horizontale du vaisseau du joueur


const VELOCITE_HORIZONTALE_BULLET = 700; // Définition de la vitesse horizontale des projectiles tirés par le vaisseau
const VELOCITE_BOMB = 500
const VELOCITE_ENNEMI = 200; // Définition de la vitesse des ennemis
const INTERVALLE_ENNEMI = 2000; // Définition de l'intervalle de temps entre chaque création d'un nouvel ennemi
const INTERVALLE_BOMB = 5000;
const INTERVALLE_PowerUp = 8000;

var ENEMIES_DE_SUITE // vatiable qui permet de savoir combien d'ennemié d'affilé ont été tuée
var SCORE; // Initialisation du score à 0
var BEST_SCORE; // Initialisation du score à 0
var NB_VIE;
var gameOver = false;
var coins;
var multiplicateur;

class Home extends Phaser.Scene {


    constructor() {
        super("home");
        this.vaisseau = null; // Variable pour stocker le vaisseau du joueur
        this.cursors = null; // Variable pour stocker les touches du clavier
        this.bullets = null; // Variable pour stocker les projectiles tirés par le vaisseau
        this.bomb = null; // Variable pour stocker la bombe utilisée pour attaquer les ennemis
        this.bulletSound = null; // Variable pour stocker le son associé au tir du vaisseau
        this.explosionSound = null; // Variable pour stocker le son associé à l'explosion des ennemis
        this.enemyTimer = null; // Variable pour stocker le minuteur de création des ennemis
        this.enemies = null; // Variable pour stocker les ennemis présents dans la scène
        this.bombs = null; // Variable pour stocker les bombes présents dans la scène
        this.scoreText = null; // Variable pour stocker le texte affichant le score du joueur
        this.best_scoreText = null; // Variable pour stocker le texte affichant le score du joueur
        this.vieText = null // Variable pour stocker le nombre de vie
        this.comboText = null // Variable pour stocker le nombre de vie
        this.isPaused = false; // Variable pour indiquer si le jeu est en pause ou non
        this.coinsText = null;
        this.hasPowerUp = false;
        this.PowerUp = null;
        this.powerUpTimer = null;
        this.powerUpDuration = 10000;

        this.bg = Phaser.GameObjects.tileSprite;
    }

    preload() {
        this.load.image("bomb", "image/bomb.png");
        this.load.image("vaisseau", "image/vaisseau.png");
        this.load.image("heart", "image/heart.png");
        this.load.image("bg", "image/bg2.png");
        this.load.image("bullet", "image/bullet.png");
        this.load.audio("bulletSound", "audio/shoot.wav");
        this.load.audio("explosionSound", "audio/expolosion1.wav");
        this.load.image("enemy", "image/ennemy1.png");
        this.load.image("coins", "image/coins.png");
        this.load.image("powerUp", "image/powerup.png");
        // Charge une feuille de sprites pour l'animation d'explosion à partir de l'image "explosion.png"
        this.load.spritesheet("explosion", "image/explosion.png", {
            frameWidth: 64,
            frameHeight: 64,
        });



    }

    // ===============================================================================================//
    displayGameOver() {

        // Enregistrer le meilleur score dans le localStorage
        if (SCORE > BEST_SCORE) {
            localStorage.setItem('bestS', SCORE.toString()); // Enregistrer le score dans le localStorage
        }

        // Ajoute un texte "Game Over" à l'écran de jeu
        const gameOverText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Game Over', { fontSize: '32px', fill: '#fff' }
        );
        gameOverText.setOrigin(0.5);
        this.physics.pause(); // Met  jeu en pause
        this.enemyTimer.paused = true; // Met en pause les  ennemis

        // Déclenche un retard de 3000 millisecondes avant d'exécuter la fonction de rappel
        this.time.delayedCall(3000, () => {
            this.scene.start("accueil");
        });

        this.hasPowerUp = false;
    }

    togglePause() {
        this.isPaused = !this.isPaused; // Inverse la valeur de la variable isPaused
        if (this.isPaused) {
            this.physics.pause(); // Met  jeu en pause
            this.enemyTimer.paused = true; // Met en pause les  ennemis
            this.pauseText.setVisible(true); // Affiche le texte de pause
        } else {
            this.physics.resume(); // Reprend  le jeu
            this.enemyTimer.paused = false; // Reprend le minuteur des ennemis
            this.pauseText.setVisible(false); // Masque le texte de pause
        }
    }


    // ===============================================================================================//


    create() {

        multiplicateur = 1;
        ENEMIES_DE_SUITE = 0;
        NB_VIE = 3;
        gameOver = false;
        SCORE = 0;
        BEST_SCORE = localStorage.getItem("bestS");
        coins = localStorage.getItem("coins")
        const { width, height } = this.scale;
        this.add.image(0, 0, "bg"); // Ajoute une image de fond
        this.bg = this.add.tileSprite(0, 0, width, height, "bg").setScale(2)
        this.add.image(LARGEUR_FENETRE - 20, 30, "heart"); // Ajoute une image du nombre de vie restantes
        this.add.image(LARGEUR_FENETRE - 20, 80, "coins")

        if (BEST_SCORE !== null) {
            this.best_score = parseInt(BEST_SCORE);
        } else {
            BEST_SCORE = 0; // Si aucun score n'est stocké, initialise le score à 0
        }

        this.best_scoreText = this.add.text(10, 40, 'Record: ' + BEST_SCORE, { fontSize: '24px', fill: '#ffffff' }) // Variable pour stocker le texte affichant le score du joueur
        this.scoreText = this.add.text(10, 10, 'Score: ' + SCORE, { fontSize: '24px', fill: '#ffffff' }); // Utilise this.score pour afficher le score
        this.vieText = this.add.text(LARGEUR_FENETRE - 60, 15, NB_VIE, { fontSize: '24px', fill: '#ffffff' });
        this.comboText = this.add.text(LARGEUR_FENETRE / 2 - 50, 15, "Combo :x" + multiplicateur, {
            fontSize: '24px',
            fill: '#ffffff'
        })
        this.coinsText = this.add.text(LARGEUR_FENETRE - 70, 68, coins, { fontSize: '24px', fill: '#ffffff' });
        this.cursors = this.input.keyboard.createCursorKeys(); // Crée les touches du clavier pour le contrôle du vaisseau
        this.bullets = this.physics.add.group(); // Crée un groupe de projectiles
        this.enemyBullets = this.physics.add.group(); // Group for storing enemy bullets

        this.vaisseau = this.physics.add.image(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE, "vaisseau"); // Ajoute le vaisseau du joueur
        this.vaisseau.setCollideWorldBounds(true); // Définit les limites de collision du vaisseau avec le monde
        this.bulletSound = this.sound.add("bulletSound"); // Ajoute le son associé au tir du vaisseau
        this.explosionSound = this.sound.add("explosionSound"); // Ajoute le son associé à l'explosion des ennemis
        this.input.keyboard.on('keydown-SPACE', this.fireBullet, this); // Associe la touche d'espace à la fonction de tir des projectiles
        this.enemies = this.physics.add.group(); // Crée un groupe pour les ennemis
        this.bombs = this.physics.add.group(); // Crée un groupe pour les bombs
        this.PowerUp = this.physics.add.group();
        this.startEnemyTimer(); // Démarre le minuteur pour la création des ennemis
        this.startBombTimer(); // Démarre le minuteur pour la création des ennemis
        this.startPowerUpTimer();
        this.physics.add.overlap(this.vaisseau, this.enemies, this.enemyCollision, null, this); // Gère la collision entre le vaisseau et les ennemis
        this.physics.add.overlap(this.vaisseau, this.PowerUp, this.collectPowerUp, null, this); // Gère la collision entre le vaisseau et les powerUp
        this.input.keyboard.on('keydown-P', this.togglePause, this); // Associe la touche P à la fonction de mise en pause/reprise du jeu
        this.pauseText = this.add.text(
            LARGEUR_FENETRE / 2,
            HAUTEUR_FENETRE / 2,
            'Jeu en pause', { fontSize: '32px', fill: '#ffffff' }
        ); // Ajoute un texte pour afficher l'état de pause du jeu
        this.pauseText.setOrigin(0.5); // Définit l'origine du texte de pause
        this.pauseText.setVisible(false); // Masque le texte de pause par défaut
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 15 }),
            frameRate: 24,
            repeat: 0,
            hideOnComplete: true,
        });
    }


    // ===============================================================================================//


    update() {

        this.bg.tilePositionY -= 3;
        if (NB_VIE >= 0) {
            this.vieText.setText(NB_VIE); // Met à jour le texte affichant le score
        }
        this.scoreText.setText('Score: ' + SCORE); // Met à jour le texte affichant le score
        this.miseAjourMulti()
        this.comboText.setText("Combo x" + multiplicateur)
        this.coinsText.setText(coins); // Met à jour le texte affichant les coins

        if (this.isPaused) {
            return; // Si le jeu est en pause, on arrête l'exécution du reste du code dans cette fonction
        }
        if (gameOver) {
            this.displayGameOver();
        }


        this.vaisseau.setVelocityX(0); // Réinitialise la vitesse horizontale du vaisseau
        this.vaisseau.setVelocityY(0); // Réinitialise la vitesse verticale du vaisseau

        if (this.vaisseau) {
            if (this.cursors.left.isDown) {
                this.vaisseau.setVelocityX(-VELOCITE_LATERAL_VAISSEAU); // Déplace le vaisseau vers la gauche
            } else if (this.cursors.right.isDown) {
                this.vaisseau.setVelocityX(VELOCITE_LATERAL_VAISSEAU); // Déplace le vaisseau vers la droite
            } else if (this.cursors.up.isDown) {
                this.vaisseau.setVelocityY(-VELOCITE_HORIZONTALE_VAISSEAU); // Déplace le vaisseau vers le haut
            } else if (this.cursors.down.isDown) {
                this.vaisseau.setVelocityY(VELOCITE_HORIZONTALE_VAISSEAU); // Déplace le vaisseau vers le bas
            }
        }

        this.bullets.getChildren().forEach((bullet) => {
            if (bullet.y < 0) {
                bullet.destroy(); // Supprime les projectiles qui sortent de l'écran en haut
            }
        });

        //renitilise le multiplicateur quand un enemie sort de le fenetre de jeu sans etre tuée
        this.enemies.getChildren().forEach((enemie) => {
            if (enemie.y > HAUTEUR_FENETRE) {
                ENEMIES_DE_SUITE = 0
                enemie.destroy()
            }
        })

        this.physics.overlap(this.bullets, this.enemies, this.bulletEnemyCollision, null, this); // Gère la collision entre les projectiles et les ennemis
        this.physics.overlap(this.bullets, this.bombs, this.bulletBombCollision, null, this);
        this.physics.overlap(this.vaisseau, this.PowerUp, this.collectPowerUp, null, this);
        this.physics.overlap(this.vaisseau, this.enemyBullets, this.enemyBulletCollision, null, this);

        console.log(this.hasPowerUp);
        if (this.hasPowerUp) {
            this.activatePowerUp();
        }

    }


    // ===============================================================================================//


    fireBullet() {
        const bullet = this.bullets.create(this.vaisseau.x, this.vaisseau.y, 'bullet'); // Crée un projectile à partir de la position actuelle du vaisseau
        bullet.setVelocityY(-VELOCITE_HORIZONTALE_BULLET); // Définit la vitesse verticale du projectile
        this.bulletSound.play(); // Joue le son associé au tir du vaisseau
    }


    // ===============================================================================================//


    bulletBombCollision(bullet, bomb) {
        bullet.destroy();
        bomb.destroy();

        const explosion = this.add.sprite(bomb.x, bomb.y, "explosion");
        explosion.play("explode");
        this.explosionSound.play();
    }

    // ===============================================================================================//




    enemyFireBullet(enemy) {
        const bullet = this.enemyBullets.create(enemy.x, enemy.y, 'bullet'); // Crée un projectile ennemi à la position de l'ennemi

        // Calcule la direction entre l'ennemi et le vaisseau spatial
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.vaisseau.x, this.vaisseau.y);

        // Définit la vitesse du projectile en fonction de la direction
        const velocityX = Math.cos(angle) * VELOCITE_HORIZONTALE_BULLET;
        const velocityY = Math.sin(angle) * VELOCITE_HORIZONTALE_BULLET;
        bullet.setVelocity(velocityX, velocityY);

        // Définit des propriétés supplémentaires du projectile ennemi si nécessaire
    }

    // ===============================================================================================//


    enemyBulletCollision(vaisseau, bullet) {
        bullet.destroy(); // Détruit le projectile ennemi
        const explosion = this.add.sprite(vaisseau.x, vaisseau.y, "explosion"); // Ajoute une explosion à la position du vaisseau
        explosion.play("explode"); // Joue l'animation d'explosion
        this.explosionSound.play(); // Joue le son d'explosion

        NB_VIE--; // Diminue le nombre de vies de 1
        if (NB_VIE <= 0) {
            gameOver = true;
            localStorage.setItem('score', SCORE); // Enregistre le score dans le localStorage
            localStorage.setItem('coins', coins); // Enregistre les coins dans le localStorage
        }
    }


    // ===============================================================================================//

    bombVaisseauCollision(vaisseau, bomb) {
        bomb.destroy(); // Supprime la bombe
        const explosion = this.add.sprite(vaisseau.x, vaisseau.y, "explosion");
        explosion.play("explode");
        this.explosionSound.play(); // Joue le son d'explosion


        gameOver = true;
        localStorage.setItem('score', SCORE); // Enregistre le score dans le localStorage
        localStorage.setItem('coins', coins); // Enregistre les coins dans le localStorage

    }

    // ===============================================================================================//

    bulletEnemyCollision(bullet, enemy) {
            ENEMIES_DE_SUITE++;

            this.miseAjourScore()
            coins++;
            bullet.destroy(); // Supprime le projectile
            enemy.destroy(); // Supprime l'ennemi
            const explosion = this.add.sprite(enemy.x, enemy.y, "explosion");
            explosion.play("explode");
            this.explosionSound.play() // Joue le son d'explosion
        }
        // ===============================================================================================//


    enemyCollision(vaisseau, enemy) {
        enemy.destroy(); // Supprime l'ennemi
        this.explosionSound.play(); // Joue le son d'explosion

        NB_VIE--; // Réduit le score d'1 point si le score est supérieur à 0
        ENEMIES_DE_SUITE = 1
        if (NB_VIE <= 0) {
            gameOver = true
            localStorage.setItem('score', SCORE); // Enregistrer le score dans le localStorage
            localStorage.setItem('coins', coins); // Enregistrer le coins dans le localStorage

        }
    }



    // ===============================================================================================//


    collectPowerUp(vaisseau, powerUp) {
        powerUp.destroy();
        this.activatePowerUp()

    }

    // ===============================================================================================//

    createPowerUp() {
        if (!this.hasPowerUp) {
            const x = Phaser.Math.Between(0, LARGEUR_FENETRE);
            const y = -10;
            const powerUp = this.PowerUp.create(x, y, "powerUp");
            powerUp.setVelocityY(VELOCITE_BOMB);
        }

    }


    // ===============================================================================================//

    activatePowerUp() {
        if (this.hasPowerUp) {
            return;
        }
        const power = ["speed", "coins", "vie"];
        const random = Phaser.Math.RND.pick(power);
        console.log(random);
        switch (random) {
            case "speed":
                this.activateSpeed();
                break;
            case "coins":
                this.AddCoins();
                break;
            case "vie":
                this.AddHealth()
            default:
                break;
        }
    }

    // ===============================================================================================//

    activateSpeed() {
        VELOCITE_LATERAL_VAISSEAU *= 2;
        VELOCITE_HORIZONTALE_VAISSEAU *= 2;

        this.hasPowerUp = true;

        this.time.delayedCall(10000, () => {
            this.resetSpeed();
        });
    }


    // ===============================================================================================//

    AddCoins() {
        this.hasPowerUp = true;
        coins += 20;
        this.time.delayedCall(10000, () => { this.hasPowerUp = false })

    }

    // ===============================================================================================//


    AddHealth() {
        this.hasPowerUp = true;
        NB_VIE ++;
        if(NB_VIE>3 ){
            NB_VIE = 3
        }
        this.time.delayedCall(10000, () => { this.hasPowerUp = false });
    }





    // ===============================================================================================//

    resetSpeed() {
        this.hasPowerUp = false;
        VELOCITE_LATERAL_VAISSEAU = 300;
        VELOCITE_HORIZONTALE_VAISSEAU = 250;
    }




    // ===============================================================================================//


    startPowerUpTimer() {
        this.powerUpTimer = this.time.addEvent({
            delay: INTERVALLE_PowerUp, // Délai entre chaque création d'powerUp
            callback: this.createPowerUp, // Fonction de création de l'powerUp
            callbackScope: this, // Portée du callback (cette scène)
            loop: true // Indique que l'événement doit se répéter en boucle
        });
    }


    // ===============================================================================================//


    miseAjourMulti() {
        if (ENEMIES_DE_SUITE > 5) {
            if (ENEMIES_DE_SUITE > 10) {
                multiplicateur = 3
            } else {
                multiplicateur = 2
            }
        } else {
            multiplicateur = 1
        }
    }

    // ===============================================================================================//

    miseAjourScore() {

        this.miseAjourMulti()
        switch (multiplicateur) {
            case 1:
                SCORE++
                break;
            case 2:
                SCORE += 2;
                break;
            case 3:
                SCORE += 3;
                break;
        }
    }


    // ===============================================================================================//

    createEnemy() {
        const x = Phaser.Math.Between(0, LARGEUR_FENETRE); // Génère une position horizontale aléatoire pour l'ennemi
        const y = -10; // Position verticale de départ de l'ennemi (au-dessus de l'écran)
        const enemy = this.enemies.create(x, y, "enemy"); // Crée un ennemi à la position générée
        enemy.setVelocityY(VELOCITE_ENNEMI); // Définit la vitesse verticale de l'ennemi
        this.enemyFireBullet(enemy);

    }

    // ===============================================================================================//

    createBomb() {
        const x = Phaser.Math.Between(0, LARGEUR_FENETRE); // Génère une position horizontale aléatoire pour l'ennemi
        const y = -10; // Position verticale de départ de la bombe (au-dessus de l'écran)
        const bomb = this.bombs.create(x, y, "bomb"); // Crée une bombe à la position générée
        bomb.setVelocityY(VELOCITE_BOMB); // Définit la vitesse verticale de la bombe
        this.physics.add.overlap(this.vaisseau, bomb, this.bombVaisseauCollision, null, this); // Gère la collision entre le vaisseau et la bombe

    }

    // ===============================================================================================//




    startEnemyTimer() {
        this.enemyTimer = this.time.addEvent({
            delay: INTERVALLE_ENNEMI, // Délai entre chaque création d'ennemi
            callback: this.createEnemy, // Fonction de création de l'ennemi
            callbackScope: this, // Portée du callback (cette scène)
            loop: true // Indique que l'événement doit se répéter en boucle
        });
    }

    // ===============================================================================================//


    startBombTimer() {
        this.bombTimer = this.time.addEvent({
            delay: INTERVALLE_BOMB, // Délai entre chaque création d'ennemi
            callback: this.createBomb, // Fonction de création de l'ennemi
            callbackScope: this, // Portée du callback (cette scène)
            loop: true // Indique que l'événement doit se répéter en boucle
        });
    }

}

// ===============================================================================================//

const config = {
    type: Phaser.AUTO,
    width: LARGEUR_FENETRE,
    height: HAUTEUR_FENETRE,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [Accueil, Home]
};
// ===============================================================================================//

var jeu = new Phaser.Game(config);