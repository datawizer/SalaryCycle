import React from 'react';
import { Plus, Check, Clock, Calendar, AlertCircle, Trash2, ShieldCheck } from 'lucide-react';
import { BillItem, formatCurrency } from '../utils/cycleCalculations';

interface BillsViewProps {
  bills: BillItem[];
  currencySymbol: string;
  pendingTotal: number;
  paidTotal: number;
  nextPayday: string;
  onOpenBillModal: () => void;
  onToggleBillPaid: (id: string) => void;
  onDeleteBill: (id: string) => void;
}

export const BillsView: React.FC<BillsViewProps> = ({
  bills,
  currencySymbol,
  pendingTotal,
  paidTotal,
  nextPayday,
  onOpenBillModal,
  onToggleBillPaid,
  onDeleteBill,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 pb-20 space-y-4">
      {/* Header and Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white">Scheduled Bills</h1>
          <p className="text-xs text-slate-400">Bills to pay before payday ({nextPayday})</p>
        </div>

        <button
          onClick={onOpenBillModal}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bill</span>
        </button>
      </div>

      {/* Reserved Shield Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 shadow-md">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Bill Protection Reserve
            </span>
            <div className="text-2xl font-black text-white mt-0.5">
              {formatCurrency(pendingTotal, currencySymbol)}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              This amount is locked out of your daily safe-to-spend allowance so you never miss rent or bills.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Unpaid Bills</span>
            <span className="text-sm font-bold text-amber-400">
              {formatCurrency(pendingTotal, currencySymbol)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Settled this Cycle</span>
            <span className="text-sm font-bold text-emerald-400">
              {formatCurrency(paidTotal, currencySymbol)}
            </span>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>All Cycle Bills ({bills.length})</span>
          <span>Tap checkmark to toggle paid</span>
        </div>

        {bills.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-300">No scheduled bills yet</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Add your monthly rent, electric, or subscription to protect your allowance.
            </p>
          </div>
        ) : (
          bills.map((bill) => {
            return (
              <div
                key={bill.id}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between group ${
                  bill.isPaid
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-75'
                    : 'bg-slate-900 border-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Mark Paid Toggle Button */}
                  <button
                    onClick={() => onToggleBillPaid(bill.id)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                      bill.isPaid
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'bg-slate-950 border-slate-700 text-transparent hover:border-emerald-400'
                    }`}
                    aria-label={`Mark ${bill.title} as ${bill.isPaid ? 'unpaid' : 'paid'}`}
                  >
                    <Check className={`w-4 h-4 stroke-[3] ${bill.isPaid ? 'block' : 'opacity-0 hover:opacity-50'}`} />
                  </button>

                  <div>
                    <h3
                      className={`text-xs font-bold leading-snug ${
                        bill.isPaid ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {bill.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                        {bill.category}
                      </span>
                      <span>Due: {bill.dueDate}</span>
                      {bill.isPaid ? (
                        <span className="text-emerald-400 font-semibold">• Paid</span>
                      ) : (
                        <span className="text-amber-400 font-semibold">• Pending</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-sm font-extrabold ${
                      bill.isPaid ? 'text-slate-500' : 'text-amber-400'
                    }`}
                  >
                    {formatCurrency(bill.amount, currencySymbol)}
                  </span>
                  <button
                    onClick={() => onDeleteBill(bill.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Delete bill"
                    aria-label={`Delete ${bill.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
