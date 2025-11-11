import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import { Service } from "../../classes/Service"

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

export const useServiceStore = create<ServiceState & ServiceActions>() (
    persist(
        (set, get) => ({
            viewingService: null,
            errors: null,
            list: null,
            index: async () => {

            },
            create: async (service) => {

            },
            read: async (id) => {

            },
            update: async (service) => {

            },
            delete: async (id) => {
                
            }
        }),
        {
            name: 'service-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)