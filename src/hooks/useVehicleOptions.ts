
import { useState } from "react";

export type VehicleOption = {
  id: string;
  code: string;
  drivetrain: string;
  color: string;
  design: string;
  roof: string;
  wheels: string;
  adas: string;
  soundSystem: string;
  priority: string;
};

const initialVehicleOptions: VehicleOption[] = [
  {
    id: "OP1",
    code: "OP1",
    drivetrain: "AWD",
    color: "",
    design: "",
    roof: "",
    wheels: "",
    adas: "",
    soundSystem: "",
    priority: "1"
  },
  {
    id: "OP2",
    code: "OP2",
    drivetrain: "RWD",
    color: "",
    design: "",
    roof: "",
    wheels: "",
    adas: "",
    soundSystem: "",
    priority: "2"
  },
  {
    id: "OP3",
    code: "OP3",
    drivetrain: "AWD",
    color: "",
    design: "",
    roof: "",
    wheels: "22\" wheel",
    adas: "",
    soundSystem: "",
    priority: ""
  },
  {
    id: "KSAOP1",
    code: "KSAOP1",
    drivetrain: "AWD",
    color: "Blue",
    design: "Stealth",
    roof: "Glass",
    wheels: "21\" wheel",
    adas: "Pro",
    soundSystem: "Pro",
    priority: "1"
  }
];

export function useVehicleOptions() {
  const [options] = useState(initialVehicleOptions);
  return options;
}
