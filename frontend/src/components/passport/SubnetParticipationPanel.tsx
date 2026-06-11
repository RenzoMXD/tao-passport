import type { SubnetParticipation } from '@tao-passport/shared-types';

export function SubnetParticipationPanel({ entries }: { entries: SubnetParticipation[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Subnet Participation</h2>
          <p className="mt-1 text-sm text-slate-300">Visible subnet roles, activity, contribution weight, and last-seen metadata.</p>
        </div>
        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-200">{entries.length} active</span>
      </div>
      <div className="mt-5 space-y-4">
        {entries.map((entry) => (
          <article key={`${entry.subnetId}-${entry.role}`} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">Subnet {entry.subnetId}</h3>
                <p className="mt-1 text-sm capitalize text-blue-200">{entry.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Contribution weight</p>
                <p className="font-semibold text-emerald-300">{Math.round(entry.contributionWeight * 100)}%</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{entry.recentActivity}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
              <span>Last seen {new Date(entry.lastSeenAt).toLocaleString()}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
