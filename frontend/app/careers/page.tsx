'use client'

import Link from 'next/link'
import { ChevronLeft, Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react'

export default function CareersPage() {
  const jobs = [
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Phnom Penh',
      type: 'Full-time',
      description: 'Build beautiful and responsive user interfaces for our web application.',
    },
    {
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Phnom Penh',
      type: 'Full-time',
      description: 'Design and implement robust APIs and server-side logic.',
    },
    {
      title: 'Customer Support Specialist',
      department: 'Support',
      location: 'Phnom Penh',
      type: 'Full-time',
      description: 'Provide excellent support to our customers via chat, email, and phone.',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Phnom Penh',
      type: 'Full-time',
      description: 'Lead marketing campaigns and grow our brand presence in Cambodia.',
    },
    {
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create intuitive and engaging user experiences for our platform.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-orange-600 to-slate-950 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Join Our Team</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Be part of the fastest growing movie platform in Cambodia
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Why Join CinemaHub?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl">
              <Briefcase className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Competitive Salary</h3>
              <p className="text-slate-400">Industry-leading compensation packages</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl">
              <Clock className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Flexible Hours</h3>
              <p className="text-slate-400">Work-life balance matters</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl">
              <MapPin className="w-10 h-10 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Remote Options</h3>
              <p className="text-slate-400">Work from anywhere</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Great Culture</h3>
              <p className="text-slate-400">Fun and inclusive workplace</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div key={index} className="bg-slate-900 p-6 rounded-xl hover:border-orange-500 border border-transparent transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span>{job.type}</span>
                    </div>
                    <p className="text-slate-400 mt-3">{job.description}</p>
                  </div>
                  <Link 
                    href="/contact" 
                    className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}