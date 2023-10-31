/* eslint-disable @typescript-eslint/no-explicit-any */
interface IData {
    [key: string]: {
        add: string;
        addMany: string;
        get: string;
    };
}

export const API: {
    chat: { addChat: string; sendMessage: string; readMessages: string; getReceivers: string; };
    serviceNotification: { read: string; readAll: string; };
    subscriber: any,
    managementCompany: {
        reference: IData;
        common: IData;
        correction: IData;
        singlePaymentDocument: { get: string; calculate: string };
        voting: { get: string; add: string };
        houseNotification: { get: string; add: string };
        appeal: { get: string };
    };
} = {
    chat: {
        addChat: `${process.env.NEXT_PUBLIC_DOMAIN}/chat/add-chat`,
        sendMessage: `${process.env.NEXT_PUBLIC_DOMAIN}/chat/add-message`,
        readMessages: `${process.env.NEXT_PUBLIC_DOMAIN}/chat/read-messages`,
        getReceivers: `${process.env.NEXT_PUBLIC_DOMAIN}/chat/get-receivers`
    },
    serviceNotification: {
        read: `${process.env.NEXT_PUBLIC_DOMAIN}/service-notification/update-service-notification`,
        readAll: `${process.env.NEXT_PUBLIC_DOMAIN}/service-notification/update-all-service-notifications`
    },
    subscriber: {
        meter: {
            index: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-all-info-by-sid`
        },
        singlePaymentDocument: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/single-payment-document/get-single-payment-documents-by-sid`,
        }
    },
    managementCompany: {
        reference: {
            house: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/house/add-house`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/house/get-houses-by-mcid`,
            },
            apartment: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/apartment/add-apartment`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/apartment/get-apartments-by-mcid`,
            },
            subscriber: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/subscriber/add-subscriber`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/subscriber/get-subscribers-by-mcid`,
            },
            meter: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/add-meter`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-by-mcid`,
            },
            tariffAndNorm: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/add-tariff-and-norm`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/get-tariffs-and-norms-by-mcid`,
            },
        },
        common: {
            owner: {
                add: ``,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/user/get-owners-by-mcid`
            }
        },
        correction: {
            penaltyRule: {
                add: ``,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/penalty/get-penalty-rules-by-mcid`
            },
            cbr: {
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/cbr/get-key-rate`,
                add: ``,
                addMany: ``
            }
        },
        singlePaymentDocument: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/single-payment-document/get-single-payment-documents-by-mcid`,
            calculate: `${process.env.NEXT_PUBLIC_DOMAIN}/single-payment-document/get-single-payment-document`,
        },
        voting: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/voting/get-votings-by-mcid`,
            add: `${process.env.NEXT_PUBLIC_DOMAIN}/voting/add-voting`
        },
        houseNotification: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/house-notification/get-house-notifications-by-mcid`,
            add: `${process.env.NEXT_PUBLIC_DOMAIN}/house-notification/add-house-notification`
        },
        appeal: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/appeal/get-appeals-by-mcid`,
        }
    },

};