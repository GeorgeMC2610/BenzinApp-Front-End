export interface FuelFillRecordData {
    id: number;
    cost: number;
    lt: number;
    km: number;
    filledAt: Date;

    station: string | null;
    fuelType: string | null;
    notes: string | null;
}

export class FuelFillRecord {
    id: number;
    cost: number;
    lt: number;
    km: number;
    filledAt: Date;

    station: string | null;
    fuelType: string | null;
    notes: string | null;

    constructor({ id, cost, lt, km, filledAt, station, fuelType, notes }: FuelFillRecordData) {
        this.id = id;
        this.cost = cost;
        this.lt = lt;
        this.km = km;
        this.filledAt = filledAt;
        this.station = station;
        this.fuelType = fuelType;
        this.notes = notes;
    }

    static fromJson(object: Record<string, any>): FuelFillRecord {
        return new FuelFillRecord({
            id: object[FuelFillRecordFields.id],
            cost: object[FuelFillRecordFields.cost],
            lt: object[FuelFillRecordFields.lt],
            km: object[FuelFillRecordFields.km],
            filledAt: object[FuelFillRecordFields.filledAt],
            station: object[FuelFillRecordFields.station],
            fuelType: object[FuelFillRecordFields.fuelType],
            notes: object[FuelFillRecordFields.notes],
        });
    }

    toJson(): Record<string, any> {
        return {
            [FuelFillRecordFields.id]: this.id,
            [FuelFillRecordFields.cost]: this.cost,
            [FuelFillRecordFields.lt]: this.lt,
            [FuelFillRecordFields.km]: this.km,
            [FuelFillRecordFields.filledAt]: this.filledAt,
            [FuelFillRecordFields.station]: this.station,
            [FuelFillRecordFields.fuelType]: this.fuelType,
            [FuelFillRecordFields.notes]: this.notes,
        };
    }
}

export class FuelFillRecordFields {
    static readonly id = 'id';
    static readonly cost = 'cost';
    static readonly lt = 'lt';
    static readonly km = 'km';
    static readonly filledAt = 'filledAt';
    static readonly station = 'station';
    static readonly fuelType = 'fuelType';
    static readonly notes = 'notes';
}