import { AttendanceKey, AttendanceLine, Response, Student, StudentAttendances } from "./CommonServices";

export const saveAttendanceLine = (db: any, attendance: AttendanceLine): Promise<Response<AttendanceLine>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT id FROM attendanceLine WHERE student_id = ? AND session_id = ?;`,
                [attendance.student_id, attendance.session_id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        // Mettre à jour si l'enregistrement existe déjà
                        tx.executeSql(
                            `UPDATE attendanceLine SET absent = ?, excused = ?, late = ?, present = ?, remark = ? , is_local = ?
                             WHERE student_id = ? AND session_id = ?;`,
                            [
                                attendance.absent,
                                attendance.excused,
                                attendance.late,
                                attendance.present,
                                attendance.remark || null,
                                attendance.is_local,
                                attendance.student_id,
                                attendance.session_id
                            ],
                            () => resolve({ success: true, data: attendance }),
                            (error: any) => reject({ success: false, error: error.message })
                        );
                    } else {
                        // Insérer une nouvelle ligne
                        tx.executeSql(
                            `INSERT INTO attendanceLine (student_id, session_id, absent, excused, late, present, remark, is_local)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                attendance.student_id,
                                attendance.session_id,
                                attendance.absent,
                                attendance.excused,
                                attendance.late,
                                attendance.present,
                                attendance.remark || null,
                                attendance.is_local

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




export function syncOnlineAttendanceLines(db: any, requests: any[], is_local: boolean) {
    console.log("syncAttendanceLines----", requests);
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM attendanceLine WHERE student_id = ? AND session_id = ?',
                        [request.student_id, request.session_id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // Mise à jour si l'entrée existe déjà
                                tx.executeSql(
                                    `UPDATE attendanceLine 
                                     SET absent = ?, excused = ?, late = ?, present = ?, remark = ?, is_local = ? 
                                     WHERE student_id = ? AND session_id = ?`,
                                    [
                                        request?.absent ?? 0,
                                        request?.excused ?? 0,
                                        request?.late ?? 0,
                                        request?.present ?? 0,
                                        request.remark || null,
                                        is_local,
                                        request.student_id || 0,
                                        request.session_id
                                    ],
                                    () => resolveQuery('Updated: ' + request.student_id),
                                    (error: any) => resolveQuery('Update failed: ' + request.student_id + ' ' + error.message)
                                );
                            } else {
                                // Insertion si aucune entrée n'existe
                                tx.executeSql(
                                    `INSERT INTO attendanceLine (student_id, session_id, absent, excused, late, present, remark, is_local) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        request.student_id || 0,
                                        request.session_id,
                                        request?.absent ?? 0,
                                        request?.excused ?? 0,
                                        request?.late ?? 0,
                                        request?.present ?? 0,
                                        request.remark || null,
                                        is_local
                                    ],
                                    () => resolveQuery('Inserted: ' + request.student_id),
                                    (error: any) => resolveQuery('Insert failed: ' + request.student_id + ' ' + error.message)
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
export function syncAttendanceLines(requests: any[], db: any) {

    console.log("syncAttendanceLines----", requests);

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM attendanceLine WHERE student_id = ? AND session_id = ?',
                        [request.student_id, request.session_id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // Mise à jour si l'entrée existe déjà
                                tx.executeSql(
                                    `UPDATE attendanceLine 
                                     SET absent = ?, excused = ?, late = ?, present = ?, remark = ?, is_local = ? 
                                     WHERE student_id = ? AND session_id = ?`,
                                    [
                                        request?.absent ?? 0,
                                        request?.excused ?? 0,
                                        request?.late ?? 0,
                                        request?.present ?? 0,
                                        request.remark || null,
                                        request.is_local,
                                        request.student_id,
                                        request.session_id
                                    ],
                                    () => resolveQuery('Updated: ' + request.student_id),
                                    (error: any) => resolveQuery('Update failed: ' + request.student_id + ' ' + error.message)
                                );
                            } else {
                                // Insertion si aucune entrée n'existe
                                tx.executeSql(
                                    `INSERT INTO attendanceLine (student_id, session_id, absent, excused, late, present, remark, is_local) 
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        request.student_id,
                                        request.session_id,
                                        request?.absent ?? 0,
                                        request?.excused ?? 0,
                                        request?.late ?? 0,
                                        request?.present ?? 0,
                                        request.remark || null,
                                        request.is_local
                                    ],
                                    () => resolveQuery('Inserted: ' + request.student_id),
                                    (error: any) => resolveQuery('Insert failed: ' + request.student_id + ' ' + error.message)
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

export const getStudentsWithAttendance = (
    db: any,
    classroom_id: number,
    session_id: number
): Promise<Response<StudentAttendances[]>> => {
    return new Promise((resolve) => {
        db.transaction((tx: any) => {

            // 🔍 Récupérer les étudiants de la classe via la table `student_classroom`
            tx.executeSql(
                `
                SELECT s.* FROM students s
                INNER JOIN student_classroom sc ON s.id = sc.student_id
                WHERE sc.classroom_id = ?  ORDER BY s.name ASC;
                `,
                [classroom_id],
                (_: any, studentsResults: any) => {
                    try {
                        let students: StudentAttendances[] = [];
                        let rows = studentsResults.rows;

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            students.push({
                                id: item.id,
                                avatar: item.avatar,
                                birth_date: item.birth_date,
                                blood_group: item.blood_group || null,
                                email: item.email,
                                name: item.name,
                                gender: item.gender,
                                gr_no: item.gr_no,
                                home_class: item.home_class ? JSON.parse(item.home_class) : null,
                                is_invited: item.is_invited === 1,
                            });
                        }

                        if (students.length === 0) {
                            return resolve({ success: true, data: [] });
                        }

                        // 🔍 Récupérer les présences des étudiants pour cette session
                        const studentIds = students.map(s => s.id);
                        const placeholders = studentIds.map(() => '?').join(',');

                        tx.executeSql(
                            `
                            SELECT * FROM attendanceLine 
                            WHERE session_id = ? 
                            AND student_id IN (${placeholders});
                            `,
                            [session_id, ...studentIds],
                            (_: any, attendanceResults: any) => {
                                let attendanceMap: { [key: number]: AttendanceLine } = {};
                                let attendanceRows = attendanceResults.rows;

                                for (let i = 0; i < attendanceRows.length; i++) {
                                    let item = attendanceRows.item(i);
                                    attendanceMap[item.student_id] = {
                                        absent: item.absent === 1,
                                        present: item.present === 1,
                                        excused: item.excused === 1,
                                        late: item.late === 1,
                                        remark: item.remark || null,
                                    };
                                }

                                // 📌 Associer les présences aux étudiants
                                students = students.map(student => ({
                                    ...student,
                                    attendance_line: attendanceMap[student.id] || ""
                                }));

                                resolve({ success: true, data: students });
                            },
                            (error: any) => resolve({ success: false, error: "Attendance query error: " + error.message })
                        );
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any) => resolve({ success: false, error: "Students query error: " + error.message })
            );
        });
    });
};


export const getLocalUnSyncAttendanceLinesGroupedBySession = (db: any): Promise<Response<{ [sessionId: number]: AttendanceLine[] }>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM attendanceLine WHERE is_local = 1 ORDER BY session_id;`,
                [],
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let groupedAttendance: { [sessionId: number]: AttendanceLine[] } = {};

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            let attendanceLine: AttendanceLine = {
                                id: item.id,
                                student_id: item.student_id,
                                session_id: item.session_id,
                                absent: item.absent === 1,
                                excused: item.excused === 1,
                                late: item.late === 1,
                                present: item.present === 1,
                                remark: item.remark || null,
                                is_local: item.is_local === 1
                            };

                            // Ajouter à la session correspondante
                            if (!groupedAttendance[item.session_id]) {
                                groupedAttendance[item.session_id] = [];
                            }
                            groupedAttendance[item.session_id].push(attendanceLine);
                        }

                        resolve({ success: true, data: groupedAttendance });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any,) => resolve({ success: false, error: "Select error: " + error.message })
            );
        });
    });
};


export const getLocalUnSyncAttendanceLinesGroupedBySessionAndClass = (
    db: any
): Promise<Response<Map<AttendanceKey, AttendanceLine[]>>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT al.*, s.classroom_id 
                 FROM attendanceLine al 
                 JOIN sessions s ON al.session_id = s.id
                 WHERE al.is_local = 1 
                 ORDER BY al.session_id;`,
                [],
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let groupedAttendance: Map<AttendanceKey, AttendanceLine[]> = new Map();

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            let attendanceLine: AttendanceLine = {
                                id: item.id,
                                student_id: item.student_id,
                                session_id: item.session_id,
                                absent: item.absent === 1,
                                excused: item.excused === 1,
                                late: item.late === 1,
                                present: item.present === 1,
                                remark: item.remark || null,
                                is_local: item.is_local === 1
                            };

                            // Création de la clé `AttendanceKey`
                            let key: AttendanceKey = {
                                sessionId: item.session_id,
                                classroom_id: item.classroom_id
                            };

                            // Vérification si la clé existe déjà dans la Map
                            let keyFound = [...groupedAttendance.keys()].find(k =>
                                k.sessionId === key.sessionId && k.classroom_id === key.classroom_id
                            );

                            if (!keyFound) {
                                groupedAttendance.set(key, []);
                                keyFound = key;
                            }

                            groupedAttendance.get(keyFound)?.push(attendanceLine);
                        }

                        resolve({ success: true, data: groupedAttendance });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error.message })
            );
        });
    });
};
