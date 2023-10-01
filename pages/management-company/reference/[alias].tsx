import { API } from "@/helpers/api";
import { IUserPage, ownerPageComponent } from "@/interfaces/account/user.interface";
import { IGeneralMeterPage, IIndividualMeterPage, generalMeterPageComponent, individualMeterPageComponent } from "@/interfaces/reference/meter.interface";
import { IReferencePageComponent } from "@/interfaces/reference/page.interface";
import { IApartmentPage, apartmentPageComponent } from "@/interfaces/reference/subscriber/apartment.interface";
import { IHousePage, housePageComponent } from "@/interfaces/reference/subscriber/house.interface";
import { ISubscriberPage, subscriberPageComponent } from "@/interfaces/reference/subscriber/subscriber.interface";
import { ICommonHouseNeedTariffPage, IMunicipalTariffPage, INormPage, ISeasonalityFactorPage, ISocialNormPage, municipalTariffPageComponent, normPageComponent, seasonalityFactorPageComponent, socialNormPageComponent, сommonHouseNeedTariffPageComponent } from "@/interfaces/reference/tariff-and-norm.interface";
import { withLayout } from "@/layout/Layout";
import { ReferencePageComponent } from "@/page-components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

function ReferencePage(): JSX.Element {
    const [engName, setEngName] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const engName = router.asPath.split("/")[3];
        setEngName(engName);
    }, [router.asPath]);

    const createComponent = <T extends FieldValues>(
        engName: string,
        item: IReferencePageComponent<T>,
    ) => {
        return (
            <ReferencePageComponent<T>
                key={item.engName}
                item={item}
                uriToAdd={API.managementCompany.reference[engName].add}
                uriToAddMany={API.managementCompany.reference[engName].addMany}
            />
        );
    };

    const createBaseComponent = <T extends FieldValues>(
        baseEngName: string,
        item: IReferencePageComponent<T>,
    ) => {
        return (
            <ReferencePageComponent<T>
                key={item.engName}
                item={item}
                uriToAdd={API.managementCompany.reference[baseEngName].add}
                uriToAddMany={API.managementCompany.reference[baseEngName].addMany}
            />
        );
    };

    return (
        <>
            {engName === "house" && createComponent<IHousePage>(engName, housePageComponent)}
            {engName === "apartment" && createComponent<IApartmentPage>(engName, apartmentPageComponent)}
            {engName === "subscriber" && createComponent<ISubscriberPage>(engName, subscriberPageComponent)}
            {engName === "individual-meter" && createBaseComponent<IIndividualMeterPage>("meter", individualMeterPageComponent)}
            {engName === "general-meter" && createBaseComponent<IGeneralMeterPage>("meter", generalMeterPageComponent)}
            {engName === "municipal-tariff" && createBaseComponent<IMunicipalTariffPage>("tariffAndNorm", municipalTariffPageComponent)}
            {engName === "norm" && createBaseComponent<INormPage>("tariffAndNorm", normPageComponent)}
            {engName === "social-norm" && createBaseComponent<ISocialNormPage>("tariffAndNorm", socialNormPageComponent)}
            {engName === "seasonality-factor" && createBaseComponent<ISeasonalityFactorPage>("tariffAndNorm", seasonalityFactorPageComponent)}
            {engName === "common-house-need" && createBaseComponent<ICommonHouseNeedTariffPage>("tariffAndNorm", сommonHouseNeedTariffPageComponent)}
            {engName === "owner" &&
                <ReferencePageComponent<IUserPage>
                    key={ownerPageComponent.engName}
                    item={ownerPageComponent}
                    uriToAdd={API.common.register.add}
                    uriToAddMany={API.common.register.addMany}
                />
            }
        </>
    );
}

export default withLayout(ReferencePage);