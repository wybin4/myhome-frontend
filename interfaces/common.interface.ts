export interface ITypeOfService {
    id: number;
    name: string;
    unitId: number;
}

export interface IUnit {
    id: number;
    name: string;
}

export interface IGetCommon {
    typesOfService: ITypeOfService[];
    units: IUnit[];
}