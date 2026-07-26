export default function LandingGradient(
  { scale } :
  { scale?: number }
) {
  return (
    <div
    className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
      className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-200 bg-main rounded-full animate-pulse blur-3xl brightness-50 animate-duration-[4s]"
      style={{
        transform: `scale(${(scale ?? 100) / 100})`,
      }}>
        <div
        className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-100 bg-sky-600 rounded-full" />
        <div
        className="aspect-square block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-50 bg-sky-300 rounded-full" />
      </div>

      <div className="bg-linear-to-t to-transparent from-background w-screen h-20 left-0 bottom-0 absolute z-3 pointer-events-none" />
      <div className="bg-linear-to-b from-background to-transparent w-screen h-20 left-0 top-0 absolute z-3 pointer-events-none" />
    </div>
  )
}