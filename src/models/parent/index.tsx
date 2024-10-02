export interface Relation {
    name: string;
    id: number;
}
export interface Parent {
    name: string;
    email: string;
    phone: string;
    id: number;
    partner_id: number;
    user_id: number;
    relation: Relation;
}