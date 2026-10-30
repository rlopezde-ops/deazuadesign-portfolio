"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  appointmentsForCustomer,
  deviceDraftFromAppointmentDevice,
  deviceDraftFromHistory,
  emptyDeviceDraft,
  findPartBySkuOrBarcode,
  getBusiness,
  getIndividual,
} from "@/lib/check-in-data";
import { useAppNavigation } from "@/lib/app-navigation";
import type {
  BusinessAccount,
  BusinessContact,
  CartItem,
  CheckInAppointment,
  DeviceDraft,
  DropOffInfo,
  HistoryDevice,
  IndividualCustomer,
  SavedDeviceRepair,
} from "@/lib/check-in-types";

type CustomerMode = "search" | "creating" | "selected";

type NewCustomerDraft = {
  firstName: string;
  lastName: string;
  phone: string;
};

type CheckInState = {
  activeStep: 1 | 2 | 3 | 4;
  stepsComplete: [boolean, boolean, boolean, boolean];

  searchQuery: string;
  customerMode: CustomerMode;
  individual: IndividualCustomer | null;
  business: BusinessAccount | null;
  contact: BusinessContact | null;
  appointment: CheckInAppointment | null;
  relatedAppointments: CheckInAppointment[];
  newCustomerDraft: NewCustomerDraft;
  showProfileModal: boolean;

  device: DeviceDraft;
  mediaCount: number;
  photoAnalysisStatus: "idle" | "loading" | "ready";
  selectedIssueIds: string[];
  devicePowersOn: "yes" | "no" | "unknown" | null;
  liquidDamage: "yes" | "no" | "unknown" | null;
  otherIssueText: string;
  selectedSymptomCodes: string[];
  photoDamageIds: string[];

  dropOff: DropOffInfo;

  savedDeviceRepairs: SavedDeviceRepair[];
  cart: CartItem[];
  discountCode: string;

  workOrderId: string;
  checkInComplete: boolean;
};

type CheckInContextValue = CheckInState & {
  setSearchQuery: (q: string) => void;
  openProfileModal: (customer: IndividualCustomer | BusinessAccount) => void;
  closeProfileModal: () => void;
  confirmFromModal: (opts: {
    appointment?: CheckInAppointment;
    historyDevice?: HistoryDevice;
    newDevice?: boolean;
  }) => void;
  startCreatingCustomer: () => void;
  cancelCreatingCustomer: () => void;
  updateNewCustomerDraft: (patch: Partial<NewCustomerDraft>) => void;
  confirmNewCustomer: () => void;
  updateDevice: (patch: Partial<DeviceDraft>) => void;
  setMediaCount: (n: number) => void;
  startPhotoAnalysis: () => void;
  confirmDevice: () => void;
  toggleIssue: (id: string) => void;
  setDevicePowersOn: (v: "yes" | "no" | "unknown") => void;
  setLiquidDamage: (v: "yes" | "no" | "unknown") => void;
  setOtherIssueText: (text: string) => void;
  toggleSymptomCode: (code: string) => void;
  setPhotoDamageIds: (ids: string[]) => void;
  confirmIssues: () => void;
  updateDropOff: (patch: Partial<DropOffInfo>) => void;
  confirmCheckIn: () => void;
  saveAndAddAnotherDevice: () => void;
  editStep: (step: 1 | 2 | 3 | 4) => void;
  addToCartBySku: (skuOrBarcode: string) => boolean;
  addPartToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  setCartQty: (id: string, qty: number) => void;
  setDiscountCode: (code: string) => void;
  reset: () => void;
  cartSubtotal: number;
  cartTax: number;
  cartTotal: number;
  customerLabel: string;
};

const emptyDropOff = (individual?: { primaryPhone?: string; email?: string } | null): DropOffInfo => ({
  pickupDate: "",
  pickupTime: "",
  contactPhone: individual?.primaryPhone ?? "",
  contactEmail: individual?.email ?? "",
  homeAddress: "",
  sendTextUpdate: false,
  sendEmailReceipt: false,
  accessories: [],
  accessoryNote: "",
});

const initial = (): CheckInState => ({
  activeStep: 1,
  stepsComplete: [false, false, false, false],
  searchQuery: "",
  customerMode: "search",
  individual: null,
  business: null,
  contact: null,
  appointment: null,
  relatedAppointments: [],
  newCustomerDraft: { firstName: "", lastName: "", phone: "" },
  showProfileModal: false,
  device: emptyDeviceDraft(),
  mediaCount: 0,
  photoAnalysisStatus: "idle" as const,
  selectedIssueIds: [],
  devicePowersOn: null,
  liquidDamage: null,
  otherIssueText: "",
  selectedSymptomCodes: [],
  photoDamageIds: [],
  dropOff: emptyDropOff(),
  savedDeviceRepairs: [],
  cart: [],
  discountCode: "",
  workOrderId: "",
  checkInComplete: false,
});

const CheckInContext = createContext<CheckInContextValue | null>(null);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CheckInState>(initial);

  const reset = useCallback(() => setState(initial), []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setState((s) => ({ ...s, searchQuery }));
  }, []);

  const openProfileModal = useCallback(
    (customer: IndividualCustomer | BusinessAccount) => {
      const related = appointmentsForCustomer(customer.id);
      if (customer.kind === "individual") {
        setState((s) => ({
          ...s,
          individual: customer as IndividualCustomer,
          business: null,
          contact: null,
          relatedAppointments: related,
          showProfileModal: true,
        }));
      } else {
        const biz = customer as BusinessAccount;
        setState((s) => ({
          ...s,
          business: biz,
          individual: null,
          contact: biz.contacts[0] ?? null,
          relatedAppointments: related,
          showProfileModal: true,
        }));
      }
    },
    []
  );

  const closeProfileModal = useCallback(() => {
    setState((s) => ({ ...s, showProfileModal: false }));
  }, []);

  const confirmFromModal = useCallback(
    (opts: {
      appointment?: CheckInAppointment;
      historyDevice?: HistoryDevice;
      newDevice?: boolean;
    }) => {
      setState((s) => {
        let device = emptyDeviceDraft();
        let appointment = s.appointment;
        let selectedIssueIds: string[] = [];

        if (opts.appointment) {
          appointment = opts.appointment;
          const apptDevice = opts.appointment.devices[0];
          if (apptDevice) {
            device = deviceDraftFromAppointmentDevice(apptDevice);
            selectedIssueIds = [...apptDevice.issueIds];
          }
        } else if (opts.historyDevice) {
          device = deviceDraftFromHistory(opts.historyDevice);
        }

        return {
          ...s,
          showProfileModal: false,
          customerMode: "selected",
          appointment,
          device,
          selectedIssueIds,
          activeStep: 2,
          stepsComplete: [true, false, false, false],
        };
      });
    },
    []
  );

  const startCreatingCustomer = useCallback(() => {
    setState((s) => ({
      ...s,
      customerMode: "creating",
      newCustomerDraft: { firstName: "", lastName: "", phone: "" },
    }));
  }, []);

  const cancelCreatingCustomer = useCallback(() => {
    setState((s) => ({ ...s, customerMode: "search" }));
  }, []);

  const updateNewCustomerDraft = useCallback(
    (patch: Partial<NewCustomerDraft>) => {
      setState((s) => ({
        ...s,
        newCustomerDraft: { ...s.newCustomerDraft, ...patch },
      }));
    },
    []
  );

  const confirmNewCustomer = useCallback(() => {
    setState((s) => {
      const { firstName, lastName, phone } = s.newCustomerDraft;
      const individual: IndividualCustomer = {
        id: `ind-new-${Math.random().toString(36).slice(2, 7)}`,
        kind: "individual",
        name: `${firstName} ${lastName}`.trim(),
        primaryPhone: phone,
        email: "",
        preferredContact: "text",
        accountCreatedOn: new Date().toISOString().slice(0, 10),
        lifetimeValue: 0,
        homePlusEnrolled: false,
        status: "active",
        accountId: `UBI${Math.floor(100000000 + Math.random() * 899999999)}`,
      };
      return {
        ...s,
        individual,
        business: null,
        contact: null,
        customerMode: "selected",
        activeStep: 2,
        stepsComplete: [true, false, false, false],
        device: emptyDeviceDraft(),
      };
    });
  }, []);

  const updateDevice = useCallback((patch: Partial<DeviceDraft>) => {
    setState((s) => ({ ...s, device: { ...s.device, ...patch } }));
  }, []);

  const setMediaCount = useCallback((mediaCount: number) => {
    setState((s) => ({ ...s, mediaCount }));
  }, []);

  const startPhotoAnalysis = useCallback(() => {
    setState((s) => {
      if (s.mediaCount === 0 || s.photoAnalysisStatus !== "idle") return s;
      return { ...s, photoAnalysisStatus: "loading" };
    });
    setTimeout(() => {
      setState((s) => {
        if (s.photoAnalysisStatus !== "loading") return s;
        // Analysis done — advance to step 3 now that it's ready
        return {
          ...s,
          photoAnalysisStatus: "ready",
          activeStep: s.stepsComplete[1] ? 3 : s.activeStep,
        };
      });
    }, 1800);
  }, []);

  const confirmDevice = useCallback(() => {
    setState((s) => {
      const done = [...s.stepsComplete] as [boolean, boolean, boolean, boolean];
      done[1] = true;
      // If photos are uploading for analysis, hold on step 2 until analysis finishes.
      // startPhotoAnalysis will advance to step 3 when done.
      const nextStep = s.photoAnalysisStatus === "loading" ? s.activeStep : 3;
      return { ...s, stepsComplete: done, activeStep: nextStep };
    });
  }, []);

  const toggleIssue = useCallback((id: string) => {
    setState((s) => {
      const has = s.selectedIssueIds.includes(id);
      return {
        ...s,
        selectedIssueIds: has
          ? s.selectedIssueIds.filter((i) => i !== id)
          : [...s.selectedIssueIds, id],
      };
    });
  }, []);

  const setDevicePowersOn = useCallback((v: "yes" | "no" | "unknown") => {
    setState((s) => ({ ...s, devicePowersOn: v }));
  }, []);

  const setLiquidDamage = useCallback((v: "yes" | "no" | "unknown") => {
    setState((s) => ({ ...s, liquidDamage: v }));
  }, []);

  const setOtherIssueText = useCallback((text: string) => {
    setState((s) => ({ ...s, otherIssueText: text }));
  }, []);

  const setPhotoDamageIds = useCallback((ids: string[]) => {
    setState((s) => ({ ...s, photoDamageIds: ids }));
  }, []);

  const toggleSymptomCode = useCallback((code: string) => {
    setState((s) => {
      const has = s.selectedSymptomCodes.includes(code);
      return {
        ...s,
        selectedSymptomCodes: has
          ? s.selectedSymptomCodes.filter((c) => c !== code)
          : [...s.selectedSymptomCodes, code],
      };
    });
  }, []);

  const confirmIssues = useCallback(() => {
    setState((s) => {
      const done = [...s.stepsComplete] as [boolean, boolean, boolean, boolean];
      done[2] = true;
      return { ...s, stepsComplete: done, activeStep: 4 };
    });
  }, []);

  const updateDropOff = useCallback((patch: Partial<DropOffInfo>) => {
    setState((s) => ({ ...s, dropOff: { ...s.dropOff, ...patch } }));
  }, []);

  const confirmCheckIn = useCallback(() => {
    setState((s) => {
      const done = [...s.stepsComplete] as [boolean, boolean, boolean, boolean];
      done[3] = true;
      return {
        ...s,
        stepsComplete: done,
        workOrderId: `WO-${10040 + Math.floor(Math.random() * 9960)}`,
        checkInComplete: true,
      };
    });
  }, []);

  const saveAndAddAnotherDevice = useCallback(() => {
    setState((s) => {
      const subtotal = s.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
      const saved: SavedDeviceRepair = {
        id: `rep-${Math.random().toString(36).slice(2, 7)}`,
        makeModel: [s.device.make, s.device.model].filter(Boolean).join(" ") || "Unknown device",
        imei: s.device.imei || "",
        cart: s.cart,
        subtotal,
        workOrderId: `WO-${10040 + Math.floor(Math.random() * 9960)}`,
      };
      return {
        ...s,
        activeStep: 2,
        stepsComplete: [true, false, false, false],
        device: emptyDeviceDraft(),
        mediaCount: 0,
        photoAnalysisStatus: "idle" as const,
        selectedIssueIds: [],
        devicePowersOn: null,
        liquidDamage: null,
        otherIssueText: "",
        selectedSymptomCodes: [],
        photoDamageIds: [],
        dropOff: emptyDropOff(s.individual),
        savedDeviceRepairs: [...s.savedDeviceRepairs, saved],
        cart: [],
        workOrderId: "",
      };
    });
  }, []);

  const editStep = useCallback((step: 1 | 2 | 3 | 4) => {
    setState((s) => ({ ...s, activeStep: step }));
  }, []);

  const addPartToCart = useCallback(
    (item: Omit<CartItem, "id" | "quantity">) => {
      setState((s) => {
        const existing = s.cart.find((c) => c.sku === item.sku);
        if (existing) {
          return {
            ...s,
            cart: s.cart.map((c) =>
              c.sku === item.sku ? { ...c, quantity: c.quantity + 1 } : c
            ),
          };
        }
        return {
          ...s,
          cart: [
            ...s.cart,
            {
              ...item,
              id: `ci-${Math.random().toString(36).slice(2, 7)}`,
              quantity: 1,
            },
          ],
        };
      });
    },
    []
  );

  const addToCartBySku = useCallback(
    (skuOrBarcode: string): boolean => {
      const part = findPartBySkuOrBarcode(skuOrBarcode);
      if (!part) return false;
      addPartToCart({ sku: part.sku, name: part.name, price: part.price });
      return true;
    },
    [addPartToCart]
  );

  const removeFromCart = useCallback((id: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => c.id !== id) }));
  }, []);

  const setCartQty = useCallback((id: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart:
        qty <= 0
          ? s.cart.filter((c) => c.id !== id)
          : s.cart.map((c) => (c.id === id ? { ...c, quantity: qty } : c)),
    }));
  }, []);

  const setDiscountCode = useCallback((discountCode: string) => {
    setState((s) => ({ ...s, discountCode }));
  }, []);

  const { pendingCheckInCustomer, clearPendingCheckInCustomer } =
    useAppNavigation();

  useEffect(() => {
    if (!pendingCheckInCustomer) return;
    if (pendingCheckInCustomer.type === "individual") {
      const c = getIndividual(pendingCheckInCustomer.id);
      if (c) openProfileModal(c);
    } else {
      const b = getBusiness(pendingCheckInCustomer.id);
      if (b) openProfileModal(b);
    }
    clearPendingCheckInCustomer();
  }, [pendingCheckInCustomer, clearPendingCheckInCustomer, openProfileModal]);

  const cartSubtotal = useMemo(
    () => state.cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
    [state.cart]
  );
  const cartTax = useMemo(
    () => Math.round(cartSubtotal * 0.0825 * 100) / 100,
    [cartSubtotal]
  );
  const cartTotal = useMemo(
    () => cartSubtotal + cartTax,
    [cartSubtotal, cartTax]
  );

  const customerLabel = useMemo(() => {
    if (state.individual) return state.individual.name || "New customer";
    if (state.business) return state.business.name;
    return "";
  }, [state.individual, state.business]);

  const value = useMemo<CheckInContextValue>(
    () => ({
      ...state,
      reset,
      setSearchQuery,
      openProfileModal,
      closeProfileModal,
      confirmFromModal,
      startCreatingCustomer,
      cancelCreatingCustomer,
      updateNewCustomerDraft,
      confirmNewCustomer,
      updateDevice,
      setMediaCount,
      startPhotoAnalysis,
      confirmDevice,
      toggleIssue,
      setDevicePowersOn,
      setLiquidDamage,
      setOtherIssueText,
      toggleSymptomCode,
      setPhotoDamageIds,
      confirmIssues,
      updateDropOff,
      confirmCheckIn,
      saveAndAddAnotherDevice,
      editStep,
      addToCartBySku,
      addPartToCart,
      removeFromCart,
      setCartQty,
      setDiscountCode,
      cartSubtotal,
      cartTax,
      cartTotal,
      customerLabel,
    }),
    [
      state,
      reset,
      setSearchQuery,
      openProfileModal,
      closeProfileModal,
      confirmFromModal,
      startCreatingCustomer,
      cancelCreatingCustomer,
      updateNewCustomerDraft,
      confirmNewCustomer,
      updateDevice,
      setMediaCount,
      startPhotoAnalysis,
      confirmDevice,
      toggleIssue,
      setDevicePowersOn,
      setLiquidDamage,
      setOtherIssueText,
      toggleSymptomCode,
      setPhotoDamageIds,
      confirmIssues,
      updateDropOff,
      confirmCheckIn,
      saveAndAddAnotherDevice,
      editStep,
      addToCartBySku,
      addPartToCart,
      removeFromCart,
      setCartQty,
      setDiscountCode,
      cartSubtotal,
      cartTax,
      cartTotal,
      customerLabel,
    ]
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) throw new Error("useCheckIn must be used within CheckInProvider");
  return ctx;
}
