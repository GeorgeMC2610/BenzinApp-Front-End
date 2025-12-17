import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Service } from "../../classes/Service"
import RequestHelper from '../RequestHelper';

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
                try {
                    const response = await RequestHelper.getInstance().sendPostRequest(
                        serviceUrl, service.toJson()
                    );
                    const newService = Service.fromJson(response.data.service);
                    if (!!get().list) {
                        set({ list: [...get().list!, newService] });
                    }
                }
                catch (error) {
                    console.log(error);
                }
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
                try {
                    const response = await RequestHelper.getInstance().sendPatchRequest(
                        serviceUrlId(service.id), service.toJson()
                    );
                    const updatedService = Service.fromJson(response.data.service);
                    if (!!get().list) {
                        const index = get().list!.findIndex((r) => r.id === updatedService.id);
                        if (~index) {
                            const newList = [...get().list!];
                            newList[index] = updatedService;
                            set({ list: newList });
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
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
