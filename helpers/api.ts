import axios from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IData {
    [key: string]: {
        add: string;
        addMany: string;
        get: string;
    };
}

interface IDataGet {
    [key: string]: {
        get: string;
    };
}

interface IDataWithoutGet {
    [key: string]: {
        add: string;
        addMany: string;
    };
}

export const API: {
    chat: { addChat: string; sendMessage: string; readMessages: string; getReceivers: string; };
    serviceNotification: { read: string; readAll: string; };
    event: { get: string };
    subscriber: {
        appeal: { add: string };
        apartment: { get: string };
        singlePaymentDocument: { get: string };
        voting: { update: string };
    },
    managementCompany: {
        reference: IDataWithoutGet;
        correction: IData;
        singlePaymentDocument: { get: string; calculate: string };
        voting: { add: string };
        houseNotification: { add: string };
        appeal: { add: string; update: string; };
    };
    admin: {
        correction: { penaltyCalculationRule: { add: string; get: string } };
    };
    reference: IDataGet;
    common: { user: { [key: string]: string } };
    auth: { [key: string]: string };
} = {
    chat: {
        addChat: `chat/add-chat`,
        sendMessage: `chat/add-message`,
        readMessages: `chat/read-messages`,
        getReceivers: `chat/get-receivers`
    },
    serviceNotification: {
        read: `service-notification/update-service-notification`,
        readAll: `service-notification/update-all-service-notifications`
    },
    subscriber: {
        apartment: {
            get: `apartment/get-apartments-by-user`,
        },
        appeal: { add: `appeal/add-appeal` },
        voting: { update: `voting/update-voting` },
        singlePaymentDocument: {
            get: `single-payment-document/get-single-payment-documents-by-sid`,
        }
    },
    managementCompany: {
        reference: {
            house: {
                add: `house/add-house`,
                addMany: ``,
            },
            apartment: {
                add: `apartment/add-apartment`,
                addMany: ``,
            },
            subscriber: {
                add: `subscriber/add-subscriber`,
                addMany: ``,
            },
            meter: {
                add: `meter/add-meter`,
                addMany: ``,
            },
            tariffAndNorm: {
                add: `tariff-and-norm/add-tariff-and-norm`,
                addMany: ``,
            },
        },
        correction: {
            penaltyRule: {
                add: ``,
                addMany: ``,
                get: `penalty/get-penalty-rules-by-mcid`
            },
            cbr: {
                get: `cbr/get-key-rate`,
                add: ``,
                addMany: ``
            }
        },
        singlePaymentDocument: {
            get: `single-payment-document/get-single-payment-documents-by-mcid`,
            calculate: `single-payment-document/get-single-payment-document`,
        },
        voting: {
            add: `voting/add-voting`
        },
        houseNotification: {
            add: `house-notification/add-house-notification`
        },
        appeal: {
            add: `appeal/add-appeal`,
            update: `appeal/update-appeal`,
        }
    },
    admin: {
        correction: {
            penaltyCalculationRule: {
                add: ``,
                get: ``
            }
        }
    },
    reference: {
        house: {
            get: `house/get-houses-by-user`,
        },
        apartment: {
            get: `apartment/get-apartments-by-user`,
        },
        subscriber: {
            get: `subscriber/get-subscribers-by-user`,
        },
        meter: {
            get: `meter/get-meters-by-user`,
        },
        tariffAndNorm: {
            get: `tariff-and-norm/get-tariffs-and-norms-by-user`,
        },
        typeOfService: {
            get: `common/get-all-types-of-service`
        },
        common: {
            get: 'common/get-common'
        }
    },
    event: {
        get: `event/get-events`
    },
    common: {
        user: {
            get: `user/get-users-by-another-role`,
            getAll: `user/get-all-users`,
            add: 'auth/register',
            addMany: 'auth/register-many'
        }
    },
    auth: {
        login: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/login`,
        refresh: `auth/refresh`,
        logout: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/logout`
    }
};

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axios.get(API.auth.refresh, {
                    baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}/`,
                    withCredentials: true
                });
                return axios(originalRequest);
            } catch (e) {
                window.location.href = "login";
            }
        }

        return Promise.reject(error);
    }
);