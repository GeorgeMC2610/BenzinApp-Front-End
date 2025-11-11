import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { FuelFillRecord } from "../../classes/FuelFillRecord"
import RequestHelper from '../RequestHelper';

type FuelFillRecordState = {
    viewingFuelFillRecord: FuelFillRecord | null;
    errors: Record<string, string> | null;
    list: FuelFillRecord[] | null;
}

type FuelFillRecordActions = {
    index: () => Promise<void>;
    create: (fuelFillRecord: FuelFillRecord) => Promise<void>;
    read: (id: number) => Promise<void>;
    update: (fuelFillRecord: FuelFillRecord) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export const useFuelFillRecordStore = create<FuelFillRecordState & FuelFillRecordActions>() (
    persist(
        (set, get) => ({
            viewingFuelFillRecord: null,
            errors: null,
            list: null,
            index: async () => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(
                        RequestHelper._baseUrl + '/fuel_fill_record'
                    );
                    const fuelFills = response.data.map((jsonRecord: Record<string, any>[]) => FuelFillRecord.fromJson(jsonRecord));
                    set({ list: fuelFills });
                }
                catch (error) {

                }
            },
            create: async (fuelFillRecord) => {

            },
            read: async (id) => {

            },
            update: async (fuelFillRecord) => {

            },
            delete: async (id) => {
                
            }
        }),
        {
            name: 'fuel-fill-record-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)