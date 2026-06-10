import type { TaoPassport } from '@tao-passport/shared-types';
import { AchievementGrid } from '../../components/achievements/AchievementGrid';
import { GitTensorContributionCards } from '../../components/gittensor/GitTensorContributionCards';
import { PassportCard } from '../../components/passport/PassportCard';
import { TrustBreakdown } from '../../components/reputation/TrustBreakdown';
import { ActivityTimeline } from '../../components/timeline/ActivityTimeline';

export function PassportPage({ passport }: { passport: TaoPassport | null }) {
  if (!passport) {
    return <main className="mx-auto max-w-6xl px-6 py-12 text-slate-300">Loading passport...</main>;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <PassportCard passport={passport} />
      <GitTensorContributionCards gitTensor={passport.gitTensor} />
      <AchievementGrid achievements={passport.achievements} />
      <div className="grid gap-8 lg:grid-cols-2">
        <TrustBreakdown signals={passport.reputationSignals} />
        <ActivityTimeline events={passport.timeline} />
      </div>
    </main>
  );
}
