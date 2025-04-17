import { create } from 'zustand';

const useBillingSessionStore = create((set) => ({
  appointmentNumber: null,
  patientID: null,
  setBillingSession: (appointmentNumber, patientID) =>
    set({ appointmentNumber, patientID }),
  clearBillingSession: () =>
    set({ appointmentNumber: null, patientID: null }),
}));

export default useBillingSessionStore;
