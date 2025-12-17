import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Trip } from "../../classes/Trip"
import RequestHelper from '../RequestHelper';
import {FuelFillRecord} from "../../classes/FuelFillRecord";

type TripState = {
    viewingTrip: Trip | null;
    errors: Record<string, string> | null;
    list: Trip[] | null;
}

type TripActions = {
    index: () => Promise<void>;
    create: (trip: Trip) => Promise<void>;
    read: (id: number) => Promise<void>;
    update: (trip: Trip) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

const repeatedTripUrl = RequestHelper._baseUrl + '/repeated_trip';
const repeatedTripUrlId = (id: number) => RequestHelper._baseUrl + '/repeated_trip/' + id;

export const useTripStore = create<TripState & TripActions>() (
    persist(
        (set, get) => ({
            viewingTrip: null,
            errors: null,
            list: null,
            index: async () => {
                set({ list: null });
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(repeatedTripUrl);
                    const trips = response.data.map((jsonRecord: Record<string, any>[]) => Trip.fromJson(jsonRecord));
                    set({ list: trips });
                }
                catch (error) {
                    console.log(error);
                }
            },
            create: async (trip) => {
                try {
                    const response = await RequestHelper.getInstance().sendPostRequest(repeatedTripUrl, trip.toJson());
                    const newTrip = Trip.fromJson(response.data.repeated_trip);
                    if (!!get().list) {
                        set({ list: [...get().list!, newTrip] });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            read: async (id) => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(repeatedTripUrlId(id));
                    const trip = Trip.fromJson(response.data);
                    set({ viewingTrip: trip });
                }
                catch (error) {
                    console.log(error);
                }
            },
            update: async (trip) => {
                try {
                    const response = await RequestHelper.getInstance().sendPatchRequest(repeatedTripUrlId(trip.id), trip.toJson());
                    const updatedTrip = Trip.fromJson(response.data.repeated_trip);
                    if (!!get().list) {
                        const index = get().list!.findIndex((r) => r.id === updatedTrip.id);
                        if (~index) {
                            const newList = [...get().list!];
                            newList[index] = updatedTrip;
                            set({ list: newList });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            delete: async (id) => {
                try {
                    await RequestHelper.getInstance().sendDeleteRequest(repeatedTripUrlId(id));
                    if (!!get().list) {
                        const newList = get().list!.filter((r) => r.id !== id);
                        set({ list: newList });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            destroyValues: () => {
                set({ viewingTrip: null });
                set({ list: null });
            },
        }),
        {
            name: 'trip-store',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                if (state?.list) {
                    state.list = state.list.map((d: any) => new Trip(d))
                }
            },
        }
    )
)
