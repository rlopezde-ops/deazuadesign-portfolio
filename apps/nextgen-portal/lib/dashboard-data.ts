export type TodoItem = {
  id: string;
  label: string;
  count: number;
  showClock?: boolean;
};

export type MetricCard = {
  id: string;
  label: string;
  current: number;
  goal: number;
  prefix?: string;
};

export type ArrivalAppointment = {
  id: string;
  name: string;
  device: string;
  service: string;
  accent: "yellow" | "green" | "purple";
};

export type ArrivalSlot = {
  hour: string;
  appointments: ArrivalAppointment[];
  moreCount: number;
};

export const storeLocation = "Gulch #948";

export const todoItems: TodoItem[] = [
  { id: "contact", label: "Confirm arrivals", count: 4 },
  { id: "pickup", label: "Call for device pickup", count: 3 },
  { id: "started", label: "Contact customers about repairs", count: 6 },
  { id: "ready-work", label: "Review aged work orders", count: 5 },
  { id: "order", label: "Order parts", count: 2 },
];

export const metricCards: MetricCard[] = [
  { id: "sales", label: "Today's sales", current: 0, goal: 323, prefix: "$" },
  {
    id: "repairs",
    label: "Today's completed repairs",
    current: 28,
    goal: 50,
  },
];

const appointmentTemplates: Omit<ArrivalAppointment, "id">[] = [
  {
    name: "jon doe",
    device: "iPhone 12 Mini Red",
    service: "Asurion Pickup & S...",
    accent: "yellow",
  },
  {
    name: "jon doe",
    device: "iPhone 12 Mini Red",
    service: "Asurion Pickup & S...",
    accent: "green",
  },
  {
    name: "jon doe",
    device: "iPhone 12 Mini Red",
    service: "Asurion Pickup & S...",
    accent: "purple",
  },
  {
    name: "jon doe",
    device: "iPhone 12 Mini Red",
    service: "Asurion Pickup & S...",
    accent: "yellow",
  },
];

export const arrivalSlots: ArrivalSlot[] = [
  { hour: "10 am", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `10-${i}` })), moreCount: 19 },
  { hour: "11 am", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `11-${i}` })), moreCount: 47 },
  { hour: "12 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `12-${i}` })), moreCount: 47 },
  { hour: "1 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `13-${i}` })), moreCount: 47 },
  { hour: "2 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `14-${i}` })), moreCount: 47 },
  { hour: "3 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `15-${i}` })), moreCount: 47 },
  { hour: "4 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `16-${i}` })), moreCount: 47 },
  { hour: "5 pm", appointments: appointmentTemplates.slice(0, 2).map((a, i) => ({ ...a, id: `17-${i}` })), moreCount: 47 },
];

export const arrivalsDateLabel = "Today, Jul 7";

// ── Follow up with customers ──────────────────────────────────────────────────
export type ContactReason = "Repair estimate" | "Price change" | "Additional issue" | "Other";

export type FollowUpWO = {
  id: string;
  customer: string;
  device: string;
  issue: string;
  contactReason: ContactReason;
};

export const followUpWOs: FollowUpWO[] = [
  { id: "500071201", customer: "Sam Rivera",        device: "Samsung Galaxy S23",    issue: "Water damage",             contactReason: "Repair estimate" },
  { id: "500071625", customer: "Brightside Realty", device: "iPad Mini 6",           issue: "Touch screen unresponsive", contactReason: "Price change" },
  { id: "500072010", customer: "Emily Watson",      device: "iPhone 13 Mini",        issue: "Battery draining fast",    contactReason: "Additional issue" },
  { id: "500072410", customer: "Sofia Lopez",       device: "Samsung Galaxy Tab S9", issue: "Won't turn on",            contactReason: "Repair estimate" },
  { id: "500072820", customer: "Aisha Johnson",     device: "Samsung Galaxy S23 FE", issue: "Microphone not working",   contactReason: "Other" },
  { id: "500073260", customer: "Rachel Green",      device: "iPhone 15 Plus",        issue: "Overheating",              contactReason: "Additional issue" },
];

// ── Send pickup reminders ─────────────────────────────────────────────────────
export type PickupReminderWO = {
  id: string;
  customer: string;
  device: string;
  amountDue: number;
  phone: string;
  workCompletedAt: string; // ISO — used to calculate days since ready
};

export const pickupReminderWOs: PickupReminderWO[] = [
  { id: "500067911", customer: "Abdullah Martinez", device: "iPhone 12 White",         amountDue: 149.99, phone: "313-555-0172", workCompletedAt: "2026-08-15T10:00:00Z" },
  { id: "500068798", customer: "Hilda Nguyen",      device: "iPhone 12 White",         amountDue: 149.99, phone: "248-555-0293", workCompletedAt: "2026-08-22T10:00:00Z" },
  { id: "500070682", customer: "Chintan Test",      device: "Samsung Galaxy S22",      amountDue: 89.00,  phone: "734-555-0441", workCompletedAt: "2026-08-25T10:00:00Z" },
];

// ── Review aged work orders ───────────────────────────────────────────────────
export type AgedWO = {
  id: string;
  customer: string;
  device: string;
  issue: string;
  status: string;
  statusLabel: string;
  lastUpdatedAt: string; // ISO
};

export const agedWOs: AgedWO[] = [
  { id: "500070127", customer: "Pasquale Verdi",  device: "iPhone 12 White",    issue: "Broken front screen",    status: "awaiting-item",  statusLabel: "Awaiting item",  lastUpdatedAt: "2026-08-01T00:50:00Z" },
  { id: "500070075", customer: "Chintan Test",    device: "Samsung Galaxy S24", issue: "Battery replacement",    status: "repair-summary", statusLabel: "Repair summary", lastUpdatedAt: "2026-08-10T14:00:00Z" },
  { id: "500071100", customer: "Jordan Lee",      device: "iPhone 15 Pro",      issue: "Cracked screen",         status: "need-to-order",  statusLabel: "Need to order",  lastUpdatedAt: "2026-08-18T10:00:00Z" },
  { id: "500071815", customer: "Lakeview Dental", device: "MacBook Pro 14",     issue: "Display flickering",     status: "need-to-order",  statusLabel: "Need to order",  lastUpdatedAt: "2026-08-20T14:00:00Z" },
  { id: "500069463", customer: "Chintan Test",    device: "Samsung Galaxy S23", issue: "Cracked back glass",     status: "diagnostics",    statusLabel: "Diagnostics",    lastUpdatedAt: "2026-08-22T10:00:00Z" },
];

// ── Order parts ───────────────────────────────────────────────────────────────
export type PartOrder = {
  id: string;
  partName: string;
  partNumber: string;
  type: "distro" | "third-party";
  quantity: number;
  woId: string;
  customer: string;
};

export const partOrders: PartOrder[] = [
  { id: "p1", partName: "iPhone 15 Pro Screen Assembly",     partNumber: "APP-15P-SCR-001",  type: "distro",       quantity: 1, woId: "500071100", customer: "Jordan Lee" },
  { id: "p2", partName: "MacBook Pro 14 Battery",            partNumber: "MBP14-BAT-3P-77",  type: "third-party",  quantity: 2, woId: "500071815", customer: "Lakeview Dental" },
];

export type ArrivalNote = {
  id: string;
  timestamp: string;
  category: string;
  body: string;
};

export type ArrivalRecord = {
  id: string;
  customerName: string;
  initials: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  device: string;
  imei: string;
  servicePlan: string;
  appointmentStart: string; // ISO
  appointmentEnd: string;   // ISO
  confirmationStatus: "confirmed" | "not-confirmed";
  preferredContact: "call" | "text" | "email";
  notes: ArrivalNote[];
};

export const mockArrivals: ArrivalRecord[] = [
  {
    id: "arr-001",
    customerName: "Danny Jin",
    initials: "DJ",
    email: "tim.jin@asurion.com",
    phone: "989-234-4347",
    address: "22789 Teppert Ave, Eastpointe, MI 48021-1927",
    source: "Verizon",
    device: "Samsung Galaxy S22 5G",
    imei: "35883596061643*",
    servicePlan: "Verizon Extended Warranty",
    appointmentStart: "2027-03-05T07:06:00",
    appointmentEnd: "2027-03-05T08:06:00",
    confirmationStatus: "not-confirmed",
    preferredContact: "call",
    notes: [
      {
        id: "n1",
        timestamp: "February 16 at 8:03am",
        category: "Initial Check-In",
        body: "Verizon Wireless Extended Warranty Details – Claim Number: 271142 – Reference Number: Q341701,271142,1 – Device IMEI: 358835960616438 – Device Model: GALAXY S22 128 BLK – SKU: CLNRGOGA00661 – Device Symptoms: charging port not working – Primary Pos: 20 – Display/Touchscreen – Secondary Pos: 21 – Blank/One Color Display – Trans Type: Device Repair",
      },
      {
        id: "n2",
        timestamp: "February 16 at 8:03am",
        category: "Arrival Created",
        body: "Arrival record created automatically upon check-in.",
      },
    ],
  },
  {
    id: "arr-002",
    customerName: "Maria Torres",
    initials: "MT",
    email: "maria.torres@email.com",
    phone: "312-555-0182",
    address: "4801 N Clark St, Chicago, IL 60640",
    source: "AT&T",
    device: "iPhone 14 Pro Max",
    imei: "35219312847651",
    servicePlan: "AT&T Protect Advantage",
    appointmentStart: "2027-03-05T09:00:00",
    appointmentEnd: "2027-03-05T10:00:00",
    confirmationStatus: "confirmed",
    preferredContact: "text",
    notes: [
      {
        id: "n3",
        timestamp: "February 16 at 9:01am",
        category: "Initial Check-In",
        body: "AT&T Protect Advantage – Claim Number: 489203 – Device IMEI: 35219312847651 – Device Model: iPhone 14 Pro Max 256GB Space Black – Device Symptoms: cracked screen – Trans Type: Screen Repair",
      },
    ],
  },
  {
    id: "arr-003",
    customerName: "Priya Nair",
    initials: "PN",
    email: "priya.nair@gmail.com",
    phone: "415-555-0234",
    address: "1420 Mission St, San Francisco, CA 94103",
    source: "T-Mobile",
    device: "Google Pixel 8",
    imei: "86710204937510",
    servicePlan: "T-Mobile Protection 360",
    appointmentStart: "2027-03-05T10:30:00",
    appointmentEnd: "2027-03-05T11:30:00",
    confirmationStatus: "not-confirmed",
    preferredContact: "call",
    notes: [
      {
        id: "n4",
        timestamp: "February 16 at 10:31am",
        category: "Initial Check-In",
        body: "T-Mobile Protection 360 – Claim Number: 773019 – Device Model: Google Pixel 8 128GB Obsidian – Device Symptoms: battery draining fast, device not charging – Trans Type: Battery Replacement",
      },
      {
        id: "n5",
        timestamp: "February 16 at 10:31am",
        category: "Arrival Created",
        body: "Arrival record created automatically upon check-in.",
      },
    ],
  },
  {
    id: "arr-004",
    customerName: "James Okafor",
    initials: "JO",
    email: "james.okafor@work.com",
    phone: "646-555-0398",
    address: "350 5th Ave, New York, NY 10118",
    source: "Verizon",
    device: "Samsung Galaxy Z Fold 5",
    imei: "35991807264530",
    servicePlan: "Verizon Mobile Protect",
    appointmentStart: "2027-03-05T11:00:00",
    appointmentEnd: "2027-03-05T12:00:00",
    confirmationStatus: "confirmed",
    preferredContact: "email",
    notes: [
      {
        id: "n6",
        timestamp: "February 16 at 11:02am",
        category: "Initial Check-In",
        body: "Verizon Mobile Protect – Claim Number: 904451 – Device Model: Samsung Galaxy Z Fold 5 256GB Phantom Black – Device Symptoms: inner screen flickering – Trans Type: Screen Repair",
      },
    ],
  },
];
