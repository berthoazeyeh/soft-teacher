import { LOCAL_URL, postData, postDataDoc } from "apis";
import { showCustomMessage } from "utils";
import { syncAttendanceLines } from "./AttendanceLineServices";
import { db } from "apis/database";
import moment from "moment";


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