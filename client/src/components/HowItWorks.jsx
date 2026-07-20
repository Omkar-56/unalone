import React from 'react';
import { MapPin, Plus, Users, MessageCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: MapPin,
      title: 'Find Your Location',
      description: 'Enable location access to see all the exciting plans happening around you right now.',
      details: ['Real-time location', 'Adjustable radius', 'Privacy control'],
    },
    {
      number: 2,
      icon: Plus,
      title: 'Create or Join',
      description: 'Either create your own plan by clicking on the map or join existing plans with a simple request.',
      details: ['Quick map creation', 'Detailed form option', 'Instant join requests'],
    },
    {
      number: 3,
      icon: Users,
      title: 'Get Approved',
      description: 'Creators review your request and can accept or decline based on their preferences.',
      details: ['Real-time notifications', 'No spam bots', 'Verified users only'],
    },
    {
      number: 4,
      icon: MessageCircle,
      title: 'Connect & Enjoy',
      description: 'Once accepted, unlock the group chat and start coordinating details with your new friends.',
      details: ['Instant messaging', 'Plan updates', 'Share contact info'],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to find and create amazing local experiences.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div key={index} className="flex items-center gap-8 md:gap-12">
                {/* Left - Step Number and Icon */}
                <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-slate-600 rounded-2xl opacity-10 blur-xl" />
                  <div className="relative w-full h-full bg-white rounded-2xl border-2 border-slate-200 flex flex-col items-center justify-center shadow-lg">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900">{step.number}</p>
                    <Icon size={24} className="text-slate-600 mt-1" />
                  </div>
                </div>

                {/* Right - Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.details.map((detail, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-24 bg-gradient-to-b from-blue-400 to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-slate-700 rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Meeting People?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of users discovering genuine local connections and amazing meetups.
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
