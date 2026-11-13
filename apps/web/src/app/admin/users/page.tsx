import type { Metadata } from 'next';
import { Badge, Panel } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Users' };

type UserStatus = 'Active' | 'Suspended' | 'Banned';

const users: { name: string; email: string; role: string; status: UserStatus; flags: number }[] = [
  { name: 'Alex Rivera', email: 'alex@bidnest.app', role: 'Buyer', status: 'Active', flags: 0 },
  { name: 'Meridian Collectibles', email: 'desk@meridian.watch', role: 'Seller', status: 'Active', flags: 0 },
  { name: 'QuickFlip99', email: 'qnflip@mail.com', role: 'Buyer', status: 'Suspended', flags: 3 },
  { name: 'Studio Volt', email: 'studio.volt@bidnest.app', role: 'Seller', status: 'Active', flags: 0 },
  { name: 'Sniper Kevin', email: 'k.ev@nobody.com', role: 'Buyer', status: 'Banned', flags: 7 },
];

const tone = { Active: 'good', Suspended: 'warn', Banned: 'bad' } as const;

export default function UsersPage() {
  return (
    <Panel title="Accounts">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-ink/45">
              <th className="pb-3 pr-4 font-medium">User</th>
              <th className="pb-3 pr-4 font-medium">Role</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
              <th className="pb-3 pr-4 font-medium">Non-payment flags</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {users.map((u) => (
              <tr key={u.email}>
                <td className="py-3.5 pr-4">
                  <p className="font-medium text-ink">{u.name}</p>
                  <p className="text-xs text-ink/45">{u.email}</p>
                </td>
                <td className="py-3.5 pr-4 text-ink/70">{u.role}</td>
                <td className="py-3.5 pr-4">
                  <Badge tone={tone[u.status]}>{u.status}</Badge>
                </td>
                <td className="py-3.5 pr-4 tabular-nums text-ink/70">{u.flags}</td>
                <td className="py-3.5">
                  <button
                    type="button"
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink/60 transition hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Ban
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
