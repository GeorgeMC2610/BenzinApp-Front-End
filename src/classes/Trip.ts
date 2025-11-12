export interface TripData {
    id: number;
    title: string;
    timesRepeating: number;
    totalKm: number;
    created: Date;
    updated: Date;
    originLatitude: number;
    originLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    originAddress: string;
    destinationAddress: string;
    polyline: string;
}

export class Trip {
    id: number;
    title: string;
    timesRepeating: number;
    totalKm: number;
    created: Date;
    updated: Date;
    originLatitude: number;
    originLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    originAddress: string;
    destinationAddress: string;
    polyline: string;

    constructor({
        id, title, timesRepeating, totalKm, created, updated, originLatitude,
        originLongitude, destinationLatitude, destinationLongitude, originAddress,
        destinationAddress, polyline
    }: TripData) {
        this.id = id;
        this.title = title;
        this.timesRepeating = timesRepeating;
        this.totalKm = totalKm;
        this.created = created;
        this.updated = updated;
        this.originLatitude = originLatitude;
        this.originLongitude = originLongitude;
        this.destinationLatitude = destinationLatitude;
        this.destinationLongitude = destinationLongitude;
        this.originAddress = originAddress;
        this.destinationAddress = destinationAddress;
        this.polyline = polyline;
    }

    static fromJson(object: Record<string, any>) {
        return new Trip({
            id: object[TripFields.id],
            title: object[TripFields.title],
            timesRepeating: object[TripFields.timesRepeating],
            totalKm: object[TripFields.totalKm],
            created: object[TripFields.created],
            updated: object[TripFields.updated],
            originLatitude: object[TripFields.originLatitude],
            originLongitude: object[TripFields.originLongitude],
            destinationLatitude: object[TripFields.destinationLatitude],
            destinationLongitude: object[TripFields.destinationLongitude],
            originAddress: object[TripFields.originAddress],
            destinationAddress: object[TripFields.destinationAddress],
            polyline: object[TripFields.polyline],
        });
    }

    toJson(): Record<string, any> {
        return {
            [TripFields.id]: this.id,
            [TripFields.title]: this.title,
            [TripFields.timesRepeating]: this.timesRepeating,
            [TripFields.totalKm]: this. totalKm,
            [TripFields.created]: this. created,
            [TripFields.updated]: this. updated,
            [TripFields.originLatitude]: this.originLatitude,
            [TripFields.originLongitude]: this. originLongitude,
            [TripFields.destinationLatitude]: this.destinationLatitude,
            [TripFields.destinationLongitude]: this.destinationLongitude,
            [TripFields.originAddress]: this.originAddress,
            [TripFields.destinationAddress]: this.destinationAddress,
            [TripFields.polyline]: this.polyline,
        }
    }
}

class TripFields {
    static readonly id = 'id';
    static readonly title = 'title';
    static readonly timesRepeating = 'times_repeating';
    static readonly totalKm = 'total_km';
    static readonly created = 'created_at';
    static readonly updated = 'updated_at';
    static readonly originLatitude = 'origin_latitude';
    static readonly originLongitude = 'origin_longitude';
    static readonly destinationLatitude = 'destination_latitude';
    static readonly destinationLongitude = 'destination_longitude';
    static readonly originAddress = 'origin_address';
    static readonly destinationAddress = 'destination_address';
    static readonly polyline = 'polyline';
}
