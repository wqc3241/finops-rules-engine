
import { useState } from "react";

export type VehicleCondition = {
  id: string;
  type: string;
  geoCode: string;
  titleStatus: string;
  advertisedCondition: string;
  minOdometer: string;
  maxOdometer: string;
  registrationStartDate: string;
  registrationEndDate: string;
  modelYear: string;
  priorSellToCustomer: string;
  applicableRVTable: string;
};

const initialVehicleConditions: VehicleCondition[] = [
  {
    id: "vc-new-ksa",
    type: "New",
    geoCode: "ME-KSA",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-new-uae",
    type: "New",
    geoCode: "ME-UAE",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-used",
    type: "Used",
    geoCode: "",
    titleStatus: "New",
    advertisedCondition: "New",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-demo",
    type: "Demo",
    geoCode: "",
    titleStatus: "",
    advertisedCondition: "",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  },
  {
    id: "vc-cpo",
    type: "CPO",
    geoCode: "",
    titleStatus: "",
    advertisedCondition: "",
    minOdometer: "",
    maxOdometer: "",
    registrationStartDate: "",
    registrationEndDate: "",
    modelYear: "",
    priorSellToCustomer: "",
    applicableRVTable: ""
  }
];

export function useVehicleConditions() {
  const [vehicleConditions] = useState(initialVehicleConditions);
  return vehicleConditions;
}
