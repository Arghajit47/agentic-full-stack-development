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
  className?: string;
}

export function PricingBreakdown({ data, className = "" }: PricingBreakdownProps) {
  const { additionalFees, monthlyCosts, totalInitialCosts } = data;

  return (
    <div
      data-testid="pricing-breakdown"
      className={`w-full space-y-4 ${className}`}
    >
      {/* Card 1 — Additional Fees (one-time) */}
      <div
        data-testid="pricing-additional-fees"
        className="bg-[#1A1A1A] rounded-lg border border-zinc-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Additional Fees</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Property Transfer Tax</span>
            <span className="text-white font-medium">{formatCurrency(additionalFees.propertyTransferTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Legal &amp; Attorney Fees</span>
            <span className="text-white font-medium">{formatCurrency(additionalFees.legalFees)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Home Inspection</span>
            <span className="text-white font-medium">{formatCurrency(additionalFees.homeInspection)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Property Insurance</span>
            <span className="text-white font-medium">{formatCurrency(additionalFees.propertyInsurance)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Mortgage Origination Fees</span>
            <span className="text-white font-medium">{additionalFees.mortgageFees}</span>
          </div>
        </div>
      </div>

      {/* Card 2 — Monthly Costs */}
      <div
        data-testid="pricing-monthly-costs"
        className="bg-[#1A1A1A] rounded-lg border border-zinc-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Costs</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Property Taxes (Monthly)</span>
            <span className="text-white font-medium">{formatCurrency(monthlyCosts.propertyTaxesMonthly)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">HOA Fees (Monthly)</span>
            <span className="text-white font-medium">{formatCurrency(monthlyCosts.hoaFeeMonthly)}</span>
          </div>
        </div>
      </div>

      {/* Card 3 — Total Initial Investment */}
      <div
        data-testid="pricing-total-initial-costs"
        className="bg-[#1A1A1A] rounded-lg border border-zinc-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Total Initial Investment</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Down Payment ({totalInitialCosts.downPaymentPct}%)</span>
            <span className="text-white font-medium">{formatCurrency(totalInitialCosts.downPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#999999]">Mortgage Amount</span>
            <span className="text-white font-medium">{formatCurrency(totalInitialCosts.mortgageAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
