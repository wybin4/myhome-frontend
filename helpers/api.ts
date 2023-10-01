/* eslint-disable @typescript-eslint/no-explicit-any */
interface APIMCData {
    [key: string]: {
        add: string;
        addMany: string;
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
        }
    },
    common: {
        register: {
            add: ``,
            addMany: ``,
        }
    }
};