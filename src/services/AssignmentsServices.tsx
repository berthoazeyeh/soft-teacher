import { Assignment, AssignmentType, Response } from "./CommonServices";


export const insertAssignments = (db: any, is_local: boolean, assignments: Assignment[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction(async (tx: any) => {
            try {
                for (const assignment of assignments) {
                    await new Promise<void>((resolveInsert, rejectInsert) => {
                        tx.executeSql(
                            `INSERT INTO assignments (
                                id, name, description, document, issued_date, submission_date, active, state, marks, reviewer,
                                assignment_type, batch_id, course_id, subject_id, submissions, is_local
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [
                                assignment.id,
                                assignment.name,
                                assignment.description,
                                assignment.document,
                                assignment.issued_date,
                                assignment.submission_date,
                                assignment.active ? 1 : 0,
                                assignment.state,
                                assignment.marks,
                                assignment.reviewer,
                                JSON.stringify(assignment.assignment_type),
                                JSON.stringify(assignment.batch_id),
                                JSON.stringify(assignment.course_id),
                                JSON.stringify(assignment.subject_id),
                                JSON.stringify(assignment.submissions),
                                is_local
                            ],
                            (_: any, result: any) => {
                                console.log(`Assignment ${assignment.id} inserted`);

                                // Insérer les relations assignment_rooms
                                const roomInsertPromises = assignment.room_id.map((room) =>
                                    new Promise<void>((resolveRoom, rejectRoom) => {
                                        tx.executeSql(
                                            `INSERT INTO assignment_rooms (assignment_id, room_id) VALUES (?, ?);`,
                                            [assignment.id, room.id],
                                            () => {
                                                console.log(`Assignment ${assignment.id} linked to room ${room.id}`);
                                                resolveRoom();
                                            },
                                            (error: any) => {
                                                console.error(`Error linking assignment ${assignment.id} to room ${room.id}:`, error);
                                                rejectRoom(error);
                                            }
                                        );
                                    })
                                );

                                // Attendre que toutes les insertions dans assignment_rooms soient terminées
                                Promise.all(roomInsertPromises)
                                    .then(() => resolveInsert())
                                    .catch(rejectInsert);
                            },
                            (error: any) => {
                                console.error(`Error inserting assignment ${assignment.id}:`, error);
                                rejectInsert(error);
                            }
                        );
                    });
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
};

export function insertOrUpdateAssignments(db: any, is_local: boolean, assignments: Assignment[],): Promise<any[]> {
    console.log("..///////////.....");

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = assignments.map((assignment) => {
                return new Promise((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM assignments WHERE id = ?',
                        [assignment.id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // Mise à jour si l'entrée existe déjà
                                tx.executeSql(
                                    `UPDATE assignments 
                                     SET name = ?, description = ?, document = ?, issued_date = ?, 
                                         submission_date = ?, active = ?, state = ?, marks = ?, reviewer = ?, 
                                         assignment_type = ?, batch_id = ?, course_id = ?, subject_id = ?, 
                                         submissions = ?, is_local = ? 
                                     WHERE id = ?`,
                                    [
                                        assignment.name,
                                        assignment.description,
                                        JSON.stringify(assignment.document),
                                        assignment.issued_date,
                                        assignment.submission_date,
                                        assignment.active ? 1 : 0,
                                        assignment.state,
                                        assignment.marks,
                                        assignment.reviewer,
                                        JSON.stringify(assignment.assignment_type),
                                        JSON.stringify(assignment.batch_id),
                                        JSON.stringify(assignment.course_id),
                                        JSON.stringify(assignment.subject_id),
                                        JSON.stringify(assignment.submissions),
                                        is_local ? 1 : 0,
                                        assignment.id,
                                    ],
                                    () => resolveQuery(`Updated assignment: ${assignment.id}`),
                                    (error: any) => {
                                        console.log(error);

                                        resolveQuery(`Update failed for assignment: ${assignment.id} - ${error.message}`)
                                    }
                                );
                            } else {
                                // Insertion si aucune entrée n'existe
                                tx.executeSql(
                                    `INSERT INTO assignments (
                                        id, name, description, document, issued_date, submission_date, 
                                        active, state, marks, reviewer, assignment_type, batch_id, course_id, 
                                        subject_id, submissions, is_local
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                                    [
                                        assignment.id,
                                        assignment.name,
                                        assignment.description,
                                        JSON.stringify(assignment.document),
                                        assignment.issued_date,
                                        assignment.submission_date,
                                        assignment.active ? 1 : 0,
                                        assignment.state,
                                        assignment.marks,
                                        assignment.reviewer,
                                        JSON.stringify(assignment.assignment_type),
                                        JSON.stringify(assignment.batch_id),
                                        JSON.stringify(assignment.course_id),
                                        JSON.stringify(assignment.subject_id),
                                        JSON.stringify(assignment.submissions),
                                        is_local ? 1 : 0,
                                    ],
                                    () => resolveQuery(`Inserted assignment: ${assignment.id}`),
                                    (error: any) => {
                                        console.log(error);

                                        resolveQuery(`Insert failed for assignment: ${assignment.id} - ${error.message}`)
                                    }
                                );
                            }
                        }
                    );
                });
            });

            // Gérer les relations assignment_rooms
            let roomPromises = assignments.flatMap((assignment) =>
                [assignment.room_id].map((room: any) => {
                    return new Promise((resolveRoom, rejectRoom) => {
                        tx.executeSql(
                            `INSERT OR IGNORE INTO assignment_rooms (assignment_id, room_id) VALUES (?, ?);`,
                            [assignment.id, room.id],
                            () => resolveRoom(`Linked assignment ${assignment.id} to room ${room.id}`),
                            (error: any) => {
                                console.log(error);

                                resolveRoom(`Link failed for assignment ${assignment.id} to room ${room.id}: ${error.message}`)
                            }
                        );
                    });
                })
            );

            Promise.all([...queryPromises, ...roomPromises])
                .then(results => resolve(results))
                .catch(error => reject(error));
        });
    });
}

export const getAssignmentsByClassroomId = (db: any, classroomId: number): Promise<Response<Assignment[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT a.*
                 FROM assignments a
                 JOIN assignment_rooms ar ON a.id = ar.assignment_id
                 WHERE ar.room_id = ?;`,
                [classroomId],
                (_: any, result: any) => {
                    const assignments: Assignment[] = [];

                    for (let i = 0; i < result.rows.length; i++) {
                        const row = result.rows.item(i);
                        assignments.push({
                            id: row.id,
                            name: row.name,
                            description: row.description,
                            document: JSON.parse(row.document),
                            issued_date: row.issued_date,
                            submission_date: row.submission_date,
                            active: row.active === 1,
                            state: row.state,
                            marks: row.marks,
                            reviewer: row.reviewer,
                            assignment_type: JSON.parse(row.assignment_type),
                            batch_id: JSON.parse(row.batch_id),
                            course_id: JSON.parse(row.course_id),
                            subject_id: JSON.parse(row.subject_id),
                            submissions: JSON.parse(row.submissions),
                            room_id: [], // Les salles ne sont pas récupérées ici
                            is_local: row.is_local === 1
                        });
                    }

                    resolve({ data: assignments, success: true });
                },
                (error: any) => {
                    console.error("Error fetching assignments:", error);
                    reject({ error: error, success: false });
                }
            );
        });
    });
};





export function insertOrUpdateAssignmentTypes(types: AssignmentType[], db: any): Promise<string[]> {

    console.log("types...", types);

    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let queryPromises = types.map((type) => {
                return new Promise<string>((resolveQuery, rejectQuery) => {
                    tx.executeSql(
                        'SELECT id FROM assignment_types WHERE id = ?',
                        [type.id],
                        (tx: any, results: any) => {
                            if (results.rows.length > 0) {
                                // Mise à jour si l'entrée existe déjà
                                tx.executeSql(
                                    `UPDATE assignment_types 
                                     SET name = ?, code = ?, assign_type = ?, create_date = ?, write_date = ?
                                     WHERE id = ?`,
                                    [
                                        type.name,
                                        type.code,
                                        type.assign_type,
                                        type.create_date,
                                        type.write_date,
                                        type.id
                                    ],
                                    () => resolveQuery(`Updated assignment_type: ${type.id}`),
                                    (error: any) => rejectQuery(`Update failed for assignment_type ${type.id}: ${error.message}`)
                                );
                            } else {
                                // Insertion si aucune entrée n'existe
                                tx.executeSql(
                                    `INSERT INTO assignment_types (id, name, code, assign_type, create_date, write_date)
                                     VALUES (?, ?, ?, ?, ?, ?);`,
                                    [
                                        type.id,
                                        type.name,
                                        type.code,
                                        type.assign_type,
                                        type.create_date,
                                        type.write_date
                                    ],
                                    () => resolveQuery(`Inserted assignment_type: ${type.id}`),
                                    (error: any) => rejectQuery(`Insert failed for assignment_type ${type.id}: ${error.message}`)
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



export function getAssignmentTypes(db: any): Promise<Response<AssignmentType[]>> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT id, name, code, assign_type, create_date, write_date FROM assignment_types;`,
                [],
                (_: any, results: any) => {
                    const assignmentTypes: AssignmentType[] = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        assignmentTypes.push(results.rows.item(i));
                    }
                    resolve({ data: assignmentTypes, success: true });
                },
                (_: any, error: any) => {
                    console.error("Error fetching assignment_types:", error);
                    reject(error);
                }
            );
        });
    });
}


export function createAssignment(db: any, assignment: Assignment): Promise<string> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `INSERT INTO assignments (
                    name, description, document, issued_date, submission_date, 
                    active, state, marks, reviewer, assignment_type, batch_id, course_id, 
                    subject_id, submissions, is_local
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                [
                    assignment.name,
                    assignment.description,
                    JSON.stringify(assignment.document),
                    assignment.issued_date,
                    assignment.submission_date,
                    assignment.active ? 1 : 0,
                    assignment.state,
                    assignment.marks,
                    assignment.reviewer,
                    JSON.stringify(assignment.assignment_type),
                    JSON.stringify(assignment.batch_id),
                    JSON.stringify(assignment.course_id),
                    JSON.stringify(assignment.subject_id),
                    JSON.stringify(assignment.submissions),
                    assignment.is_local ? 1 : 0,
                ],
                (_: any, result: any) => {
                    resolve(`Inserted new assignment with ID: ${result.insertId}`);
                },
                (error: any) => {
                    console.log(error);

                    reject(`Insert failed: ${error.message}`)
                }
            );
            console.log("llllllllllllllllllllllllllllllllllll");

            // 🔗 Gérer la relation `assignment_rooms`
            if (assignment.room_id && assignment.room_id.length > 0) {
                assignment.room_id.forEach((room) => {
                    tx.executeSql(
                        `INSERT INTO assignment_rooms (assignment_id, room_id) VALUES ((SELECT last_insert_rowid()), ?);`,
                        [room.id],
                        () => console.log(`Linked new assignment to room ${room.id}`),
                        (error: any) => console.warn(`Link failed for room ${room.id}: ${error.message}`)
                    );
                });
            }
        });
    });
}




export const getLocalAssignmentsWithRooms = (db: any): Promise<Response<Assignment[]>> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // 1️⃣ Récupérer tous les assignments avec is_local = true
            tx.executeSql(
                `SELECT * FROM assignments WHERE is_local = 1;`,
                [],
                (_: any, assignmentResults: any) => {
                    let assignments: Assignment[] = [];
                    let assignmentIds: number[] = [];

                    for (let i = 0; i < assignmentResults.rows.length; i++) {
                        const row = assignmentResults.rows.item(i);
                        assignmentIds.push(row.id);
                        assignments.push({
                            id: row.id,
                            name: row.name,
                            description: row.description,
                            document: JSON.parse(row.document),
                            issued_date: row.issued_date,
                            submission_date: row.submission_date,
                            active: row.active === 1,
                            state: row.state,
                            marks: row.marks,
                            reviewer: row.reviewer,
                            assignment_type: JSON.parse(row.assignment_type),
                            batch_id: JSON.parse(row.batch_id),
                            course_id: JSON.parse(row.course_id),
                            subject_id: JSON.parse(row.subject_id),
                            submissions: JSON.parse(row.submissions),
                            room_id: [], // À compléter après la deuxième requête
                            is_local: row.is_local === 1
                        });
                    }

                    if (assignments.length === 0) {
                        return resolve({ data: [], success: true });
                    }

                    // 2️⃣ Récupérer les salles associées aux assignments trouvés
                    tx.executeSql(
                        `SELECT ar.assignment_id, r.id as room_id, r.name as room_name 
                         FROM assignment_rooms ar
                         JOIN classrooms r ON ar.room_id = r.id
                         WHERE ar.assignment_id IN (${assignmentIds.map(() => "?").join(",")});`,
                        assignmentIds,
                        (_: any, roomResults: any) => {
                            let roomMap: { [key: number]: { id: number; name: string }[] } = {};

                            for (let i = 0; i < roomResults.rows.length; i++) {
                                const row = roomResults.rows.item(i);
                                if (!roomMap[row.assignment_id]) {
                                    roomMap[row.assignment_id] = [];
                                }
                                roomMap[row.assignment_id].push({ id: row.room_id, name: row.room_name });
                            }

                            // Associer les salles aux assignments
                            assignments = assignments.map(assignment => ({
                                ...assignment,
                                room_id: roomMap[assignment.id] || []
                            }));

                            resolve({ data: assignments, success: true });
                        },
                        (error: any) => {
                            console.error("Error fetching rooms:", error);
                            reject({ error: error, success: false });
                        }
                    );
                },
                (error: any) => {
                    console.error("Error fetching assignments:", error);
                    reject({ error: error, success: false });
                }
            );
        });
    });
};

