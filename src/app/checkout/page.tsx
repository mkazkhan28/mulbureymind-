"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MEMBERSHIP_PLANS
} from "@/lib/bds-content";
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  CreditCard,
  Building,
  Smartphone,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "plan-annual";
  const statusParam = searchParams.get("status");
  const txIdParam = searchParams.get("txId");

  const [selectedPlanId, setSelectedPlanId] = useState(planParam);
  const [paymentMethod, setPaymentMethod] = useState<"jazzcash" | "easypaisa" | "card" | "ibft">("jazzcash");
  const [studentName, setStudentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [collegeName, setCollegeName] = useState("DIKIOHS (Dow University)");
  const [bankRefNumber, setBankRefNumber] = useState("");
  const [copiedBank, setCopiedBank] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(statusParam === "success");
  const [transactionId, setTransactionId] = useState(txIdParam || "");

  const currentPlan = MEMBERSHIP_PLANS.find((p) => p.id === selectedPlanId) || MEMBERSHIP_PLANS[2];

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleCompletePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          studentPhone: mobileNumber,
          planId: currentPlan.id,
          paymentMethod,
        }),
      });

      const data = await response.json();
      setTimeout(() => {
        const generatedTxId = data.orderId || `TXN-DUHS-${Math.floor(100000 + Math.random() * 900000)}`;
        setTransactionId(generatedTxId);
        setIsProcessing(false);
        setIsSuccess(true);
      }, 1000);
    } catch {
      setTimeout(() => {
        setTransactionId(`TXN-DUHS-${Math.floor(100000 + Math.random() * 900000)}`);
        setIsProcessing(false);
        setIsSuccess(true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8 sm:py-14 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {!isSuccess ? (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/70 px-3.5 py-1 rounded-full border border-cyan-800/60 shadow-sm">
                DUHS Student Gateway Checkout
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Complete Your DUHS 1st Year Membership
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Instant access to verified DUHS BCQs, interactive quizzes, and clinical notes.
              </p>
            </div>

            {/* Test Mode Notification */}
            <div className="bg-indigo-950/60 border border-indigo-700/60 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-200 shadow-xl">
              <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-white">Safe Pakistani Payment Simulator Active:</span>
                <p className="leading-relaxed text-slate-300">
                  You can test the complete checkout workflow safely. No actual PKR charges will be deducted from your bank or mobile wallet during this demonstration phase.
                </p>
              </div>
            </div>

            <form onSubmit={handleCompletePayment} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Student Details & Payment Provider */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Student Info Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                    Student Identification
                  </h2>
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Ayesha Khan"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        Dental College / Institute *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DIKIOHS, Dow Dental College, or DIDC"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1.5">
                        WhatsApp / Mobile Number (Pakistan) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0300-1234567"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-700/80 bg-slate-950/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Methods Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                    Select Payment Gateway
                  </h2>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("jazzcash")}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        paymentMethod === "jazzcash"
                          ? "border-rose-500/80 bg-rose-950/40 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500"
                          : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">JazzCash</div>
                        <div className="text-[10px] text-slate-400">Mobile Account / MPIN</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("easypaisa")}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        paymentMethod === "easypaisa"
                          ? "border-emerald-500/80 bg-emerald-950/40 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500"
                          : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Easypaisa</div>
                        <div className="text-[10px] text-slate-400">Instant Wallet Approval</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-indigo-500/80 bg-indigo-950/40 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500"
                          : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Debit / Credit Card</div>
                        <div className="text-[10px] text-slate-400">PayPak, Visa, Master</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ibft")}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center gap-3 cursor-pointer ${
                        paymentMethod === "ibft"
                          ? "border-cyan-500/80 bg-cyan-950/40 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500"
                          : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                      }`}
                    >
                      <Building className="w-5 h-5 text-cyan-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Direct Bank Transfer</div>
                        <div className="text-[10px] text-slate-400">Raast / IBFT</div>
                      </div>
                    </button>
                  </div>

                  {/* Payment Details per method */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl text-xs text-slate-300 border border-slate-850 space-y-2">
                    {paymentMethod === "jazzcash" && (
                      <p className="leading-relaxed">
                        📱 <strong className="text-white">JazzCash Mobile Account:</strong> After clicking Proceed, a payment authorization USSD push will appear on your phone asking for your 4-digit secret MPIN.
                      </p>
                    )}
                    {paymentMethod === "easypaisa" && (
                      <p className="leading-relaxed">
                        📱 <strong className="text-white">Easypaisa Mobile Account:</strong> Approve the transaction prompt in your Easypaisa application within 60 seconds to complete activation.
                      </p>
                    )}
                    {paymentMethod === "card" && (
                      <p className="leading-relaxed">
                        💳 <strong className="text-white">Pakistani Debit / Credit Card:</strong> 3D-Secure 2.0 protected. You will receive an SMS OTP from your issuing Pakistani bank (Habib Bank, Meezan, Bank Alfalah, etc.).
                      </p>
                    )}
                    {paymentMethod === "ibft" && (
                      <div className="space-y-2.5">
                        <div className="font-bold text-white">Bank Deposit Instructions:</div>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] space-y-1.5">
                          <div><strong className="text-slate-400">Bank:</strong> <span className="text-white">Meezan Bank Islamic Ltd</span></div>
                          <div><strong className="text-slate-400">Account Title:</strong> <span className="text-white">BDS Study Hub Educational Services</span></div>
                          <div className="flex items-center justify-between">
                            <span><strong className="text-slate-400">IBAN:</strong> <span className="text-white font-mono">PK88MEZN0001020304050607</span></span>
                            <button
                              type="button"
                              onClick={() => handleCopyIban("PK88MEZN0001020304050607")}
                              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              {copiedBank ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedBank ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <div><strong className="text-slate-400">Raast ID:</strong> <span className="text-white font-mono">03001234567</span></div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-300 mb-1">
                            Deposit Transaction ID / Bank Reference *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. IBFT-84920491 or Branch Slip #"
                            value={bankRefNumber}
                            onChange={(e) => setBankRefNumber(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Order Summary
                  </h2>

                  {/* Plan Switcher */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400">
                      Selected Plan:
                    </label>
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                    >
                      {MEMBERSHIP_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — PKR {p.pricePKR.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Plan Duration</span>
                      <span className="font-semibold text-white">{currentPlan.periodText}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Curriculum Focus</span>
                      <span className="font-semibold text-cyan-400">DUHS 1st Year (6 Subjects)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Gateway Fee</span>
                      <span className="font-semibold text-emerald-400">PKR 0 (Free)</span>
                    </div>
                    <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-extrabold text-white">
                      <span>Total Amount:</span>
                      <span className="text-cyan-300 text-base">
                        PKR {currentPlan.pricePKR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span>Verifying with {paymentMethod.toUpperCase()}...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay PKR {currentPlan.pricePKR.toLocaleString()} & Activate</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>State Bank of Pakistan Compliant Gateways</span>
                  </div>
                </div>
              </div>

            </form>
          </div>
        ) : (
          /* SUCCESS CONFIRMATION SCREEN */
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 sm:p-12 shadow-2xl text-center space-y-6 max-w-xl mx-auto animate-fadeIn">
            <div className="w-18 h-18 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-950/70 px-3.5 py-1 rounded-full border border-emerald-700/60 shadow-sm">
                Payment Verified & Activated
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome to DUHS BDS Study Hub!
              </h2>
              <p className="text-xs text-slate-300">
                Your subscription to <strong className="text-white">{currentPlan.name}</strong> is now live on your account.
              </p>
            </div>

            <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold text-white">{studentName || "Dr. Ayesha Khan"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Dental College:</span>
                <span className="font-semibold text-white">{collegeName || "DIKIOHS (Dow University)"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Reference:</span>
                <span className="font-mono font-bold text-cyan-400">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway Provider:</span>
                <span className="font-semibold text-white uppercase">{paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold text-xs shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Go to My Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] text-slate-400 flex items-center justify-center text-xs">
          Loading Checkout...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
