export interface FuelFillRecordData {
    id: number;
    cost: number;
    lt: number;
    km: number;
    filledAt: Date;

    station: string | null;
    fuelType: string | null;
    totalKm: number | null;
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
    totalKm: number | null;

    constructor({ id, cost, lt, km, filledAt, station, fuelType, totalKm, notes }: FuelFillRecordData) {
        this.id = id;
        this.cost = cost;
        this.lt = lt;
        this.km = km;
        this.filledAt = filledAt;
        this.station = station;
        this.fuelType = fuelType;
        this.totalKm = totalKm;
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
            totalKm: object[FuelFillRecordFields.totalKm],
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
            [FuelFillRecordFields.totalKm]: this.totalKm,
            [FuelFillRecordFields.notes]: this.notes,
        };
    }

    getEfficiency(): number {
        return this.km / this.lt;
    }

    getConsumption(): number {
        return 100 * this.lt / this.km;
    }

    getTravelCost(): number {
        return this.cost / this.km
    }
}

export class FuelFillRecordFields {
    static readonly id = 'id';
    static readonly cost = 'cost_eur';
    static readonly lt = 'lt';
    static readonly km = 'km';
    static readonly filledAt = 'filled_at';
    static readonly station = 'station';
    static readonly fuelType = 'fuel_type';
    static readonly notes = 'notes';
    static readonly totalKm = 'total_km';
}