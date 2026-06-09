'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  CurrencyDollarIcon, UsersIcon, CubeIcon, ShoppingBagIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b', PAID: '#10b981', SHIPPED: '#3b82f6',
  DELIVERED: '#6b7280', CANCELLED: '#ef4444',
};

const CATEGORY_COLORS = ['#ff5500','#3b82f6','#8b5cf6','#10b981','#f59e0b','#ec4899','#14b8a6'];

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `$${(n / 1_000).toFixed(1)}k`
  : `$${n.toFixed(0)}`;

const shortDate = (d: string) => {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
};

function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>;
  const up = pct >= 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 600, color: up ? '#10b981' : '#ef4444' }}>
      {up
        ? <ArrowTrendingUpIcon style={{ width: 12, height: 12 }} />
        : <ArrowTrendingDownIcon style={{ width: 12, height: 12 }} />
      }
      {Math.abs(pct)}% vs last 30d
    </span>
  );
}

const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: 'var(--muted)', margin: '0 0 6px' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0', fontWeight: 600 }}>
          {p.name}: {prefix}{typeof p.value === 'number' && prefix === '$' ? p.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ margin: 0, fontWeight: 600, color: 'var(--foreground)' }}>{name}: {value}</p>
    </div>
  );
};

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 24, ...style }}>
    {children}
  </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 20px', letterSpacing: '-0.2px' }}>{children}</p>
);

export default function AdminOverview() {
  const token = useAuthStore((s) => s.token);
  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[120, 320, 280, 220].map((h, i) => (
        <div key={i} className="skeleton" style={{ height: h, borderRadius: 16 }} />
      ))}
    </div>
  );

  const stats = [
    { label: 'Total revenue',  value: fmt(data?.revenue ?? 0),      icon: CurrencyDollarIcon, color: '#ff5500', trend: data?.trends?.revenue },
    { label: 'Total orders',   value: data?.totalOrders ?? 0,        icon: ShoppingBagIcon,    color: '#3b82f6', trend: data?.trends?.orders },
    { label: 'Products',       value: data?.totalProducts ?? 0,      icon: CubeIcon,           color: '#8b5cf6', trend: null },
    { label: 'Users',          value: data?.totalUsers ?? 0,         icon: UsersIcon,          color: '#10b981', trend: data?.trends?.users },
  ];

  // Combine revenue + orders into one series for dual-line chart
  const revenueOrders = (data?.dailyRevenue ?? []).map((r: any, i: number) => ({
    date:    shortDate(r.date),
    Revenue: r.value,
    Orders:  data?.dailyOrders?.[i]?.value ?? 0,
  }));

  const userGrowth = (data?.dailyUsers ?? []).map((r: any) => ({
    date:  shortDate(r.date),
    Users: r.value,
  }));

  const statusData = (data?.ordersByStatus ?? []).map((s: any) => ({
    name: s.status, value: s.count,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '0 0 4px' }}>Overview</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Last 30 days performance</p>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 14 }}>
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <Card key={label} style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 18, height: 18, color }} />
              </div>
              <TrendBadge pct={trend} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.8px', color: 'var(--foreground)', margin: '0 0 2px' }}>{value}</p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>{label}</p>
          </Card>
        ))}
      </div>

      {/* ── Revenue & Orders area chart ── */}
      <div style={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '24px 24px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f1f1', margin: '0 0 2px', letterSpacing: '-0.3px' }}>Revenue & Orders</p>
            <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Last 30 days</p>
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            {[{ color: '#ff5500', label: 'Revenue' }, { color: '#38bdf8', label: 'Orders' }].map(({ color, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: 12, color: '#888' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueOrders} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#ff5500" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#ff5500" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#38bdf8" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#555' }}
              axisLine={false} tickLine={false}
              interval={4} dy={10}
            />
            <YAxis
              yAxisId="rev"
              tick={{ fontSize: 11, fill: '#555' }}
              axisLine={false} tickLine={false}
              tickFormatter={(v) => fmt(v)}
              width={52}
            />
            <YAxis
              yAxisId="ord"
              orientation="right"
              tick={{ fontSize: 11, fill: '#555' }}
              axisLine={false} tickLine={false}
              width={28}
              allowDecimals={false}
            />

            <Tooltip
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div style={{ background: '#1a1d27', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', minWidth: 155 }}>
                    <p style={{ fontSize: 11, color: '#666', margin: '0 0 10px', fontWeight: 500 }}>{label}</p>
                    {payload.map((p: any) => (
                      <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.stroke, flexShrink: 0, boxShadow: `0 0 5px ${p.stroke}` }} />
                        <span style={{ fontSize: 12, color: '#888', flex: 1 }}>{p.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f1f1' }}>
                          {p.name === 'Revenue' ? `$${Number(p.value).toLocaleString()}` : p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Area
              yAxisId="rev"
              type="monotone"
              dataKey="Revenue"
              name="Revenue"
              stroke="#ff5500"
              strokeWidth={2.5}
              fill="url(#fillRevenue)"
              dot={false}
              activeDot={{ r: 4, fill: '#ff5500', stroke: '#0f1117', strokeWidth: 2 }}
            />
            <Area
              yAxisId="ord"
              type="monotone"
              dataKey="Orders"
              name="Orders"
              stroke="#38bdf8"
              strokeWidth={2.5}
              fill="url(#fillOrders)"
              dot={false}
              activeDot={{ r: 4, fill: '#38bdf8', stroke: '#0f1117', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Middle row: Order status donut + Category revenue bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 20 }}>

        {/* Order status donut */}
        <Card>
          <CardTitle>Orders by status</CardTitle>
          {statusData.length === 0
            ? <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No orders yet</p>
            : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                      dataKey="value" paddingAngle={3} stroke="none">
                      {statusData.map((s: any) => (
                        <Cell key={s.name} fill={STATUS_COLORS[s.name] ?? '#888'} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', justifyContent: 'center', marginTop: 8 }}>
                  {statusData.map((s: any) => (
                    <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[s.name] ?? '#888', flexShrink: 0 }} />
                      <span style={{ color: 'var(--muted)' }}>{s.name}</span>
                      <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )
          }
        </Card>

        {/* Revenue by category */}
        <Card>
          <CardTitle>Revenue by category</CardTitle>
          {(data?.categoryRevenue ?? []).length === 0
            ? <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.categoryRevenue} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => fmt(v)} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip prefix="$" />} />
                  <Bar dataKey="revenue" radius={[0, 6, 6, 0]} name="Revenue">
                    {(data.categoryRevenue ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>
      </div>

      {/* ── User growth line + Top products bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* User signups */}
        <Card>
          <CardTitle>New user signups — last 30 days</CardTitle>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={userGrowth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={2.5} dot={false} name="Signups" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top products by units sold */}
        <Card>
          <CardTitle>Top products by units sold</CardTitle>
          {(data?.topProducts ?? []).length === 0
            ? <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '40px 0' }}>No data yet</p>
            : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.topProducts.map((p: any) => ({ name: p.name?.split(' ').slice(0, 2).join(' '), sold: p.sold ?? 0, revenue: p.revenue ?? 0 }))}
                  margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sold" name="Units sold" radius={[6, 6, 0, 0]}>
                    {(data.topProducts ?? []).map((_: any, i: number) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>
      </div>

      {/* ── Bottom row: Recent orders + Low stock warnings ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>

        {/* Recent orders */}
        <Card>
          <CardTitle>Recent orders</CardTitle>
          {(data?.recentOrders ?? []).length === 0
            ? <p style={{ fontSize: 13, color: 'var(--muted)' }}>No orders yet</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {data.recentOrders.map((o: any, i: number) => {
                  const color = STATUS_COLORS[o.status] ?? '#888';
                  return (
                    <div key={o.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 0',
                      borderBottom: i < data.recentOrders.length - 1 ? '1px solid var(--border-color)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>
                          {o.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>{o.user.name}</p>
                          <p style={{ fontSize: 11, color: 'var(--muted)', margin: '1px 0 0' }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>${Number(o.total).toFixed(2)}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${color}22`, color }}>
                          {o.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </Card>

        {/* Low stock */}
        <Card>
          <CardTitle>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ExclamationTriangleIcon style={{ width: 14, height: 14, color: '#f59e0b' }} />
              Low stock alerts
            </span>
          </CardTitle>
          {(data?.lowStock ?? []).length === 0
            ? <p style={{ fontSize: 13, color: '#10b981' }}>All products well stocked ✓</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.lowStock.map((p: any) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>{p.category}</p>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 20, flexShrink: 0,
                      background: p.stock === 0 ? '#fee2e2' : '#fef9c3',
                      color:      p.stock === 0 ? '#991b1b' : '#854d0e',
                    }}>
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
            )
          }
        </Card>
      </div>

    </div>
  );
}
