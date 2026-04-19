type AppCard = {
  title: string;
  description: string;
  path: string;
  status: 'live' | 'building' | 'planned';
};

const apps: AppCard[] = [
  {
    title: 'Wallet Health',
    description: 'Check token approvals for any Arc wallet. Spot risky unlimited approvals, revoke via Revoke.cash.',
    path: 'health',
    status: 'live',
  },
  {
    title: 'Wallet Dashboard',
    description: 'Activity, USDC spent, token balances, and NFTs for any Arc wallet.',
    path: 'wallet',
    status: 'live',
  },
  {
    title: 'ArcFlow',
    description: 'Bridge monitor + DEX tracker. Inflows, outflows, unique wallets, trading volume on Arc.',
    path: 'flow',
    status: 'live',
  },
  {
    title: 'ArcAudit',
    description: 'Web security scanner. Check any site for security headers, HTTPS, best practices. Free scan, paid on-chain proof.',
    path: 'audit',
    status: 'live',
  },
  {
    title: 'ArcPoll',
    description: 'On-chain polls. Create questions, vote with your wallet. Every vote is a verifiable transaction.',
    path: 'poll',
    status: 'live',
  },
  {
    title: 'Test Yourself',
    description: 'Science & math quiz — Geometry, Math, Physics, Biology, Chemistry. 100 questions, achievements.',
    path: 'quiz',
    status: 'live',
  },
  {
    title: 'Fantasy PL',
    description: 'Build your dream Premier League squad with a £100M budget. Live FPL data.',
    path: 'fantasy',
    status: 'live',
  },
  {
    title: 'Game Hub',
    description: '8 games — Hangman, Minesweeper, Snake, Tetris, Solo Test, Crossword, Checkers, Tower Defense.',
    path: 'games',
    status: 'live',
  },
  {
    title: 'GM Widget',
    description: 'Daily on-chain gm with streak tracking. Connect wallet, say gm, build your streak.',
    path: 'gm',
    status: 'live',
  },
  {
    title: 'ArcMint',
    description: 'AI-powered NFT generator. Describe your art, AI creates it, mint as NFT on Arc. 0.5 USDC.',
    path: 'mint',
    status: 'live',
  },
  {
    title: 'ArcTip',
    description: 'Send on-chain tips to anyone on Arc. Shareable tip links. No middleman.',
    path: 'tip',
    status: 'live',
  },
  {
    title: 'ArcSight',
    description: 'Community insight platform. Projects pay to ask, you earn points for answering.',
    path: 'arcsight',
    status: 'live',
  },
  {
    title: 'ArcPress',
    description: 'Decentralized blog on Arc. Read and collect articles as ERC-1155 NFTs. Apply to write.',
    path: 'arcpress',
    status: 'live',
  },
];

function StatusBadge({ status }: { status: AppCard['status'] }) {
  const styles =
    status === 'live'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : status === 'building'
      ? 'bg-amber-50 text-amber-700 ring-amber-200'
      : 'bg-arc-100 text-arc-600 ring-arc-200';
  const label = status === 'live' ? 'Live' : status === 'building' ? 'Building' : 'Planned';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {label}
    </span>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-arc-600/10 px-3 py-1 text-xs font-medium text-arc-600 ring-1 ring-inset ring-arc-600/20">
          <span className="h-1.5 w-1.5 rounded-full bg-arc-500" />
          Built for Arc — Circle&apos;s L1
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-arc-600 sm:text-6xl">
          Arc Suite
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-arc-700/70">
          A portfolio of small, focused apps for anyone using or building on Arc.
          Track wallets, play games, say gm on-chain, publish articles as NFTs, and more — all
          under one roof, all open source.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="https://github.com/erdemcrypto3/arcsuite"
            className="rounded-lg bg-arc-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-arc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arc-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <a
            href="https://arc.network"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-arc-600 ring-1 ring-inset ring-arc-200 hover:bg-arc-100 shadow-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            What is Arc? →
          </a>
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-arc-400">
          Apps in the suite
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <a
              key={app.path}
              href={app.status === 'live' ? `/${app.path}` : undefined}
              className={`group block rounded-xl bg-white p-5 ring-1 ring-inset ring-arc-200/60 shadow-sm transition ${
                app.status === 'live'
                  ? 'hover:shadow-md hover:ring-arc-500/30 cursor-pointer'
                  : 'opacity-70'
              }`}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-arc-600">{app.title}</h3>
                <StatusBadge status={app.status} />
              </div>
              <p className="mb-4 text-sm leading-relaxed text-arc-700/60">
                {app.description}
              </p>
              <div className="font-mono text-xs text-arc-500 group-hover:text-arc-500">
                /{app.path}
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="mt-24 border-t border-arc-200 pt-8 text-sm text-arc-400">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>
            Arc Suite · MIT license ·{' '}
            <a
              href="https://github.com/erdemcrypto3/arcsuite"
              className="hover:text-arc-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              erdemcrypto3/arcsuite
            </a>
          </span>
          <span>Not affiliated with Circle or the Arc Foundation.</span>
        </div>
      </footer>
    </main>
  );
}
