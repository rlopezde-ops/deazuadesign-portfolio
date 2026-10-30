import type {
  BusinessAccount,
  CheckInAppointment,
  DeviceIssue,
  DeviceType,
  HistoryDevice,
  IndividualCustomer,
  OmniResult,
  PartSku,
  ProfileInvoice,
  ProfileNote,
  ProfileWorkOrder,
  ProfileWorkOrderStatus,
  RepairHistoryItem,
  SalesHistoryItem,
  WarrantyResult,
  WorkOrder,
  WOStatus,
} from "./check-in-types";

export const DEVICE_TYPE_OPTIONS: { value: DeviceType; label: string }[] = [
  { value: "mobile", label: "Mobile phone" },
  { value: "tablet", label: "Tablet" },
  { value: "computer", label: "Computer" },
  { value: "game-console", label: "Game console" },
  { value: "wearable", label: "Wearable" },
  { value: "hearable", label: "Hearable" },
  { value: "other", label: "Other" },
];

export const ACCESSORY_OPTIONS = [
  { id: "charger" as const, label: "Charger / cord" },
  { id: "sim" as const, label: "SIM card" },
  { id: "case" as const, label: "Case" },
  { id: "stylus" as const, label: "Stylus" },
  { id: "other" as const, label: "Other" },
];

export const MAKES_BY_TYPE: Record<DeviceType, string[]> = {
  mobile: ["Apple", "Samsung", "Google", "Motorola"],
  tablet: ["Apple", "Samsung", "Microsoft"],
  computer: ["Apple", "Dell", "HP", "Lenovo"],
  "game-console": ["Sony", "Microsoft", "Nintendo"],
  wearable: ["Apple", "Samsung", "Garmin"],
  hearable: ["Apple", "Samsung", "Sony"],
  other: ["Generic", "Other"],
};

export const MODELS_BY_MAKE: Record<string, string[]> = {
  Apple: [
    "iPhone 15 Pro",
    "iPhone 14",
    "iPhone 13",
    "iPad Pro 11",
    "MacBook Air M2",
    "Apple Watch Series 9",
    "AirPods Pro 2",
  ],
  Samsung: [
    "Galaxy S24",
    "Galaxy S23",
    "Galaxy Tab S9",
    "Galaxy Watch 6",
    "Galaxy Buds 2",
  ],
  Google: ["Pixel 8", "Pixel 7"],
  Motorola: ["Edge 40"],
  Microsoft: ["Surface Pro 9", "Xbox Series X"],
  Dell: ["XPS 13", "Inspiron 15"],
  HP: ["Pavilion 15"],
  Lenovo: ["ThinkPad X1"],
  Sony: ["PlayStation 5", "WH-1000XM5"],
  Nintendo: ["Switch OLED"],
  Garmin: ["Fenix 7"],
  Generic: ["Unknown model"],
  Other: ["Other model"],
};

export const DEVICE_ISSUES: DeviceIssue[] = [
  { id: "cracked-screen", category: "physical", label: "Cracked screen" },
  { id: "back-glass", category: "physical", label: "Back glass damage" },
  { id: "liquid", category: "physical", label: "Liquid damage" },
  { id: "bent-frame", category: "physical", label: "Bent / dented frame" },
  { id: "port-damage", category: "physical", label: "Port damage" },
  { id: "no-power", category: "malfunction", label: "Won't power on" },
  { id: "battery", category: "malfunction", label: "Battery / charging" },
  { id: "camera", category: "malfunction", label: "Camera issue" },
  { id: "speaker", category: "malfunction", label: "Speaker / mic" },
  { id: "overheat", category: "malfunction", label: "Overheating" },
  { id: "wifi", category: "malfunction", label: "Wi‑Fi / connectivity" },
  { id: "software-update", category: "software", label: "Software update" },
  { id: "factory-reset", category: "software", label: "Factory reset" },
  { id: "cleaning", category: "software", label: "Cleaning" },
  { id: "data-recovery", category: "software", label: "Data recovery" },
  { id: "device-setup", category: "software", label: "Device setup" },
];

export const ISSUE_CATEGORY_LABELS: Record<
  DeviceIssue["category"],
  string
> = {
  physical: "Physical & liquid damage",
  malfunction: "Malfunctions",
  software: "Software, cleaning & setup",
};

export const PARTS_CATALOG: PartSku[] = [
  // ── Apple iPhone ────────────────────────────────────────────────────────────
  { sku: "SCR-IP16P-OLED",    name: "iPhone 16 Pro OLED screen",       deviceTypes: ["mobile"],             makes: ["apple"],   price: 299,  isOem: true  },
  { sku: "SCR-IP15P-OLED",    name: "iPhone 15 Pro OLED screen",       deviceTypes: ["mobile"],             makes: ["apple"],   price: 279,  isOem: true  },
  { sku: "SCR-IP15P-OLED-3P", name: "iPhone 15 Pro display (3rd party)",deviceTypes: ["mobile"],            makes: ["apple"],   price: 149,  isOem: false },
  { sku: "SCR-IP14-LCD",      name: "iPhone 14 LCD screen",            deviceTypes: ["mobile"],             makes: ["apple"],   price: 199,  isOem: true  },
  { sku: "BAT-IP16",          name: "iPhone 16 battery",               deviceTypes: ["mobile"],             makes: ["apple"],   price: 99,   isOem: true  },
  { sku: "BAT-IP15",          name: "iPhone 15 battery",               deviceTypes: ["mobile"],             makes: ["apple"],   price: 89,   isOem: true  },
  { sku: "BAT-IP14",          name: "iPhone 14 battery",               deviceTypes: ["mobile"],             makes: ["apple"],   price: 89,   isOem: true  },
  { sku: "BAT-IP14-3P",       name: "iPhone 14 battery (3rd party)",   deviceTypes: ["mobile"],             makes: ["apple"],   price: 49,   isOem: false },
  { sku: "CHG-IP-LGHT",       name: "iPhone Lightning charge port",    deviceTypes: ["mobile"],             makes: ["apple"],   price: 55,   isOem: true  },
  { sku: "CAM-IP16-REAR",     name: "iPhone 16 rear camera module",    deviceTypes: ["mobile"],             makes: ["apple"],   price: 189,  isOem: true  },
  { sku: "SPK-IP15",          name: "iPhone 15 earpiece speaker",      deviceTypes: ["mobile"],             makes: ["apple"],   price: 45,   isOem: true  },
  // ── Samsung ─────────────────────────────────────────────────────────────────
  { sku: "SCR-S25-OLED",      name: "Galaxy S25 OLED display",         deviceTypes: ["mobile"],             makes: ["samsung"], price: 269,  isOem: true  },
  { sku: "SCR-S25-OLED-3P",   name: "Galaxy S25 display (3rd party)",  deviceTypes: ["mobile"],             makes: ["samsung"], price: 139,  isOem: false },
  { sku: "SCR-S24",           name: "Galaxy S24 display assembly",     deviceTypes: ["mobile"],             makes: ["samsung"], price: 249,  isOem: true  },
  { sku: "SCR-S24-3P",        name: "Galaxy S24 display (3rd party)",  deviceTypes: ["mobile"],             makes: ["samsung"], price: 129,  isOem: false },
  { sku: "BAT-S25",           name: "Galaxy S25 battery",              deviceTypes: ["mobile"],             makes: ["samsung"], price: 79,   isOem: true  },
  { sku: "BAT-S24",           name: "Galaxy S24 battery",              deviceTypes: ["mobile"],             makes: ["samsung"], price: 75,   isOem: true  },
  { sku: "CHG-S-USBC",        name: "Samsung USB-C charge port",       deviceTypes: ["mobile"],             makes: ["samsung"], price: 45,   isOem: true  },
  { sku: "CAM-S25-REAR",      name: "Galaxy S25 rear camera module",   deviceTypes: ["mobile"],             makes: ["samsung"], price: 175,  isOem: true  },
  { sku: "SPK-S24",           name: "Galaxy S24 earpiece speaker",     deviceTypes: ["mobile"],             makes: ["samsung"], price: 40,   isOem: true  },
  // ── Google ──────────────────────────────────────────────────────────────────
  { sku: "SCR-P9P-OLED",      name: "Pixel 9 Pro OLED display",        deviceTypes: ["mobile"],             makes: ["google"],  price: 259,  isOem: true  },
  { sku: "BAT-P9",            name: "Pixel 9 battery",                 deviceTypes: ["mobile"],             makes: ["google"],  price: 79,   isOem: true  },
  { sku: "CHG-P-USBC",        name: "Pixel USB-C charge port",         deviceTypes: ["mobile"],             makes: ["google"],  price: 45,   isOem: true  },
  // ── Apple tablet ────────────────────────────────────────────────────────────
  { sku: "SCR-IPAD11",        name: "iPad Pro 11 screen",              deviceTypes: ["tablet"],             makes: ["apple"],   price: 299,  isOem: true  },
  { sku: "BAT-IPAD11",        name: "iPad Pro 11 battery",             deviceTypes: ["tablet"],             makes: ["apple"],   price: 119,  isOem: true  },
  // ── Apple computer ──────────────────────────────────────────────────────────
  { sku: "KB-MBA-M2",         name: "MacBook Air M2 keyboard",         deviceTypes: ["computer"],           makes: ["apple"],   price: 189,  isOem: true  },
  { sku: "SSD-512-MBA",       name: "512GB NVMe SSD (MacBook)",        deviceTypes: ["computer"],           makes: ["apple"],   price: 149,  isOem: true  },
  // ── Samsung tablet ──────────────────────────────────────────────────────────
  { sku: "SCR-TAB-S9",        name: "Galaxy Tab S9 display",           deviceTypes: ["tablet"],             makes: ["samsung"], price: 279,  isOem: true  },
  { sku: "BAT-TAB-S9",        name: "Galaxy Tab S9 battery",           deviceTypes: ["tablet"],             makes: ["samsung"], price: 109,  isOem: true  },
  // ── Universal / multi-make ───────────────────────────────────────────────────
  { sku: "CHG-PORT-USB-C",    name: "USB-C charge port (universal)",   deviceTypes: ["mobile", "tablet"],                       price: 45,   isOem: false },
  { sku: "SSD-512",           name: "512GB NVMe SSD",                  deviceTypes: ["computer"],                               price: 129,  isOem: false },
  { sku: "HNG-PS5",           name: "PS5 HDMI port",                   deviceTypes: ["game-console"],                           price: 65,   isOem: true  },
  { sku: "GLS-AW9",           name: "Apple Watch S9 crystal",          deviceTypes: ["wearable"],           makes: ["apple"],   price: 99,   isOem: true  },
  { sku: "CASE-AIRPODS",      name: "AirPods Pro charging case",       deviceTypes: ["hearable"],           makes: ["apple"],   price: 79,   isOem: true  },
];

export const PROTECTION_PRODUCT_NAMES = {
  vhdp: "Verizon Home Device Protect",
  "att-hometech": "AT&T HomeTech Protection",
  "asurion-tech-care": "Asurion Tech Care",
} as const;

export const INDIVIDUALS: IndividualCustomer[] = [
  {
    id: "ind-1",
    kind: "individual",
    name: "Jordan Lee",
    primaryPhone: "(512) 555-0142",
    altPhone: "(512) 555-0199",
    email: "jordan.lee@email.com",
    smsOptIn: true,
    preferredContact: "text",
    accountCreatedOn: "2023-04-12",
    clientSinceYear: 2023,
    lifetimeValue: 1840,
    homePlusEnrolled: true,
    status: "active",
    accountId: "UBI000884221",
    address: "2143 Barton Springs Rd, Austin, TX 78704",
    specialInstructions: "Prefers text updates. Leave device with front desk if closed.",
    protectionOffers: [
      {
        id: "asurion-tech-care",
        name: PROTECTION_PRODUCT_NAMES["asurion-tech-care"],
        eligible: false,
        enrolled: true,
        enrolledSince: "2025-03-18",
      },
    ],
  },
  {
    id: "ind-2",
    kind: "individual",
    name: "Sam Rivera",
    primaryPhone: "(512) 555-0201",
    email: "sam.r@email.com",
    smsOptIn: false,
    preferredContact: "call",
    accountCreatedOn: "2024-09-03",
    lifetimeValue: 420,
    homePlusEnrolled: false,
    status: "active",
    accountId: "UBI000901554",
    address: "8800 N MoPac Expy, Austin, TX 78759",
    techCareOfferCount: 2,
    techCareDeclined: true,
    protectionOffers: [
      {
        id: "vhdp",
        name: PROTECTION_PRODUCT_NAMES.vhdp,
        eligible: true,
      },
    ],
  },
  {
    id: "ind-3",
    kind: "individual",
    name: "Alex Chen",
    primaryPhone: "(737) 555-0888",
    altPhone: "(737) 555-0110",
    email: "alex.chen@email.com",
    preferredContact: "email",
    accountCreatedOn: "2025-01-18",
    lifetimeValue: 265,
    homePlusEnrolled: false,
    status: "active",
    accountId: "UBI000922110",
    protectionOffers: [
      {
        id: "att-hometech",
        name: PROTECTION_PRODUCT_NAMES["att-hometech"],
        eligible: true,
      },
    ],
  },
];

export const BUSINESSES: BusinessAccount[] = [
  {
    id: "biz-1",
    kind: "business",
    name: "Brightside Realty",
    address: "1200 Congress Ave, Austin, TX 78701",
    phone: "(512) 555-3000",
    email: "ops@brightside.realty",
    status: "active",
    accountId: "UBA000115338",
    billingTerms: "Net 30",
    taxExempt: true,
    clientSinceYear: 2022,
    lifetimeValue: 460,
    specialInstructions:
      "Always invoice to accounts payable. Devices must stay on-site overnight.",
    automaticDiscount: {
      label: "12% off Accessories, 21% off Repair Parts",
      enabled: true,
    },
    contacts: [
      {
        id: "bc-1",
        name: "Taylor Brooks",
        phone: "(512) 555-3001",
        email: "taylor@brightside.realty",
        role: "Office manager",
        smsOptIn: true,
      },
      {
        id: "bc-2",
        name: "Morgan Diaz",
        phone: "(512) 555-3002",
        email: "morgan@brightside.realty",
        role: "IT lead",
        smsOptIn: false,
      },
    ],
  },
  {
    id: "biz-2",
    kind: "business",
    name: "Lakeview Dental",
    address: "4500 N Lamar Blvd, Austin, TX 78756",
    phone: "(512) 555-4400",
    email: "front@lakeviewdental.com",
    status: "active",
    accountId: "UBA000118902",
    billingTerms: "Net 15",
    taxExempt: false,
    clientSinceYear: 2024,
    lifetimeValue: 890,
    automaticDiscount: {
      label: "10% off Repair Parts",
      enabled: true,
    },
    contacts: [
      {
        id: "bc-3",
        name: "Priya Shah",
        phone: "(512) 555-4401",
        email: "priya@lakeviewdental.com",
        role: "Front desk",
        smsOptIn: true,
      },
    ],
  },
];

export const HISTORY_DEVICES: HistoryDevice[] = [
  {
    id: "hist-1",
    customerId: "ind-1",
    deviceType: "mobile",
    make: "Apple",
    model: "iPhone 14",
    imei: "356938035643809",
    lastRepair: "Screen — Jan 2026",
  },
  {
    id: "hist-2",
    customerId: "ind-1",
    deviceType: "tablet",
    make: "Apple",
    model: "iPad Pro 11",
    serial: "DMPX2LLABC1",
    lastRepair: "Battery — Nov 2025",
    liquidDamage: true,
  },
  {
    id: "hist-3",
    customerId: "ind-2",
    deviceType: "mobile",
    make: "Samsung",
    model: "Galaxy S23",
    imei: "359258075643210",
    lastRepair: "Charge port — Mar 2026",
  },
  {
    id: "hist-4",
    customerId: "biz-1",
    deviceType: "computer",
    make: "Apple",
    model: "MacBook Air M2",
    serial: "C02XL0ABJHD2",
    lastRepair: "Keyboard — Feb 2026",
  },
  {
    id: "hist-5",
    customerId: "ind-1",
    deviceType: "wearable",
    make: "Apple",
    model: "Apple Watch Series 9",
    serial: "G9K2L0WATCH9",
    lastRepair: "Crystal — Aug 2025",
  },
  {
    id: "hist-6",
    customerId: "ind-3",
    deviceType: "tablet",
    make: "Apple",
    model: "iPad Pro 11",
    serial: "DMPX2LLABC9",
  },
];

export const REPAIR_HISTORY: RepairHistoryItem[] = [
  {
    id: "rep-1",
    customerId: "ind-1",
    date: "2026-01-14",
    workOrderId: "WO-10412",
    deviceLabel: "Apple iPhone 14",
    issue: "Cracked screen",
    status: "completed",
    amount: 279,
  },
  {
    id: "rep-2",
    customerId: "ind-1",
    date: "2025-11-02",
    workOrderId: "WO-09881",
    deviceLabel: "Apple iPad Pro 11",
    issue: "Battery replacement",
    status: "completed",
    amount: 149,
  },
  {
    id: "rep-3",
    customerId: "ind-1",
    date: "2025-08-19",
    workOrderId: "WO-09104",
    deviceLabel: "Apple Watch Series 9",
    issue: "Cracked crystal",
    status: "completed",
    amount: 99,
  },
  {
    id: "rep-4",
    customerId: "ind-2",
    date: "2026-03-08",
    workOrderId: "WO-11002",
    deviceLabel: "Samsung Galaxy S23",
    issue: "Charge port",
    status: "completed",
    amount: 89,
  },
  {
    id: "rep-5",
    customerId: "ind-3",
    date: "2026-06-21",
    workOrderId: "WO-11840",
    deviceLabel: "Apple iPad Pro 11",
    issue: "Device setup",
    status: "in-progress",
    amount: 49,
  },
];

export const SALES_HISTORY: SalesHistoryItem[] = [
  {
    id: "sale-1",
    customerId: "ind-1",
    date: "2026-01-14",
    description: "Tempered glass + case",
    amount: 54.99,
    channel: "in-store",
  },
  {
    id: "sale-2",
    customerId: "ind-1",
    date: "2025-08-19",
    description: "Asurion Home+ annual plan",
    amount: 144,
    channel: "in-store",
  },
  {
    id: "sale-3",
    customerId: "ind-1",
    date: "2024-12-05",
    description: "USB-C fast charger",
    amount: 29.99,
    channel: "online",
  },
  {
    id: "sale-4",
    customerId: "ind-2",
    date: "2026-03-08",
    description: "Screen protector",
    amount: 24.99,
    channel: "in-store",
  },
  {
    id: "sale-5",
    customerId: "ind-3",
    date: "2025-01-18",
    description: "Asurion Home+ annual plan",
    amount: 144,
    channel: "in-store",
  },
];

export const PROFILE_WORK_ORDERS: ProfileWorkOrder[] = [
  {
    id: "500073781",
    customerId: "biz-1",
    createdAt: "2026-06-30T11:56:00",
    contactName: "Taylor Brooks",
    deviceLabel: "MacBook Air M2",
    deviceType: "computer",
    program: "Out Of Warranty",
    status: "ready-for-work",
  },
  {
    id: "500073790",
    customerId: "biz-1",
    createdAt: "2026-07-02T09:20:00",
    contactName: "Morgan Diaz",
    deviceLabel: "iPhone 14",
    deviceType: "mobile",
    program: "Out Of Warranty",
    status: "not-started",
  },
  {
    id: "500073801",
    customerId: "biz-1",
    createdAt: "2026-07-10T14:05:00",
    contactName: "Taylor Brooks",
    deviceLabel: "iPad Pro 11",
    deviceType: "tablet",
    program: "Business Protect",
    status: "ready-for-pickup",
  },
  {
    id: "500073812",
    customerId: "biz-1",
    createdAt: "2026-07-18T16:40:00",
    contactName: "Morgan Diaz",
    deviceLabel: "Galaxy S24",
    deviceType: "mobile",
    program: "Out Of Warranty",
    status: "completed",
  },
  {
    id: "500074100",
    customerId: "biz-2",
    createdAt: "2026-07-12T10:15:00",
    contactName: "Priya Shah",
    deviceLabel: "iPad Pro 11",
    deviceType: "tablet",
    program: "Out Of Warranty",
    status: "started",
  },
  {
    id: "500072200",
    customerId: "ind-1",
    createdAt: "2026-01-14T10:30:00",
    contactName: "Jordan Lee",
    deviceLabel: "iPhone 14",
    deviceType: "mobile",
    program: "Out Of Warranty",
    status: "completed",
  },
  {
    id: "500072880",
    customerId: "ind-1",
    createdAt: "2026-07-20T13:10:00",
    contactName: "Jordan Lee",
    deviceLabel: "iPhone 15 Pro",
    deviceType: "mobile",
    program: "Home+",
    status: "ready-for-pickup",
  },
  {
    id: "500072901",
    customerId: "ind-1",
    createdAt: "2026-07-22T09:00:00",
    contactName: "Jordan Lee",
    deviceLabel: "Apple Watch Series 9",
    deviceType: "wearable",
    program: "Home+",
    status: "not-started",
  },
  {
    id: "500073010",
    customerId: "ind-2",
    createdAt: "2026-03-08T15:45:00",
    contactName: "Sam Rivera",
    deviceLabel: "Galaxy S23",
    deviceType: "mobile",
    program: "Out Of Warranty",
    status: "completed",
  },
  {
    id: "500073050",
    customerId: "ind-3",
    createdAt: "2026-06-21T11:20:00",
    contactName: "Alex Chen",
    deviceLabel: "iPad Pro 11",
    deviceType: "tablet",
    program: "Home+",
    status: "started",
  },
];

export const PROFILE_INVOICES: ProfileInvoice[] = [
  {
    id: "INV-44021",
    customerId: "biz-1",
    date: "2026-07-11",
    description: "WO-500073801 · iPad Pro 11",
    amount: 189,
    status: "open",
  },
  {
    id: "INV-43880",
    customerId: "biz-1",
    date: "2026-06-30",
    description: "WO-500073781 · MacBook Air M2",
    amount: 249,
    status: "paid",
  },
  {
    id: "INV-43110",
    customerId: "ind-1",
    date: "2026-01-14",
    description: "WO-500072200 · iPhone 14 screen",
    amount: 279,
    status: "paid",
  },
  {
    id: "INV-44102",
    customerId: "ind-1",
    date: "2026-07-20",
    description: "Accessories · case + glass",
    amount: 54.99,
    status: "paid",
  },
];

export const PROFILE_NOTES: ProfileNote[] = [
  {
    id: "note-1",
    customerId: "biz-1",
    createdAt: "2026-06-24T05:59:00",
    title: "Auto note",
    category: "Business Settings",
    author: "vaishali taru",
    body: "vaishali taru set the automatic discount to 12% off Accessories, 21% off Repair parts.\n\nPrevious discount was set to: 12% off Accessories, $20 off Repair parts",
  },
  {
    id: "note-2",
    customerId: "biz-1",
    createdAt: "2026-05-02T14:20:00",
    title: "Manual note",
    category: "Account",
    author: "Store lead",
    body: "Discount plan renewed through end of year. AP prefers email invoices.",
  },
  {
    id: "note-3",
    customerId: "biz-1",
    createdAt: "2026-07-10T09:15:00",
    title: "Manual note",
    category: "Operations",
    author: "Ying W.",
    body: "Overnight storage approved for corporate devices.",
  },
  {
    id: "note-4",
    customerId: "ind-1",
    createdAt: "2026-01-14T10:45:00",
    title: "Manual note",
    category: "Preferences",
    author: "Ying W.",
    body: "Customer prefers text updates. Confirmed Home+ enrollment at drop-off.",
  },
  {
    id: "note-5",
    customerId: "ind-1",
    createdAt: "2025-08-19T16:02:00",
    title: "Auto note",
    category: "Membership",
    author: "System",
    body: "Jordan Lee enrolled in Asurion Home+ annual plan.",
  },
  {
    id: "note-6",
    customerId: "ind-2",
    createdAt: "2026-03-08T15:50:00",
    title: "Manual note",
    category: "Repair",
    author: "Ying W.",
    body: "Customer declined case upsell at checkout.",
  },
  {
    id: "note-7",
    customerId: "biz-2",
    createdAt: "2026-07-12T10:30:00",
    title: "Manual note",
    category: "Account",
    author: "Store lead",
    body: "Front desk contact is primary for all device pickups.",
  },
];

export function notesForCustomer(customerId: string) {
  return PROFILE_NOTES.filter((n) => n.customerId === customerId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function formatNoteTimestamp(iso: string) {
  const d = new Date(iso);
  const formatted = d.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  // "June 24, 5:59 AM" → "June 24 at 5:59am"
  return formatted
    .replace(", ", " at ")
    .replace(/\s(AM|PM)/, (_, m) => m.toLowerCase());
}

export const WORK_ORDER_STATUS_FILTERS: { id: ProfileWorkOrderStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "needs-update", label: "Needs Update" },
  { id: "not-started", label: "Not Started" },
  { id: "started", label: "Started" },
  { id: "waiting", label: "Waiting" },
  { id: "ready-for-pickup", label: "Ready for Pickup" },
];

export function workOrdersForCustomer(customerId: string) {
  return PROFILE_WORK_ORDERS.filter((w) => w.customerId === customerId).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );
}

export function invoicesForCustomer(customerId: string) {
  return PROFILE_INVOICES.filter((i) => i.customerId === customerId).sort(
    (a, b) => b.date.localeCompare(a.date)
  );
}

export function workOrderStatusLabel(status: ProfileWorkOrderStatus) {
  switch (status) {
    case "needs-update":
      return "Needs update";
    case "not-started":
      return "Not started";
    case "started":
      return "Started";
    case "waiting":
      return "Waiting";
    case "ready-for-pickup":
      return "Ready for pickup";
    case "ready-for-work":
      return "Ready for work";
    case "completed":
      return "Completed";
  }
}

export function formatWorkOrderCreatedAt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function repairHistoryForCustomer(customerId: string) {
  return REPAIR_HISTORY.filter((r) => r.customerId === customerId).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function salesHistoryForCustomer(customerId: string) {
  return SALES_HISTORY.filter((s) => s.customerId === customerId).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDisplayDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function preferredContactLabel(
  method: IndividualCustomer["preferredContact"]
) {
  if (method === "call") return "Call";
  if (method === "text") return "Text";
  return "Email";
}

export function clientSinceYearFromDate(iso: string) {
  return new Date(`${iso}T12:00:00`).getFullYear();
}

export const APPOINTMENTS: CheckInAppointment[] = [
  {
    id: "appt-1",
    kind: "timed",
    label: "Jordan Lee — iPhone screen",
    whenLabel: "Today · 11:30 AM",
    customerId: "ind-1",
    customerKind: "individual",
    devices: [
      {
        deviceType: "mobile",
        make: "Apple",
        model: "iPhone 15 Pro",
        imei: "353260051234567",
        issueIds: ["cracked-screen"],
      },
    ],
  },
  {
    id: "appt-2",
    kind: "date-range",
    label: "Sam Rivera — battery (walk-in window)",
    whenLabel: "Jul 28–30 · anytime",
    customerId: "ind-2",
    customerKind: "individual",
    devices: [
      {
        deviceType: "mobile",
        make: "Samsung",
        model: "Galaxy S23",
        imei: "359258075643210",
        issueIds: ["battery"],
      },
    ],
  },
  {
    id: "appt-3",
    kind: "timed",
    label: "Brightside Realty — MacBook",
    whenLabel: "Today · 2:00 PM",
    customerId: "biz-1",
    customerKind: "business",
    contactId: "bc-1",
    devices: [
      {
        deviceType: "computer",
        make: "Apple",
        model: "MacBook Air M2",
        serial: "C02XL0ABJHD2",
        issueIds: ["no-power"],
      },
    ],
  },
  {
    id: "appt-4",
    kind: "date-range",
    label: "Alex Chen — tablet setup",
    whenLabel: "Jul 27–29 · anytime",
    customerId: "ind-3",
    customerKind: "individual",
    devices: [
      {
        deviceType: "tablet",
        make: "Apple",
        model: "iPad Pro 11",
        serial: "DMPX2LLABC9",
        issueIds: ["device-setup"],
      },
    ],
  },
];

function normalize(q: string) {
  return q.trim().toLowerCase().replace(/[^\w\s]/g, "");
}

function matchesQuery(haystack: string, q: string) {
  const hay = normalize(haystack);
  if (!q) return false;
  return hay.includes(q) || q.split(/\s+/).every((p) => p && hay.includes(p));
}

export type CustomerSearchResult =
  | { type: "individual"; customer: IndividualCustomer }
  | { type: "business"; business: BusinessAccount };

/** Header / customer lookup: name, phone, business name, or address. */
export function searchCustomers(query: string): CustomerSearchResult[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results: CustomerSearchResult[] = [];

  for (const customer of INDIVIDUALS) {
    if (
      matchesQuery(
        `${customer.name} ${customer.primaryPhone} ${customer.altPhone ?? ""} ${customer.email}`,
        q
      )
    ) {
      results.push({ type: "individual", customer });
    }
  }

  for (const business of BUSINESSES) {
    if (
      matchesQuery(
        `${business.name} ${business.address} ${business.phone} ${business.email}`,
        q
      )
    ) {
      results.push({ type: "business", business });
    }
  }

  return results;
}

export function omniSearch(query: string): OmniResult[] {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results: OmniResult[] = [];

  for (const appointment of APPOINTMENTS) {
    const customer =
      appointment.customerKind === "individual"
        ? INDIVIDUALS.find((c) => c.id === appointment.customerId)
        : BUSINESSES.find((b) => b.id === appointment.customerId);
    const hay = [
      appointment.label,
      appointment.whenLabel,
      customer && "name" in customer ? customer.name : "",
      customer && "primaryPhone" in customer ? customer.primaryPhone : "",
      customer && "phone" in customer ? customer.phone : "",
    ].join(" ");
    if (matchesQuery(hay, q)) {
      results.push({ type: "appointment", appointment });
    }
  }

  for (const hit of searchCustomers(query)) {
    results.push(hit);
  }

  return results;
}

export function getIndividual(id: string) {
  return INDIVIDUALS.find((c) => c.id === id);
}

export function getBusiness(id: string) {
  return BUSINESSES.find((b) => b.id === id);
}

/** Offer the customer is already enrolled in (at most one). */
export function getEnrolledProtectionOffer(customer: IndividualCustomer) {
  return customer.protectionOffers?.find((offer) => offer.enrolled);
}

/** Eligible offers that are not already enrolled. */
export function getEligibleProtectionOffers(customer: IndividualCustomer) {
  return (
    customer.protectionOffers?.filter(
      (offer) => offer.eligible && !offer.enrolled
    ) ?? []
  );
}

/** Human-readable tenure since enrollment, e.g. "5 months" or "1 year, 4 months". */
export function formatEnrollmentTenure(
  enrolledSince: string,
  now: Date = new Date()
) {
  const start = new Date(`${enrolledSince}T12:00:00`);
  if (Number.isNaN(start.getTime()) || start > now) return null;

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 1) return "less than a month";

  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const yearPart =
    years === 0 ? null : years === 1 ? "1 year" : `${years} years`;
  const monthPart =
    remMonths === 0
      ? null
      : remMonths === 1
        ? "1 month"
        : `${remMonths} months`;

  if (yearPart && monthPart) return `${yearPart}, ${monthPart}`;
  return yearPart ?? monthPart;
}

export function appointmentsForCustomer(customerId: string) {
  return APPOINTMENTS.filter((a) => a.customerId === customerId);
}

export function historyForCustomer(customerId: string) {
  return HISTORY_DEVICES.filter((d) => d.customerId === customerId);
}

export function modelsForMake(make: string) {
  return MODELS_BY_MAKE[make] ?? ["Other model"];
}

/**
 * Mock manufacturer / extended warranty lookup after IMEI or serial.
 * Deterministic based on last digit of identifier.
 */
export function lookupWarranty(
  identifier: string,
  deviceType: DeviceType
): WarrantyResult {
  const digits = identifier.replace(/\D/g, "");
  if (digits.length < 4) {
    return { status: "none" };
  }

  const last = Number(digits[digits.length - 1]);

  if (last <= 3) {
    return {
      status: "manufacturer",
      typeLabel: "Manufacturer limited warranty",
      expiresOn: "2027-03-15",
      freeToCustomer: true,
      claim: null,
    };
  }

  if (last <= 6) {
    return {
      status: "extended",
      typeLabel: "Asurion Protect+",
      expiresOn: "2028-01-01",
      freeToCustomer: false,
      claim: {
        id: `CLM-${digits.slice(-6)}`,
        label: "Open claim — approved for repair",
        status: "open",
      },
      missingClaim: false,
    };
  }

  if (last <= 8) {
    return {
      status: "extended",
      typeLabel: "Carrier device protection",
      expiresOn: "2027-11-30",
      freeToCustomer: false,
      claim: null,
      missingClaim: true,
    };
  }

  return { status: "none", typeLabel: "Manufacturer warranty", expiresOn: "2024-08-22" };
}

export function findPartBySkuOrBarcode(input: string): PartSku | undefined {
  const q = input.trim().toUpperCase();
  return PARTS_CATALOG.find(
    (p) => p.sku === q || p.sku.includes(q) || normalize(p.name).includes(normalize(input))
  );
}

export function searchParts(query: string, deviceType?: DeviceType, make?: string): PartSku[] {
  const q = normalize(query);
  const makeLc = make ? normalize(make.split(" ")[0]) : undefined;
  return PARTS_CATALOG.filter((p) => {
    if (deviceType && !p.deviceTypes.includes(deviceType)) return false;
    if (makeLc && p.makes && !p.makes.some((m) => makeLc.includes(m) || m.includes(makeLc))) return false;
    if (!q) return true;
    return normalize(p.sku).includes(q) || normalize(p.name).includes(q);
  });
}

export const COMMON_ISSUE_IDS = [
  "cracked-screen",
  "battery",
  "liquid",
  "port-damage",
  "no-power",
  "camera",
];

const ISSUE_PART_SKU_HINTS: Record<string, string[]> = {
  "cracked-screen": ["SCR", "GLS"],
  "back-glass": ["GLS", "SCR"],
  "battery": ["BAT"],
  "port-damage": ["CHG-PORT"],
  "no-power": ["BAT", "CHG-PORT"],
  "liquid": ["BAT", "CHG-PORT"],
  "data-recovery": ["SSD"],
  "software-update": ["SSD"],
};

export function suggestedParts(issueIds: string[], deviceType: DeviceType, make?: string): PartSku[] {
  const makeLc = make ? normalize(make.split(" ")[0]) : undefined;
  const hints = issueIds.flatMap((id) => ISSUE_PART_SKU_HINTS[id] ?? []);
  const byType = PARTS_CATALOG.filter((p) => {
    if (!p.deviceTypes.includes(deviceType)) return false;
    if (makeLc && p.makes && !p.makes.some((m) => makeLc.includes(m) || m.includes(makeLc))) return false;
    return true;
  });
  if (hints.length === 0) return byType;
  const matching = byType.filter((p) => hints.some((h) => p.sku.toUpperCase().includes(h)));
  const rest = byType.filter((p) => !hints.some((h) => p.sku.toUpperCase().includes(h)));
  return [...matching, ...rest];
}

export function issueLabel(id: string) {
  return DEVICE_ISSUES.find((i) => i.id === id)?.label ?? id;
}

export function newDeviceId() {
  return `dev-${Math.random().toString(36).slice(2, 9)}`;
}

export function emptyDeviceDraft(
  partial?: Partial<import("./check-in-types").DeviceDraft>
): import("./check-in-types").DeviceDraft {
  return {
    id: newDeviceId(),
    deviceType: "mobile",
    make: "",
    model: "",
    imei: "",
    serial: "",
    locked: false,
    passcode: "",
    accessories: [],
    accessoryNote: "",
    issueIds: [],
    parts: [],
    warranty: null,
    complete: false,
    ...partial,
  };
}

export function deviceDraftFromAppointmentDevice(
  d: import("./check-in-types").AppointmentDevice
) {
  return emptyDeviceDraft({
    deviceType: d.deviceType,
    make: [d.make, d.model].filter(Boolean).join(" "),
    model: "",
    issueIds: [...d.issueIds],
  });
}

export function deviceDraftFromHistory(h: HistoryDevice) {
  return emptyDeviceDraft({
    sourceHistoryId: h.id,
    deviceType: h.deviceType,
    make: h.make,
    model: h.model,
    imei: h.imei ?? "",
    serial: h.serial ?? "",
    prefillLiquidDamage: h.liquidDamage ?? false,
  });
}

export const PICKUP_OPTIONS = [
  { value: "today-eod", label: "Today · end of day" },
  { value: "tomorrow-am", label: "Tomorrow · morning" },
  { value: "tomorrow-pm", label: "Tomorrow · afternoon" },
  { value: "2-days", label: "In 2 business days" },
  { value: "3-days", label: "In 3 business days" },
];

// ── Work Orders page mock data ─────────────────────────────────────────────────

export const WORK_ORDERS: WorkOrder[] = [
  // Ready for pickup: red=10d, yellow=4d, green=yesterday
  { id: "500067911", createdAt: "2026-08-17T10:00:00Z", nextUpdate: "2026-08-25T08:00:00Z", customer: "Abdullah Martinez", device: "iPhone 12 White", issue: "Broken front screen", deviceType: "mobile", status: "ready-for-pickup", program: "OOW", location: "Gulch #948", total: 149.99 },
  { id: "500068798", createdAt: "2026-08-23T10:00:00Z", nextUpdate: "2026-08-28T08:00:00Z", customer: "Hilda Nguyen", device: "iPhone 12 White", issue: "Broken front screen", deviceType: "mobile", status: "ready-for-pickup", program: "OOW", location: "Gulch #948", total: 149.99 },
  { id: "500070682", createdAt: "2026-08-26T10:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", customer: "Chintan Test", device: "Samsung Galaxy S22", issue: "Charging port issue", deviceType: "mobile", status: "ready-for-pickup", program: "Samsung Care+", location: "Gulch #948", total: 89.00 },
  // Work started
  { id: "500069463", createdAt: "2026-08-22T10:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-06T17:00:00Z", customer: "Chintan Test", device: "Samsung Galaxy S23", issue: "Cracked back glass", deviceType: "mobile", status: "diagnostics", program: "Samsung Care+", location: "Gulch #948", total: 199.99 },
  { id: "500070075", createdAt: "2026-08-25T10:00:00Z", nextUpdate: "2026-09-05T14:00:00Z", estimatedPickup: "2026-09-06T14:00:00Z", customer: "Chintan Test", device: "Samsung Galaxy S24", issue: "Battery replacement", deviceType: "mobile", status: "repair-summary", program: "Samsung IW", location: "Gulch #948", total: 79.99 },
  { id: "500070127", createdAt: "2026-08-21T10:00:00Z", nextUpdate: "2026-08-24T10:00:00Z", estimatedPickup: "2026-08-31T17:00:00Z", customer: "Pasquale Verdi", device: "iPhone 12 White", issue: "Broken front screen", deviceType: "mobile", status: "awaiting-item", program: "OOW", location: "Gulch #948", total: 229.99 },
  { id: "500070197", createdAt: "2026-08-27T08:00:00Z", nextUpdate: "2026-09-05T09:00:00Z", estimatedPickup: "2026-09-06T12:00:00Z", customer: "Chintan Test", device: "Google Pixel 6 Pro", issue: "Camera not working", deviceType: "mobile", status: "repair-summary", program: "Google IW", location: "Gulch #948", total: 159.99 },
  { id: "500071201", createdAt: "2026-08-24T10:00:00Z", nextUpdate: "2026-08-28T05:00:00Z", estimatedPickup: "2026-08-30T17:00:00Z", customer: "Sam Rivera", device: "Samsung Galaxy S23", issue: "Water damage", deviceType: "mobile", status: "awaiting-callback", program: "OOW", location: "Gulch #948", total: 349.99 },
  { id: "500071510", createdAt: "2026-08-23T10:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-06T17:00:00Z", customer: "James Kim", device: "iPhone 14 Pro", issue: "Face ID not working", deviceType: "mobile", status: "work-in-progress", program: "Asurion Mobility", location: "Gulch #948", total: 279.99 },
  { id: "500071625", createdAt: "2026-08-26T10:00:00Z", nextUpdate: null, estimatedPickup: "2026-09-02T17:00:00Z", customer: "Brightside Realty", device: "iPad Mini 6", issue: "Touch screen unresponsive", deviceType: "tablet", status: "awaiting-item", program: "OOW", location: "Gulch #948", total: 199.99 },
  { id: "500071920", createdAt: "2026-08-20T10:00:00Z", nextUpdate: "2026-08-26T10:00:00Z", estimatedPickup: "2026-08-29T17:00:00Z", customer: "Carlos Mendoza", device: "Samsung Galaxy S24 Ultra", issue: "S Pen not working", deviceType: "mobile", status: "work-in-progress", program: "OOW", location: "Gulch #948", total: 129.99 },
  { id: "500072010", createdAt: "2026-08-27T09:00:00Z", nextUpdate: "2026-09-01T11:00:00Z", estimatedPickup: "2026-09-02T17:00:00Z", customer: "Emily Watson", device: "iPhone 13 Mini", issue: "Battery draining fast", deviceType: "mobile", status: "quality-check", program: "Asurion Mobility", location: "Gulch #948", total: 89.99 },
  { id: "500072315", createdAt: "2026-08-25T10:00:00Z", nextUpdate: "2026-08-28T06:00:00Z", estimatedPickup: "2026-08-29T17:00:00Z", customer: "Robert Chen", device: "iPhone 15", issue: "Rear camera cracked", deviceType: "mobile", status: "work-in-progress", program: "OOW", location: "Gulch #948", total: 259.99 },
  { id: "500072410", createdAt: "2026-08-27T10:00:00Z", nextUpdate: null, estimatedPickup: "2026-09-03T17:00:00Z", customer: "Sofia Lopez", device: "Samsung Galaxy Tab S9", issue: "Won't turn on", deviceType: "tablet", status: "awaiting-item", program: "OOW", location: "Gulch #948", total: 189.99 },
  { id: "500072600", createdAt: "2026-08-22T10:00:00Z", nextUpdate: "2026-08-28T07:00:00Z", estimatedPickup: "2026-08-29T17:00:00Z", customer: "Priya Shah", device: "iPhone 14", issue: "No cellular signal", deviceType: "mobile", status: "repair-summary", program: "OOW", location: "Gulch #948", total: 179.99 },
  { id: "500072820", createdAt: "2026-08-26T10:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-07T17:00:00Z", customer: "Aisha Johnson", device: "Samsung Galaxy S23 FE", issue: "Microphone not working", deviceType: "mobile", status: "awaiting-item", program: "Asurion Home+", location: "Gulch #948", total: 99.99 },
  { id: "500072935", createdAt: "2026-08-24T10:00:00Z", nextUpdate: "2026-09-01T10:00:00Z", estimatedPickup: "2026-09-02T17:00:00Z", customer: "Kevin O'Brien", device: "iPad Pro 12.9", issue: "Pencil not connecting", deviceType: "tablet", status: "work-in-progress", program: "OOW", location: "Gulch #948", total: 149.99 },
  { id: "500073150", createdAt: "2026-08-21T10:00:00Z", nextUpdate: "2026-09-02T14:00:00Z", estimatedPickup: "2026-09-04T17:00:00Z", customer: "Luis Fernandez", device: "MacBook Pro 16 M3", issue: "Battery swollen", deviceType: "computer", status: "work-in-progress", program: "OOW", location: "Gulch #948", total: 399.99 },
  { id: "500073260", createdAt: "2026-08-27T08:00:00Z", nextUpdate: "2026-09-04T15:00:00Z", estimatedPickup: "2026-09-05T17:00:00Z", customer: "Rachel Green", device: "iPhone 15 Plus", issue: "Overheating", deviceType: "mobile", status: "quality-check", program: "OOW", location: "Gulch #948", total: 119.99 },
  // Ready to start
  { id: "500071350", createdAt: "2026-08-24T08:00:00Z", nextUpdate: "2026-08-25T08:00:00Z", estimatedPickup: "2026-08-29T17:00:00Z", customer: "Alex Chen", device: "iPad Pro 11", issue: "Shattered screen", deviceType: "tablet", status: "ready-for-work", program: "OOW", location: "Gulch #948", total: 329.99 },
  { id: "500071700", createdAt: "2026-08-26T09:00:00Z", nextUpdate: "2026-09-02T22:00:00Z", estimatedPickup: "2026-08-30T17:00:00Z", customer: "Nina Patel", device: "Google Pixel 7", issue: "Speaker damage", deviceType: "mobile", status: "ready-for-work", program: "OOW", location: "Gulch #948", total: 109.99 },
  { id: "500072105", createdAt: "2026-08-27T08:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-04T17:00:00Z", customer: "David Park", device: "Apple Watch Series 9", issue: "Screen cracked", deviceType: "wearable", status: "ready-for-work", program: "OOW", location: "Gulch #948", total: 199.99 },
  { id: "500072220", createdAt: "2026-08-27T09:00:00Z", nextUpdate: "2026-09-04T09:00:00Z", estimatedPickup: "2026-09-05T17:00:00Z", customer: "Fatima Al-Hassan", device: "iPad Air 5", issue: "Charging not working", deviceType: "tablet", status: "ready-for-work", program: "Verizon EW", location: "Gulch #948", total: 169.99 },
  { id: "500072715", createdAt: "2026-08-27T07:00:00Z", nextUpdate: "2026-09-04T11:00:00Z", estimatedPickup: "2026-09-03T17:00:00Z", customer: "Tom Bradley", device: "Google Pixel 8 Pro", issue: "Screen burn-in", deviceType: "mobile", status: "ready-for-work", program: "OOW", location: "Gulch #948", total: 249.99 },
  { id: "500073370", createdAt: "2026-08-27T10:00:00Z", nextUpdate: "2026-09-04T10:00:00Z", estimatedPickup: "2026-09-05T17:00:00Z", customer: "Omar Hassan", device: "Samsung Galaxy A54", issue: "Screen replacement", deviceType: "mobile", status: "ready-for-work", program: "OOW", location: "Gulch #948", total: 139.99 },
  // Need to order
  { id: "500071100", createdAt: "2026-08-26T09:00:00Z", nextUpdate: "2026-09-03T08:00:00Z", estimatedPickup: "2026-09-01T17:00:00Z", customer: "Jordan Lee", device: "iPhone 15 Pro", issue: "Cracked screen", deviceType: "mobile", status: "need-to-order", program: "OOW", location: "Gulch #948", total: 299.99 },
  { id: "500071402", createdAt: "2026-08-27T09:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-05T17:00:00Z", customer: "Maria Torres", device: "MacBook Air M2", issue: "Keyboard not working", deviceType: "computer", status: "need-to-order", program: "Asurion Home+", location: "Gulch #948", total: 229.99 },
  { id: "500071815", createdAt: "2026-08-27T10:00:00Z", nextUpdate: "2026-09-06T14:00:00Z", estimatedPickup: "2026-09-06T17:00:00Z", customer: "Lakeview Dental", device: "MacBook Pro 14", issue: "Display flickering", deviceType: "computer", status: "need-to-order", program: "OOW", location: "Gulch #948", total: 449.99 },
  { id: "500072505", createdAt: "2026-08-27T08:00:00Z", nextUpdate: "2026-09-05T10:00:00Z", estimatedPickup: "2026-09-10T17:00:00Z", customer: "Michael Brown", device: "MacBook Air M3", issue: "Liquid damage", deviceType: "computer", status: "need-to-order", program: "OOW", location: "Gulch #948", total: 599.99 },
  { id: "500073040", createdAt: "2026-08-27T11:00:00Z", nextUpdate: "2026-09-04T09:00:00Z", estimatedPickup: "2026-09-06T17:00:00Z", customer: "Hannah White", device: "iPhone 13 Pro Max", issue: "Rear glass cracked", deviceType: "mobile", status: "need-to-order", program: "OOW", location: "Gulch #948", total: 189.99 },
];

export const WO_STATUS_LABELS: Record<WOStatus, string> = {
  "need-to-order":     "Need to order",
  "ready-for-work":    "Ready for work",
  "diagnostics":       "Diagnostics",
  "work-in-progress":  "Work in progress",
  "repair-summary":    "Repair summary",
  "quality-check":     "Quality check",
  "awaiting-item":     "Awaiting item",
  "awaiting-callback": "Awaiting callback",
  "ready-for-pickup":  "Ready for pickup",
};

export const WO_PROGRAMS = [...new Set(WORK_ORDERS.map(w => w.program))].sort();
export const WO_DEVICE_TYPES = ["mobile", "tablet", "computer", "wearable", "hearable", "game-console", "other"] as const;
export const WO_DEVICE_TYPE_LABELS: Record<string, string> = {
  mobile: "Phone",
  tablet: "Tablet",
  computer: "Computer",
  wearable: "Wearable",
  hearable: "Earbuds / Headphones",
  "game-console": "Game console",
  other: "Other",
};

export function formatWODate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
  return { date, time };
}
