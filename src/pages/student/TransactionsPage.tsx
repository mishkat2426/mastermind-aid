import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DBService } from '../../services/db';
import { Transaction, TransactionStatus } from '../../types/platform';
import { ShieldCheck, CheckCircle2, Clock, XCircle, RefreshCw, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../../components/layout/Footer';

export const TransactionsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [statusFilter, setStatusFilter] = useState<'ALL' | TransactionStatus>('ALL');
  const [search, setSearch] = useState('');

  const allTransactions = isAdmin
    ? DBService.getTransactions('ADMIN')
    : currentUser && currentUser.role === 'STUDENT'
    ? DBService.getTransactionsByUserId(currentUser.id, currentUser.id)
    : [];

  const filteredTransactions = allTransactions.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.transactionId.toLowerCase().includes(q) ||
        t.courseTitle.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (trxId: string, status: TransactionStatus) => {
    if (!isAdmin) return;
    DBService.updateTransactionStatus(trxId, status, currentUser?.name || 'Admin');
    window.location.reload();
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> SUCCESS</span>;
      case 'PENDING':
        return <span className="bg-amber-100 text-amber-800 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>;
      case 'FAILED':
        return <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> FAILED</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 text-[11px] font-black px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center items-center py-16 px-4 font-sans relative overflow-hidden">
        <div className="max-w-md w-full bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-9 h-9 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Authentication Required</h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Transaction ledgers contain confidential purchase details. Please log in or create an account to view your transaction records.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition text-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold text-xs rounded-xl transition text-center"
            >
              Create Account (Sign Up)
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link to="/" className="text-xs text-brand-400 hover:underline font-bold">
              ← Return to Mastermind AidIT Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.role === 'TEACHER') {
    return (
      <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-center items-center py-16 px-4 font-sans relative overflow-hidden">
        <div className="max-w-md w-full bg-[#0B1B33]/90 backdrop-blur-xl p-8 rounded-3xl border border-rose-500/40 shadow-2xl space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-xl">
            <ShieldCheck className="w-9 h-9 stroke-[2]" />
          </div>
          <h2 className="text-xl font-black">Access Denied</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Instructor accounts do not have authorization to access platform financial transactions. Please visit your Instructor CMS Dashboard to manage your courses.
          </p>
          <div className="pt-2">
            <Link
              to="/teacher/dashboard"
              className="inline-block py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
            >
              Go to Instructor Dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-[#0A192F] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-brand-400 font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-brand-400 bg-brand-500/20 px-3 py-1 rounded-full border border-brand-400/30">
                {isAdmin ? 'Admin Transaction Ledger' : 'Payment History & Invoices'}
              </span>
              <h1 className="text-3xl font-black mt-1">
                {isAdmin ? 'Platform-Wide Transactions' : 'Your Order & Transaction Records'}
              </h1>
            </div>

            <div className="bg-white/10 p-3 rounded-2xl border border-white/10 text-xs font-bold text-slate-200">
              Total Recorded: <strong className="text-emerald-400 font-black">{allTransactions.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-6">
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by TrxID, course, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  statusFilter === st
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4 px-6">Transaction ID</th>
                  <th className="p-4">Course</th>
                  {isAdmin && <th className="p-4">User</th>}
                  <th className="p-4">Amount</th>
                  <th className="p-4">Gateway</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  {isAdmin && <th className="p-4 px-6 text-right">Admin Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 6} className="p-8 text-center text-slate-400">
                      No transaction records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4 px-6 font-mono font-bold text-slate-800">
                        {t.transactionId}
                      </td>
                      <td className="p-4 font-bold text-[#0A192F] max-w-xs truncate">
                        {t.courseTitle}
                      </td>
                      {isAdmin && (
                        <td className="p-4">
                          <div className="font-bold text-slate-800">{t.userName}</div>
                          <div className="text-[10px] text-slate-400">{t.userEmail}</div>
                        </td>
                      )}
                      <td className="p-4 font-black text-slate-900">
                        ৳{t.amount.toLocaleString()} BDT
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                          {t.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-[11px]">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(t.status)}
                      </td>
                      {isAdmin && (
                        <td className="p-4 px-6 text-right space-x-1">
                          {t.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(t.id, 'SUCCESS')}
                                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(t.id, 'FAILED')}
                                className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <Footer onSelectCategory={() => {}} />

    </div>
  );
};
