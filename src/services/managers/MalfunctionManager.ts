import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Malfunction } from "../../classes/Malfunction"
import RequestHelper from '../RequestHelper';

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

const malfunctionUrl = RequestHelper._baseUrl + '/malfunction';
const malfunctionUrlId = (id: number) => RequestHelper._baseUrl + '/malfunction/' + id; 

export const useMalfunctionStore = create<MalfunctionState & MalfunctionActions>() (
    persist(
        (set, get) => ({
            viewingMalfunction: null,
            errors: null,
            list: null,
            index: async () => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(malfunctionUrl);
                    const malfunctions = response.data.map((jsonRecord: Record<string, any>[]) => Malfunction.fromJson(jsonRecord));
                    set({ list: malfunctions });
                }
                catch (error) {
                    console.log(error);
                }
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
            onRehydrateStorage: () => (state) => {
                if (state?.list) {
                    state.list = state.list.map((d: any) => new Malfunction(d))
                }
            },
        }
    )
)