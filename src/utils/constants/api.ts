
import moment from "moment";


export const backgroundImages = require("assets/images/backgroundImages.jpg")
export const homeBackgroundImages = require("assets/images/HomeBackground.jpeg")

export const ImageE1 = require("assets/images/ImageE1.jpg")
export const ImageE2 = require("assets/images/ImageE2.jpg")
export const ImageE3 = require("assets/images/ImageE3.jpg")


export const profils = require("assets/images/profils.png")
export const bus = require("assets/icons/launch_screen.jpg")
export const logo = require("assets/images/launch_screen.png")
export const logo1 = require("assets/images/openeducat-logo-transparent.png")

export const groupTasksByDate = (tasks: any[]) => {
    return tasks.reduce((acc, task) => {
        const { date, ...rest } = task;

        // Vérifie si la date existe déjà dans l'objet accumulé
        if (!acc[date]) {
            acc[date] = [];
        }

        // Ajoute la tâche à la date correspondante
        acc[date].push(rest);

        return acc;
    }, {});
};

export function getRandomColor() {
    const colors = [
        '#FF5733', // Rouge orangé
        '#33FF57', // Vert lime
        '#3357FF', // Bleu vif
        '#FF33A8', // Rose vif
        '#FFC300', // Jaune
        '#DAF7A6', // Vert pâle
        '#C70039', // Rouge foncé
        '#900C3F', // Bordeaux
        '#581845', // Violet foncé
        '#1ABC9C', // Vert émeraude
    ];

    // Sélectionne une couleur aléatoire dans la liste
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}