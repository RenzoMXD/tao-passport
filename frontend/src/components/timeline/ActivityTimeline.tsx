import type { TimelineEvent } from '@tao-passport/shared-types';

export function ActivityTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-xl font-semibold text-white">Wallet History</h2>
      <div className="mt-5 space-y-5">
        {events.map((event) => (
          <article key={event.id} className="border-l border-blue-400/40 pl-4">
            <p className="text-sm text-blue-200">{new Date(event.occurredAt).toLocaleDateString()}</p>
            <h3 className="mt-1 font-semibold text-white">{event.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{event.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>Source {event.provenance.sourceCategory}</span>
              <span>Observed {new Date(event.provenance.observedAt).toLocaleDateString()}</span>
              <span>Ref {event.provenance.reference ?? event.provenance.sourceId}</span>
            </div>
            {event.provenance.evidenceLinks && event.provenance.evidenceLinks.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-3 text-xs">
                {event.provenance.evidenceLinks.map((link) => (
                  <a
                    key={`${event.id}-${link.url}`}
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
          </article>
        ))}
      </div>
    </section>
  );
}
