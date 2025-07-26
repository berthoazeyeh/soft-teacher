import moment from 'moment';
// @ts-ignore
import SQLite from 'react-native-sqlite-storage';

// Ouvrir ou créer la base de données
export const db = SQLite.openDatabase(
    {
        name: 'Soft.Education.Teachers.db',
        location: 'default',
    },
    () => { console.log('Base de données ouverte, Soft.Education.Teachers.db') },
    (error: any) => { console.log('Erreur lors de l’ouverture de la base de données', error) }
);


export const createAllTable = async (db: any) => {
    db.transaction((tx: any) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                partner_id INTEGER,
                user_id INTEGER,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                mobile TEXT,
                gender TEXT,
                birth_date TEXT,
                registration_number TEXT UNIQUE,
                avatar TEXT,
                department TEXT,
                max_sub_exams INTEGER,
                password
            );`,
            [],
            () => console.log("Table users créée avec succès."),
            (_: any, error: any) => console.error("Erreur lors de la création de la table users :", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS classrooms (
                id INTEGER PRIMARY KEY,
                code TEXT,
                faculty_id INTEGER,
                name TEXT,
                isSecondary BOOLEAN,
                branch TEXT,  -- JSON string
                course TEXT,  -- JSON string
                subjects TEXT  -- JSON string (liste de matières)
            );`,
            [],
            () => console.log("Table classrooms created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                day TEXT NOT NULL,
                faculty_id INTEGER,
                start_datetime TEXT NOT NULL,
                end_datetime TEXT NOT NULL,
                attendance_sheet TEXT, -- JSON string
                classroom_id INTEGER,  
                course_id TEXT,  -- JSON string
                subject_id TEXT,  -- JSON string
                timing_id TEXT,
                FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
            );`,
            [],
            () => console.log("Table sessions created"),
            (error: any) => console.error("Error creating table: ", error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS faculty_attendances (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                session_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                date TEXT, -- Format YYYY-MM-DD
                remark TEXT,
                present BOOLEAN DEFAULT FALSE,
                late BOOLEAN DEFAULT FALSE,        
                absent BOOLEAN DEFAULT FALSE,
                is_local BOOLEAN DEFAULT TRUE, -- Indique si la donnée est locale ou synchronisée
                checkin TEXT,  
                checkout TEXT, 
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(session_id, user_id) -- Assure qu'un utilisateur ne peut avoir qu'une seule entrée par session
            );`,
            [],
            () => console.log("Table faculty_attendances created"),
            (error: any) => console.error("Error creating table: ", error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY,
                active BOOLEAN,
                avatar TEXT,
                birth_date TEXT,
                blood_group TEXT,
                category_id TEXT,
                email TEXT UNIQUE,
                first_name TEXT,
                middle_name TEXT,
                last_name TEXT,
                name TEXT,
                gender TEXT,
                gr_no TEXT UNIQUE,
                id_number TEXT,
                nationality TEXT,
                parents TEXT, -- Stocké en JSON
                home_class TEXT, -- Stocké en JSON
                is_invited BOOLEAN DEFAULT FALSE,
                partner_id INTEGER,
                phone TEXT,
                rfid_code TEXT,
                user_id INTEGER,
                visa_info TEXT
            );`,
            [],
            () => console.log("Table students created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS attendanceLine (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                session_id INTEGER NOT NULL,
                absent BOOLEAN DEFAULT FALSE,
                excused BOOLEAN DEFAULT FALSE,
                late BOOLEAN DEFAULT FALSE,
                present BOOLEAN DEFAULT TRUE,
                remark TEXT DEFAULT NULL,
                is_local BOOLEAN DEFAULT TRUE, -- Indique si la donnée est locale ou synchronisée
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            );`,
            [],
            () => console.log("Table attendanceLine created"),
            (error: any) => console.error("Error creating table: ", error)
        );


        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS assignments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                document TEXT,
                issued_date TEXT NOT NULL,
                submission_date TEXT NOT NULL,
                active INTEGER DEFAULT 1, -- 1 = true, 0 = false
                state TEXT ,
                marks INTEGER DEFAULT 0,
                reviewer TEXT,
                assignment_type TEXT, -- JSON string
                batch_id TEXT , -- JSON string
                course_id TEXT , -- JSON string
                subject_id TEXT , -- JSON string
                submissions TEXT , -- JSON string
                is_local BOOLEAN DEFAULT TRUE -- Indique si la donnée est locale ou synchronisée
            );`,
            [],
            () => console.log("Table assignments created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS assignment_rooms (
                assignment_id INTEGER,
                room_id INTEGER,
                PRIMARY KEY (assignment_id, room_id),
                FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
                FOREIGN KEY (room_id) REFERENCES classrooms(id) ON DELETE CASCADE
            );`,
            [],
            () => console.log("Table assignment_rooms created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS assignment_types (
                id INTEGER PRIMARY KEY,
                name TEXT ,
                code TEXT ,
                assign_type TEXT ,
                create_date TEXT ,
                write_date TEXT 
            );`,
            [],
            () => console.log("Table assignment_types created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL , -- Le code du cours doit être unique
                name TEXT NOT NULL,        -- Nom du cours
                subject_type TEXT,         -- Type de sujet (compulsory, optional, etc.)
                type TEXT,                 -- Type de cours (theory, practical, etc.)
                description TEXT           -- Description du cours (optionnel)
            );`,
            [],
            () => console.log("Table subjects created"),
            (error: any) => console.error("Error creating table: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS student_subject (
                student_id INTEGER,
                subject_id INTEGER,
                PRIMARY KEY (student_id, subject_id),
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
            );`,
            [],
            () => console.log("Table student_subject created"),
            (error: any) => console.error("Error creating table student_subject: ", error)
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                date TEXT NOT NULL,  -- Format YYYY-MM-DD HH:MM:SS
                isRead BOOLEAN DEFAULT FALSE,  -- Indique si la notification a été lue
                pressAction TEXT,  -- Stocke l'action associée à la notification
                created_at TEXT DEFAULT (DATETIME('now', 'localtime')) -- Timestamp de création
            );`,
            [],
            () => console.log("Table notifications created"),
            (error: any) => console.error("Error creating table notifications: ", error)
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS student_classroom (
                student_id INTEGER,
                classroom_id INTEGER,
                PRIMARY KEY (student_id, classroom_id),
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE CASCADE
            );`,
            [],
            () => console.log("Table student_classroom created"),
            (error: any) => console.error("Error creating table student_classroom: ", error)
        );

    });


};


export const clearTables = (db: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `DELETE FROM students;`,
                [],
                () => {
                    tx.executeSql(
                        `DELETE FROM students;`,
                        [],
                        () => resolve({ success: true, message: "Toutes les données des tables users et classrooms ont été supprimées." }),
                        (_: any, error: any) => reject({ success: false, error: "Erreur lors du nettoyage de classrooms : " + error.message })
                    );
                },
                (_: any, error: any) => reject({ success: false, error: "Erreur lors du nettoyage de users : " + error.message })
            );
        });
    });
};



export const dropTables = (db: any): Promise<{ success: boolean; message?: string; error?: string }> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `DROP TABLE IF EXISTS users;`,
                [],
                () => {
                    tx.executeSql(
                        `DROP TABLE IF EXISTS classrooms;`,
                        [],
                        () => {
                            tx.executeSql(
                                `DROP TABLE IF EXISTS sessions;`,
                                [],
                                () => resolve({ success: true, message: "Tables users classrooms et sessions supprimées." }),
                                (_: any, error: any) => reject({ success: false, error: "Erreur lors de la suppression de classrooms : " + error.message })
                            );
                        },
                        (_: any, error: any) => reject({ success: false, error: "Erreur lors de la suppression de classrooms : " + error.message })
                    );

                },
                (_: any, error: any) => reject({ success: false, error: "Erreur lors de la suppression de users : " + error.message })
            );
        });
    });
};




export const loginUserWithPartner = (email: string, password: string) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                `SELECT * FROM Users WHERE Users.email = ? AND Users.password = ?;`,
                [email, password],
                (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                        let user = results.rows.item(0); // Récupérer les informations de l'utilisateur et du partenaire
                        resolve({ success: true, data: user }); // Renvoie toutes les informations (utilisateur + partenaire)
                    } else {
                        resolve({
                            success: false, message: 'Email ou mot de passe incorrect'
                        });
                    }
                },
                (error: any) => {
                    resolve({ success: false, message: 'Erreur lors de la connexion: ' + error.message });

                }
            );
        });
    });
};



export const createOrUpdateUser = (
    id: number,
    name: string,
    email: string,
    password: string,
    phone: string,
    role: string,
    partner_id: number,
    avatar: string,
    birth_date: string,
    department: string,
    gender: string,
    max_sub_exams: string,
    registration_number: string,
    user_id: number
) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            tx.executeSql(
                'SELECT id FROM Users WHERE email = ?;',
                [email],
                (_: any, results: any) => {
                    if (results.rows.length > 0) {
                        tx.executeSql(
                            `UPDATE Users SET 
                                name = ?, 
                                password = ?, 
                                phone = ?, 
                                mobile = ?,
                                partner_id = ?, 
                                avatar = ?, 
                                birth_date = ?, 
                                department = ?, 
                                gender = ?, 
                                max_sub_exams = ?, 
                                registration_number = ?, 
                                user_id = ? 
                            WHERE email = ?;`,
                            [name, password, phone, role, partner_id, avatar, birth_date, department, gender, max_sub_exams, registration_number, user_id, email],
                            () => resolve({ success: true, message: 'Utilisateur mis à jour avec succès', data: { id, name, email, phone, role, partner_id, avatar, birth_date, department, gender, max_sub_exams, registration_number, user_id } }),
                            (_: any, error: any) => resolve({ success: false, message: 'Erreur lors de la mise à jour: ' + error.message })
                        );
                    } else {
                        tx.executeSql(
                            `INSERT INTO Users (id, name, email, password, phone, mobile, partner_id, avatar, birth_date, department, gender, max_sub_exams, registration_number, user_id)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                            [id, name, email, password, phone, role, partner_id, avatar, birth_date, department, gender, max_sub_exams, registration_number, user_id],
                            () => resolve({ success: true, message: 'Utilisateur créé avec succès', data: { id, name, email, phone, role, partner_id, avatar, birth_date, department, gender, max_sub_exams, registration_number, user_id } }),
                            (_: any, error: any) => {
                                console.log(_);

                                resolve({ success: false, message: 'Erreur lors de la création de l’utilisateur: ' + error.message })
                            }
                        );
                    }
                },
                (_: any, error: any) => resolve({ success: false, message: 'Erreur lors de la vérification de l’email: ' + error.message })
            );
        });
    });
};



export function clearCustomTables(tableNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let clearPromises = tableNames.map((table) => {
                return new Promise<void>((resolveClear, rejectClear) => {
                    tx.executeSql(
                        `DELETE FROM ${table};`, // Supprime toutes les lignes sans supprimer la table
                        [],
                        () => {
                            console.log(`Table ${table} cleared`);
                            resolveClear();
                        },
                        (_: any, error: any) => {
                            console.error(`Error clearing table ${table}:`, error);
                            rejectClear(error);
                        }
                    );
                });
            });

            Promise.all(clearPromises)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
}


export function dropCustomTables(tableNames: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            let dropPromises = tableNames.map((table) => {
                return new Promise<void>((resolveDrop, rejectDrop) => {
                    tx.executeSql(
                        `DROP TABLE IF EXISTS ${table};`,
                        [],
                        () => {
                            console.log(`Table ${table} dropped`);
                            resolveDrop();
                        },
                        (_: any, error: any) => {
                            console.error(`Error dropping table ${table}:`, error);
                            rejectDrop(error);
                        }
                    );
                });
            });

            Promise.all(dropPromises)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
}
