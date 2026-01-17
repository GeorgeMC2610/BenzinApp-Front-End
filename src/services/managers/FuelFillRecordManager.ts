import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { FuelFillRecord } from "../../classes/FuelFillRecord"
import RequestHelper from '../RequestHelper';

// Track an in-flight `index` request so multiple callers (e.g. React StrictMode)
// don't cause duplicate network requests.
let pendingIndexRequest: Promise<void> | null = null;

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
                // If there's already an in-flight index request, return that promise
                // instead of issuing another network call.
                if (pendingIndexRequest) return pendingIndexRequest;

                pendingIndexRequest = (async () => {
                    set({ list: null });
                    try {
                        const response = await RequestHelper.getInstance().sendGetRequest(fuelFillUrl);
                        const fuelFills = response.data.map((jsonRecord: Record<string, any>[]) => FuelFillRecord.fromJson(jsonRecord));
                        set({ list: fuelFills });
                    }
                    catch (error) {
                        console.log(error);
                    }
                    finally {
                        // clear the pending marker when finished so subsequent calls work
                        pendingIndexRequest = null;
                    }
                })();

                return pendingIndexRequest;
            },

            create: async (fuelFillRecord) => {
                try {
                    const response = await RequestHelper.getInstance().sendPostRequest(
                        fuelFillUrl, fuelFillRecord.toJson()
                    );
                    const fuelFill = FuelFillRecord.fromJson(response.data.fuel_fill);
                    // TODO: Change this to actually fitting the correct place in the list based on date
                    if (!!get().list) {
                        set({ list: [...get().list!, fuelFill] });
                    }
                }
                catch (error) {
                    console.log(error);
                }
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
                try {
                    const response = await RequestHelper.getInstance().sendPatchRequest(
                        fuelFillUrlId(fuelFillRecord.id), fuelFillRecord.toJson()
                    );
                    const fuelFill = FuelFillRecord.fromJson(response.data.fuel_fill);
                    if (!!get().list) {
                        const index = get().list!.findIndex((r) => r.id === fuelFill.id);
                        if (~index) {
                            const newList = [...get().list!];
                            newList[index] = fuelFill;
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
                    await RequestHelper.getInstance().sendDeleteRequest(
                        fuelFillUrlId(id)
                    );
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
                set({ viewingFuelFillRecord: null });
                set({ list: null });
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
