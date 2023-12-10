import axios from 'axios';

interface IDataGet {
    [key: string]: {
        get: string;
    };
}

export const API: {
    chat: { addChat: string; sendMessage: string; readMessages: string; getReceivers: string; };
    serviceNotification: { read: string; readAll: string; };
    event: { get: string };
    subscriber: {
        appeal: { add: string };
        apartment: { get: string };
        voting: { update: string };
        meterReading: { add: string };
        debt: { get: string };
    },
    managementCompany: {
        reference: { [key: string]: { addMany: string; }; };
        correction: { [key: string]: { addMany: string; get: string; getMany?: string; } };
        singlePaymentDocument: { calculate: string };
        voting: { add: string };
        houseNotification: { add: string };
        appeal: { update: string; };
    };
    admin: {
        correction: { penaltyCalculationRule: { add: string; get: string } };
    };
    singlePaymentDocument: { get: string };
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
        apartment: { get: `apartment/get-apartments-by-user`, },
        meterReading: { add: `meter/add-meter-reading` },
        appeal: { add: `appeal/add-appeal` },
        voting: { update: `voting/update-voting` },
        debt: { get: `debt/get-debts` },
    },
    managementCompany: {
        reference: {
            house: {
                addMany: `house/add-houses`,
            },
            apartment: {
                addMany: `apartment/add-apartments`,
            },
            subscriber: {
                addMany: `subscriber/add-subscribers`,
            },
            meter: {
                addMany: `meter/add-meters`,
            },
            tariffAndNorm: {
                addMany: `tariff-and-norm/add-tariffs-and-norms`,
            },
        },
        correction: {
            penaltyRule: {
                addMany: `penalty/add-penalty-calculation-rules`,
                get: `penalty/get-penalty-calculation-rules-by-mcid`,
                getMany: `penalty/get-penalty-rules`
            },
            cbr: {
                get: `cbr/get-key-rate`,
                addMany: ``
            }
        },
        singlePaymentDocument: {
            calculate: `single-payment-document/get-single-payment-document`,
        },
        voting: {
            add: `voting/add-voting`
        },
        houseNotification: {
            add: `house-notification/add-house-notification`
        },
        appeal: {
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
    singlePaymentDocument: {
        get: `single-payment-document/get-single-payment-documents-by-user`,
    },
    auth: {
        login: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/login`,
        refresh: `auth/refresh`,
        logout: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/logout`,
        setPassword: `${process.env.NEXT_PUBLIC_DOMAIN}/auth/set-password`,
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