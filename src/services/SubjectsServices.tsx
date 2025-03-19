import { db } from "apis/database";
import { Subjects } from "./CommonServices";


/**
 * Insère ou met à jour une liste de cours dans la table Cours.
 * @param {Cours[]} listeCours - Une liste de cours à insérer ou mettre à jour.
 * @returns {Promise<void>} - Une promesse qui résout une fois l'opération terminée.
 */


export const insertOrUpdateSubjectsList = async (listeCours: Subjects[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            listeCours.forEach((cours, index) => {
                const { id, code, name, subject_type, type } = cours;
                // Vérifier si le sujet existe déjà
                tx.executeSql(
                    `SELECT id FROM subjects WHERE id = ?;`,
                    [id],
                    (tx: any, result: any) => {
                        if (result.rows.length > 0) {
                            // Mise à jour si l'entrée existe déjà
                            tx.executeSql(
                                `UPDATE subjects 
                                 SET code = ?, name = ?, subject_type = ?, type = ?
                                 WHERE id = ?;`,
                                [code, name, subject_type, type, id],
                                () => {
                                    console.log(`Sujet mis à jour : ${name}`);
                                    if (index === listeCours.length - 1) {
                                        resolve();
                                    }
                                },
                                (error: any) => {
                                    console.error(`Erreur lors de la mise à jour du sujet "${name}" :`, error);
                                    reject(error);
                                }
                            );
                        } else {
                            // Insérer un nouvel élément
                            tx.executeSql(
                                `INSERT INTO subjects (id, code, name, subject_type, type) 
                                 VALUES (?, ?, ?, ?, ?);`,
                                [id, code, name, subject_type, type],
                                () => {
                                    console.log(`Nouveau sujet inséré : ${name}`);
                                    if (index === listeCours.length - 1) {
                                        resolve();
                                    }
                                },
                                (error: any) => {
                                    console.error(`Erreur lors de l'insertion du sujet "${name}" :`, error);
                                    reject(error);
                                }
                            );
                        }
                    },
                    (error: any) => {
                        console.error(`Erreur lors de la vérification du sujet "${name}" :`, error);
                        reject(error);
                    }
                );
            });
        });
    });
};



export const insertOrUpdateSubjectsListOld = async (listeCours: Subjects[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx: any) => {
            // Préparer la requête SQL pour insérer ou mettre à jour un cours
            const sql = `
                INSERT INTO subjects (id, code, name, subject_type, type)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    code = excluded.code,
                    name = excluded.name,
                    subject_type = excluded.subject_type,
                    type = excluded.type;
            `;

            // Insérer ou mettre à jour chaque cours un par un
            listeCours.forEach((cours, index) => {
                const { id, code, name, subject_type, type } = cours;
                tx.executeSql(
                    sql,
                    [id, code, name, subject_type, type],
                    (_: any, result: any) => {
                        // console.log(`Cours "${name}" traité avec succès.`);
                        // Si c'est le dernier cours, résoudre la promesse
                        if (index === listeCours.length - 1) {
                            resolve();
                        }
                    },
                    (error: any) => {
                        console.error(`Erreur lors du traitement du cours "${name}" :`, error);
                        reject(error);
                        return false;
                    }
                );
            });
        });
    });
};

