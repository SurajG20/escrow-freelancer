"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
  ArrowRight,
  Lock,
  Shield,
  CheckCircle2,
  Users,
  Globe,
  BarChart3,
  Smartphone,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Award,
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
                Crypto Escrow for Freelancers & Clients
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Lock funds on-chain. Work with confidence. Get paid only when work is approved—trustless escrow on BSC.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow bg-teal-600 hover:bg-teal-700"
                  >
                    Connect Wallet
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 group border-teal-600 text-teal-700 hover:bg-teal-50"
                  >
                    How It Works
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Built for Both Sides
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Users className="w-6 h-6 text-teal-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Clients</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Lock crypto in escrow—only release when you approve</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Milestone-based projects with clear deliverables</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                      <span>Dispute flow if something goes wrong</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Freelancers</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Funds are locked before you start—no chasing payments</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>Submit work per milestone; get paid on approval</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>BNB & USDT on BSC—simple, transparent</span>
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
          className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-xl mx-auto">
              Four steps from agreement to payment—all on-chain.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-teal-200 via-orange-200 to-teal-200 -z-10" />

              <div className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Create & Agree</h3>
                <p className="text-gray-600 text-sm">Set milestones and amounts. Freelancer approves terms.</p>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Deposit</h3>
                <p className="text-gray-600 text-sm">Client deploys escrow and locks BNB or USDT on BSC.</p>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Submit Work</h3>
                <p className="text-gray-600 text-sm">Freelancer delivers per milestone; client reviews.</p>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-orange-500 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-lg">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Approve & Release</h3>
                <p className="text-gray-600 text-sm">Client approves; funds release from escrow to freelancer.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section id="features" className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Why Custodia
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-xl mx-auto">
              Trustless escrow and clear workflows—no middleman holds your funds.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-teal-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">On-Chain Escrow</h3>
                  <p className="text-gray-600 text-sm">Smart contracts hold funds until you approve release. No custody risk.</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Milestone Payments</h3>
                  <p className="text-gray-600 text-sm">Break work into milestones. Pay per deliverable, not upfront.</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-cyan-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Client + Freelancer Approval</h3>
                  <p className="text-gray-600 text-sm">Both parties agree to terms; only client can release funds.</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-3">
                    <Globe className="w-6 h-6 text-teal-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">BNB & USDT on BSC</h3>
                  <p className="text-gray-600 text-sm">Use native BNB or USDT. Deploy and pay on Binance Smart Chain.</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Dispute Safety</h3>
                  <p className="text-gray-600 text-sm">Raise a dispute to lock funds; resolution path when needed.</p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
                    <Smartphone className="w-6 h-6 text-cyan-700" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Simple Dashboard</h3>
                  <p className="text-gray-600 text-sm">Create projects, track milestones, and message—all in one place.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Trustless by Design
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No Payment Chase</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>Funds locked before work starts</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>One-click approve & release</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">You Stay in Control</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>Smart contract holds funds—not us</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span>Dispute flow if things go wrong</span>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Clear & Transparent</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>On-chain history; no hidden fees</span>
                  </li>
                  <li className="flex items-start gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Wallet connect, no signup wall</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-20 px-6 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              What People Say
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12">
              Escrow that actually protects both sides.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    &quot;We use Custodia for all our freelance dev work. Funds in escrow = no more payment headaches.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center font-bold text-teal-700 text-sm">S</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Client</p>
                      <p className="text-xs text-gray-600">Startup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    &quot;Knowing the client&apos;s crypto is locked before I start—huge. I just focus on delivery.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 text-sm">J</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Freelancer</p>
                      <p className="text-xs text-gray-600">Developer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 shadow-md border border-gray-200">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    &quot;Milestones + on-chain release = clear audit trail. Exactly what we needed.&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-cyan-700 text-sm">E</div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Client</p>
                      <p className="text-xs text-gray-600">DAO</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Secure & Transparent
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-7 h-7 text-teal-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Contracts</h3>
                <p className="text-gray-600 text-sm">Escrow logic on-chain; no one can move funds without approval.</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 text-cyan-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Verifiable</h3>
                <p className="text-gray-600 text-sm">Every deposit and release is on BSC; check the explorer.</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Wallet-Based</h3>
                <p className="text-gray-600 text-sm">Connect wallet, sign in. No email signup required.</p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-7 h-7 text-teal-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">BSC-Powered</h3>
                <p className="text-gray-600 text-sm">Low fees, fast finality. Mainnet and testnet supported.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Lock Funds. Ship Work. Get Paid.
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90">
              Connect your wallet and create your first escrow in minutes.
            </p>
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-white text-teal-700 hover:bg-gray-100 shadow-xl"
              >
                Connect Wallet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm opacity-75 mt-6">
              No signup form • BSC only • 0% platform fee
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-gray-900 text-gray-300">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <Image
                  src="/logo.png"
                  alt="Custodia"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain opacity-95"
                />
                <p className="text-sm mb-6 leading-relaxed">
                  Crypto escrow for freelancers and clients. Lock funds on BSC; release on approval.
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
