'use client'

import { Fragment, type ReactNode } from 'react'

interface Props {
  script: string
  /** Substring of `script` that receives the karaoke highlight. Defaults to the full script. */
  verbatimText?: string
  /** Mandatory/compliance phrases underlined within the highlighted region. */
  emphasisPhrases?: readonly string[]
  /** 0→1 fraction of the verbatim region spoken. */
  progress: number
  className?: string
}

/** Word-boundary index nearest the progress point, so full words fill in (not partial ones). */
function karaokeSplitIndex(text: string, progress: number): number {
  if (progress <= 0) return 0
  if (progress >= 1) return text.length

  let index = Math.round(progress * text.length)
  while (index < text.length && text[index] !== ' ') index++
  return index
}

interface EmphasisRange {
  start: number
  end: number
}

function computeEmphasisRanges(region: string, phrases: readonly string[]): EmphasisRange[] {
  const found = phrases
    .map((phrase) => ({ start: region.indexOf(phrase), end: region.indexOf(phrase) + phrase.length }))
    .filter((range) => range.start >= 0)
    .sort((a, b) => a.start - b.start)

  const ranges: EmphasisRange[] = []
  let cursor = -1
  for (const range of found) {
    if (range.start >= cursor) {
      ranges.push(range)
      cursor = range.end
    }
  }
  return ranges
}

function renderRegionSlice(
  region: string,
  sliceStart: number,
  sliceEnd: number,
  ranges: readonly EmphasisRange[],
  keyPrefix: string,
): ReactNode {
  if (sliceStart >= sliceEnd) return null

  const nodes: ReactNode[] = []
  let cursor = sliceStart
  let key = 0
  for (const range of ranges) {
    const start = Math.max(range.start, sliceStart)
    const end = Math.min(range.end, sliceEnd)
    if (start >= end) continue
    if (start > cursor) {
      nodes.push(<Fragment key={`${keyPrefix}-${key++}`}>{region.slice(cursor, start)}</Fragment>)
    }
    nodes.push(
      <span key={`${keyPrefix}-${key++}`} className="sales-karaoke-emphasis">
        {region.slice(start, end)}
      </span>,
    )
    cursor = end
  }
  if (cursor < sliceEnd) {
    nodes.push(<Fragment key={`${keyPrefix}-${key++}`}>{region.slice(cursor, sliceEnd)}</Fragment>)
  }
  return nodes
}

function splitVerbatimRegion(
  script: string,
  verbatimText?: string,
): [before: string, region: string, after: string] {
  if (!verbatimText) return ['', script, '']
  const start = script.indexOf(verbatimText)
  if (start < 0) return ['', script, '']
  return [script.slice(0, start), verbatimText, script.slice(start + verbatimText.length)]
}

/**
 * Progressive spoken-word highlight for sales scripts.
 * Renders inline (no wrapping `<p>`) so it nests inside `Task.Verbatim`.
 */
export function SalesKaraokeText({
  script,
  verbatimText,
  emphasisPhrases,
  progress,
  className = '',
}: Props) {
  const [before, region, after] = splitVerbatimRegion(script, verbatimText)
  const spokenLen = karaokeSplitIndex(region, progress)
  const ranges = computeEmphasisRanges(region, emphasisPhrases ?? [])

  return (
    <span className={`sales-karaoke ${className}`.trim()}>
      {before}
      {spokenLen > 0 && (
        <span className="sales-karaoke-spoken">
          {renderRegionSlice(region, 0, spokenLen, ranges, 's')}
        </span>
      )}
      <span className="sales-karaoke-unspoken">
        {renderRegionSlice(region, spokenLen, region.length, ranges, 'r')}
      </span>
      {after}
    </span>
  )
}
