"use client";

import { useMemo, useState } from "react";
import {
  Action,
  Icon,
  Tag,
  Text,
  TextField,
} from "@asurion-core/mx-asurion-ui-react";
import { ArrowLeft } from "@phosphor-icons/react";
import {
  WORK_ORDER_STATUS_FILTERS,
  clientSinceYearFromDate,
  formatCurrency,
  formatDisplayDate,
  formatWorkOrderCreatedAt,
  getBusiness,
  getEligibleProtectionOffers,
  getEnrolledProtectionOffer,
  getIndividual,
  historyForCustomer,
  invoicesForCustomer,
  notesForCustomer,
  preferredContactLabel,
  workOrderStatusLabel,
  workOrdersForCustomer,
} from "@/lib/check-in-data";
import { useAppNavigation } from "@/lib/app-navigation";
import type {
  BusinessAccount,
  BusinessContact,
  DeviceType,
  IndividualCustomer,
  ProfileInvoice,
  ProfileNote,
  ProfileWorkOrder,
  ProfileWorkOrderStatus,
  ProtectionProductId,
} from "@/lib/check-in-types";
import { cn } from "@/lib/utils";
import { ProtectionOffersSection } from "@/components/customer/protection-offer-banner";

type ProfileTab = "work-orders" | "invoices" | "contacts" | "devices" | "notes";

type MetaItem = {
  icon: string;
  label?: string;
  value: string;
};

function shortProtectionLabel(id: ProtectionProductId) {
  switch (id) {
    case "vhdp":
      return "VHDP";
    case "att-hometech":
      return "HomeTech";
    case "asurion-tech-care":
      return "Tech Care";
  }
}

export function CustomerProfileView() {
  const { selectedCustomerProfile, goToDashboard } = useAppNavigation();

  if (!selectedCustomerProfile) {
    return <EmptyProfile onBack={goToDashboard} />;
  }

  if (selectedCustomerProfile.type === "business") {
    const business = getBusiness(selectedCustomerProfile.id);
    if (!business) return <EmptyProfile onBack={goToDashboard} />;
    return <BusinessProfile business={business} />;
  }

  const customer = getIndividual(selectedCustomerProfile.id);
  if (!customer) return <EmptyProfile onBack={goToDashboard} />;
  return <IndividualProfile customer={customer} />;
}

function BusinessProfile({ business }: { business: BusinessAccount }) {
  const { goToDashboard, goToCheckInWithCustomer } = useAppNavigation();
  const [tab, setTab] = useState<ProfileTab>("work-orders");
  const workOrders = workOrdersForCustomer(business.id);
  const invoices = invoicesForCustomer(business.id);
  const notes = notesForCustomer(business.id);

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: "work-orders", label: "Work orders", icon: "wrench" },
    { id: "invoices", label: "Invoices", icon: "receipt" },
    { id: "contacts", label: "Authorized contacts", icon: "users" },
    { id: "notes", label: "Notes", icon: "note" },
  ];

  return (
    <ProfileShell
      title={business.name}
      statusBadge={{
        text: business.status === "active" ? "Active" : "Inactive",
        type: business.status === "active" ? "success" : "gray",
      }}
      onBack={goToDashboard}
      onCheckIn={() =>
        goToCheckInWithCustomer({ type: "business", id: business.id })
      }
      metaColumns={[
        [
          { icon: "envelope-simple", value: business.email },
          { icon: "phone", value: business.phone },
          { icon: "map-pin", value: business.address },
        ],
        [
          { icon: "identification-card", value: `Account ID: ${business.accountId}` },
          { icon: "file-text", value: `Billing terms: ${business.billingTerms}` },
          {
            icon: "tag",
            value: `Tax exempt: ${business.taxExempt ? "Enabled" : "Disabled"}`,
          },
        ],
        [
          {
            icon: "chat-text",
            value: business.specialInstructions
              ? "View special instructions"
              : "No special instructions",
            label: "instructions",
          },
          {
            icon: "clock",
            value: `Client since: ${business.clientSinceYear}`,
          },
          {
            icon: "currency-dollar",
            value: `Lifetime value: ${formatCurrency(business.lifetimeValue)}`,
          },
        ],
      ]}
      specialInstructions={business.specialInstructions}
      banner={
        business.automaticDiscount ? (
          <DiscountBanner
            label={`Automatic Discount: ${business.automaticDiscount.label}`}
            enabled={business.automaticDiscount.enabled}
          />
        ) : null
      }
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === "work-orders" ? (
        <WorkOrdersPanel workOrders={workOrders} />
      ) : null}
      {tab === "invoices" ? <InvoicesPanel invoices={invoices} /> : null}
      {tab === "contacts" ? (
        <ContactsPanel contacts={business.contacts} />
      ) : null}
      {tab === "notes" ? <NotesPanel notes={notes} /> : null}
    </ProfileShell>
  );
}

function IndividualProfile({ customer }: { customer: IndividualCustomer }) {
  const { goToDashboard, goToCheckInWithCustomer } = useAppNavigation();
  const [tab, setTab] = useState<ProfileTab>("work-orders");
  const workOrders = workOrdersForCustomer(customer.id);
  const invoices = invoicesForCustomer(customer.id);
  const notes = notesForCustomer(customer.id);
  const devices = historyForCustomer(customer.id);
  const enrolledOffer = getEnrolledProtectionOffer(customer);
  const eligibleOffers = getEligibleProtectionOffers(customer);

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: "work-orders", label: "Work orders", icon: "wrench" },
    { id: "invoices", label: "Sales orders", icon: "receipt" },
    { id: "devices", label: "Devices", icon: "device-mobile" },
    { id: "notes", label: "Notes", icon: "note" },
  ];

  const statusBadge = enrolledOffer
    ? {
        text: `${shortProtectionLabel(enrolledOffer.id)} enrolled`,
        type: "success" as const,
      }
    : eligibleOffers.length > 0
      ? {
          text: `${shortProtectionLabel(eligibleOffers[0].id)} eligible`,
          type: "success" as const,
        }
      : {
          text: customer.homePlusEnrolled
            ? "Home+ enrolled"
            : "Home+ not enrolled",
          type: (customer.homePlusEnrolled ? "success" : "gray") as
            | "success"
            | "gray",
        };

  return (
    <ProfileShell
      title={customer.name}
      statusBadge={statusBadge}
      onBack={goToDashboard}
      onCheckIn={() =>
        goToCheckInWithCustomer({ type: "individual", id: customer.id })
      }
      metaColumns={[
        [
          { icon: "envelope-simple", value: customer.email },
          {
            icon: "phone",
            value: `${customer.primaryPhone} (Primary)`,
          },
          ...(customer.altPhone
            ? [
                {
                  icon: "phone",
                  value: `${customer.altPhone} (Secondary)`,
                },
              ]
            : []),
          {
            icon: "map-pin",
            value: customer.address ?? "No address on file",
          },
        ],
        [
          {
            icon: "chat-circle",
            value: `Preferred contact: ${preferredContactLabel(customer.preferredContact)}`,
          },
        ],
        [
          {
            icon: "clock",
            value: `Client since: ${clientSinceYearFromDate(customer.accountCreatedOn)}`,
          },
          {
            icon: "currency-dollar",
            value: `Lifetime value: ${formatCurrency(customer.lifetimeValue)}`,
          },
        ],
      ]}
      specialInstructions={undefined}
      banner={
        <ProtectionOffersSection
          enrolled={enrolledOffer}
          eligible={eligibleOffers}
        />
      }
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === "work-orders" ? (
        <WorkOrdersPanel workOrders={workOrders} />
      ) : null}
      {tab === "invoices" ? <InvoicesPanel invoices={invoices} /> : null}
      {tab === "devices" ? <DevicesPanel devices={devices} /> : null}
      {tab === "notes" ? <NotesPanel notes={notes} /> : null}
    </ProfileShell>
  );
}

function ProfileShell({
  title,
  statusBadge,
  onBack,
  onCheckIn,
  metaColumns,
  specialInstructions,
  banner,
  tabs,
  activeTab,
  onTabChange,
  children,
}: {
  title: string;
  statusBadge: { text: string; type: "success" | "gray" };
  onBack: () => void;
  onCheckIn: () => void;
  metaColumns: MetaItem[][];
  specialInstructions?: string;
  banner?: React.ReactNode;
  tabs: { id: ProfileTab; label: string; icon: string }[];
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  children: React.ReactNode;
}) {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-[var(--aui-spacing-400)] px-[var(--aui-spacing-400)] py-[var(--aui-spacing-400)]">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-[var(--aui-spacing-150)] inline-flex items-center gap-1 text-sm text-[var(--aui-on-surface-soft)] transition-colors hover:text-[var(--aui-on-surface)]"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </button>

        <div className="flex flex-wrap items-start justify-between gap-[var(--aui-spacing-300)]">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <Text as="h1" size={5} weight="heavy" className="text-balance">
              {title}
            </Text>
            <Tag
              text={statusBadge.text}
              type={statusBadge.type}
              size="small"
              family="soft"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Action type="button" variant="outline" size="sm">
              <Icon.Phosphor name="pencil-simple" size="small" className="!mr-2" />
              Edit
            </Action>
            <Action type="button" variant="filled" size="sm" onClick={onCheckIn}>
              Check-in
            </Action>
            <Action
              type="button"
              variant="flat"
              size="sm"
              aria-label="More actions"
              className="!min-w-9 !px-2"
            >
              <Icon.Phosphor name="dots-three-vertical" size="small" />
            </Action>
          </div>
        </div>
      </div>

      <div className="grid gap-[var(--aui-spacing-400)] border-b border-[var(--aui-outline-soft)] pb-[var(--aui-spacing-400)] md:grid-cols-3">
        {metaColumns.map((column, colIdx) => (
          <ul key={colIdx} className="flex flex-col gap-[var(--aui-spacing-200)]">
            {column.map((item) => {
              const isInstructions = item.label === "instructions";
              const clickable = isInstructions && Boolean(specialInstructions);
              return (
                <li key={`${item.icon}-${item.value}`}>
                  <button
                    type="button"
                    disabled={!clickable}
                    onClick={() =>
                      clickable && setShowInstructions((v) => !v)
                    }
                    className={cn(
                      "flex w-full items-start gap-2 text-left",
                      clickable
                        ? "text-[var(--aui-accent-purple)] hover:underline"
                        : "text-[var(--aui-on-surface)]"
                    )}
                  >
                    <Icon.Phosphor
                      name={item.icon}
                      size="small"
                      className="mt-0.5 !block shrink-0 text-[var(--aui-on-surface-soft)]"
                    />
                    <span className="text-sm text-pretty">{item.value}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
      </div>

      {showInstructions && specialInstructions ? (
        <div className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]">
          <Text size={2} weight="heavy">
            Special instructions
          </Text>
          <Text size={2} className="mt-1 text-pretty text-[var(--aui-on-surface-soft)]">
            {specialInstructions}
          </Text>
        </div>
      ) : null}

      {banner}

      <div className="border-b border-[var(--aui-outline-soft)]">
        <nav className="-mb-px flex flex-wrap gap-1" aria-label="Profile sections">
          {tabs.map((t) => {
            const active = t.id === activeTab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "border-[var(--aui-on-surface)] font-medium text-[var(--aui-on-surface)]"
                    : "border-transparent text-[var(--aui-on-surface-soft)] hover:text-[var(--aui-on-surface)]"
                )}
              >
                <Icon.Phosphor name={t.icon} size="small" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div>{children}</div>
    </div>
  );
}

function DiscountBanner({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--aui-border-radius-100)] bg-[var(--aui-primary-soft)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]">
      <div className="flex items-center gap-2">
        <Icon.Phosphor name="tag" size="small" className="!block shrink-0" />
        <Text size={2}>{label}</Text>
      </div>
      <Tag
        text={enabled ? "Enabled" : "Disabled"}
        type={enabled ? "success" : "gray"}
        size="small"
        family="soft"
      />
    </div>
  );
}

function WorkOrdersPanel({ workOrders }: { workOrders: ProfileWorkOrder[] }) {
  const [filter, setFilter] = useState<"all" | ProfileWorkOrderStatus>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: workOrders.length };
    for (const f of WORK_ORDER_STATUS_FILTERS) {
      if (f.id === "all") continue;
      map[f.id] = workOrders.filter((w) => w.status === f.id).length;
    }
    // ready-for-work counted under not-started visually in some UIs; keep separate if present
    map["ready-for-work"] = workOrders.filter(
      (w) => w.status === "ready-for-work"
    ).length;
    return map;
  }, [workOrders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return workOrders.filter((w) => {
      const statusOk =
        filter === "all"
          ? true
          : filter === "not-started"
            ? w.status === "not-started" || w.status === "ready-for-work"
            : w.status === filter;
      if (!statusOk) return false;
      if (!q) return true;
      return (
        w.id.toLowerCase().includes(q) ||
        w.contactName.toLowerCase().includes(q) ||
        w.deviceLabel.toLowerCase().includes(q)
      );
    });
  }, [workOrders, filter, query]);

  return (
    <div className="flex flex-col gap-[var(--aui-spacing-300)]">
      <div className="flex flex-wrap gap-2">
        {WORK_ORDER_STATUS_FILTERS.map((f) => {
          const count =
            f.id === "not-started"
              ? (counts["not-started"] ?? 0) + (counts["ready-for-work"] ?? 0)
              : (counts[f.id] ?? 0);
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-[var(--aui-brand-asurion-purple)] text-[var(--aui-brand-white)]"
                  : "bg-[var(--aui-surface-variant)] text-[var(--aui-on-surface)] hover:bg-[var(--aui-outline-soft)]"
              )}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      <TextField
        label="Search work orders"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by WO number or contact"
        className="w-full"
      />

      {filtered.length === 0 ? (
        <Text size={2} className="text-[var(--aui-on-surface-soft)]">
          No work orders match this filter.
        </Text>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((w) => (
            <li
              key={w.id}
              className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-4 py-4"
            >
              {/* Top row: WO number + status */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Text size={2} weight="heavy" className="tabular-nums">
                  {w.id}
                </Text>
                <Tag
                  text={workOrderStatusLabel(w.status)}
                  type={workOrderTagType(w.status)}
                  size="small"
                  family="soft"
                />
              </div>

              {/* Device */}
              <div className="mt-2.5 flex items-center gap-2">
                <Icon.Phosphor
                  name={deviceIcon(w.deviceType)}
                  size="small"
                  className="shrink-0 text-[var(--aui-on-surface-soft)]"
                />
                <Text size={2}>{w.deviceLabel}</Text>
              </div>

              {/* Meta rows */}
              <div className="mt-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon.Phosphor name="user" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                  <Text size={1} className="text-[var(--aui-on-surface-soft)]">{w.contactName}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Icon.Phosphor name="calendar-blank" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                  <Text size={1} className="text-[var(--aui-on-surface-soft)]">{formatWorkOrderCreatedAt(w.createdAt)}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <Icon.Phosphor name="tag" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                  <Tag text={w.program} type="gray" size="small" family="soft" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InvoicesPanel({ invoices }: { invoices: ProfileInvoice[] }) {
  if (invoices.length === 0) {
    return (
      <Text size={2} className="text-[var(--aui-on-surface-soft)]">
        No invoices on file.
      </Text>
    );
  }

  return (
    <div className="overflow-x-auto rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)]">
      <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--aui-outline-soft)]">
            {["Invoice", "Date", "Description", "Amount", "Status"].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-xs font-medium text-[var(--aui-on-surface-soft)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="border-b border-[var(--aui-outline-soft)] last:border-b-0"
            >
              <td className="px-3 py-3 font-medium">{inv.id}</td>
              <td className="px-3 py-3 tabular-nums text-[var(--aui-on-surface-soft)]">
                {formatDisplayDate(inv.date)}
              </td>
              <td className="px-3 py-3">{inv.description}</td>
              <td className="px-3 py-3 tabular-nums">
                {formatCurrency(inv.amount)}
              </td>
              <td className="px-3 py-3">
                <Tag
                  text={
                    inv.status === "paid"
                      ? "Paid"
                      : inv.status === "open"
                        ? "Open"
                        : "Overdue"
                  }
                  type={
                    inv.status === "paid"
                      ? "success"
                      : inv.status === "open"
                        ? "update"
                        : "warn"
                  }
                  size="small"
                  family="soft"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactsPanel({ contacts }: { contacts: BusinessContact[] }) {
  return (
    <ul className="grid gap-[var(--aui-spacing-150)] sm:grid-cols-2">
      {contacts.map((c) => (
        <li
          key={c.id}
          className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]"
        >
          <Text size={2} weight="heavy">
            {c.name}
          </Text>
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
            {c.role}
          </Text>
          <Text size={2} className="mt-2">
            {c.phone}
          </Text>
          <Text size={2} className="text-[var(--aui-on-surface-soft)]">
            {c.email}
          </Text>
        </li>
      ))}
    </ul>
  );
}

function DevicesPanel({
  devices,
}: {
  devices: ReturnType<typeof historyForCustomer>;
}) {
  if (devices.length === 0) {
    return (
      <Text size={2} className="text-[var(--aui-on-surface-soft)]">
        No devices on file.
      </Text>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {devices.map((d) => (
        <li
          key={d.id}
          className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-4 py-4"
        >
          {/* Device icon + type */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--aui-border-radius-050)] bg-[var(--aui-surface-variant)]">
              <Icon.Phosphor
                name={deviceIcon(d.deviceType)}
                size="medium"
                className="text-[var(--aui-on-surface-soft)]"
              />
            </div>
            <div className="min-w-0">
              <Text size={2} weight="heavy" className="leading-snug">
                {d.make} {d.model}
              </Text>
              <Text size={1} className="capitalize text-[var(--aui-on-surface-soft)]">
                {d.deviceType.replace("-", " ")}
              </Text>
            </div>
          </div>

          {/* Identifiers */}
          <div className="mt-3 flex flex-col gap-1.5 border-t border-[var(--aui-outline-soft)] pt-3">
            {d.imei ? (
              <div className="flex items-center gap-2">
                <Icon.Phosphor name="hash" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  IMEI: <span className="tabular-nums text-[var(--aui-on-surface)]">{d.imei}</span>
                </Text>
              </div>
            ) : d.serial ? (
              <div className="flex items-center gap-2">
                <Icon.Phosphor name="hash" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  S/N: <span className="tabular-nums text-[var(--aui-on-surface)]">{d.serial}</span>
                </Text>
              </div>
            ) : null}
            {d.lastRepair ? (
              <div className="flex items-center gap-2">
                <Icon.Phosphor name="wrench" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">
                  Last repair: {d.lastRepair}
                </Text>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon.Phosphor name="wrench" size="small" className="shrink-0 text-[var(--aui-on-surface-soft)]" />
                <Text size={1} className="text-[var(--aui-on-surface-soft)]">No repairs on file</Text>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function NotesPanel({ notes }: { notes: ProfileNote[] }) {
  if (notes.length === 0) {
    return (
      <Text size={2} className="text-[var(--aui-on-surface-soft)]">
        No notes yet.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-[var(--aui-spacing-150)]">
      {notes.map((n) => (
        <li
          key={n.id}
          className="rounded-[var(--aui-border-radius-100)] border border-[var(--aui-outline-soft)] bg-[var(--aui-surface)] px-[var(--aui-spacing-300)] py-[var(--aui-spacing-200)]"
        >
          <Text size={1} className="text-[var(--aui-on-surface-soft)]">
            {formatDisplayDate(n.createdAt)} · {n.author}
          </Text>
          <Text size={2} className="mt-1 text-pretty">
            {n.body}
          </Text>
        </li>
      ))}
    </ul>
  );
}

function deviceIcon(type: DeviceType) {
  switch (type) {
    case "mobile":
      return "device-mobile";
    case "tablet":
      return "device-tablet";
    case "computer":
      return "laptop";
    case "wearable":
      return "watch";
    case "game-console":
      return "game-controller";
    case "hearable":
      return "headphones";
    default:
      return "device-mobile";
  }
}

function workOrderTagType(
  status: ProfileWorkOrderStatus
): "success" | "update" | "warn" | "gray" | "attention" {
  switch (status) {
    case "completed":
    case "ready-for-pickup":
      return "success";
    case "started":
    case "ready-for-work":
      return "update";
    case "needs-update":
    case "waiting":
      return "warn";
    default:
      return "gray";
  }
}

function EmptyProfile({ onBack }: { onBack: () => void }) {
  return (
    <div className="mx-auto max-w-3xl px-[var(--aui-spacing-400)] py-[var(--aui-spacing-500)]">
      <Text size={3} weight="heavy">
        Customer not found
      </Text>
      <Action
        type="button"
        variant="outline"
        className="mt-[var(--aui-spacing-300)]"
        onClick={onBack}
      >
        Back to dashboard
      </Action>
    </div>
  );
}
