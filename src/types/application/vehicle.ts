
// Vehicle-related types
export interface VehicleData {
  vin: string;
  trim: string;
  year: string;
  model: string;
  msrp: string;
  gccCashPrice: string;
  applicableDiscounts: string;
  totalDiscountAmount: string;
}

export interface AppDTReferences {
  dtPortalState: string;
  dtId: string;
  applicationDate: string;
}
