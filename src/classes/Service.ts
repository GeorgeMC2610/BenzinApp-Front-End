export interface ServiceData {
    id: number;
    kilometersDone: number;
    description: string;
    dateHappened: Date;
    cost: number;

    nextServiceDate: Date | null;
    nextServiceKilometers: number | null;
    location: string | null;
}

export class Service {
    id: number;
    kilometersDone: number;
    description: string;
    dateHappened: Date;
    cost: number;

    nextServiceDate: Date | null;
    nextServiceKilometers: number | null;
    location: string | null;

    constructor({ id, kilometersDone, description, dateHappened, cost,
        nextServiceDate, nextServiceKilometers, location
    }: ServiceData) {
        this.id = id;
        this.kilometersDone = kilometersDone;
        this.description = description;
        this.dateHappened = dateHappened;
        this.cost = cost;
        this.nextServiceDate = nextServiceDate;
        this.nextServiceKilometers = nextServiceKilometers;
        this.location = location;
    }

    static fromJson(object: Record<string, any>): Service {
        return new Service({
            id: object[ServiceFields.id],
            kilometersDone: object[ServiceFields.kilometersDone],
            description: object[ServiceFields.description],
            dateHappened: object[ServiceFields.dateHappened],
            cost: object[ServiceFields.cost],
            nextServiceDate: object[ServiceFields.nextServiceDate],
            nextServiceKilometers: object[ServiceFields.nextServiceKilometers],
            location: object[ServiceFields.location],
        });
    }

    toJson(): Record<string, any> {
        return {
            [ServiceFields.id]: this.id,
            [ServiceFields.kilometersDone]: this.kilometersDone,
            [ServiceFields.description]: this.description,
            [ServiceFields.dateHappened]: this.dateHappened,
            [ServiceFields.cost]: this.cost,
            [ServiceFields.nextServiceDate]: this.nextServiceDate,
            [ServiceFields.nextServiceKilometers]: this.nextServiceKilometers,
            [ServiceFields.location]: this.location,
        }
    }
}

export class ServiceFields {
    static readonly id = 'id';
    static readonly kilometersDone = 'at_km';
    static readonly description = 'description';
    static readonly dateHappened = 'date_happened';
    static readonly cost = 'cost_eur';

    static readonly nextServiceDate = 'next_at_date';
    static readonly nextServiceKilometers = 'next_km';
    static readonly location = 'location';
}
