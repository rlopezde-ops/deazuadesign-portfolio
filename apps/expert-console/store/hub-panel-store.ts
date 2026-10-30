'use client'

import { create } from 'zustand'

export type HubPanelView = 'leaderboard'

export const HUB_PANEL_TITLES: Record<HubPanelView, string> = {
  leaderboard: 'Team leaderboard',
}

interface HubPanelState {
  view: HubPanelView | null
  togglePanel: (view: HubPanelView) => void
  closePanel: () => void
}

export const useHubPanelStore = create<HubPanelState>((set) => ({
  view: null,
  togglePanel: (view) => set((state) => ({ view: state.view === view ? null : view })),
  closePanel: () => set({ view: null }),
}))
