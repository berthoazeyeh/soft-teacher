import { Response, Student } from "./CommonServices";



export const upsertStudent = (db: any, student: any, classroom_id: number): Promise<Response<any>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                "SELECT id FROM students WHERE id = ?;",
                [student.id],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        // ⚡ Mettre à jour si l'étudiant existe
                        tx.executeSql(
                            `UPDATE students SET 
                                active = ?, avatar = ?, birth_date = ?, blood_group = ?, 
                                category_id = ?, email = ?, first_name = ?, middle_name = ?, 
                                last_name = ?, name = ?, gender = ?, gr_no = ?, id_number = ?, 
                                nationality = ?, parents = ?, partner_id = ?, phone = ?, 
                                rfid_code = ?, user_id = ?, visa_info = ?, classroom_id = ?
                             WHERE id = ?;`,
                            [
                                student.active ? 1 : 0,
                                student.avatar,
                                student.birth_date,
                                student.blood_group || "",
                                student.category_id || "",
                                student.email,
                                student.first_name,
                                student.middle_name || "",
                                student.last_name,
                                student.name,
                                student.gender,
                                student.gr_no,
                                student.id_number || "",
                                student.nationality,
                                JSON.stringify(student.parents || {}), // Convertir en JSON string
                                student.partner_id,
                                student.phone,
                                student.rfid_code || "",
                                student.user_id || null,
                                student.visa_info || "",
                                classroom_id,
                                student.id
                            ],
                            () => resolve({ success: true, message: "Étudiant mis à jour" }),
                            (_: any, error: any) => reject({ success: false, error: error.message })
                        );
                    } else {
                        // ⚡ Insérer un nouvel étudiant
                        tx.executeSql(
                            `INSERT INTO students 
                                (id, active, avatar, birth_date, blood_group, category_id, email, 
                                first_name, middle_name, last_name, name, gender, gr_no, id_number, 
                                nationality, parents, partner_id, phone, rfid_code, user_id, visa_info, classroom_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                student.id,
                                student.active ? 1 : 0,
                                student.avatar,
                                student.birth_date,
                                student.blood_group || "",
                                student.category_id || "",
                                student.email,
                                student.first_name,
                                student.middle_name || "",
                                student.last_name,
                                student.name,
                                student.gender,
                                student.gr_no,
                                student.id_number || "",
                                student.nationality,
                                JSON.stringify(student.parents || {}), // Convertir en JSON string
                                student.partner_id,
                                student.phone,
                                student.rfid_code || "",
                                student.user_id || null,
                                student.visa_info || "",
                                classroom_id
                            ],
                            () => resolve({ success: true, message: "Étudiant ajouté" }),
                            (_: any, error: any) => reject({ success: false, error: error.message })
                        );
                    }
                },
                (_: any, error: any) => reject({ success: false, error: error.message })
            );
        });
    });
};

export const clearManyToManyRelations = (db: any): Promise<Response<string>> => {
    return new Promise((resolve) => {
        db.transaction((tx: any) => {
            try {
                // 🗑️ Supprimer toutes les entrées de `student_classroom`
                tx.executeSql(
                    `DELETE FROM student_classroom;`,
                    [],
                    () => console.log("🧹 Toutes les relations student_classroom supprimées"),
                    (error: any) => console.error("❌ Erreur suppression student_classroom: ", error)
                );

                // 🗑️ Supprimer toutes les entrées de `student_subject`
                tx.executeSql(
                    `DELETE FROM student_subject;`,
                    [],
                    () => console.log("🧹 Toutes les relations student_subject supprimées"),
                    (error: any) => console.error("❌ Erreur suppression student_subject: ", error)
                );

                resolve({ success: true, data: "Toutes les relations many-to-many ont été supprimées" });
            } catch (error: any) {
                resolve({ success: false, error: "Erreur lors de la suppression: " + error.message });
            }
        });
    });
};


export function syncAllStudents(requests: any[], db: any, classroom_id: number) {
    console.log("📌 Nombre d'étudiants à synchroniser :", requests.length);

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM students WHERE id = ?',
                        [request.id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // 🔄 Mise à jour de l'étudiant existant
                                tx.executeSql(
                                    `UPDATE students 
                                     SET 
                                        active = ?, 
                                        avatar = ?, 
                                        birth_date = ?, 
                                        blood_group = ?, 
                                        category_id = ?, 
                                        email = ?, 
                                        first_name = ?, 
                                        middle_name = ?, 
                                        last_name = ?, 
                                        name = ?, 
                                        gender = ?, 
                                        gr_no = ?, 
                                        id_number = ?, 
                                        nationality = ?, 
                                        parents = ?, 
                                        partner_id = ?, 
                                        phone = ?, 
                                        rfid_code = ?, 
                                        user_id = ?, 
                                        visa_info = ?,
                                        classroom_id = ?
                                     WHERE id = ?`,
                                    [
                                        request.active ? 1 : 0,
                                        request.avatar,
                                        request.birth_date,
                                        request.blood_group || null,
                                        request.category_id || null,
                                        request.email,
                                        request.first_name,
                                        request.middle_name || null,
                                        request.last_name,
                                        request.name,
                                        request.gender,
                                        request.gr_no,
                                        request.id_number || null,
                                        request.nationality,
                                        JSON.stringify(request.parents), // JSON stringifié
                                        request.partner_id,
                                        request.phone,
                                        request.rfid_code || null,
                                        request.user_id || null,
                                        request.visa_info || null,
                                        classroom_id,
                                        request.id
                                    ],
                                    () => resolveQuery('Updated: ' + request.id),
                                    (tx: any, error: any) => rejectQuery('Update failed: ' + request.id + ' ' + error.message)
                                );
                            } else {
                                // ➕ Insertion d'un nouvel étudiant
                                tx.executeSql(
                                    `INSERT INTO students (id, active, avatar, birth_date, blood_group, category_id, email, first_name, middle_name, last_name, name, gender, gr_no, id_number, nationality, parents, partner_id, phone, rfid_code, user_id, visa_info, classroom_id)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        request.id,
                                        request.active ? 1 : 0,
                                        request.avatar,
                                        request.birth_date,
                                        request.blood_group || null,
                                        request.category_id || null,
                                        request.email,
                                        request.first_name,
                                        request.middle_name || null,
                                        request.last_name,
                                        request.name,
                                        request.gender,
                                        request.gr_no,
                                        request.id_number || null,
                                        request.nationality,
                                        JSON.stringify(request.parents), // JSON stringifié
                                        request.partner_id,
                                        request.phone,
                                        request.rfid_code || null,
                                        request.user_id || null,
                                        request.visa_info || null,
                                        classroom_id
                                    ],
                                    () => resolveQuery('Inserted: ' + request.id),
                                    (error: any, tx: any) => rejectQuery('Insert failed: ' + request.id + ' ' + error.message)
                                );
                            }
                        }
                    );
                });
            });

            // ✅ Exécuter toutes les requêtes et retourner la promesse
            Promise.all(queryPromises)
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    });
}



export function syncAllStudentsNew(requests: any[], db: any, classroom_id: number): Promise<string[]> {
    console.log("📌 Nombre d'étudiants à synchroniser :", requests.length);

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = requests.map((request: any) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    // const classroom_id = request.home_classroom?.id || null;
                    const subjects = request.subjects?.map((sub: any) => sub.id) || [];

                    tx.executeSql(
                        'SELECT id FROM students WHERE id = ?',
                        [request.id],
                        (tx: any, results: any) => {
                            // console.log("......///////////");

                            if (results.rows.length > 0) {
                                // 🔄 Mise à jour de l'étudiant existant
                                tx.executeSql(
                                    `UPDATE students 
                                     SET active = ?, 
                                         avatar = ?, 
                                         birth_date = ?, 
                                         blood_group = ?, 
                                         category_id = ?, 
                                         email = ?, 
                                         first_name = ?, 
                                         middle_name = ?, 
                                         last_name = ?, 
                                         name = ?, 
                                         gender = ?, 
                                         gr_no = ?, 
                                         id_number = ?, 
                                         nationality = ?, 
                                         parents = ?, 
                                         home_class = ?, 
                                         is_invited = ?,
                                         partner_id = ?, 
                                         phone = ?, 
                                         rfid_code = ?, 
                                         user_id = ?, 
                                         visa_info = ?
                                     WHERE id = ?`,
                                    [
                                        request.active ? 1 : 0,
                                        request.avatar,
                                        request.birth_date,
                                        request.blood_group || null,
                                        request.category_id || null,
                                        request.email,
                                        request.first_name,
                                        request.middle_name || null,
                                        request.last_name,
                                        request.name,
                                        request.gender,
                                        request.gr_no,
                                        request.id_number || null,
                                        request.nationality,
                                        JSON.stringify(request.parents || []),
                                        JSON.stringify(request.home_classroom || {}),
                                        request.is_invited ? 1 : 0,
                                        request.partner_id,
                                        request.phone,
                                        request.rfid_code || null,
                                        request.user_id || null,
                                        request.visa_info || null,
                                        request.id
                                    ],
                                    () => {

                                        syncStudentRelations(tx, request.id, classroom_id, subjects)
                                            .then(() => resolveQuery(`Updated: ${request.id}`))
                                            .catch(error => rejectQuery(`Relation Update failed: ${error}`));
                                    },
                                    (error: any) => {
                                        console.log(error);

                                        rejectQuery(`Update failed: ${request.id} ${error.message}`)
                                    }
                                );
                            } else {
                                // ➕ Insertion d'un nouvel étudiant
                                tx.executeSql(
                                    `INSERT INTO students (id, active, avatar, birth_date, blood_group, category_id, email, first_name, middle_name, 
                                    last_name, name, gender, gr_no, id_number, nationality, parents, home_class, is_invited, partner_id, phone, rfid_code, user_id, visa_info)
                                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        request.id,
                                        request.active ? 1 : 0,
                                        request.avatar,
                                        request.birth_date,
                                        request.blood_group || null,
                                        request.category_id || null,
                                        request.email,
                                        request.first_name,
                                        request.middle_name || null,
                                        request.last_name,
                                        request.name,
                                        request.gender,
                                        request.gr_no,
                                        request.id_number || null,
                                        request.nationality,
                                        JSON.stringify(request.parents || []),
                                        JSON.stringify(request.home_classroom || {}),
                                        request.is_invited ? 1 : 0,
                                        request.partner_id,
                                        request.phone,
                                        request.rfid_code || null,
                                        request.user_id || null,
                                        request.visa_info || null
                                    ],
                                    () => {
                                        console.log("......///////////");

                                        syncStudentRelations(tx, request.id, classroom_id, subjects)
                                            .then(() => resolveQuery(`Inserted: ${request.id}`))
                                            .catch(error => rejectQuery(`Relation Insert failed: ${error}`));
                                    },
                                    (error: any) => {
                                        console.log(error);
                                        rejectQuery(`Insert failed: ${request.id} ${error.message}`)
                                    }
                                );
                            }
                        }
                    );
                });
            });

            // ✅ Exécuter toutes les requêtes et retourner la promesse
            Promise.all(queryPromises)
                .then((results: any) => resolve(results))
                .catch(error => reject(error));
        });
    });
}




export function syncStudentRelations(tx: any, studentId: number, classroom_id: number | null, subjects: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
        // 🗑️ Supprimer les anciennes matières
        tx.executeSql('DELETE FROM student_subject WHERE student_id = ?', [studentId]);

        // ➕ Ajouter les nouvelles matières
        subjects.forEach((subjectId: number) => {
            tx.executeSql(
                'INSERT INTO student_subject (student_id, subject_id) VALUES (?, ?)',
                [studentId, subjectId],
                () => console.log(`📚 Subject ${subjectId} assigned to Student ${studentId}`),
                (tx: any, error: any) => reject(`Failed to assign subject ${subjectId}: ${error.message}`)
            );
        });

        // 🗑️ Supprimer l'ancienne classe
        tx.executeSql(
            'DELETE FROM student_classroom WHERE student_id = ?',
            [studentId],
            () => {
                if (classroom_id) {
                    // ➕ Ajouter la nouvelle classe
                    tx.executeSql(
                        'INSERT INTO student_classroom (student_id, classroom_id) VALUES (?, ?)',
                        [studentId, classroom_id],
                        () => {
                            // console.log(`🏫 Student ${studentId} assigned to Classroom ${classroom_id}`);
                            resolve();
                        },
                        (tx: any, error: any) => reject(`Failed to assign classroom ${classroom_id}: ${error.message}`)
                    );
                } else {
                    resolve();
                }
            },
            (tx: any, error: any) => reject(`Failed to remove old classroom for Student ${studentId}: ${error.message}`)
        );
    });
}


export const getStudentsByFilter = (db: any, classroom_id?: number, subject_id?: number): Promise<Response<Student[]>> => {
    return new Promise((resolve) => {
        let query = `
            SELECT DISTINCT s.* 
            FROM students s
            LEFT JOIN student_classroom sc ON s.id = sc.student_id
            LEFT JOIN student_subject ss ON s.id = ss.student_id
            WHERE 1=1
        `;
        const params: any[] = [];

        if (classroom_id) {
            query += " AND sc.classroom_id = ?";
            params.push(classroom_id);
        }

        if (subject_id) {
            query += " AND ss.subject_id = ?";
            params.push(subject_id);
        }
        query += " ORDER BY s.name ASC";

        db.transaction((tx: any) => {
            tx.executeSql(
                query,
                params,
                (_: any, results: any) => {
                    try {
                        let rows = results.rows;
                        let students: Student[] = [];

                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            students.push({
                                id: item.id,
                                active: item.active === 1, // SQLite stocke boolean en 0 ou 1
                                avatar: item.avatar,
                                birth_date: item.birth_date,
                                blood_group: item.blood_group || null,
                                category_id: item.category_id || null,
                                email: item.email,
                                first_name: item.first_name,
                                middle_name: item.middle_name || null,
                                last_name: item.last_name,
                                name: item.name,
                                gender: item.gender,
                                gr_no: item.gr_no,
                                id_number: item.id_number || null,
                                nationality: item.nationality,
                                parents: item.parents ? JSON.parse(item.parents) : {}, // Conversion JSON
                                home_class: item.home_class ? JSON.parse(item.home_class) : null,
                                is_invited: item.is_invited === 1,
                                partner_id: item.partner_id,
                                phone: item.phone,
                                rfid_code: item.rfid_code || null,
                                user_id: item.user_id || null,
                                visa_info: item.visa_info || null,
                            });
                        }

                        resolve({ success: true, data: students });
                    } catch (error: any) {
                        resolve({ success: false, error: "Parsing error: " + error.message });
                    }
                },
                (error: any, _: any) => resolve({ success: false, error: "Select error: " + error.message })
            );
        });
    });
};


export const getManyToManyRelations = (db: any): Promise<Response<{ student_classrooms: any[], student_subjects: any[] }>> => {
    return new Promise((resolve) => {
        db.transaction((tx: any) => {
            try {
                let student_classrooms: any[] = [];
                let student_subjects: any[] = [];

                // 📌 Récupérer toutes les relations `student_classroom`
                tx.executeSql(
                    `SELECT * FROM student_classroom;`,
                    [],
                    (_: any, results: any) => {
                        let rows = results.rows;
                        for (let i = 0; i < rows.length; i++) {
                            student_classrooms.push(rows.item(i));
                        }

                        // 📌 Récupérer toutes les relations `student_subject`
                        tx.executeSql(
                            `SELECT * FROM student_subject;`,
                            [],
                            (_: any, subjectResults: any) => {
                                let subjectRows = subjectResults.rows;
                                for (let i = 0; i < subjectRows.length; i++) {
                                    student_subjects.push(subjectRows.item(i));
                                }

                                // ✅ Retourner les données
                                resolve({
                                    success: true,
                                    data: {
                                        student_classrooms,
                                        student_subjects
                                    }
                                });
                            },
                            (error: any) => resolve({ success: false, error: "Erreur lors de la récupération de student_subject: " + error.message })
                        );
                    },
                    (error: any) => resolve({ success: false, error: "Erreur lors de la récupération de student_classroom: " + error.message })
                );
            } catch (error: any) {
                resolve({ success: false, error: "Erreur lors de l'exécution: " + error.message });
            }
        });
    });
};
