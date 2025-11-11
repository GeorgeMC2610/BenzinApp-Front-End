import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Trip } from "../../classes/Trip"

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

export const useTripStore = create<TripState & TripActions>() (
    persist(
        (set, get) => ({
            viewingTrip: null,
            errors: null,
            list: null,
            index: async () => {

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
        }
    )
)