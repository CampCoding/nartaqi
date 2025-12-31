"use client";
import React from "react";
import { Calendar, CreditCard, Clock, ArrowRight } from "lucide-react";

export default function StudentPayment() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-5xl">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-indigo-700 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-3">Student Payment Portal</h1>
            <p className="text-blue-100 text-lg opacity-90">
              Manage tuition fees, view payment history, and set up schedules
            </p>
          </div>

          {/* Body - Upcoming Feature Placeholder */}
          <div className="px-8 py-16 lg:px-16">
            <div className="max-w-2xl mx-auto text-center">
              {/* Icon Animation */}
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-blue-100 p-8 rounded-3xl">
                  <Clock className="w-20 h-20 text-orange-600 mx-auto animate-pulse" />
                </div>
              </div>

              {/* Main Message */}
              <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                Coming Soon
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                We're working hard to bring you a seamless payment experience. 
                Track dues, make secure payments, and get reminders — all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}