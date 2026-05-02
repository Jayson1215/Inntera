import React, { useEffect, useState } from 'react';

import { DollarSign, TrendingUp, Calendar, ArrowUpRight, Download, Activity, ShieldCheck } from 'lucide-react';
import { dashboardService } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export function AdminReports() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await dashboardService.getAnalytics();
        if (res.success && res.data) {
          setData(res.data);
        } else {
          toast.error('Failed to load analytics data');
        }
      } catch (err) {
        toast.error('Error connecting to analytics service');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-slate-900 font-medium">
      <Activity className="w-8 h-8 text-slate-900 animate-spin mb-4" />
      Compiling Reports...
    </div>
  );
  if (!data) return null;

  return (
    <div className="space-y-8 p-4 md:p-8 -m-4 md:-m-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest">Analytics</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Financial Intelligence</h1>
          <p className="text-sm font-bold text-slate-900 mt-1">Real-time revenue metrics and property operations.</p>
        </div>
        <div className="flex gap-3">

          <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-[1rem] h-12 px-6 shadow-xl shadow-slate-900/20 font-bold transition-all"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-slate-900 shadow-sm flex flex-col justify-between group transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white text-indigo-600 rounded-[1.25rem] border border-indigo-100 shadow-sm"><DollarSign className="w-6 h-6" /></div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><ArrowUpRight className="w-3 h-3" /> +12.5%</div>
          </div>
          <div>
            <p className="text-slate-900 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">₱{data.summary.total_revenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-[2rem] border border-slate-900 shadow-sm flex flex-col justify-between group transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white text-emerald-600 rounded-[1.25rem] border border-emerald-100 shadow-sm"><TrendingUp className="w-6 h-6" /></div>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full"><ArrowUpRight className="w-3 h-3" /> +5.2%</div>
          </div>
          <div>
            <p className="text-slate-900 text-[10px] font-black uppercase tracking-widest mb-1">Avg. Booking Value</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">₱{Math.round(data.summary.avg_booking_value).toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-[2rem] border border-slate-900 shadow-sm flex flex-col justify-between group transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white text-blue-600 rounded-[1.25rem] border border-blue-100 shadow-sm"><Calendar className="w-6 h-6" /></div>
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full"><ArrowUpRight className="w-3 h-3 rotate-180" /> -2.1%</div>
          </div>
          <div>
            <p className="text-slate-900 text-[10px] font-black uppercase tracking-widest mb-1">Total Bookings</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">{data.summary.total_bookings.toLocaleString()}</h3>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-[2rem] border border-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Audit Logs</h3>
              <p className="text-slate-900 text-xs font-bold mt-0.5">Recent payment settlements and status transitions.</p>
            </div>
          </div>
          <Button variant="ghost" className="font-bold text-[10px] rounded-xl tracking-widest uppercase">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-bold border-collapse">
            <thead className="bg-slate-50/80 text-[10px] text-slate-900 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5 border border-slate-900">Timestamp</th>
                <th className="px-8 py-5 border border-slate-900">Reference</th>
                <th className="px-8 py-5 border border-slate-900">Method</th>
                <th className="px-8 py-5 border border-slate-900">Amount</th>
                <th className="px-8 py-5 text-center border border-slate-900">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { t: '10:42 AM', r: 'BK-921', m: 'GCash', a: '₱4,500', s: 'Verified', c: 'emerald' },
                { t: '09:15 AM', r: 'BK-845', m: 'Cash', a: '₱2,200', s: 'Paid', c: 'indigo' },
                { t: '08:30 AM', r: 'BK-712', m: 'Maya', a: '₱5,800', s: 'Pending', c: 'amber' }
              ].map((l, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-slate-900 font-medium border border-slate-900">{l.t}</td>
                  <td className="px-8 py-5 text-slate-900 border border-slate-900">{l.r}</td>
                  <td className="px-8 py-5 text-slate-900 uppercase text-xs border border-slate-900">{l.m}</td>
                  <td className="px-8 py-5 text-slate-900 text-base border border-slate-900">{(l.a)}</td>
                  <td className="px-8 py-5 text-center border border-slate-900">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${l.c === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : l.c === 'indigo' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                      {l.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
