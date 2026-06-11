import type { TaoPassport } from '@tao-passport/shared-types';
import type { ReactNode } from 'react';
import { ArrowRight, Network, Shield, Sparkles } from 'lucide-react';
import { PassportCard } from '../../components/passport/PassportCard';

type HomePageProps = {
  passport: TaoPassport | null;
  onOpenPassport: () => void;
};

export function HomePage({ passport, onOpenPassport }: HomePageProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Bittensor reputation layer</p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-white md:text-7xl">
            Every TAO wallet deserves a story.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            TAO Passport turns wallet history, validator performance, subnet participation, governance activity, and
            community signals into portable reputation profiles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={onOpenPassport}
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-400"
            >
              View sample passport <ArrowRight size={18} />
            </button>
            <a
              href="https://bittensor.com/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/15 px-6 py-3 font-semibold text-slate-100 hover:bg-white/10"
            >
              Bittensor ecosystem
            </a>
          </div>
        </div>
        {passport ? <PassportCard passport={passport} /> : <SkeletonCard />}
      </section>
      <section className="mt-16 grid gap-4 md:grid-cols-3">
        <Feature icon={<Shield />} title="Trust Score" text="Aggregates durable on-chain and ecosystem signals into a transparent score." />
        <Feature icon={<Sparkles />} title="Achievements" text="Rewards validators, miners, voters, delegates, and long-term community contributors." />
        <Feature icon={<Network />} title="Subnet History" text="Builds a readable participation graph across Bittensor subnets and wallet roles." />
      </section>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="text-blue-300">{icon}</div>
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-slate-300">{text}</p>
    </article>
  );
}

function SkeletonCard() {
  return <div className="h-96 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />;
}
