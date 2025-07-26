import { FacultyAttendance, Response } from "./CommonServices";



export const saveFacultyAttendance = (db: any, attendance: FacultyAttendance, is_local: boolean): Promise<Response<FacultyAttendance>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT id FROM faculty_attendances WHERE user_id = ? AND session_id = ?;`,
                [attendance.user_id, attendance.session_id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        // Mettre à jour l'enregistrement existant
                        tx.executeSql(
                            `UPDATE faculty_attendances 
                             SET name = ?, date = ?, remark = ?, present = ?, late = ?, absent = ?, checkin = ?, checkout = ? , is_local=?
                             WHERE user_id = ? AND session_id = ?;`,
                            [
                                attendance.name,
                                attendance.date,
                                attendance.remark || null,
                                attendance.present ? 1 : 0,
                                attendance.late ? 1 : 0,
                                attendance.absent ? 1 : 0,
                                attendance.checkin || null,
                                attendance.checkout || null,
                                is_local ? 1 : 0, // Mise à jour de is_local
                                attendance.user_id,
                                attendance.session_id
                            ],
                            () => resolve({ success: true, data: attendance }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    } else {
                        // Insérer une nouvelle ligne
                        tx.executeSql(
                            `INSERT INTO faculty_attendances (name, session_id, user_id, date, remark, present, late, absent, checkin, checkout, is_local)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                attendance.name,
                                attendance.session_id,
                                attendance.user_id,
                                attendance.date,
                                attendance.remark || null,
                                attendance.present ? 1 : 0,
                                attendance.late ? 1 : 0,
                                attendance.absent ? 1 : 0,
                                attendance.checkin || null,
                                attendance.checkout || null,
                                is_local ? 1 : 0, // Mise à jour de is_local

                            ],
                            (_: any, results: any) => resolve({ success: true, data: { ...attendance, id: results.insertId } }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    }
                },
                (error: any) => reject({ success: false, error: error.message })
            );
        });
    });
};
export const saveFacultyAttendanceNotification = (db: any, attendance: FacultyAttendance, is_local: boolean): Promise<Response<FacultyAttendance>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT id FROM faculty_attendances WHERE user_id = ? AND session_id = ?;`,
                [attendance.user_id, attendance.session_id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        // Mettre à jour l'enregistrement existant
                        tx.executeSql(
                            `UPDATE faculty_attendances 
                             SET  checkout = ? , is_local=?
                             WHERE user_id = ? AND session_id = ?;`,
                            [
                                attendance.checkout || null,
                                is_local ? 1 : 0, // Mise à jour de is_local
                                attendance.user_id,
                                attendance.session_id
                            ],
                            () => resolve({ success: true, data: attendance }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    } else {
                        resolve({ success: true, data: attendance })
                    }
                },
                (error: any) => reject({ success: false, error: error.message })
            );
        });
    });
};


const t = {
    "absent": false,
    "attendance_date": "2025-03-21",
    "attended_hours": "",
    "check_in": "2025-03-21 10:00:00",
    "check_out": "",
    "classroom": [Object],
    "classroom_id": 1,
    "course": [Object],
    "course_id": 1,
    "faculty": [Object],
    "faculty_id": 75,
    "id": 2,
    "late": false,
    "name": "AF02",
    "present": true,
    "remark": "",
    "session": [Object],
    "session_hours": "",
    "session_id": 1
}

export function syncOnlineFacultyAttendances(db: any, requests: any[], is_local: boolean, mustErase?: boolean): Promise<any> {
    console.log("syncOnlineFacultyAttendances----", requests);
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT * FROM faculty_attendances WHERE id=? OR ( user_id = ? AND session_id = ?)',
                        [request?.id, request.faculty_id, request.session_id],
                        (tx: any, results: any) => {
                            // console.warn(results.rows.length);
                            // console.warn(results.rows.item(0));
                            if (results.rows.length > 0) {
                                let item = results.rows.item(0);
                                console.log(item);
                                if ((mustErase === undefined) && item.is_local === 1) {
                                    resolveQuery('Skited: ' + request.faculty_id);
                                } else {
                                    // Mise à jour si l'entrée existe déjà
                                    tx.executeSql(
                                        `UPDATE faculty_attendances 
                                     SET  name = ?, date = ?, remark = ?, present = ?, late = ?, absent = ?, checkin = ?, checkout = ?, is_local = ? 
                                     WHERE id=? OR ( user_id = ? AND session_id = ?)`,
                                        [
                                            request.name,
                                            request?.attendance_date || '',
                                            request.remark || null,
                                            request.present ? 1 : 0,
                                            request.late ? 1 : 0,
                                            request.absent ? 1 : 0,
                                            request.check_in || null,
                                            request.check_out || null,
                                            is_local ? 1 : 0, // Mise à jour de is_local
                                            request.id,
                                            request.faculty_id,
                                            request.session_id
                                        ],
                                        () => resolveQuery('Updated: ' + request.faculty_id),
                                        (error: any) => resolveQuery('Update failed: ' + request.faculty_id + ' ' + error.message)
                                    );
                                }
                            } else {
                                // Insertion si aucune entrée n'existe
                                tx.executeSql(
                                    `INSERT INTO faculty_attendances (id, name, session_id, user_id, date, remark, present, late, absent, checkin, checkout, is_local) 
                                     VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        request.id,
                                        request.name,
                                        request.session_id,
                                        request.faculty_id,
                                        request?.attendance_date || "",
                                        request.remark || null,
                                        request.present ? 1 : 0,
                                        request.late ? 1 : 0,
                                        request.absent ? 1 : 0,
                                        request.check_in || null,
                                        request.check_out || null,
                                        is_local ? 1 : 0 // Ajout de is_local
                                    ],
                                    () => resolveQuery('Inserted: ' + request.faculty_id),
                                    (error: any) => resolveQuery('Insert failed: ' + request.faculty_id + ' ' + error.message)
                                );
                            }
                        }
                    );
                });
            });

            Promise.all(queryPromises)
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    });
}




export const getLocalUnSyncFacultyAttendances = (
    db: any
): Promise<Response<FacultyAttendance[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM faculty_attendances WHERE is_local = 1 ORDER BY session_id;`,
                [],
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let attendanceList: FacultyAttendance[] = [];

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            let attendance: FacultyAttendance = {
                                id: item.id,
                                name: item.name,
                                session_id: item.session_id,
                                user_id: item.user_id,
                                date: item.date,
                                remark: item.remark || null,
                                present: item.present === 1,
                                late: item.late === 1,
                                absent: item.absent === 1,
                                checkin: item.checkin || null,
                                checkout: item.checkout || null,
                                is_local: item.is_local === 1
                            };
                            attendanceList.push(attendance)

                        }

                        resolve({ success: true, data: attendanceList });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any) => resolve({ success: false, error: "Select error: " + error.message })
            );
        });
    });
};
