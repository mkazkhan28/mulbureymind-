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
import PageHeader from "@/components/PageHeader";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <PageHeader
          eyebrow="Help & support"
          title="Contact and support"
          lead="We're here to help."
          intro="Questions about your access, a mistake in an MCQ, or group discounts — get in touch below."
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-6 text-slate-200">
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider">
                Support Channels
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-primary border border-blue-500/30 rounded-xl">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-ink">WhatsApp Student Helpline</div>
                    <div className="text-slate-400 mt-0.5">+92 300 0000000</div>
                    <div className="text-[10px] text-primary font-medium">Mon - Sat (9 AM - 9 PM)</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-blue-500/10 text-primary border border-blue-500/30 rounded-xl">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-ink">Academic & Verification Email</div>
                    <div className="text-slate-400 mt-0.5">support@bdsstudyhub.pk</div>
                    <div className="text-[10px] text-slate-400">Response within 24 hours</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-slate-950 text-slate-300 border border-slate-800 rounded-xl">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-ink">Account Activation Assistance</div>
                    <div className="text-slate-400 mt-0.5">Instant via JazzCash / Easypaisa</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-ink p-6 rounded-2xl space-y-2 text-xs shadow-md">
              <div className="font-bold text-sm text-primary">
                Are you a Class Representative (CR/GR)?
              </div>
              <p className="text-slate-300 leading-relaxed">
                Contact us for batch registrations of 15+ dental students across DIKIOHS, DDC, or DIDC to receive customized college discount packages.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-sm text-slate-200">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-2">
                    Send Us a Message
                  </h2>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. Fatima Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="fatima@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="tel"
                        placeholder="0300-1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 font-medium text-ink focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="payment">JazzCash / Easypaisa Payment Assistance</option>
                      <option value="question-feedback">Suggest / Report a DUHS BCQ Correction</option>
                      <option value="batch">DUHS Batch / College Group Subscription</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can our DUHS academic team help you today?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-ink placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-primary hover:bg-primary-hover text-on-primary rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSending ? "Sending..." : "Submit Inquiry"}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-primary border border-blue-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-800 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-base text-ink">Message Received</h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you, {name}! Our DUHS academic support team will get back to you shortly via WhatsApp or email.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="text-xs font-semibold text-primary hover:text-blue-700 dark:hover:text-blue-300 hover:underline pt-2"
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
