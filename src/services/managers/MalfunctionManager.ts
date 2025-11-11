import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Malfunction } from "../../classes/Malfunction"

type MalfunctionState = {
    viewingMalfunction: Malfunction | null;
    errors: Record<string, string> | null;
    list: Malfunction[] | null;
}

type MalfunctionActions = {
    index: () => Promise<void>;
    create: (malfunction: Malfunction) => Promise<void>;
    read: (id: number) => Promise<void>;
    update: (fuelFillRecord: Malfunction) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export const useMalfunctionStore = create<MalfunctionState & MalfunctionActions>() (
    persist(
        (set, get) => ({
            viewingMalfunction: null,
            errors: null,
            list: null,
            index: async () => {

            },
            create: async (malfunction) => {

            },
            read: async (id) => {

            },
            update: async (malfunction) => {

            },
            delete: async (id) => {
                
            }
        }),
        {
            name: 'malfunction-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)