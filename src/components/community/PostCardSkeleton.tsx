export function PostCardSkeleton() {
  const shimmer =
    "animate-shimmer bg-gradient-to-r from-paper-2 via-line-faint to-paper-2"
  return (
    <div className="wf-box px-5 py-4">
      <div className="flex items-center gap-3">
        <div className={`${shimmer} size-8 rounded-full`} />
        <div className="space-y-1.5">
          <div className={`${shimmer} h-2.5 w-28 rounded`} />
          <div className={`${shimmer} h-2 w-16 rounded`} />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className={`${shimmer} h-4 w-3/4 rounded`} />
        <div className={`${shimmer} h-3 w-full rounded`} />
        <div className={`${shimmer} h-3 w-5/6 rounded`} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className={`${shimmer} h-3 w-8 rounded`} />
        <div className={`${shimmer} h-3 w-10 rounded`} />
        <div className={`${shimmer} ml-auto h-3 w-24 rounded`} />
      </div>
    </div>
  )
}
