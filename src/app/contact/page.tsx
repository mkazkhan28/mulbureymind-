"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("general");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>DUHS Academic & Student Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact & Academic Support
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about your DUHS BDS 1st Year access, want to report a BCQ discrepancy, or need batch discounts? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Support Channels
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">WhatsApp Student Helpline</div>
                    <div className="text-slate-500 mt-0.5">+92 300 0000000</div>
                    <div className="text-[10px] text-blue-700 font-medium">Mon - Sat (9 AM - 9 PM)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Academic & Verification Email</div>
                    <div className="text-slate-500 mt-0.5">support@bdsstudyhub.pk</div>
                    <div className="text-[10px] text-slate-500">Response within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Account Activation Assistance</div>
                    <div className="text-slate-500 mt-0.5">Instant via JazzCash / Easypaisa</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 text-xs shadow-md">
              <div className="font-bold text-sm text-blue-400">
                Are you a Class Representative (CR/GR)?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Contact us for batch registrations of 15+ dental students across DIKIOHS, DDC, or DIDC to receive customized college discount packages.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm text-slate-700">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Send Us a Message
                  </h2>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Fatima Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="fatima@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="0300-1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="payment">JazzCash / Easypaisa Payment Assistance</option>
                      <option value="question-feedback">Suggest / Report a DUHS BCQ Correction</option>
                      <option value="batch">DUHS Batch / College Group Subscription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can our DUHS academic team help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-600/25 transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSending ? "Sending..." : "Submit Inquiry"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Message Received</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, {name}! Our DUHS academic support team will get back to you shortly via WhatsApp or email.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-800 hover:underline pt-2"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
