"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  DownloadCloud
} from "lucide-react";

export default function SubscriptionPage() {
  const currentSubscription = {
    plan: "DUHS BDS 1st Year Full Session Pass",
    amount: "PKR 1,999",
    status: "Active",
    startDate: "October 19, 2026",
    renewalDate: "October 19, 2027",
    paymentMethod: "JazzCash Mobile Account"
  };

  const paymentHistory = [
    {
      id: "TXN-DUHS-948102",
      date: "Oct 19, 2026",
      plan: "DUHS BDS 1st Year Full Pass",
      amount: "PKR 1,999",
      method: "JazzCash",
      status: "Active",
      receiptUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Subscription & Payment History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your active DUHS membership plan and download official payment receipts.
          </p>
        </div>

        {/* Active Membership Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-200">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full uppercase">
                  {currentSubscription.status}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {currentSubscription.plan}
                </h2>
              </div>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              Change or Renew Plan
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div>
              <div className="text-slate-500 font-medium">Billed Amount</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentSubscription.amount}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Activation Date</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentSubscription.startDate}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Valid Until</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentSubscription.renewalDate}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Payment Provider</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{currentSubscription.paymentMethod}</div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Payment Receipts & Invoices
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="pb-3">Transaction ID</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {paymentHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-blue-700">{txn.id}</td>
                    <td className="py-3 text-slate-500">{txn.date}</td>
                    <td className="py-3 font-medium text-slate-900">{txn.plan}</td>
                    <td className="py-3 font-semibold text-slate-800">{txn.amount}</td>
                    <td className="py-3 text-slate-500">{txn.method}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for ${txn.id}`)}
                        className="text-blue-700 hover:text-blue-800 font-semibold underline inline-flex items-center gap-1"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
