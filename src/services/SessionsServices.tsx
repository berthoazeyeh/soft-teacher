import { Response, Session } from "./CommonServices";

export function syncAllSessions(requests: any[], db: any, faculty_id: number) {
    console.log("requests", requests.length);

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM sessions WHERE id = ?',
                        [request.id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // Mise à jour de la session existante
                                tx.executeSql(
                                    `UPDATE sessions 
                                     SET 
                                        name = ?, 
                                        day = ?, 
                                        start_datetime = ?, 
                                        end_datetime = ?, 
                                        attendance_sheet = ?, 
                                        classroom_id = ?, 
                                        course_id = ?, 
                                        subject_id = ?, 
                                        timing_id = ?,
                                        faculty_id = ?
                                     WHERE id = ?`,
                                    [
                                        request.name,
                                        request.day,
                                        request.start_datetime,
                                        request.end_datetime,
                                        JSON.stringify(request.attendance_sheet),
                                        request.classroom_id?.id,
                                        JSON.stringify(request.course_id),
                                        JSON.stringify(request.subject_id),
                                        request.timing_id,
                                        faculty_id,
                                        request.id
                                    ],
                                    () => resolveQuery('Updated: ' + request.id),
                                    (tx: any, error: any) => rejectQuery('Update failed: ' + request.id + ' ' + error.message)
                                );
                            } else {
                                // Insertion d'une nouvelle session
                                tx.executeSql(
                                    `INSERT INTO sessions (id, name, day, start_datetime, end_datetime, attendance_sheet, classroom_id, course_id, subject_id, timing_id, faculty_id)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                                    [
                                        request.id,
                                        request.name,
                                        request.day,
                                        request.start_datetime,
                                        request.end_datetime,
                                        JSON.stringify(request.attendance_sheet),
                                        request.classroom_id?.id,
                                        JSON.stringify(request.course_id),
                                        JSON.stringify(request.subject_id),
                                        request.timing_id,
                                        faculty_id
                                    ],
                                    () => resolveQuery('Inserted: ' + request.id),
                                    (error: any, tx: any) => rejectQuery('Insert failed: ' + request.id + ' ' + error.message)
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


export const getSessions = (db: any): Promise<Response<Session[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT sessions.*, 
                        classrooms.id AS classroom_id, 
                        classrooms.name AS classroom_name, 
                        classrooms.subjects AS classroom_subjects,
                        classrooms.course AS classroom_course ,
                        classrooms.isSecondary AS classroom_isSecondary ,
                        classrooms.branch AS classroom_branch ,
                        classrooms.code AS classroom_code 
                 FROM sessions 
                 LEFT JOIN classrooms ON sessions.classroom_id = classrooms.id;`,
                [],
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let sessions: Session[] = [];
                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            sessions.push({
                                id: item.id,
                                name: item.name,
                                day: item.day,
                                faculty_id: item.faculty_id,
                                start_datetime: item.start_datetime,
                                end_datetime: item.end_datetime,
                                attendance_sheet: item.attendance_sheet ? JSON.parse(item.attendance_sheet) : [],
                                course_id: item.course_id ? JSON.parse(item.course_id) : {},
                                subject_id: item.subject_id ? JSON.parse(item.subject_id) : {},
                                timing_id: item.timing_id,
                                classroom_id: {
                                    id: item.classroom_id,
                                    name: item.classroom_name,
                                    code: item.classroom_code,
                                    // faculty_id: item.faculty_id,
                                    subjects: item.classroom_subjects ? JSON.parse(item.classroom_subjects) : [],
                                    course: item.classroom_course ? JSON.parse(item.classroom_course) : {},
                                    isSecondary: item.classroom_isSecondary ? Boolean(item.classroom_isSecondary) : false,
                                    branch: item.classroom_branch ? JSON.parse(item.classroom_branch) : {},

                                }
                            });
                        }

                        resolve({ success: true, message: "success", data: sessions });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error?.message })
            );
        });
    });
};


export const getSessionsFilter = (
    db: any,
    faculty_id?: number,
    classroom_id?: number,
    date?: string
): Promise<Response<Session[]>> => {
    let filtre = "Filtre par: ";
    if (faculty_id) {
        filtre += "Faculté: " + faculty_id + ", ";
    }
    if (classroom_id) {
        filtre += " Classe: " + classroom_id + ", ";
    } if (date) {
        filtre += " Date: " + date + ", ";
    }
    console.log(filtre);
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let query = `
                SELECT sessions.*, 
                        classrooms.id AS classroom_id, 
                        classrooms.name AS classroom_name, 
                        classrooms.subjects AS classroom_subjects,
                        classrooms.course AS classroom_course,
                        classrooms.isSecondary AS classroom_isSecondary,
                        classrooms.branch AS classroom_branch,
                        classrooms.code AS classroom_code 
                 FROM sessions 
                 LEFT JOIN classrooms ON sessions.classroom_id = classrooms.id
                 WHERE 1 = 1
            `;

            let params: any[] = [];

            if (faculty_id) {
                query += " AND sessions.faculty_id = ?";
                params.push(faculty_id);
            }

            if (classroom_id) {
                query += " AND sessions.classroom_id = ?";
                params.push(classroom_id);
            }

            if (date) {
                query += " AND DATE(sessions.start_datetime) = ?";
                params.push(date);
            }

            tx.executeSql(
                query,
                params,
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let sessions: Session[] = [];

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            sessions.push({
                                id: item.id,
                                name: item.name,
                                day: item.day,
                                faculty_id: item.faculty_id,
                                start_datetime: item.start_datetime,
                                end_datetime: item.end_datetime,
                                attendance_sheet: item.attendance_sheet ? JSON.parse(item.attendance_sheet) : "",
                                course_id: item.course_id ? JSON.parse(item.course_id) : {},
                                subject_id: item.subject_id ? JSON.parse(item.subject_id) : {},
                                timing_id: item.timing_id,
                                classroom_id: {
                                    id: item.classroom_id,
                                    name: item.classroom_name,
                                    code: item.classroom_code,
                                    // faculty_id: item.faculty_id,
                                    subjects: item.classroom_subjects ? JSON.parse(item.classroom_subjects) : [],
                                    course: item.classroom_course ? JSON.parse(item.classroom_course) : {},
                                    isSecondary: item.classroom_isSecondary ? Boolean(item.classroom_isSecondary) : false,
                                    branch: item.classroom_branch ? JSON.parse(item.classroom_branch) : {},
                                }
                            });
                        }

                        resolve({ success: true, error: filtre, data: sessions });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error?.message })
            );
        });
    });
};
