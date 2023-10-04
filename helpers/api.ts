/* eslint-disable @typescript-eslint/no-explicit-any */
interface APIMCData {
    [key: string]: {
        add: string;
        addMany: string;
        get: string;
    };
}

export const API: {
    subscriber: any,
    managementCompany: {
        reference: APIMCData;
    };
    common: {
        register: {
            add: string,
            addMany: string,
        }
    };
    correction: {
        penaltyRule: {
            add: string,
        }
    }
} = {
    subscriber: {
        meter: {
            index: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters-all-info-by-sid`
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
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/meter/get-meters`,
            },
            tariffAndNorm: {
                add: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/add-tariff-and-norm`,
                addMany: ``,
                get: `${process.env.NEXT_PUBLIC_DOMAIN}/tariff-and-norm/get-tariff-and-norms`,
            },
        }
    },
    common: {
        register: {
            add: ``,
            addMany: ``,
        }
    },
    correction: {
        penaltyRule: {
            add: ``,
        }
    }
};