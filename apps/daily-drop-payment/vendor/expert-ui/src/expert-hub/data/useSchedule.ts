// PROTOTYPE STAND-IN — not verbatim upstream. See prototype/DEVIATIONS.md.
// Upstream this is a @tanstack/react-query hook against /api/gamification/v1/schedule with a
// non-prod mock fallback. Here it returns production's own `getMockSchedule()` fixture
// synchronously. The exported types and `useSchedule()` signature are unchanged, so ScheduleView
// is untouched.
'use client'

import type { ScheduleEventData } from '@mantine/schedule'

import { useMemo } from 'react'

import type { ScheduleResponse } from './types'

import { getBusinessToday } from './businessDay'
import { getMockSchedule } from './mocks'
import { toScheduleEvents } from './scheduleEvents'
import { useDataFlags } from '~/prototype/state/usePrototypeState'

export interface ScheduleResult {
  schedule: ScheduleResponse | null
  events: ScheduleEventData[]
  date: string
  isLoading: boolean
  isError: boolean
  isMock: boolean
  hasShift: boolean
}

export interface UseScheduleOptions {
  enabled?: boolean
  reportScheduleReceived?: boolean
}

export function useSchedule({ enabled = true }: UseScheduleOptions = {}): ScheduleResult {
  const date = getBusinessToday()
  const { isLoading, isError, isEmpty } = useDataFlags()

  const schedule = useMemo(() => {
    if (!enabled || isLoading || isError) return null
    if (isEmpty) {
      return { employeeId: 'prototype', date, workStart: null, workEnd: null, blocks: [] }
    }
    return getMockSchedule(date)
  }, [enabled, isLoading, isError, isEmpty, date])

  const events = useMemo(() => toScheduleEvents(schedule), [schedule])
  const hasShift = !!schedule && (schedule.workStart != null || schedule.blocks.length > 0)

  return { schedule, events, date, isLoading, isError, isMock: schedule != null, hasShift }
}
