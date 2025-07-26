import { FacultyAttendance, MyNotificationTypesBD, Response } from "./CommonServices";



export const saveNotification = (db: any, notification: MyNotificationTypesBD): Promise<Response<MyNotificationTypesBD>> => {
    console.log("saveNotification called................");

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT id FROM notifications WHERE title = ? AND body = ? AND date = ?;`,
                [notification.title, notification.body, notification.date],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        // Mettre à jour la notification existante
                        tx.executeSql(
                            `UPDATE notifications 
                             SET isRead = ?, pressAction = ? 
                             WHERE title = ? AND body = ? AND date = ?;`,
                            [
                                notification.isRead,
                                JSON.stringify(notification.pressAction),
                                notification.title,
                                notification.body,
                                notification.date
                            ],
                            () => resolve({ success: true, data: notification }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    } else {
                        // Insérer une nouvelle notification
                        tx.executeSql(
                            `INSERT INTO notifications (title, body, date, isRead, pressAction) 
                             VALUES (?, ?, ?, ?, ?);`,
                            [
                                notification.title,
                                notification.body,
                                notification.date,
                                notification.isRead,
                                JSON.stringify(notification.pressAction),
                            ],
                            (_: any, results: any) => resolve({ success: true, data: { ...notification, id: results.insertId } }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    }
                },
                (error: any) => reject({ success: false, error: error.message })
            );
        });
    });
};



export function getNotifications(db: any, isRead?: boolean): Promise<Response<MyNotificationTypesBD[]>> {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM notifications  `;
        let params: any[] = [];
        if (isRead !== undefined) {
            query += ` WHERE isRead = ?`;
            params.push(isRead ? 1 : 0);
        }
        query += " ORDER BY date DESC";
        db.transaction((tx: any) => {
            tx.executeSql(
                query,
                params,
                (_: any, results: any) => {
                    let notifications: MyNotificationTypesBD[] = [];

                    for (let i = 0; i < results.rows.length; i++) {
                        let item = results.rows.item(i);
                        notifications.push({
                            id: item.id,
                            title: item.title,
                            body: item.body,
                            date: item.date,
                            isRead: item.isRead === 1,
                            pressAction: JSON.parse(item.pressAction) || null,
                        });
                    }

                    resolve({ success: true, data: notifications });
                },
                (error: any) => reject({ success: false, error: error.message })
            );
        });
    });
}
