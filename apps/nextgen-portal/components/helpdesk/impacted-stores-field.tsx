"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ManualSelectionChips,
  PredictiveTextField,
} from "@asurion-core/mx-asurion-ui-react";
import {
  SAMPLE_STORES,
  storesByType,
  type ClosureType,
  type ImpactScope,
  type SampleStore,
} from "@/lib/store-closures-data";

type StoreSuggestion = {
  id: string;
  header: string;
  subHeader: string;
  value: string;
};

const TEMP_SEGMENTS: { value: ImpactScope; label: string }[] = [
  { value: "specific", label: "Specific" },
  { value: "all-corporate", label: "Corporate" },
  { value: "all-franchise", label: "Franchise" },
  { value: "all-stores", label: "All" },
];

type ImpactedStoresFieldProps = {
  closureType: ClosureType;
  impactScope: ImpactScope;
  selectedStores: SampleStore[];
  onImpactScopeChange: (scope: ImpactScope) => void;
  onSelectedStoresChange: (stores: SampleStore[]) => void;
};

export function ImpactedStoresField({
  closureType,
  impactScope,
  selectedStores,
  onImpactScopeChange,
  onSelectedStoresChange,
}: ImpactedStoresFieldProps) {
  const [query, setQuery] = useState("");

  const isPermanent = closureType === "permanent";
  const showCombobox = isPermanent || impactScope === "specific";

  useEffect(() => {
    setQuery("");
  }, [closureType, impactScope]);

  const suggestions = useMemo<StoreSuggestion[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const selectedIds = new Set(selectedStores.map((s) => s.storeId));
    return SAMPLE_STORES.filter(
      (s) =>
        !selectedIds.has(s.storeId) &&
        `${s.storeName} ${s.storeId}`.toLowerCase().includes(q)
    )
      .slice(0, 8)
      .map((store) => ({
        id: store.storeId,
        header: store.storeName,
        subHeader: `#${store.storeId} · ${store.storeType}`,
        value: store.storeId,
      }));
  }, [query, selectedStores]);

  const bulkCount = useMemo(() => {
    if (impactScope === "all-corporate") return storesByType("corporate").length;
    if (impactScope === "all-franchise") return storesByType("franchise").length;
    if (impactScope === "all-stores") return SAMPLE_STORES.length;
    return 0;
  }, [impactScope]);

  const bulkSummary = useMemo(() => {
    if (impactScope === "all-corporate") {
      return `Includes ${bulkCount} corporate store${bulkCount === 1 ? "" : "s"}.`;
    }
    if (impactScope === "all-franchise") {
      return `Includes ${bulkCount} franchise store${bulkCount === 1 ? "" : "s"}.`;
    }
    if (impactScope === "all-stores") {
      return `Includes all ${bulkCount} corporate and franchise stores.`;
    }
    return null;
  }, [impactScope, bulkCount]);

  function selectStore(store: SampleStore) {
    if (selectedStores.some((s) => s.storeId === store.storeId)) {
      onImpactScopeChange("specific");
      setQuery("");
      return;
    }
    onImpactScopeChange("specific");
    onSelectedStoresChange([...selectedStores, store]);
    setQuery("");
  }

  function removeStore(store: SampleStore) {
    onSelectedStoresChange(
      selectedStores.filter((s) => s.storeId !== store.storeId)
    );
  }

  function handleSuggestionSelect(suggestion: StoreSuggestion) {
    const store = SAMPLE_STORES.find((s) => s.storeId === suggestion.id);
    if (store) selectStore(store);
  }

  return (
    <div className="flex flex-col gap-[var(--aui-spacing-200)]">
      {!isPermanent ? (
        <ManualSelectionChips
          size="small"
          type="selection"
          layout="wrap"
          aria-label="Impacted store scope"
          chips={TEMP_SEGMENTS.map((segment) => ({
            label: segment.label,
            isSelected: impactScope === segment.value,
            onClick: () => onImpactScopeChange(segment.value),
          }))}
        />
      ) : null}

      {!showCombobox && bulkSummary ? (
        <p className="text-sm text-[var(--aui-on-surface-soft)]">{bulkSummary}</p>
      ) : null}

      {showCombobox ? (
        <div className="relative z-[110] flex flex-col gap-[var(--aui-spacing-200)]">
          <PredictiveTextField
            label="Search store"
            value={query}
            handleChange={setQuery}
            iconName="magnifying-glass"
            suggestions={suggestions}
            shouldFilterSuggestions={false}
            maxSuggestionsToShow={8}
            includeSubheader
            alertNoResults
            noResultsText={
              query.trim()
                ? `No stores match “${query.trim()}”.`
                : "No stores found."
            }
            onSelection={handleSuggestionSelect}
            maxHeight="12rem"
            className="relative z-[110]"
          />

          {selectedStores.length > 0 ? (
            <ManualSelectionChips
              size="small"
              type="filter"
              layout="wrap"
              chips={selectedStores.map((store) => ({
                label: `${store.storeName} (#${store.storeId})`,
                isSelected: true,
                onClick: () => removeStore(store),
              }))}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
