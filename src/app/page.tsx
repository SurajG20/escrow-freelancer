"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowRight,
  Lock,
  Shield,
  CheckCircle2,
  FileCheck,
  Users,
  Globe,
  BarChart3,
  Smartphone,
  TrendingUp,
  Clock,
  AlertCircle,
  Star,
  Zap,
  DollarSign,
  Award,
  Play,
  Check,
} from "lucide-react";
import { GlassNav } from "@/components/landing/GlassNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <GlassNav />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-teal-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
                Transform Your Business with Professional Solutions
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Streamline operations, boost productivity, and achieve your
                goals with our comprehensive platform designed for modern teams
                and freelancers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow bg-teal-600 hover:bg-teal-700"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 group border-teal-600 text-teal-700 hover:bg-teal-50"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              Who Is This For?
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-10 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-teal-700" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      For Businesses
                    </h3>
                  </div>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Streamline project management and workflows
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Secure payment processing with milestone tracking
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Reduce administrative overhead by 60%
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Scale operations with confidence
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="p-10 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      For Freelancers
                    </h3>
                  </div>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Get paid securely and on time
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Professional project proposals and contracts
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Build credibility with verified reviews
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-lg">
                        Focus on work, not payment chasing
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Get started in four simple steps and experience seamless project
              management
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-teal-200 via-orange-200 to-teal-200 -z-10"></div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Create Your Project
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Set up milestones, deliverables, and timelines in minutes
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Secure Agreement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Both parties approve terms with digital signatures
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Protected Payments
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Funds held securely until milestone completion
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-orange-500 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Release & Review
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Approve work, release payment, build reputation
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Everything you need to manage projects and payments with
              confidence
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                    <Lock className="w-7 h-7 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Secure Escrow Protection
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Military-grade encryption for all transactions with
                    blockchain security
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                    <BarChart3 className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Milestone Tracking
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Visual progress monitoring and detailed reporting for every
                    project
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-cyan-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Mutual Approval System
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fair process protecting both parties with transparent
                    workflows
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                    <Globe className="w-7 h-7 text-teal-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Global Payments
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Support for 150+ currencies and crypto-native transactions
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                    <Smartphone className="w-7 h-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Mobile-First Design
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Manage projects anywhere with our responsive mobile
                    interface
                  </p>
                </CardContent>
              </Card>

              <Card className="p-8 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-14 h-14 rounded-xl bg-cyan-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-7 h-7 text-cyan-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Analytics Dashboard
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Real-time insights and comprehensive reporting tools
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              Why Choose Our Platform
            </h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Save Time
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Automated invoicing and reminders</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Template-based contracts</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>One-click milestone approvals</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Reduce Risk
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>Payment disputes decreased by 95%</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>Verified user community</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>Transparent communication logs</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Grow Faster
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Average 40% increase in completion</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Built-in reputation system</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Scale from 1 to 100+ projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-24 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600 text-center mb-16">
              Real feedback from real users
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "This platform has completely transformed how we manage
                    freelance projects. Payment disputes are now a thing of the
                    past, and our project completion rate increased
                    significantly."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Business Owner
                      </p>
                      <p className="text-sm text-gray-600">Design Agency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "As a freelancer, getting paid on time was always a
                    struggle. Now I have peace of mind knowing funds are secured
                    before I start work. Game changer!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">
                      J
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Freelance Developer
                      </p>
                      <p className="text-sm text-gray-600">Full-Stack</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "The milestone tracking and automated payments have saved us
                    countless hours. We've scaled our operations significantly
                    without adding administrative overhead."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700">
                      E
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Operations Lead
                      </p>
                      <p className="text-sm text-gray-600">Tech Company</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              Built on Trust and Security
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Secure by Design
                </h3>
                <p className="text-gray-600">
                  End-to-end encryption for all data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-cyan-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fully Transparent
                </h3>
                <p className="text-gray-600">
                  Blockchain-verified transactions
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Community Support
                </h3>
                <p className="text-gray-600">
                  Active community and documentation
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Fast & Reliable
                </h3>
                <p className="text-gray-600">Optimized for performance</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform How You Work?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90">
              Start managing projects with confidence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/login">
                <Button
                  size="lg"
                  className="text-lg px-10 py-7 bg-white text-teal-700 hover:bg-gray-100 shadow-xl"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm opacity-75">
              No credit card required • Start in minutes
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-gray-900 text-gray-300">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <h3 className="text-white font-bold text-xl mb-4">Custodia</h3>
                <p className="text-sm mb-6 leading-relaxed">
                  Transform your business with secure, professional project
                  management and payment solutions.
                </p>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm">𝕏</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm">in</span>
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm">GH</span>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Community
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Security
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm">© 2026 Custodia. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <Button size="sm" className="whitespace-nowrap">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
