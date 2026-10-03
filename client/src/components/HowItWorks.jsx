import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Users, MessageCircle, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      icon: MapPin,
      title: 'Find Your Location',
      description: 'Enable location access to see all the exciting plans happening around you right now.',
      details: ['Real-time location', 'Adjustable radius', 'Privacy control'],
    },
    {
      number: '02',
      icon: Plus,
      title: 'Create or Join',
      description: 'Either create your own plan by clicking on the map or join existing plans with a simple request.',
      details: ['Quick map creation', 'Detailed form', 'Instant join requests'],
    },
    {
      number: '03',
      icon: Users,
      title: 'Get Approved',
      description: 'Creators review your request and can accept or decline based on their preferences.',
      details: ['Live notifications', 'No spam bots', 'Verified users only'],
    },
    {
      number: '04',
      icon: MessageCircle,
      title: 'Connect & Enjoy',
      description: 'Once accepted, unlock the group chat and start coordinating details with your new friends.',
      details: ['Instant messaging', 'Plan updates', 'Share contact info'],
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Four simple steps to find and create amazing local experiences.
          </p>
        </div>

        {/* 4 Steps in a single horizontal row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1.5">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Details Badges */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                  {step.details.map((detail, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-slate-700 text-[11px] font-medium rounded-md border border-slate-200"
                    >
                      <span className="w-1 h-1 bg-blue-600 rounded-full" />
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Compact CTA Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-slate-800 rounded-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-md">
          <div>
            <h3 className="text-base sm:text-lg font-bold mb-1">Ready to Start Meeting People?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Join thousands of users discovering genuine local connections and spontaneous meetups.
            </p>
          </div>
          <button
            onClick={() => navigate('/register')}
            className="flex-shrink-0 px-5 py-2.5 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-xs sm:text-sm flex items-center gap-1.5 shadow-sm"
          >
            Get Started Now
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
