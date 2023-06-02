# Space-Battle

Ce projet est un jeu développé en utilisant le framework Phaser. Il s'agit d'un jeu de tir dans lequel le joueur contrôle un vaisseau spatial et doit détruire les ennemis qui apparaissent à l'écran. Le score du joueur augmente chaque fois qu'il réussit à détruire un ennemi, et diminue lorsqu'il est touché par un ennemi.

## Caractéristiques

- Taille de la fenêtre : 300 (largeur) x 480 (hauteur)
- Vélocité latérale du vaisseau : 200
- Vélocité horizontale du vaisseau : 250
- Vélocité horizontale du projectile : 700
- Score initial : 0
- Nombre d'ennemis tués : 0
- Vélocité des ennemis : 200
- Intervalle d'apparition des ennemis : 2000 millisecondes

## Prérequis

Avant de pouvoir exécuter ce projet, assurez-vous d'avoir les éléments suivants installés :

- [Phaser](https://phaser.io/) (version compatible avec Phaser 3)

## Installation

1. Clonez ce dépôt de code sur votre machine locale.
2. Assurez-vous d'avoir Phaser correctement installé.
3. Ouvrez le fichier `index.html` dans un navigateur web.

## Contrôles

- Utilisez les touches fléchées gauche et droite pour déplacer le vaisseau horizontalement.
- Utilisez les touches fléchées haut et bas pour déplacer le vaisseau verticalement.
- Appuyez sur la barre d'espace pour tirer des projectiles.
- Appuyez sur la touche "P" pour mettre le jeu en pause.

## Fonctionnalités

- Affichage du score : Le score du joueur est affiché en haut à gauche de l'écran.
- Gestion des collisions : Lorsqu'un projectile touche un ennemi, les deux sont détruits et le score est augmenté.
- Gestion de la collision avec le vaisseau : Si le vaisseau est touché par un ennemi, le vaisseau est détruit, le score diminue (s'il est supérieur à zéro) et un effet sonore d'explosion est joué.
- Mise en pause du jeu : En appuyant sur la touche "P", le jeu peut être mis en pause. Pendant la pause, la physique du jeu est suspendue, le minuteur d'apparition des ennemis est mis en pause et un message "Jeu en pause" est affiché à l'écran.
