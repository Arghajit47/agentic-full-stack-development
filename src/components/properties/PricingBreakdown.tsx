"use client";

import React from "react";
import { formatCurrency } from "@/lib/utils";

export interface PricingBreakdownItem {
  amount: number;
  label: string;
}

export interface PricingBreakdownData {
  propertySlug: string;
  breakdown: {
    listing: PricingBreakdownItem;
    fees: {
      platformFee: PricingBreakdownItem;
      processingFee: PricingBreakdownItem;
    };
    costs: {
      inspectionCost: PricingBreakdownItem;
      legalFee: PricingBreakdownItem;
      insuranceCost: PricingBreakdownItem;
    };
  };
  totalPrice: number;
}

export interface PricingBreakdownProps {
  data: PricingBreakdownData;
  className?: string;
}

export function PricingBreakdown({ data, className = "" }: PricingBreakdownProps) {
  const { breakdown, totalPrice } = data;

  return (
    <div
      data-testid="pricing-breakdown"
      className={`w-full bg-[#1A1A1A] rounded-lg border border-zinc-800 p-6 ${className}`}
    >
      {/* Heading */}
      <h3
        data-testid="pricing-heading"
        className="text-2xl font-semibold text-white mb-6"
      >
        Pricing Breakdown
      </h3>

      {/* Listing Price */}
      <div className="space-y-4">
        <div
          data-testid="pricing-listing"
          className="flex justify-between items-center pb-4 border-b border-zinc-800"
        >
          <span className="text-lg text-[#999999]">{breakdown.listing.label}</span>
          <span className="text-xl font-semibold text-white">
            {formatCurrency(breakdown.listing.amount)}
          </span>
        </div>

        {/* Fees Section */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-white mt-4 mb-3">Fees</h4>
          <div
            data-testid="pricing-platform-fee"
            className="flex justify-between items-center"
          >
            <span className="text-base text-[#999999]">
              {breakdown.fees.platformFee.label}
            </span>
            <span className="text-lg font-medium text-white">
              {formatCurrency(breakdown.fees.platformFee.amount)}
            </span>
          </div>
          <div
            data-testid="pricing-processing-fee"
            className="flex justify-between items-center"
          >
            <span className="text-base text-[#999999]">
              {breakdown.fees.processingFee.label}
            </span>
            <span className="text-lg font-medium text-white">
              {formatCurrency(breakdown.fees.processingFee.amount)}
            </span>
          </div>
        </div>

        {/* Costs Section */}
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-white mt-4 mb-3">Additional Costs</h4>
          <div
            data-testid="pricing-inspection-cost"
            className="flex justify-between items-center"
          >
            <span className="text-base text-[#999999]">
              {breakdown.costs.inspectionCost.label}
            </span>
            <span className="text-lg font-medium text-white">
              {formatCurrency(breakdown.costs.inspectionCost.amount)}
            </span>
          </div>
          <div
            data-testid="pricing-legal-fee"
            className="flex justify-between items-center"
          >
            <span className="text-base text-[#999999]">
              {breakdown.costs.legalFee.label}
            </span>
            <span className="text-lg font-medium text-white">
              {formatCurrency(breakdown.costs.legalFee.amount)}
            </span>
          </div>
          <div
            data-testid="pricing-insurance-cost"
            className="flex justify-between items-center"
          >
            <span className="text-base text-[#999999]">
              {breakdown.costs.insuranceCost.label}
            </span>
            <span className="text-lg font-medium text-white">
              {formatCurrency(breakdown.costs.insuranceCost.amount)}
            </span>
          </div>
        </div>

        {/* Total Price */}
        <div
          data-testid="pricing-total"
          className="flex justify-between items-center pt-4 mt-4 border-t border-zinc-800"
        >
          <span className="text-xl font-semibold text-white">Total Price</span>
          <span className="text-2xl font-bold text-violet-600">
            {formatCurrency(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
