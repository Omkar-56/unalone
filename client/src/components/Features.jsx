import React from 'react';
import { MapPin, Clock, Users, Zap, Shield, MessageCircle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: MapPin,
      title: 'Real-Time Location',
      description: 'Discover plans happening around you with live map integration and distance calculations.',
      color: 'blue',
    },
    {
      icon: Clock,
      title: 'Smart Filtering',
      description: 'Filter plans by time (today, soon) or category to find exactly what you\'re looking for.',
      color: 'purple',
    },
    {
      icon: Users,
      title: 'Join Requests',
      description: 'Send requests to join plans and receive real-time notifications when creators respond.',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Quick Creation',
      description: 'Create plans instantly by clicking on the map or using the comprehensive form.',
      color: 'amber',
    },
    {
      icon: Shield,
      title: 'Verified Community',
      description: 'Connect with verified users in safe, public places for genuine meetups.',
      color: 'red',
    },
    {
      icon: MessageCircle,
      title: 'Real-Time Chat',
      description: 'Chat with group members after requests are accepted with instant messaging.',
      color: 'cyan',
    },
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200' },
    red: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-200' },
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to help you discover and create meaningful local connections.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];

            return (
              <div
                key={index}
                className={`p-8 rounded-2xl border ${colors.border} ${colors.bg} hover:shadow-lg transition-shadow group`}
              >
                <div className="mb-4 inline-flex p-3 rounded-xl bg-white">
                  <Icon size={24} className={`${colors.icon} group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
