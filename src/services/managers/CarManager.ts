import {create} from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {Car, CarFields} from "../../classes/Car";
import RequestHelper from "../RequestHelper";
import TokenHelper from "../TokenHelper";

type CarState = {
    car: Car | null;
}

type CarActions = {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (manufacturer: string, model: string, year: number) => Promise<boolean>;
    update: (manufacturer: string, model: string, year: number) => Promise<void>;
}

export const useCarStore = create<CarState & CarActions>()(
    persist(
        (set, get) => ({
            car: null,
            login: async (email, password) => {

                try {
                    const response = await RequestHelper.getInstance().sendPostRequest(
                        RequestHelper._baseUrl + '/auth/login', {
                            username: email,
                            password: password
                        }, false
                    );

                    TokenHelper.getInstance().removeToken();
                    TokenHelper.getInstance().setToken(response.data.auth_token)
                    return true;
                }
                catch (error) {
                    return false;
                }
            },

            logout: () => {

            },

            register: async (manufacturer, model, year) => {
                return true;
            },

            update: async (manufacturer, model, year) => {

            }
        }),
        {
            name: 'car-store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
