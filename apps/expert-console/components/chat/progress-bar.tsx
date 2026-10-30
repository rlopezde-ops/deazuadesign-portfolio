'use client'

/**
 * AUI determinate Progress Bar — "Step 1 of 2" style. Value is 0–1.
 */
export function ProgressBar({
  value,
  label,
  className = '',
}: {
  value: number
  label?: string
  className?: string
}) {
  const clamped = Math.max(0, Math.min(1, value))
  return (
    <div className={`progress-bar ${className}`.trim()}>
      {label ? <p className="progress-bar-label">{label}</p> : null}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={Math.round(clamped * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className="progress-bar-fill" style={{ width: `${clamped * 100}%` }} />
      </div>
    </div>
  )
}
