"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  DownloadCloud
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <PageHeader
          eyebrow="Plan status"
          title="Subscription and payments"
          intro="Review your active membership plan and download your payment receipts."
          className="!pb-2"
        />

        {/* Active Membership Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-soft text-primary rounded-2xl border border-blue-500/30">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider text-primary bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase">
                  {currentSubscription.status}
                </span>
                <h2 className="text-lg font-bold text-ink mt-1">
                  {currentSubscription.plan}
                </h2>
              </div>
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold border border-slate-800 transition"
            >
              Change or Renew Plan
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-850 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Billed Amount</div>
              <div className="text-sm font-bold text-ink mt-0.5">{currentSubscription.amount}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Activation Date</div>
              <div className="text-sm font-bold text-ink mt-0.5">{currentSubscription.startDate}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Valid Until</div>
              <div className="text-sm font-bold text-ink mt-0.5">{currentSubscription.renewalDate}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Payment Provider</div>
              <div className="text-sm font-bold text-ink mt-0.5">{currentSubscription.paymentMethod}</div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-ink">
            Payment Receipts & Invoices
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold text-[10px]">
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
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {paymentHistory.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-950 transition">
                    <td className="py-3 font-mono font-bold text-primary">{txn.id}</td>
                    <td className="py-3 text-slate-400">{txn.date}</td>
                    <td className="py-3 font-medium text-ink">{txn.plan}</td>
                    <td className="py-3 font-semibold text-slate-100">{txn.amount}</td>
                    <td className="py-3 text-slate-400">{txn.method}</td>
                    <td className="py-3">
                      <span className="text-[10px] font-bold text-primary bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => alert(`Receipt downloaded for ${txn.id}`)}
                        className="text-primary hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline inline-flex items-center gap-1"
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
