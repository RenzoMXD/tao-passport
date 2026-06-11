import type { ReputationSignal } from '@tao-passport/shared-types';

export function TrustBreakdown({ signals }: { signals: ReputationSignal[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-semibold text-white">Reputation Signals</h2>
      <div className="mt-5 space-y-4">
        {signals.map((signal) => (
          <div key={signal.name}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-200">{signal.name}</span>
              <span className="text-blue-200">{signal.score}/100</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${signal.score}%` }} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>Source {signal.provenance.sourceCategory}</span>
              <span>Confidence {signal.provenance.confidence}</span>
              <span>Observed {new Date(signal.provenance.observedAt).toLocaleDateString()}</span>
              <span>Model {signal.provenance.scoringModelVersion}</span>
              <span>Ref {signal.provenance.reference ?? signal.provenance.sourceId}</span>
            </div>
            {signal.provenance.evidenceLinks && signal.provenance.evidenceLinks.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-3 text-xs">
                {signal.provenance.evidenceLinks.map((link) => (
                  <a
                    key={`${signal.name}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-300 transition hover:text-blue-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
