import { CallBarStatic } from '@/components/call-bar-static'

export default function StaticBarPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#545454] p-6">
      <div className="w-full max-w-[1460px]">
        <p className="mb-2 pl-1 text-[13px] text-white/60">Call bar</p>
        <CallBarStatic />
        <p className="mt-6 text-center text-xs text-white/30">
          Dev shortcut: press{' '}
          <kbd className="rounded border border-white/25 px-1.5 py-0.5 font-mono">F</kbd>{' '}
          to skip ahead ~10%
        </p>
      </div>
    </main>
  )
}
