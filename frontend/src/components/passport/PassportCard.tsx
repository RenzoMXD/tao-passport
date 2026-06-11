import type { TaoPassport } from '@tao-passport/shared-types';
import type { ReactNode } from 'react';
import { BadgeCheck, ShieldCheck, Trophy } from 'lucide-react';
import { shortenWallet } from '../../services/wallet';
import { scoreColor } from '../../utils/score';

type PassportCardProps = {
  passport: TaoPassport;
};

export function PassportCard({ passport }: PassportCardProps) {
  return (
    <section className="rounded-3xl border border-blue-400/30 bg-gradient-to-br from-slate-900 to-blue-950 p-6 shadow-2xl shadow-blue-950/40">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-blue-200">Wallet Passport</p>
          <h2 className="mt-3 text-3xl font-bold text-white">{shortenWallet(passport.walletAddress)}</h2>
          <p className="mt-2 max-w-xl text-slate-300">{passport.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-200">
            <Tag label={`Gov Votes ${passport.profileMetadata.governanceVotes}`} />
            <Tag label={`Subnets ${passport.profileMetadata.subnetsParticipated}`} />
            <Tag label={`Cache ${passport.profileMetadata.cache.source}`} />
            <Tag label={`TTL ${Math.round(passport.profileMetadata.cache.ttlMs / 60000)}m`} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Metric label="Level" value={passport.level.toString()} />
          <Metric label="Trust" value={passport.trustScore.toString()} emphasis />
          <Metric label="Years" value={passport.yearsActive.toFixed(1)} />
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Score icon={<ShieldCheck />} label="Validator Score" value={passport.validatorScore} />
        <Score icon={<Trophy />} label="Miner Score" value={passport.minerScore} />
        <Score icon={<BadgeCheck />} label="Community Score" value={passport.communityScore} />
      </div>
    </section>
  );
}

function Tag({ label }: { label: string }) {
  return <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{label}</span>;
}

function Metric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
      <p className="text-xs uppercase tracking-widest text-slate-300">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${emphasis ? scoreColor(Number(value)) : 'text-white'}`}>{value}</p>
    </div>
  );
}

function Score({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <div className="flex items-center gap-3 text-blue-200">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-800">
        <div className="h-2 rounded-full bg-blue-400" style={{ width: `${value}%` }} />
      </div>
      <p className={`mt-2 text-lg font-semibold ${scoreColor(value)}`}>{value}</p>
    </div>
  );
}
