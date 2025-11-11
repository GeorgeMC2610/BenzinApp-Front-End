export interface MalfunctionData {
    id: number;
    dateStarted: Date;
    description: string;
    title: string;
    severity: number;
    kilometersDiscovered: number;

    dateEnded: Date | null;
    cost: number | null;
    location: string | null;
}

export class Malfunction {
    id: number;
    dateStarted: Date;
    description: string;
    title: string;
    severity: number;
    kilometersDiscovered: number;

    dateEnded: Date | null;
    cost: number | null;
    location: string | null;

    constructor({
        id, dateStarted, description, title, severity,
        kilometersDiscovered, dateEnded, cost, location
    }: MalfunctionData) {
        this.id = id;
        this.dateStarted = dateStarted;
        this.description = description;
        this.severity = severity;
        this.title = title;
        this.kilometersDiscovered = kilometersDiscovered;
        this.dateEnded = dateEnded;
        this.cost = cost;
        this.location = location;
    }

    static fromJson(object: Record<string, any>): Malfunction {
        return new Malfunction({
            id: object[MalfunctionFields.id],
            dateStarted: object[MalfunctionFields.started],
            dateEnded: object[MalfunctionFields.ended],
            title: object[MalfunctionFields.title],
            description: object[MalfunctionFields.description],
            severity: object[MalfunctionFields.severity],
            cost: object[MalfunctionFields.costEur],
            kilometersDiscovered: object[MalfunctionFields.atKm],
            location: object[MalfunctionFields.location],
        });
    }

    toJson(): Record<string, any> {
        return {
            id: [MalfunctionFields.id],
            started: [MalfunctionFields.started],
            ended: [MalfunctionFields.ended],
            title: [MalfunctionFields.title],
            description: [MalfunctionFields.description],
            severity: [MalfunctionFields.severity],
            costEur: [MalfunctionFields.costEur],
            atKm: [MalfunctionFields.atKm],
            location: [MalfunctionFields.location],
        }
    }
}

export class MalfunctionFields {
    static readonly id = 'id';
    static readonly started = 'started';
    static readonly ended = 'ended';
    static readonly title = 'title';
    static readonly description = 'description';
    static readonly severity = 'severity';
    static readonly costEur = 'cost_eur';
    static readonly atKm = 'at_km';
    static readonly location = 'location';
}
