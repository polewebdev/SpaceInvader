const LARGEUR_FENETRE = 750; // Définition de la largeur de la fenêtre du jeu
const HAUTEUR_FENETRE = 600; // Définition de la hauteur de la fenêtre du jeu

export default class Accueil extends Phaser.Scene {
    constructor() {
        super("accueil");
    }

    preload() {
        this.load.image("background", "image/bgAcceuil.jpg");
    }

    create() {
        this.add.image(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE / 2, "background");

        const style = {
            fontFamily: "Arial",
            fontSize: "32px",
            fill: "#ffffff",
            backgroundColor: "#051937",
            padding: {
                left: 16,
                right: 16,
                top: 8,
                bottom: 8
            },
            borderRadius: "20px",
            stroke: "#ffffff",
            strokeThickness: 2
        };


        const logoStyle = {
            fontFamily: "Arial",
            fontSize: "40px",
            fill: "#fff"

        }


        const titre = this.add.text(LARGEUR_FENETRE / 2, 50, "Space-Battle", logoStyle).setOrigin(0.5);

        const boutonJouer = this.add.text(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE / 2 - 50, "Jouer", style).setOrigin(0.5);
        boutonJouer.setInteractive({ useHandCursor: true });

        boutonJouer.on("pointerup", () => {
            this.scene.start("home");
        });

        const boutonQuitter = this.add.text(LARGEUR_FENETRE / 2, HAUTEUR_FENETRE / 2 + 50, "Quitter", style).setOrigin(0.5);
        boutonQuitter.setInteractive({ useHandCursor: true });

        boutonQuitter.on("pointerup", () => {
            this.game.destroy(true);
            window.close();

        });
    }
}