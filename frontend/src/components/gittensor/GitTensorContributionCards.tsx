import type { GitTensorActivity, GitTensorContributionSummary } from '@tao-passport/shared-types';
import { Clock, GitBranch, GitPullRequest } from 'lucide-react';

const freshnessLabel: Record<GitTensorContributionSummary['contributionFreshness'], string> = {
  fresh: 'Fresh',
  active: 'Active',
  stale: 'Stale',
};

const activityLabel: Record<GitTensorActivity['type'], string> = {
  commit: 'Commit',
  pull_request: 'Pull request',
  issue: 'Issue',
  review: 'Review',
};

export function GitTensorContributionCards({ gitTensor }: { gitTensor: GitTensorContributionSummary }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3 text-blue-200">
            <GitBranch className="size-5" />
            <h2 className="text-xl font-semibold text-white">GitTensor Contributions</h2>
          </div>
          <p className="mt-2 text-sm text-slate-300">
            Builder activity from repositories, pull requests, reviews, and issue work.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-200">
          <Clock className="size-4" />
          {freshnessLabel[gitTensor.contributionFreshness]}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Contributions" value={gitTensor.totalContributions.toString()} />
        <Metric label="Merged PRs" value={gitTensor.mergedPullRequests.toString()} />
        <Metric label="Last Active" value={formatDate(gitTensor.lastContributionAt)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Repositories</h3>
          <div className="mt-3 space-y-3">
            {gitTensor.repositories.map((repository) => (
              <a
                key={repository.name}
                className="block rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-blue-300/50 hover:bg-slate-900"
                href={repository.url}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <GitBranch className="size-4 text-blue-200" />
                  {repository.name}
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {repository.contributionCount} contributions - {repository.mergedPullRequests} merged PRs
                </p>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-300">Recent Activity</h3>
          <div className="mt-3 space-y-3">
            {gitTensor.recentActivity.map((activity) => (
              <article key={activity.id} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200">
                  <GitPullRequest className="size-4" />
                  <span>{activityLabel[activity.type]}</span>
                  <span>{formatDate(activity.occurredAt)}</span>
                </div>
                <h4 className="mt-2 font-medium text-white">{activity.title}</h4>
                <p className="mt-1 text-sm text-slate-300">{activity.repository}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
