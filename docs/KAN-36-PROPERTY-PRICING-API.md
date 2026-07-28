# KAN-36: Property Pricing API

## Overview
Backend API endpoint for retrieving property pricing breakdowns including listing price, fees, and costs.

## Endpoint
```
GET /api/properties/[slug]/pricing
```

## Response Structure
```json
{
  "propertySlug": "modern-villa-in-sunset-hills",
  "breakdown": {
    "listing": {
      "amount": 250000,
      "label": "Listing Price"
    },
    "fees": {
      "platformFee": {
        "amount": 5000,
        "label": "Platform Service Fee"
      },
      "processingFee": {
        "amount": 1250,
        "label": "Transaction Processing Fee"
      }
    },
    "costs": {
      "inspectionCost": {
        "amount": 500,
        "label": "Property Inspection"
      },
      "legalFee": {
        "amount": 1500,
        "label": "Legal Documentation"
      },
      "insuranceCost": {
        "amount": 750,
        "label": "Insurance Cost"
      }
    }
  },
  "totalPrice": 259000,
  "createdAt": "2026-07-28T20:39:22.857Z",
  "updatedAt": "2026-07-28T20:39:22.857Z"
}
```

## Pricing Calculation
- **Platform Fee**: 2% of listing price
- **Processing Fee**: 0.5% of listing price
- **Inspection Cost**: $500 (fixed)
- **Legal Fee**: $1,500 (fixed)
- **Insurance Cost**: 0.3% of listing price
- **Total Price**: Sum of listing price + all fees + all costs

## Database Schema
Added `PropertyPricing` model in `prisma/schema.prisma`:
```prisma
model PropertyPricing {
  id               Int      @id @default(autoincrement())
  propertySlug     String   @unique
  listingPrice     Int      // Base property listing price
  platformFee      Int      // Platform service fee
  processingFee    Int      // Transaction processing fee
  inspectionCost   Int      // Property inspection cost
  legalFee         Int      // Legal documentation fee
  insuranceCost    Int      // Insurance cost
  totalPrice       Int      // Total = listing + all fees + costs
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([propertySlug])
}
```

## Testing
Run the tests:
```bash
npm test -- src/app/api/properties/[slug]/pricing/route.test.ts
```

## Example Requests
```bash
# Valid property
curl http://localhost:3000/api/properties/modern-villa-in-sunset-hills/pricing

# Non-existent property (returns 404)
curl http://localhost:3000/api/properties/non-existent-property/pricing
```

## Files Modified/Created
- `prisma/schema.prisma` - Added PropertyPricing model
- `prisma/seed.ts` - Added pricing data seeding
- `src/app/api/properties/[slug]/pricing/route.ts` - GET endpoint implementation
- `src/app/api/properties/[slug]/pricing/route.test.ts` - Test suite
