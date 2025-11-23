/**
 * BOT (Baked On Time) - Admin Dashboard Page
 * 
 * Copyright (c) 2025 BOT (Baked On Time)
 * Licensed under the MIT License
 * 
 * Moderator and Admin Control Panel
 */

'use client'

import { useState } from 'react'

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual authentication with backend API
    // This is a placeholder UI - authentication should be implemented before production use
    alert('Authentication not yet implemented. This is a UI demonstration only.')
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-neutral-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-2 border-neutral-200">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🛡️</div>
            <h1 className="font-display text-4xl font-bold text-neutral-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-neutral-600">
              {isSignUp ? 'Create moderator account' : 'Moderator login'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition text-neutral-900"
                placeholder="moderator@bot.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-accent-gold outline-none transition text-neutral-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-coral hover:bg-coral-dark text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 uppercase tracking-wide"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-accent-gold hover:text-accent-rose-gold font-medium text-sm transition"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-200">
            <p className="text-xs text-neutral-500 text-center">
              © 2025 BOT (Baked On Time). All rights reserved.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-accent-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="font-display text-2xl font-bold text-accent-gold">
                🛡️ Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-neutral-700">{email}</span>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-coral hover:bg-coral-dark text-white px-4 py-2 rounded-lg transition uppercase tracking-wide font-semibold text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Users</p>
                <p className="text-3xl font-bold text-neutral-900">1,234</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Active Orders</p>
                <p className="text-3xl font-bold text-neutral-900">89</p>
              </div>
              <div className="bg-teal-light/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Revenue</p>
                <p className="text-3xl font-bold text-neutral-900">$12.4k</p>
              </div>
              <div className="bg-accent-light/40 p-3 rounded-full">
                <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-neutral-900">24</p>
              </div>
              <div className="bg-coral-light/20 p-3 rounded-full">
                <svg className="w-8 h-8 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Management */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">User Management</h2>
            <div className="space-y-3">
              <button className="w-full bg-primary hover:bg-primary-400 text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                👥 View All Users
              </button>
              <button className="w-full bg-teal hover:bg-teal-dark text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                ✅ Approve Pending Bakers
              </button>
              <button className="w-full bg-accent-gold hover:bg-accent-rose-gold text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                ⚠️ Flagged Content Review
              </button>
              <button className="w-full bg-coral hover:bg-coral-dark text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                🚫 Ban/Suspend Users
              </button>
            </div>
          </div>

          {/* System Controls */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">System Controls</h2>
            <div className="space-y-3">
              <button className="w-full bg-neutral-700 hover:bg-neutral-800 text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                ⚙️ System Settings
              </button>
              <button className="w-full bg-accent-rose-gold hover:bg-accent-gold text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                📊 Analytics Dashboard
              </button>
              <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                💳 Payment Management
              </button>
              <button className="w-full bg-teal hover:bg-teal-dark text-white px-4 py-3 rounded-lg transition text-left font-semibold">
                📧 Email Templates
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-neutral-200 lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-teal-light/20 p-2 rounded-full">
                    <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">New baker registration</p>
                    <p className="text-xs text-neutral-500">Sweet Treats Bakery - 2 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Order completed</p>
                    <p className="text-xs text-neutral-500">Order #4521 - 15 minutes ago</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-coral-light/20 p-2 rounded-full">
                    <svg className="w-5 h-5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Content flagged for review</p>
                    <p className="text-xs text-neutral-500">User report #892 - 1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t-2 border-accent-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-600">
          <p>© 2025 BOT (Baked On Time). All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
