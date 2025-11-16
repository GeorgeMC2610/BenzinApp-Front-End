import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { FuelFillRecord } from "../../classes/FuelFillRecord"
import RequestHelper from '../RequestHelper';
import SpecificFuelFillRecord from '../../components/SpecificFuelFillRecord';

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

const fuelFillUrl = RequestHelper._baseUrl + '/fuel_fill_record';
const fuelFillUrlId = (id: number) => RequestHelper._baseUrl + '/fuel_fill_record/' + id; 

export const useFuelFillRecordStore = create<FuelFillRecordState & FuelFillRecordActions>() (
    persist(
        (set, get) => ({
            viewingFuelFillRecord: null,
            errors: null,
            list: null,
            index: async () => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(fuelFillUrl);
                    const fuelFills = response.data.map((jsonRecord: Record<string, any>[]) => FuelFillRecord.fromJson(jsonRecord));
                    set({ list: fuelFills });
                }
                catch (error) {
                    console.log(error);
                }
            },
            create: async (fuelFillRecord) => {

            },
            read: async (id) => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(fuelFillUrlId(id));
                    const fuelFill = FuelFillRecord.fromJson(response.data);
                    set({ viewingFuelFillRecord: fuelFill });
                }
                catch (error) {
                    console.log(error);
                }
            },
            update: async (fuelFillRecord) => {

            },
            delete: async (id) => {
                
            }
        }),
        {
            name: 'fuel-fill-record-store',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                if (state?.list) {
                    state.list = state.list.map((d: any) => new FuelFillRecord(d))
                }
            },
        }
    )
)