"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
              Secure Crypto Escrow for Freelancers and Clients
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Lock funds in crypto. Work with confidence. Get paid only when work is approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Using Escrow
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Freelance Payments Are Broken
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Clients fear paying upfront
                </p>
                <p className="text-gray-600">
                  Without guarantees, clients hesitate to commit funds before seeing results.
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Freelancers fear not getting paid
                </p>
                <p className="text-gray-600">
                  Completed work can go unpaid, leaving freelancers vulnerable.
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Chargebacks and disputes waste time
                </p>
                <p className="text-gray-600">
                  Traditional payment methods allow reversals that create uncertainty for both parties.
                </p>
              </div>
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  International payments are slow and expensive
                </p>
                <p className="text-gray-600">
                  Bank transfers and payment processors add delays and high fees to global work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Crypto Escrow Solves This
            </h2>
            <div className="space-y-8 max-w-2xl mx-auto">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Client deposits crypto into escrow
                  </h3>
                  <p className="text-gray-600">
                    Funds are locked in a secure smart contract before work begins.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Freelancer starts work after funds are locked
                  </h3>
                  <p className="text-gray-600">
                    Work begins with confidence knowing payment is secured.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Client approves the work
                  </h3>
                  <p className="text-gray-600">
                    Simple approval process when deliverables meet expectations.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Crypto is released instantly
                  </h3>
                  <p className="text-gray-600">
                    Payment happens automatically, no waiting, no intermediaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Product */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Built for Freelancers, Powered by Crypto
            </h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Trustless escrow using smart contracts
                </h3>
                <p className="text-gray-600">
                  No need to trust a third party. The code enforces fair payment.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No chargebacks
                </h3>
                <p className="text-gray-600">
                  Once approved, payments are final. No reversals or disputes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Instant global payments
                </h3>
                <p className="text-gray-600">
                  Crypto enables fast, borderless transactions anywhere in the world.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Transparent and secure
                </h3>
                <p className="text-gray-600">
                  Every transaction is verifiable on-chain with full transparency.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Lower fees than traditional platforms
                </h3>
                <p className="text-gray-600">
                  Smart contracts eliminate middlemen, reducing costs significantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Who It's For
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Freelancers working globally
                  </h3>
                  <p className="text-gray-600">
                    Developers, designers, writers, and remote workers seeking secure payment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Clients hiring remote talent
                  </h3>
                  <p className="text-gray-600">
                    Businesses and individuals looking to hire with payment protection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Web3 teams & startups
                  </h3>
                  <p className="text-gray-600">
                    Crypto-native companies building in the decentralized economy.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    DAOs and crypto-native companies
                  </h3>
                  <p className="text-gray-600">
                    Decentralized organizations managing contributor payments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Security */}
        <section className="py-24 px-6 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
              Funds Are Safe by Design
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Funds locked in escrow until approval
                </h3>
                <p className="text-gray-600">
                  Money cannot be withdrawn until work is approved by the client.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No single party controls the money
                </h3>
                <p className="text-gray-600">
                  Smart contracts ensure fair distribution without central authority.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Transparent transaction history
                </h3>
                <p className="text-gray-600">
                  All escrow activity is recorded on-chain and publicly verifiable.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Crypto-native security principles
                </h3>
                <p className="text-gray-600">
                  Built on proven blockchain technology with industry-standard security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Work Without Trust Issues
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Start using crypto escrow today. Secure payments for freelancers and clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Create Your First Escrow
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Start Secure Payments
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-gray-200">
          <div className="container mx-auto max-w-4xl flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2026 Escrow Protocol. Open Source.</p>
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
