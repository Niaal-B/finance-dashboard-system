import { clsx } from 'clsx';

const Skeleton = ({ className }) => (
  <div className={clsx('animate-pulse rounded-xl bg-white/5', className)} />
);

export const SkeletonCard = () => (
  <div className="glass rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>
    <Skeleton className="h-8 w-40" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-4">
    <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-24" />
    </div>
    <Skeleton className="h-5 w-20" />
  </div>
);

export default Skeleton;
