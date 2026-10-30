export type CustomerKind = "individual" | "business";

export type DeviceType =
  | "mobile"
  | "tablet"
  | "computer"
  | "game-console"
  | "wearable"
  | "hearable"
  | "other";

export type AppointmentKind = "timed" | "date-range";

export type PreferredContactMethod = "call" | "text" | "email";

/** Home-tech protection plans shown on the customer profile. */
export type ProtectionProductId =
  | "vhdp"
  | "att-hometech"
  | "asurion-tech-care";

export type ProtectionProductOffer = {
  id: ProtectionProductId;
  name: string;
  eligible: boolean;
  /** Customer already has this product. At most one offer may be enrolled. */
  enrolled?: boolean;
  /** ISO date when enrollment started (required when enrolled). */
  enrolledSince?: string;
};

export type IndividualCustomer = {
  id: string;
  kind: "individual";
  name: string;
  primaryPhone: string;
  altPhone?: string;
  email: string;
  smsOptIn?: boolean;
  preferredContact: PreferredContactMethod;
  accountCreatedOn: string;
  lifetimeValue: number;
  homePlusEnrolled: boolean;
  status: "active" | "inactive";
  accountId: string;
  address?: string;
  clientSinceYear?: number;
  specialInstructions?: string;
  techCareOfferCount?: number;
  techCareDeclined?: boolean;
  /** Eligibility / enrollment for VHDP, AT&T HomeTech, or Asurion Tech Care. */
  protectionOffers?: ProtectionProductOffer[];
};

export type RepairHistoryItem = {
  id: string;
  customerId: string;
  date: string;
  workOrderId: string;
  deviceLabel: string;
  issue: string;
  status: "completed" | "in-progress" | "cancelled";
  amount: number;
};

export type SalesHistoryItem = {
  id: string;
  customerId: string;
  date: string;
  description: string;
  amount: number;
  channel: "in-store" | "online";
};

export type BusinessContact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  smsOptIn?: boolean;
};

export type BusinessAccount = {
  id: string;
  kind: "business";
  name: string;
  address: string;
  phone: string;
  email: string;
  contacts: BusinessContact[];
  status: "active" | "inactive";
  accountId: string;
  billingTerms: string;
  taxExempt: boolean;
  clientSinceYear: number;
  lifetimeValue: number;
  specialInstructions?: string;
  automaticDiscount?: {
    label: string;
    enabled: boolean;
  };
};

export type ProfileWorkOrderStatus =
  | "needs-update"
  | "not-started"
  | "started"
  | "waiting"
  | "ready-for-pickup"
  | "ready-for-work"
  | "completed";

// ── Work Orders page ──────────────────────────────────────────────────────────

export type WOStatus =
  | "need-to-order"
  | "ready-for-work"
  | "diagnostics"
  | "work-in-progress"
  | "repair-summary"
  | "quality-check"
  | "awaiting-item"
  | "awaiting-callback"
  | "ready-for-pickup";

export type WorkOrder = {
  id: string;
  createdAt: string;
  nextUpdate: string | null;
  estimatedPickup?: string | null;
  customer: string;
  customerId?: string;
  device: string;
  issue: string;
  deviceType: DeviceType;
  status: WOStatus;
  program: string;
  location: string;
  total?: number;
};

export type ProfileWorkOrder = {
  id: string;
  customerId: string;
  createdAt: string;
  contactName: string;
  deviceLabel: string;
  deviceType: DeviceType;
  program: string;
  status: ProfileWorkOrderStatus;
};

export type ProfileInvoice = {
  id: string;
  customerId: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "open" | "overdue";
};

export type ProfileNote = {
  id: string;
  customerId: string;
  /** ISO datetime string for display */
  createdAt: string;
  title: string;
  category: string;
  body: string;
  author?: string;
};

export type HistoryDevice = {
  id: string;
  customerId: string;
  deviceType: DeviceType;
  make: string;
  model: string;
  imei?: string;
  serial?: string;
  lastRepair?: string;
  liquidDamage?: boolean;
};

export type AppointmentDevice = {
  deviceType: DeviceType;
  make: string;
  model: string;
  imei?: string;
  serial?: string;
  issueIds: string[];
};

export type CheckInAppointment = {
  id: string;
  kind: AppointmentKind;
  label: string;
  /** Timed: display time; date-range: range label */
  whenLabel: string;
  customerId: string;
  customerKind: CustomerKind;
  contactId?: string;
  devices: AppointmentDevice[];
};

export type IssueCategory = "physical" | "malfunction" | "software";

export type DeviceIssue = {
  id: string;
  category: IssueCategory;
  label: string;
};

export type PartSku = {
  sku: string;
  name: string;
  deviceTypes: DeviceType[];
  /** Lowercase make names this part is compatible with (e.g. "apple", "samsung"). Omit for universal parts. */
  makes?: string[];
  price: number;
  /** True = OEM / manufacturer part, false = 3rd-party aftermarket */
  isOem?: boolean;
};

export type WarrantyResult = {
  status: "manufacturer" | "extended" | "none";
  typeLabel?: string;
  expiresOn?: string;
  /** Free to customer when manufacturer coverage applies */
  freeToCustomer?: boolean;
  claim?: {
    id: string;
    label: string;
    status: "open";
  } | null;
  /** Extended coverage but no open claim */
  missingClaim?: boolean;
};

export type AccessoryId =
  | "charger"
  | "sim"
  | "case"
  | "stylus"
  | "other";

export type DeviceDraft = {
  id: string;
  sourceHistoryId?: string;
  deviceType: DeviceType;
  make: string;
  model: string;
  imei: string;
  serial: string;
  locked: boolean;
  passcode: string;
  accessories: AccessoryId[];
  accessoryNote: string;
  issueIds: string[];
  parts: { sku: string; name: string; qty: number }[];
  warranty: WarrantyResult | null;
  /** Pre-filled from history device if liquid damage was previously flagged */
  prefillLiquidDamage?: boolean;
  /** Device steps completed through parts */
  complete: boolean;
};

export type CheckInPhase = "search" | "profile" | "customer" | "devices" | "finish" | "receipt";

export type CartItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

export type DropOffInfo = {
  pickupDate: string;
  pickupTime: string;
  contactPhone: string;
  contactEmail: string;
  homeAddress: string;
  sendTextUpdate: boolean;
  sendEmailReceipt: boolean;
  accessories: string[];
  accessoryNote: string;
};

export type SavedDeviceRepair = {
  id: string;
  makeModel: string;
  imei: string;
  cart: CartItem[];
  subtotal: number;
  workOrderId: string;
};

export type OmniResult =
  | { type: "appointment"; appointment: CheckInAppointment }
  | { type: "individual"; customer: IndividualCustomer }
  | { type: "business"; business: BusinessAccount };
