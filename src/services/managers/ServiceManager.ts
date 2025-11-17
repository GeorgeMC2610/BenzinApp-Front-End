import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Service } from "../../classes/Service"
import RequestHelper from '../RequestHelper';
import {Trip} from "../../classes/Trip";

type ServiceState = {
    viewingService: Service | null;
    errors: Record<string, string> | null;
    list: Service[] | null;
}

type ServiceActions = {
    index: () => Promise<void>;
    create: (service: Service) => Promise<void>;
    read: (id: number) => Promise<void>;
    update: (service: Service) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

const serviceUrl = RequestHelper._baseUrl + '/service';
const serviceUrlId = (id: number) => RequestHelper._baseUrl + '/service/' + id;

export const useServiceStore = create<ServiceState & ServiceActions>() (
    persist(
        (set, get) => ({
            viewingService: null,
            errors: null,
            list: null,
            index: async () => {
                set({ list: null });
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(serviceUrl);
                    const services = response.data.map((jsonRecord: Record<string, any>[]) => Service.fromJson(jsonRecord));
                    set({ list: services });
                }
                catch (error) {
                    console.log(error);
                }
            },
            create: async (service) => {

            },
            read: async (id) => {
                try {
                    const response = await RequestHelper.getInstance().sendGetRequest(serviceUrlId(id));
                    const service = Service.fromJson(response.data);
                    set({ viewingService: service });
                }
                catch (error) {
                    console.log(error);
                }
            },
            update: async (service) => {

            },
            delete: async (id) => {

            },
            destroyValues: () => {
                set({ viewingService: null });
                set({ list: null });
            },
        }),
        {
            name: 'service-store',
            storage: createJSONStorage(() => sessionStorage),
            onRehydrateStorage: () => (state) => {
                if (state?.list) {
                    state.list = state.list.map((d: any) => new Service(d))
                }
            },
        }
    )
)
