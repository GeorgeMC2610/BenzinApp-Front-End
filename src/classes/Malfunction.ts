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
            [MalfunctionFields.id]: this.id,
            [MalfunctionFields.started]: this.dateStarted,
            [MalfunctionFields.ended]: this.dateEnded,
            [MalfunctionFields.title]: this.title,
            [MalfunctionFields.description]: this.description,
            [MalfunctionFields.severity]: this.severity,
            [MalfunctionFields.costEur]: this.cost,
            [MalfunctionFields.atKm]: this.kilometersDiscovered,
            [MalfunctionFields.location]: this.location,
        }
    }

    fixed(): boolean {
        return this.dateEnded !== null;
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
