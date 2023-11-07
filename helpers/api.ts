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
        meter: { index: string; get: string };
        apartment: { get: string };
        singlePaymentDocument: { get: string };
        voting: { update: string };
    },
    managementCompany: {
        reference: IDataWithoutGet;
        common: IData;
        correction: IData;
        singlePaymentDocument: { get: string; calculate: string };
        voting: { add: string };
        houseNotification: { add: string };
        appeal: { add: string };
    };
    reference: IDataGet
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
        apartment: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/apartment/get-apartments-by-user`,
        },
        appeal: { add: `${process.env.NEXT_PUBLIC_DOMAIN}/appeal/add-appeal` },
        voting: { update: `${process.env.NEXT_PUBLIC_DOMAIN}/voting/update-voting` },
        meter: {
            index: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-all-info-by-sid`,
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-by-user`
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
            },
            apartment: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/apartment/add-apartment`,
                addMany: ``,
            },
            subscriber: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/subscriber/add-subscriber`,
                addMany: ``,
            },
            meter: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/add-meter`,
                addMany: ``,
            },
            tariffAndNorm: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/add-tariff-and-norm`,
                addMany: ``,
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
            add: `${process.env.NEXT_PUBLIC_DOMAIN}/voting/add-voting`
        },
        houseNotification: {
            add: `${process.env.NEXT_PUBLIC_DOMAIN}/house-notification/add-house-notification`
        },
        appeal: {
            add: `${process.env.NEXT_PUBLIC_DOMAIN}/appeal/add-appeal`,
        }
    },
    reference: {
        house: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/house/get-houses-by-user`,
        },
        apartment: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/apartment/get-apartments-by-user`,
        },
        subscriber: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/subscriber/get-subscribers-by-user`,
        },
        meter: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-by-user`,
        },
        tariffAndNorm: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/get-tariffs-and-norms-by-mcid`,
        },
        typeOfService: {
            get: `${process.env.NEXT_PUBLIC_DOMAIN}/common/get-all-types-of-service`
        }
    },
    event: {
        get: `${process.env.NEXT_PUBLIC_DOMAIN}/event/get-events`
    },

};