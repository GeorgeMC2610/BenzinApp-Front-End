import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Malfunction } from "../../classes/Malfunction"
import RequestHelper from '../RequestHelper';
import {Service} from "../../classes/Service";

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
                set({ list: null })
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
                try {
                    const response = await RequestHelper.getInstance().sendPostRequest(
                        malfunctionUrl, malfunction.toJson()
                    );
                    const newMalfunction = Malfunction.fromJson(response.data.malfunction);
                    if (!!get().list) {
                        set({ list: [...get().list!, newMalfunction] });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            },
            read: async (id) => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(malfunctionUrlId(id));
                    const malfunction = Malfunction.fromJson(response.data);
                    set({ viewingMalfunction: malfunction });
                }
                catch (error) {
                    console.log(error);
                }
            },
            update: async (malfunction) => {
                try {
                    const response = await RequestHelper.getInstance().sendPatchRequest(
                        malfunctionUrlId(malfunction.id), malfunction.toJson()
                    );
                    const updatedMalfunction = Malfunction.fromJson(response.data.malfunction);
                    if (!!get().list) {
                        const index = get().list!.findIndex((r) => r.id === updatedMalfunction.id);
                        if (~index) {
                            const newList = [...get().list!];
                            newList[index] = updatedMalfunction;
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
                        malfunctionUrlId(id)
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
                set({ viewingMalfunction: null });
                set({ list: null });
            },
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
