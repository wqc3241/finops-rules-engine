
import { useState } from "react";

export type VehicleStyle = {
  id: string;
  styleId: string;
  algCode: string;
  geoCode: string;
  modelYear: string;
  make: string;
  model: string;
  trim: string;
  optionCode: string;
  priority: string;
};

const initialVehicleStyles: VehicleStyle[] = [
  {
    id: "L25A1",
    styleId: "L25A1",
    algCode: "ZL_MV001",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Grand Touring",
    optionCode: "OP1",
    priority: "1"
  },
  {
    id: "L25A2",
    styleId: "L25A2",
    algCode: "ZL_MV002",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "OP2",
    priority: "1"
  },
  {
    id: "L25A3",
    styleId: "L25A3",
    algCode: "ZL_MV003",
    geoCode: "",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "",
    priority: "2"
  },
  {
    id: "KSA25A1",
    styleId: "KSA25A1",
    algCode: "",
    geoCode: "ME-KSA",
    modelYear: "2025",
    make: "Lucid",
    model: "Air",
    trim: "Pure",
    optionCode: "KSAOP1",
    priority: "1"
  }
];

export function useVehicleStyles() {
  const [styles] = useState(initialVehicleStyles);
  return styles;
}
