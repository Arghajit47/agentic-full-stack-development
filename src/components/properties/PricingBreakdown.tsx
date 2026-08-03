"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";

export interface PricingAdditionalFees {
  propertyTransferTax: number;
  legalFees: number;
  homeInspection: number;
  propertyInsurance: number;
  mortgageFees: string;
}

export interface PricingMonthlyCosts {
  propertyTaxesMonthly: number;
  hoaFeeMonthly: number;
}

export interface PricingTotalInitialCosts {
  downPayment: number;
  downPaymentPct: number;
  mortgageAmount: number;
}

export interface PricingBreakdownData {
  propertySlug: string;
  additionalFees: PricingAdditionalFees;
  monthlyCosts: PricingMonthlyCosts;
  totalInitialCosts: PricingTotalInitialCosts;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingBreakdownProps {
  data: PricingBreakdownData;
  listingPrice?: number;
  className?: string;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[#1A1A1A] border border-[#262626] rounded-full px-3 py-1 text-xs text-[#999999] whitespace-nowrap">
      {children}
    </span>
  );
}

function FeeRow({ label, value, pill }: { label: string; value: string; pill: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#999999] text-sm shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <span className="text-white font-semibold text-sm">{value}</span>
        <Pill>{pill}</Pill>
      </div>
    </div>
  );
}

function CostCell({ label, value, pill }: { label: string; value: string; pill?: string }) {
  return (
    <div>
      <p className="text-[#999999] text-xs mb-1">{label}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white font-semibold text-sm">{value}</span>
        {pill && <Pill>{pill}</Pill>}
      </div>
    </div>
  );
}

export function PricingBreakdown({ data, listingPrice, className = "" }: PricingBreakdownProps) {
  const { additionalFees, monthlyCosts, totalInitialCosts } = data;

  const additionalFeesSum =
    additionalFees.propertyTransferTax +
    additionalFees.legalFees +
    additionalFees.homeInspection +
    additionalFees.propertyInsurance;

  return (
    <section data-testid="pricing-breakdown" className={`w-full ${className}`}>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Comprehensive Pricing Details</h2>
        <p className="text-[#999999] text-sm">
          At Estatein, transparency is key. We want you to have a clear understanding of all costs
          associated with your property investment. Below, we break down the pricing to help you
          make an informed decision.
        </p>
      </div>

      {/* Note Card */}
      <div
        data-testid="pricing-note-card"
        className="bg-[#141414] rounded-xl px-6 py-4 flex items-center gap-4 mb-8"
      >
        <span className="text-white text-sm font-semibold shrink-0">
          Note
        </span>
        <p className="text-[#999999] text-sm leading-relaxed">
          The figures provided above are estimates and may vary depending on the property, location, and individual circumstances.
        </p>
      </div>

      {/* Main layout: Listing Price (left) + Cards (right) */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 sm:items-start">
        {/* Left: Listing Price */}
        {listingPrice != null && (
          <div data-testid="pricing-listing-price" className="w-full sm:w-48 sm:shrink-0 sm:sticky sm:top-8">
            <p className="text-[#999999] text-sm mb-1">Listing Price</p>
            <p className="text-3xl font-bold text-white">{formatCurrency(listingPrice)}</p>
          </div>
        )}

        {/* Right: 4 Cards */}
        <div className="flex-1 space-y-4">
          {/* CARD 1 — Additional Fees */}
          <div
            data-testid="pricing-additional-fees"
            className="bg-[#141414] rounded-xl p-6"
          >
            <h3 className="text-[#999999] text-sm font-medium mb-3">Additional Fees</h3>
            <div className="border-t border-[#262626] mb-4" />
            <div className="space-y-4">
              <FeeRow
                label="Property Transfer Tax"
                value={formatCurrency(additionalFees.propertyTransferTax)}
                pill="Based on the sale price and local regulations"
              />
              <FeeRow
                label="Legal & Attorney Fees"
                value={formatCurrency(additionalFees.legalFees)}
                pill="Approximate cost for legal services, including title transfer"
              />
              <FeeRow
                label="Home Inspection"
                value={formatCurrency(additionalFees.homeInspection)}
                pill="Recommended for due diligence"
              />
              <FeeRow
                label="Property Insurance"
                value={formatCurrency(additionalFees.propertyInsurance)}
                pill="Annual cost for comprehensive property insurance"
              />
              <FeeRow
                label="Mortgage Fees"
                value={additionalFees.mortgageFees}
                pill="If applicable, consult with your lender for specific details"
              />
            </div>
          </div>

          {/* CARD 2 — Monthly Costs */}
          <div
            data-testid="pricing-monthly-costs"
            className="bg-[#141414] rounded-xl p-6"
          >
            <h3 className="text-[#999999] text-sm font-medium mb-3">Monthly Costs</h3>
            <div className="border-t border-[#262626] mb-4" />
            <div className="space-y-4">
              <FeeRow
                label="Property Taxes"
                value={formatCurrency(monthlyCosts.propertyTaxesMonthly)}
                pill="Approximate monthly property tax based on the sale price and local rates"
              />
              <FeeRow
                label="Homeowners' Association Fee"
                value={formatCurrency(monthlyCosts.hoaFeeMonthly)}
                pill="Monthly fee for common area maintenance and security"
              />
            </div>
          </div>

          {/* CARD 3 — Total Initial Costs */}
          <div
            data-testid="pricing-total-initial-costs"
            className="bg-[#141414] rounded-xl p-6"
          >
            <h3 className="text-[#999999] text-sm font-medium mb-3">Total Initial Costs</h3>
            <div className="border-t border-[#262626] mb-4" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CostCell
                label="Listing Price"
                value={listingPrice != null ? formatCurrency(listingPrice) : "—"}
              />
              <CostCell
                label="Additional Fees"
                value={formatCurrency(additionalFeesSum)}
                pill="Property transfer tax, legal fees, inspection, insurance"
              />
              <CostCell
                label="Down Payment"
                value={formatCurrency(totalInitialCosts.downPayment)}
                pill={`${totalInitialCosts.downPaymentPct}%`}
              />
              <CostCell
                label="Mortgage Amount"
                value={formatCurrency(totalInitialCosts.mortgageAmount)}
                pill="If applicable"
              />
            </div>
          </div>

          {/* CARD 4 — Monthly Expenses */}
          <div
            data-testid="pricing-monthly-expenses"
            className="bg-[#141414] rounded-xl p-6"
          >
            <h3 className="text-[#999999] text-sm font-medium mb-3">Monthly Expenses</h3>
            <div className="border-t border-[#262626] mb-4" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CostCell
                label="Property Taxes"
                value={formatCurrency(monthlyCosts.propertyTaxesMonthly)}
                pill="Approximate monthly cost"
              />
              <CostCell
                label="Homeowners' Association Fee"
                value={formatCurrency(monthlyCosts.hoaFeeMonthly)}
                pill="Monthly fee"
              />
              <CostCell
                label="Mortgage Payment"
                value="Varies"
                pill="If applicable"
              />
              <CostCell
                label="Property Insurance"
                value="$100"
                pill="Approximate monthly cost"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
