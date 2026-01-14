"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, Lock, Shield, CheckCircle2, FileCheck, Coins, Users, Globe } from "lucide-react";
import { GlassNav } from "@/components/landing/GlassNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <GlassNav />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Secure Freelance Projects with Crypto Escrow
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">
              Create a project, get it approved, deposit funds securely, and release payments only when milestones are completed.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
              Either the <strong className="text-gray-900">client or freelancer</strong> can start a project. Payments stay locked until work is approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Who Is This For?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    For Clients
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Approve the project before paying</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Funds locked safely in escrow</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Release payment only after milestone completion</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    For Freelancers
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Create projects and invite clients</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>Guaranteed payment on approved milestones</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>No payment delays or disputes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Create Project
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Client <strong>or</strong> freelancer creates a project with milestones, scope, and amount.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Project Approval
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The counterparty reviews and approves the project terms before anything happens.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Fund Escrow
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Client deposits funds into a smart contract.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center font-bold text-2xl mx-auto mb-6">
                  4
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Milestone Release
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Freelancer completes milestones → client approves → funds are released.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Milestone-Based Payments */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 text-center">
              Milestone-Based Payments
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Payments are <strong>not released all at once</strong>. Each milestone must be completed and approved. Full transparency on-chain.
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center p-6">
                <div className="text-3xl mb-3">🚫</div>
                <h3 className="font-semibold text-gray-900 mb-2">No upfront full payment</h3>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl mb-3">✅</div>
                <h3 className="font-semibold text-gray-900 mb-2">No unpaid work</h3>
              </div>
              <div className="text-center p-6">
                <div className="text-3xl mb-3">🤝</div>
                <h3 className="font-semibold text-gray-900 mb-2">No trust required</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <Lock className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Smart Contract Escrow</h3>
              </div>
              <div className="text-center p-6">
                <FileCheck className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Milestone-Based Payments</h3>
              </div>
              <div className="text-center p-6">
                <Users className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Mutual Project Approval</h3>
              </div>
              <div className="text-center p-6">
                <Shield className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">On-Chain Transparency</h3>
              </div>
              <div className="text-center p-6">
                <Globe className="w-8 h-8 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Global, Crypto-Native</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Trust & Security
            </h2>
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                Funds are locked in escrow smart contracts. The platform does not control user funds. Payments only move based on approvals. Everything is verifiable.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure by Design</h3>
                  <p className="text-gray-600 text-sm">
                    Smart contracts ensure funds cannot be accessed without proper approvals.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fully Transparent</h3>
                  <p className="text-gray-600 text-sm">
                    All transactions are recorded on-chain and publicly verifiable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Start Your First Escrow Project in Minutes
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-200">
          <div className="container mx-auto max-w-4xl flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2026 Custodia. Open Source.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-gray-900 transition-colors">
                Github
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
