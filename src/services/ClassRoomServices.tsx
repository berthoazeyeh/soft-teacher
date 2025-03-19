import { Classroom, Response } from "./CommonServices";


export function syncAllClassrooms(requests: any[], db: any, isSecondary: boolean, faculty_id: number) {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {

            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM classrooms WHERE id =? ',
                        [request.id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // La classe existe, on met à jour
                                tx.executeSql(
                                    `UPDATE classrooms 
                                     SET 
                                        code = ?, 
                                        name = ?, 
                                        branch = ?, 
                                        course = ?, 
                                        subjects = ? ,
                                        isSecondary = ?,
                                        faculty_id = ?
                                     WHERE id = ?`,
                                    [
                                        request.code || "",
                                        request.name || "",
                                        JSON.stringify(request.branch) || "{}",
                                        JSON.stringify(request.course_id) || "{}",
                                        JSON.stringify(request.subjects) || "[]",
                                        isSecondary ? 1 : 0,
                                        faculty_id,
                                        request.id,
                                    ],
                                    () => resolveQuery('Updated: ' + request.id),
                                    (tx: any, error: any) => {
                                        console.log(tx);
                                        rejectQuery('Update failed: ' + request.id + ' ' + error.message)
                                    }
                                );
                            } else {

                                // La classe n'existe pas, on l'insère
                                tx.executeSql(
                                    `INSERT INTO classrooms (id, code, name, branch, course, subjects,  isSecondary, faculty_id)
                                     VALUES (?, ?, ?, ?, ?, ?,?, ?)`,
                                    [
                                        request.id,
                                        request.code || "",
                                        request.name || "",
                                        JSON.stringify(request.branch) || "{}",
                                        JSON.stringify(request.course_id) || "{}",
                                        JSON.stringify(request.subjects) || "[]",
                                        isSecondary ? 1 : 0,
                                        faculty_id,
                                    ],
                                    () => resolveQuery('Inserted: ' + request.id),
                                    (error: any) => {
                                        console.log(tx);

                                        rejectQuery('Insert failed: ' + request.id + ' ' + error.message)
                                    }
                                );
                            }
                        }
                    );
                });
            });

            // Attendre que toutes les requêtes soient terminées
            Promise.all(queryPromises)
                .then(results => resolve(results)) // Toutes les requêtes réussies
                .catch(error => reject(error)); // Au moins une requête a échoué
        });
    });
}
export const getClassrooms = (db: any, isSecondary: boolean, faculty_id: number): Promise<Response<Classroom[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM classrooms WHERE faculty_id = ? AND isSecondary = ?;`,
                [faculty_id, isSecondary ? 1 : 0], // SQLite utilise INTEGER pour BOOLEAN (1 = true, 0 = false)
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let classrooms: Classroom[] = [];

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            classrooms.push({
                                ...item,
                                branch: JSON.parse(item.branch),
                                course: JSON.parse(item.course),
                                subjects: JSON.parse(item.subjects), // Convertir en liste d'objets
                                isSecondary: !!item.isSecondary // Convertir en booléen
                            });
                        }

                        resolve({ success: true, data: classrooms });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error?.message })
            );
        });
    });
};
export const getClassroomsTMP = (db: any): Promise<Response<Classroom[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM users ;`,
                [], // SQLite utilise INTEGER pour BOOLEAN (1 = true, 0 = false)
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;

                        let classrooms: any[] = [];

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            classrooms.push({
                                ...item,

                            });
                        }
                        resolve({ success: true, data: classrooms });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error?.message })
            );
        });
    });
};
