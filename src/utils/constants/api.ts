
import moment from "moment";
import notifee, { AndroidImportance, AndroidVisibility, AndroidAction, AndroidCategory, TimestampTrigger, TimeUnit, TriggerType, EventType } from '@notifee/react-native';
import { NotificationState } from "store";

export const DEFAULT_IMG = "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"




export const backgroundImages = require("assets/images/backgroundImages.jpg")
export const homeBackgroundImages = require("assets/images/HomeBackground.jpeg")

export const ImageE1 = require("assets/images/ImageE1.jpg")
export const ImageE2 = require("assets/images/ImageE2.jpg")
export const ImageE3 = require("assets/images/ImageE3.jpg")


export const profils = require("assets/images/profils.png")
export const bus = require("assets/icons/launch_screen.jpg")
export const logo = require("assets/images/launch_screen.png")
export const logo1 = require("assets/images/openeducat-logo-transparent.png")
export const synchronisation = require("assets/images/synchronisation.png")
export function formatName(fullName: string): string {
    let parts = fullName.trim().split(" ");

    return parts
        .map((word, index) =>
            index === 0
                ? word.toUpperCase()  // Garder le premier mot en majuscules
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Majuscule sur la première lettre uniquement
        )
        .join(" ");
}



export async function displayNotificationTest() {
    // Créer un canal avec un niveau d’importance élevé et son activé
    const channelId = await notifee.createChannel({
        id: 'default....',
        name: 'Notifications importantes',
        sound: 'default', // ou le nom d’un fichier de son personnalisé dans res/raw/
        importance: AndroidImportance.HIGH, // garantit que la notification est visible et sonore
    });

    // Afficher la notification
    await notifee.displayNotification({
        title: 'Nouvelle notification',
        body: 'Voici une notification avec son 🔊',
        android: {
            channelId,
            pressAction: {
                id: 'default',
            },
            sound: 'default',
            importance: AndroidImportance.HIGH,
        },
    });
}


// Exemple d'utilisation :
console.log(formatName("ANDREA BEKIRA INDIRA")); // "ANDREA Bekira Indira"
console.log(formatName("JOHN DOE SMITH")); // "JOHN Doe Smith"



export const groupTasksByDate = (tasks: any[]) => {
    return tasks.reduce((acc, task) => {
        const { date, ...rest } = task;

        if (!acc[date]) {
            acc[date] = [];
        }

        acc[date].push(rest);

        return acc;
    }, {});
};
const data: any = [
    // { id: 1, name: "John Doe", hasMarkedAttendance: true, status: true, timeMarked: "09:00 AM", date: "2024-09-23", remarks: "On time" },
    // { id: 2, name: "Jane Smith", hasMarkedAttendance: true, status: false, timeMarked: "09:15 AM", date: "2024-09-23", remarks: "Absent" },
    // { id: 3, name: "Michael Johnson", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
    // { id: 4, name: "Emily Davis", hasMarkedAttendance: true, status: true, timeMarked: "08:50 AM", date: "2024-09-23", remarks: "Early arrival" },
    // { id: 5, name: "Daniel Brown", hasMarkedAttendance: true, status: true, timeMarked: "09:05 AM", date: "2024-09-23", remarks: "On time" },
    // { id: 6, name: "Olivia Williams", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
    // { id: 7, name: "James Miller", hasMarkedAttendance: true, status: false, timeMarked: "09:30 AM", date: "2024-09-23", remarks: "Absent" },
    // { id: 8, name: "Sophia Wilson", hasMarkedAttendance: true, status: true, timeMarked: "08:55 AM", date: "2024-09-23", remarks: "On time" },
    // { id: 9, name: "Liam Martinez", hasMarkedAttendance: true, status: true, timeMarked: "09:10 AM", date: "2024-09-23", remarks: "Slightly late" },
    // { id: 10, name: "Emma Anderson", hasMarkedAttendance: true, status: false, timeMarked: "09:25 AM", date: "2024-09-23", remarks: "Absent" },
    // { id: 11, name: "Noah Thomas", hasMarkedAttendance: true, status: true, timeMarked: "08:45 AM", date: "2024-09-23", remarks: "Early arrival" },
    // { id: 12, name: "Ava Taylor", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
    // { id: 13, name: "William Lee", hasMarkedAttendance: true, status: true, timeMarked: "09:20 AM", date: "2024-09-23", remarks: "Slightly late" },
    // { id: 14, name: "Mia Harris", hasMarkedAttendance: true, status: true, timeMarked: "09:00 AM", date: "2024-09-23", remarks: "On time" },
    // { id: 15, name: "Ethan Clark", hasMarkedAttendance: true, status: false, timeMarked: "09:35 AM", date: "2024-09-23", remarks: "Absent" },
    // { id: 16, name: "Isabella Lewis", hasMarkedAttendance: true, status: true, timeMarked: "09:05 AM", date: "2024-09-23", remarks: "On time" },
    // { id: 17, name: "Mason Walker", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
    // { id: 18, name: "Lucas Hall", hasMarkedAttendance: true, status: true, timeMarked: "08:55 AM", date: "2024-09-23", remarks: "Early arrival" },
    // { id: 19, name: "Charlotte Young", hasMarkedAttendance: true, status: true, timeMarked: "09:10 AM", date: "2024-09-23", remarks: "Slightly late" },
    // { id: 20, name: "Elijah King", hasMarkedAttendance: true, status: false, timeMarked: "09:30 AM", date: "2024-09-23", remarks: "Absent" }
];

export function groupByDay(events: any) {
    // 1. Trier les événements par start_datetime
    const sortedEvents = events.sort((a, b) => (new Date(a.start_datetime) - new Date(b.start_datetime)));

    // 2. Regrouper les événements triés par jour
    const groupedEvents = sortedEvents.reduce((groupedEvents, event) => {
        const date = new Date(event.start_datetime).toISOString().split('T')[0]; // Récupère la date au format YYYY-MM-DD
        if (!groupedEvents[date]) {
            groupedEvents[date] = [];
        }
        groupedEvents[date].push(event);
        return groupedEvents;
    }, {});

    return groupedEvents;
}
export function formatDate(date: string) {
    const now = moment();
    const inputDate = moment(date);

    // Vérifie si c'est aujourd'hui
    if (inputDate.isSame(now, 'day')) {
        // Si la différence est inférieure à 1 minute, retourne "À l'instant"
        if (now.diff(inputDate, 'minutes') < 1) {
            return "À l'instant";
        }
        // Sinon, retourne l'heure
        return inputDate.format('HH:mm');
    }

    // Vérifie si c'est hier
    if (inputDate.isSame(now.subtract(1, 'day'), 'day')) {
        return 'Hier';
    }

    // Sinon, retourne la date au format DD/MM/YYYY
    return inputDate.format('DD/MM/YYYY');
}
export function removeHtmlTags(str: string) {
    return str.replace(/<[^>]*>/g, ''); // Remplace les balises HTML par une chaîne vide
}

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

export const getTimeSlotsForWeek = () => {
    let timeSlots = [];

    // Récupère le lundi de la semaine courante
    let monday = moment().startOf('isoWeek');

    // Boucle sur chaque jour de la semaine (lundi à dimanche)
    for (let i = 0; i < 7; i++) {
        let day = monday.clone().add(i, 'days');

        let startTime = day.clone().set({ hour: 11, minute: 45 });
        let endTime = day.clone().set({ hour: 12, minute: 0 });

        timeSlots.push({
            title: "pause",
            startTime: startTime.toDate(),
            endTime: endTime.toDate(),
            location: "",
            extra_descriptions: [],
        });
    }

    return timeSlots;
};

export const getMondayOfCurrentWeek = () => {
    // Récupère la date actuelle
    const today = moment();

    // Calcule le décalage nécessaire pour arriver à lundi (1 est lundi, 7 est dimanche)
    const dayOfWeek = today.isoWeekday();

    // Si on n'est pas lundi, on retranche le nombre de jours pour arriver au lundi précédent
    const monday = today.subtract(dayOfWeek - 1, 'days');

    return monday;
};


export interface MyNotificationTypes {
    title: string;
    body: string;
    date: string; // Format: "2025-03-24 13:10:19"
    action?: AndroidAction[];
    smallIcon?: string;
    largeIcon?: string;
}

export async function displayScheduledNotification(myNotificationTypes: MyNotificationTypes, channelId: string, settings: NotificationState): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`Programmation pour : ${myNotificationTypes.date}`);
            // Conversion de la date en timestamp (ms)
            const notificationDate = new Date(myNotificationTypes.date).getTime();

            const trigger: TimestampTrigger = {
                type: TriggerType.TIMESTAMP,
                timestamp: notificationDate, // 📅 Déclenchement à l'heure spécifiée
            };

            // Planification de la notification
            await notifee.createTriggerNotification(
                {
                    id: notificationDate.toString(),
                    title: myNotificationTypes.title,
                    body: myNotificationTypes.body,
                    data: { date: myNotificationTypes.date },
                    android: {
                        pressAction: { id: "default" },
                        channelId,
                        sound: 'default',
                        smallIcon: myNotificationTypes.smallIcon ?? 'ic_launcher',
                        importance: AndroidImportance.HIGH,
                        actions: myNotificationTypes.action,
                    },
                },
                trigger
            );

            // console.log(`Notification programmée pour : ${myNotificationTypes.date} - ${myNotificationTypes.title}`);
            resolve(`Notification programmée pour : ${myNotificationTypes.date} - ${myNotificationTypes.title}`); // Résolution de la promesse quand la notification est bien programmée
        } catch (error) {
            // console.error("Notification Error", error);
            resolve(`Notification Error, ${error}`); // Rejeter la promesse en cas d'erreur
        }
    });
}




export function formatRelativeTime(date: string): string {
    const now = moment();
    const givenDate = moment(date, "YYYY-MM-DD HH:mm:ss");

    const diffInSeconds = now.diff(givenDate, "seconds");

    if (diffInSeconds < 60) return "Maintenant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heure${Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""}`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} jour${Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""}`;

    return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
}
