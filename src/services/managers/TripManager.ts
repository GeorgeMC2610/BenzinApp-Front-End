import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Trip } from "../../classes/Trip"
import RequestHelper from '../RequestHelper';

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

            },
            read: async (id) => {

            },
            update: async (trip) => {

            },
            delete: async (id) => {
                
            }
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