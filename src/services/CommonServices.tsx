import { LOCAL_URL, postData, postDataDoc } from "apis";
import { displayScheduledNotification, MyNotificationTypes, showCustomMessage } from "utils";
import { syncAttendanceLines } from "./AttendanceLineServices";
import { db } from "apis/database";
import moment from "moment";
import { saveFacultyAttendance, saveFacultyAttendanceNotification, syncOnlineFacultyAttendances } from "./FacultyAttendanceServices";
import notifee, { AndroidImportance, AndroidVisibility, AndroidAction, AndroidCategory, TimestampTrigger, TimeUnit, TriggerType, EventType, Event as NoteeEvent } from '@notifee/react-native';
import { getSessionsFromDateFilterGroupedByDate } from "./SessionsServices";
import { I18n } from 'i18n';
import { saveNotification } from "./NotificationsServices";
import { NotificationState } from "store";


export type Classroom = {
    id: number;
    branch: { id: number; name: string };
    code: string;
    course: { id: number; name: string };
    isSecondary: boolean;
    name: string;
    subjects: { id: number; name: string; code: string; branch: { id: number; name: string } }[];
};

export type Response<T> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
};

export type Session = {
    id: number;
    name: string;
    day: string;
    faculty_id: number;
    start_datetime: string;
    end_datetime: string;
    attendance_sheet: any; // Stocké en JSON, peut être un objet ou une liste
    classroom_id: Classroom; // Relation avec la table classrooms
    course_id: any; // Stocké en JSON, peut être un objet
    subject_id: any; // Stocké en JSON, peut être un objet
    timing_id: string;
    facultyAttendance?: FacultyAttendance
};


export type ParentInfo = {
    father?: string;
    mother?: string;
    guardian?: string;
};

export type Student = {
    id: number;
    active: boolean;
    avatar: string;
    birth_date: string;
    blood_group?: string | null;
    category_id?: string | null;
    email: string;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    name: string;
    gender: "m" | "f";
    gr_no: string;
    id_number?: string | null;
    nationality: string;
    parents: ParentInfo[];
    home_class: any;
    is_invited: boolean;
    partner_id: number;
    phone: string;
    rfid_code?: string | null;
    user_id?: number | null;
    visa_info?: string | null;
    // classroom_id: number;

};
export type StudentAttendances = {
    id: number;
    avatar: string;
    birth_date: string;
    blood_group?: string | null;
    email: string;
    name: string;
    gender: "m" | "f";
    gr_no: string;
    attendance_line?: AttendanceLine;
    is_invited: boolean,
    home_class: any
};



export interface FacultyAttendance {
    id?: number; // Optionnel car généré automatiquement
    name: string;
    session_id: number;
    user_id: number;
    date?: string; // Format YYYY-MM-DD HH:MM:SS
    remark?: string;
    present: boolean;
    late: boolean;
    is_local: boolean;
    absent: boolean;
    checkin?: string; // Format YYYY-MM-DD HH:MM:SS
    checkout?: string; // Format YYYY-MM-DD HH:MM:SS
}


export type AttendanceLine = {
    id?: number; // Optionnel car il est généré automatiquement
    student_id: number;
    session_id: number;
    absent: boolean;
    excused: boolean;
    late: boolean;
    present: boolean;
    remark?: string | null;
    is_local: boolean; // Ajout du champ pour indiquer si la donnée est locale
};
export type AttendanceKey = {
    sessionId: number;
    classroom_id: number;
};



export async function syncAttendanceLinesToServersPromise(
    dataToSync: Map<AttendanceKey, AttendanceLine[]>,
): Promise<void> {
    try {

        if (!dataToSync || dataToSync.size === 0) {
            return; // Rien à synchroniser
        }

        // Convertir le Map en une liste de promesses
        const syncPromises = Array.from(dataToSync.entries()).map(async ([key, lines]) => {
            try {
                const res = await postData(
                    `${LOCAL_URL}/api/crud/attendance-lines/session/${key.sessionId}/${key.classroom_id}`,
                    { arg: lines }
                );

                console.log(`Session ID: ${key.sessionId}`);

                if (res?.success) {
                    const updatedAttendanceLines: AttendanceLine[] = lines.map(line => ({
                        ...line,
                        is_local: false,
                        session_id: key.sessionId,
                    }));

                    await syncAttendanceLines(updatedAttendanceLines, db);
                } else {
                    console.log(res);
                    showCustomMessage(
                        "Information",
                        `Erreur de synchronisation : ${res?.message}`,
                        "warning",
                        "bottom"
                    );
                }
            } catch (error) {
                console.error("Erreur lors de la synchronisation des lignes :", error);
                showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");
                throw error; // ❌ Rejet de la promesse globale
            }
        });

        // Attendre que toutes les synchronisations soient terminées
        await Promise.all(syncPromises);
    } catch (error) {
        console.error("Erreur globale de synchronisation :", error);
        throw error; // ❌ Rejet de la promesse globale

    }
}
export async function syncAssignmentToServersPromise(assignments: Assignment[], faculty_id: number): Promise<void> {
    try {
        if (!assignments || assignments.length === 0) {
            return; // Rien à synchroniser
        }

        // Convertir la liste des assignments en une liste de promesses
        const syncPromises = assignments.map(async (assignment) => {
            try {
                const assignmentData = {
                    name: assignment.name,
                    faculty_id: faculty_id, // Assumant que reviewer correspond à l'ID du prof
                    room_id: assignment.room_id[0]?.id || 1, // Premier ID de salle
                    subject_id: assignment.subject_id.id,
                    description: assignment.description,
                    submission_date: moment(assignment.submission_date).format("YYYY-MM-DD HH:mm:ss"),
                    assignment_type: assignment.assignment_type.id,
                    document: assignment.document || null,
                };
                const res = await postDataDoc(`${LOCAL_URL}/api/crud/assignment`, { arg: assignmentData });
                if (res?.success) {
                    console.log(`Assignment ID: ${assignment.id} synchronisé avec succès`);
                    await syncAssignments(assignment.id, db);
                } else {
                    console.log(res);
                    showCustomMessage(
                        "Information",
                        `Erreur de synchronisation : ${res?.message}`,
                        "warning",
                        "bottom"
                    );
                }
            } catch (error) {
                console.error("Erreur lors de la synchronisation des assignments :", error);
                showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");
                throw error; // ❌ Rejet de la promesse globale
            }
        });

        // Attendre que toutes les synchronisations soient terminées
        await Promise.all(syncPromises);
    } catch (error) {
        console.error("Erreur globale de synchronisation :", error);
        throw error; // ❌ Rejet de la promesse globale
    }
}
export async function syncTeacherAttendancesToServersPromise(facultyAttendance: FacultyAttendance[]): Promise<void> {

    if (!facultyAttendance || facultyAttendance.length === 0) {
        return; // Rien à synchroniser
    }
    return new Promise(async (resolve, reject) => {
        try {
            const dataArg: any[] = facultyAttendance.map((e) => ({
                "session_id": e.session_id,
                "check_in": e.checkin ?? null,
                "present": e.present,
                "late": e.late,
                "absent": e.absent,
                "check_out": e.checkout ?? null,
            }));
            console.log("dataArg", dataArg);

            const res = await postData(`${LOCAL_URL}/api/create/attendances`, { arg: dataArg });
            console.log("res", res);

            if (res?.success) {
                const updatedAttendanceLines: FacultyAttendance[] = facultyAttendance.map(line => ({
                    ...line,
                    is_local: false,
                }));
                const re = await syncOnlineFacultyAttendances(db, updatedAttendanceLines, false, true);
                console.log("res................", re);
                resolve();

                // await syn(updatedAttendanceLines, db);
                // deleteTeacherAttendance(facultyAttendance, db).then(() => resolve())
                //     .catch((error) => reject(error));
            } else {
                console.log(res);
                showCustomMessage(
                    "Information",
                    `Erreur de synchronisation : ${res?.message}`,
                    "warning",
                    "bottom"
                );
                resolve();
            }
        } catch (error) {
            console.error("Erreur lors de la synchronisation des assignments :", error);
            showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");
            throw error; // ❌ Rejet de la promesse globale
        }

    })

}

export function deleteTeacherAttendance(facultyAttendances: FacultyAttendance[], db: any): Promise<void> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = facultyAttendances.map((attendance) => {
                return new Promise<void>((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        `DELETE FROM faculty_attendances WHERE id = ?;`,
                        [attendance.id], // Utilisation correcte de l'ID
                        () => {
                            console.log(`Attendance ID: ${attendance.id} supprimé de la base locale`);
                            resolveQuery();
                        },
                        (error: any) => {
                            console.error(`Erreur lors de la suppression de l'Attendance ID: ${attendance.id} - ${error.message}`);
                            rejectQuery(error);
                        }
                    );
                });
            });

            Promise.all(queryPromises)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
}


export function syncAssignments(id: number, db: any): Promise<void> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `DELETE FROM assignments WHERE id = ?;`,
                [id],
                () => {
                    console.log(`Assignment ID: ${id} supprimé de la base locale`);
                    resolve();
                },
                (error: any) => {
                    console.error(`Erreur lors de la suppression de l'Assignment ID: ${id} - ${error.message}`);
                    reject(error);
                }
            );
        });
    });
}

export async function scheduleNotificationsForTeacher(sessions: Record<string, Session[]>, channelId: string, settings: NotificationState) {
    const log: string[] = [];
    Object.entries(sessions).map(async ([date, sessionsList], index) => {

        if (sessionsList.length === 0) return;
        if (settings.badging) {

            const dayStart = moment(sessionsList[0].start_datetime);
            const dayEnd = moment(sessionsList[sessionsList.length - 1].end_datetime);
            log.push(`debut de la journee ${date}. nombres de session: ${sessionsList.length}`);

            // Notification de bienvenue 5 min avant la première session
            const welcomeNotification: MyNotificationTypes = {
                title: I18n.t("PushNotification.welcomeNotification_title"),
                body: I18n.t("PushNotification.welcomeNotification_body"),
                date: dayStart.subtract(settings.time * 2, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            };
            try {

                const res = await displayScheduledNotification(welcomeNotification, channelId, settings);
                log.push(`welcomeNotification ${res}`);
            } catch (error) {
                console.error("welcomeNotification", error);

            }
            // Notification d'au revoir 5 min après la dernière session
            const goodbyeNotification: MyNotificationTypes = {
                title: I18n.t("PushNotification.goodbyeNotification_title"),
                body: I18n.t("PushNotification.goodbyeNotification_body"),
                date: dayEnd.add(settings.time * 2, "minutes").format("YYYY-MM-DD HH:mm:ss"),

            };

            try {
                const res = await displayScheduledNotification(goodbyeNotification, channelId, settings);
                log.push(`goodbyeNotification ${res}`);
            } catch (error) {
                console.error("goodbyeNotification", error);

            }
        }
        sessionsList.map(async (session, index1) => {
            const startTime = moment(session.start_datetime);
            const endTime = moment(session.end_datetime);
            if (settings.cources) {
                // Notification 10 minutes avant le début du cours
                const beforeStartNotification: MyNotificationTypes = {

                    title: I18n.t("PushNotification.beforeStartNotification_title", { classroom: session.classroom_id.name }),
                    body: I18n.t("PushNotification.beforeStartNotification_body",
                        {
                            subject: session.subject_id.name,
                            date: moment(session.start_datetime).format("YYYY-MM-DD"),
                            time: moment(session.start_datetime).format("HH:mm"),
                            timing: settings.time,
                            classroom: session.classroom_id.name
                        }),
                    // date: moment().add(30, "seconds").format("YYYY-MM-DD HH:mm:ss"),
                    date: startTime.subtract(settings.time, "minutes").format("YYYY-MM-DD HH:mm:ss"),
                    action: [{
                        icon: 'ic_start',
                        title: I18n.t("PushNotification.beforeStartNotification_action"),
                        pressAction: { id: `start+${session.id}+${session.faculty_id}` },
                    }]

                };
                try {
                    const res = await displayScheduledNotification(beforeStartNotification, channelId, settings);
                    log.push(`beforeStartNotification ${res}`);

                } catch (error) {

                }
                // Notification 10 minutes avant la fin du cours
                const beforeEndNotification: MyNotificationTypes = {
                    title: I18n.t("PushNotification.beforeEndNotification_title", { classroom: session.classroom_id.name }),
                    body: I18n.t("PushNotification.beforeEndNotification_body"),
                    // date: moment().add(1, "minutes").format("YYYY-MM-DD HH:mm:ss"),
                    date: endTime.subtract(settings.time, "minutes").format("YYYY-MM-DD HH:mm:ss"),
                    action: [{
                        title: I18n.t("PushNotification.beforeEndNotification_action"),
                        pressAction: { id: `end+${session.id}+${session.faculty_id}` },
                    },]
                };
                try {
                    const res = await displayScheduledNotification(beforeEndNotification, channelId, settings);
                    log.push(`beforeStartNotification ${res}`);
                } catch (error) {

                }
                if ((index === Object.entries(sessions).length - 1) && (index1 === sessionsList.length - 1)) {
                    console.log(log);

                }
            }
        });
    });
    return log;
}

export const onEventNotification = ({ type, detail }: NoteeEvent) => {

    if (type == EventType.PRESS) {
        console.log('Cours mis en pause.....');
        const notification = {
            title: detail?.notification?.title ?? "",
            body: detail?.notification?.body ?? "",
            pressAction: detail?.notification?.android?.pressAction ?? null,
            isRead: true,
            date: detail?.notification?.data?.date ? moment(detail?.notification?.data?.date).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        saveNotification(db, notification).then((e) => {
            console.log("saveNotification", e);

        });
        if (detail.pressAction?.id === 'pause') {
            console.log('Cours mis en pause');
        } else if (detail.pressAction?.id === 'end') {
            console.log('Cours terminé');
        }
    }
    if (type === EventType.ACTION_PRESS) {
        console.log('Cours mis en pause.....', detail);
        const notification = {
            title: detail?.notification?.title ?? "",
            body: detail?.notification?.body ?? "",
            pressAction: detail.pressAction,
            isRead: true,
            date: detail?.notification?.data?.date ? moment(detail?.notification?.data?.date).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        const id = (detail?.pressAction ?? { id: "" }).id.split("+");
        console.log(id, id.length);
        if (id.length === 3) {
            saveAttendance(parseInt(id[2]), parseInt(id[2]), id[0] === "start").then((e) => {
                console.log("saveAttendance", e);
            });
        }
        saveNotification(db, notification).then((e) => {
            console.log("saveNotification", e);
        });
        if (detail.pressAction?.id === 'pause') {
            console.log('Cours mis en pause');
        } else if (detail.pressAction?.id === 'end') {
            console.log('Cours terminé');
        }
    }
    if (type === EventType.DELIVERED) {
        console.log('Cours mis en pause DELIVERED');
        const notification = {
            title: detail?.notification?.title ?? "",
            body: detail?.notification?.body ?? "",
            pressAction: detail.pressAction ?? null,
            isRead: false,
            date: detail?.notification?.data?.date ? moment(detail?.notification?.data?.date).format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
        };
        saveNotification(db, notification).then((e) => {
            console.log("saveNotification", e);

        });
    }

}
export const saveAttendance = async (userId: number, sessionId: number, isCheckin: boolean) => {

    try {
        let facultyAttendance: FacultyAttendance;
        if (isCheckin) {
            facultyAttendance = {
                name: '...',
                user_id: userId,
                session_id: sessionId,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                checkin: moment().format('YYYY-MM-DD HH:mm:ss'),
                present: true,
                absent: false,
                late: false,
                is_local: true,
                remark: "RAS"
            };
            const res = await saveFacultyAttendance(db, facultyAttendance, true);
            console.log("saveFacultyAttendance------ isCheckin", res);
        } else {
            facultyAttendance = {
                name: '...',
                user_id: userId,
                session_id: sessionId,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                checkout: moment().format('YYYY-MM-DD HH:mm:ss'),
                present: true,
                absent: false,
                late: false,
                is_local: true,
                remark: "RAS"
            };
            const res = await saveFacultyAttendanceNotification(db, facultyAttendance, true);
            console.log("saveFacultyAttendance------ isCheckout", res);

        }
    } catch (error) {
        console.log(error);
        showCustomMessage("Information", 'Une erreur s\'est produite lors de l\'enregistrement de l\'absence :' + error, "warning", "bottom")
    }
}


export async function fetchLocalTeacherTimeTablesData(currentUser: any, settings: NotificationState) {
    console.log("rfetchLocalTeacherTimeTablesData.......................................");
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
        id: 'default1',
        name: 'Notifications principales',
        badge: true,
        vibration: true,
        sound: 'default',
        visibility: AndroidVisibility.PUBLIC,
        importance: AndroidImportance.HIGH,
    });
    try {
        if (!currentUser) {
            return;
        }


        console.log("rfetchLocalTeacherTimeTablesData...................00000000000....................");

        const res0: Response<Record<string, Session[]>> = await getSessionsFromDateFilterGroupedByDate(
            db,
            moment().subtract(3, 'days').format("YYYY-MM-DD"),
            moment().add(7, 'days').format("YYYY-MM-DD"),
            currentUser?.id
        );
        if (res0.success && res0.data) {
            const r = await scheduleNotificationsForTeacher(res0.data, channelId, settings);
            console.log("...", r);

        } else {
            console.log("rfetchLocalTeacherTimeTablesData", res0.error);

        }
    } catch (error) {
        console.log("rfetchLocalTeacherTimeTablesData", error);

    }

}

export interface Assignment {
    id: number;
    name: string;
    description: string;
    document: string;
    issued_date: string;
    submission_date: string;
    active: boolean;
    state: string;
    marks: number;
    reviewer: string;
    assignment_type: { id: number; name: string };
    batch_id: number;
    course_id: { id: number; name: string };
    subject_id: { id: number; name: string };
    submissions: any[];
    room_id: { id: number; name: string }[];
    is_local: boolean;
}


export type AssignmentType = {
    id: number;
    name: string;
    code: string;
    assign_type: string;
    create_date: string;
    write_date: string;
};


export interface Subjects {
    id?: number;
    code: string;
    name: string;
    subject_type: string;
    type: string;
}

export interface MyNotificationTypesBD {
    id?: number;  // Ajouté pour gérer les notifications existantes
    title: string;
    body: string;
    date: string; // Format YYYY-MM-DD HH:mm:ss
    isRead: boolean; // Indique si la notification a été lue
    pressAction?: any; // Action déclenchée par l'utilisateur
}
