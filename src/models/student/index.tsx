interface User {
    id: number;
    name: string;
}

interface EmergencyContact {
    id: number;
    name: string;
}

interface Nationality {
    id: number;
    name: string;
}

interface MessageFollower {
    id: number;
    name: string;
}

interface Message {
    id: number;
}

interface Partner {
    id: number;
    name: string;
}

export interface Eleve {
    active: boolean;
    birth_date: string; // Format YYYY-MM-DD
    blood_group: string;
    category_id: number[];
    create_date: string; // Format ISO 8601
    create_uid: User[];
    emergency_contact: EmergencyContact[];
    first_name: string;
    gender: string; // 'm' or 'f'
    gr_no: boolean | string;
    id: number;
    id_number: boolean | string;
    last_name: string;
    library_card_id: number[];
    message_follower_ids: MessageFollower[];
    message_ids: Message[];
    middle_name: string;
    rfid: string;
    nationality: Nationality[];
    parent_ids: number[];
    partner_id: Partner[];
    user_id: User[];
    visa_info: boolean | string;
    write_date: string; // Format ISO 8601
    write_uid: User[];
}