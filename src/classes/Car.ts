import { useFuelFillRecordStore } from "../services/managers/FuelFillRecordManager";
import { useMalfunctionStore } from "../services/managers/MalfunctionManager";
import { useServiceStore } from "../services/managers/ServiceManager";

export interface CarData {
    id: number;
    username: string;
    manufacturer: string;
    model: string;
    year: number;
}

export class Car {
    id: number;
    username: string;
    manufacturer: string;
    model: string;
    year: number;

    constructor({ id, username, manufacturer, model, year }: CarData) {
        this.id = id;
        this.username = username;
        this.manufacturer = manufacturer;
        this.model = model;
        this.year = year;
    }

    static fromJson(object: Record<string, any>): Car {
        return new Car({
            id: object[CarFields.id],
            username: object[CarFields.username],
            manufacturer: object[CarFields.manufacturer],
            model: object[CarFields.model],
            year: object[CarFields.year],
        });
    }

    toJson(): Record<string, any> {
        return {
            [CarFields.manufacturer]: this.manufacturer,
            [CarFields.model]: this.model,
            [CarFields.year]: this.year,
        };
    }

    // ----- Static Utility Methods -----

    static getTotalConsumption(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        if (fuelFills.length <= 1) return 0;

        const totalKilometers = fuelFills.reduce((sum, f) => sum + f.km, 0);
        const totalLiters = fuelFills.reduce((sum, f) => sum + f.lt, 0);

        return totalKilometers === 0 ? 0 : (100 * totalLiters) / totalKilometers;
    }

    static getTotalEfficiency(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        if (fuelFills.length <= 1) return 0;

        const totalKilometers = fuelFills.reduce((sum, f) => sum + f.km, 0);
        const totalLiters = fuelFills.reduce((sum, f) => sum + f.lt, 0);

        return totalLiters === 0 ? 0 : totalKilometers / totalLiters;
    }

    static getTotalTravelCost(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        if (fuelFills.length <= 1) return 0;

        const totalCost = fuelFills.reduce((sum, f) => sum + f.cost, 0);
        const totalKilometers = fuelFills.reduce((sum, f) => sum + f.km, 0);

        return totalKilometers === 0 ? 0 : totalCost / totalKilometers;
    }

    static getTotalLitersFilled(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        return fuelFills.reduce((sum, f) => sum + f.lt, 0);
    }

    static getTotalKilometersTraveled(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        return fuelFills.reduce((sum, f) => sum + f.km, 0);
    }

    static getTotalFuelFillCosts(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;
        return fuelFills.reduce((sum, f) => sum + f.cost, 0);
    }

    static getTotalMalfunctionCosts(): number {
        const malfunctions = useMalfunctionStore.getState().list;
        if (malfunctions === null) return NaN;
        return malfunctions.reduce(
            (sum, m) => sum + (m.cost ?? 0),
            0
        );
    }

    static getTotalServiceCosts(): number {
        const services = useServiceStore.getState().list;
        if (services === null) return NaN;
        return services.reduce((sum, s) => sum + (s.cost ?? 0), 0);
    }

    static getTotalCost(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        const services = useServiceStore.getState().list;
        const malfunctions = useMalfunctionStore.getState().list;

        const fuelCost = fuelFills?.reduce((sum, f) => sum + f.cost, 0) ?? 0;
        const serviceCost = services?.reduce((sum, s) => sum + (s.cost ?? 0), 0) ?? 0;
        const malfunctionCost = malfunctions?.reduce((sum, m) => sum + (m.cost ?? 0), 0) ?? 0;

        return fuelCost + serviceCost + malfunctionCost;
    }

    static getBestEfficiency(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;

        const efficiencies = fuelFills
            .map(f => f.getEfficiency());
        return efficiencies.length ? Math.max(...efficiencies) : 0;
    }

    static getWorstEfficiency(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;

        const efficiencies = fuelFills
            .map(f => f.getEfficiency());
        return efficiencies.length ? Math.min(...efficiencies) : 0;
    }

    static getBestTravelCost(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;

        const travelCosts = fuelFills
            .map(f => f.getTravelCost());
        return travelCosts.length ? Math.min(...travelCosts) : 0;
    }

    static getWorstTravelCost(): number {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return NaN;

        const travelCosts = fuelFills
            .map(f => f.getTravelCost());
        return travelCosts.length ? Math.max(...travelCosts) : 0;
    }

    static getMostRecentTotalKilometers(): number | null {
        const fuelFills = useFuelFillRecordStore.getState().list;
        if (fuelFills === null) return null;
        if (fuelFills.length === 0) return null;
        return fuelFills[0].totalKm;
    }
}

export class CarFields {
    static readonly id = 'id';
    static readonly username = 'username';
    static readonly manufacturer = 'manufacturer';
    static readonly model = 'model';
    static readonly year = 'year';
}
