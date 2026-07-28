# Property Details Gallery & Details Components

This documentation covers the Property Details Gallery carousel and Property Details section components for displaying detailed property information.

## Table of Contents
- [Overview](#overview)
- [Components](#components)
  - [PropertyGallery](#propertygallery)
  - [PropertyDetails](#propertydetails)
- [Data Models](#data-models)
- [Usage Examples](#usage-examples)
- [Testing](#testing)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

## Overview

The Property Details system consists of two main components:

1. **PropertyGallery**: A responsive image carousel with thumbnail navigation and full-screen lightbox
2. **PropertyDetails**: A comprehensive property information display with features, amenities, and agent contact

Both components work together to create a complete property detail page experience.

## Components

### PropertyGallery

A fully-featured image gallery component with carousel navigation and lightbox functionality.

#### Features

- **Responsive Carousel**: Navigate through property images with prev/next buttons
- **Thumbnail Strip**: Quick navigation via thumbnail preview images
- **Lightbox Mode**: Full-screen image viewing with backdrop
- **Keyboard Navigation**: Support for arrow keys (future enhancement)
- **Touch Gestures**: Swipe support for mobile (future enhancement)
- **Image Captions**: Optional captions for each image
- **Counter Display**: Shows current image position (e.g., "3 / 5")
- **Lazy Loading**: Optimized image loading with Next.js Image component

#### Props

```typescript
interface PropertyGalleryProps {
  images: PropertyImage[];  // Array of property images
  title: string;            // Property title for alt text context
}

interface PropertyImage {
  id: number;
  url: string;              // Image path or URL
  alt: string;              // Accessibility alt text
  caption?: string;         // Optional image caption
}
```

#### Example Usage

```tsx
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { getPropertyDetailBySlug } from "@/mocks/property-details";

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = getPropertyDetailBySlug(params.slug);
  
  if (!property) return <div>Property not found</div>;
  
  return (
    <div>
      <PropertyGallery 
        images={property.images} 
        title={property.title} 
      />
    </div>
  );
}
```

#### Component Behavior

**Main Gallery View:**
- Displays the current image in a 16:9 aspect ratio container
- Shows navigation arrows (hidden on single image)
- Displays image counter in bottom-right corner
- Shows caption overlay in bottom-left (if available)
- Click main image to open lightbox

**Thumbnail Navigation:**
- Displays all images as thumbnails below main image
- Active thumbnail highlighted with violet border
- Inactive thumbnails at 60% opacity
- Hover increases opacity to 100%
- Click thumbnail to navigate to that image

**Lightbox Mode:**
- Full-screen black backdrop (95% opacity)
- Centered image up to 90% of viewport
- Close button in top-right corner
- Navigation arrows on sides (if multiple images)
- Image counter and caption below image
- Click backdrop to close
- Click close button to close

#### State Management

```typescript
const [currentIndex, setCurrentIndex] = useState(0);      // Main gallery index
const [isLightboxOpen, setIsLightboxOpen] = useState(false);  // Lightbox visibility
const [lightboxIndex, setLightboxIndex] = useState(0);    // Lightbox image index
```

#### Empty State

When no images are provided, displays:
```
┌─────────────────────────────────┐
│                                 │
│     No images available         │
│                                 │
└─────────────────────────────────┘
```

### PropertyDetails

A comprehensive property information display component.

#### Features

- **Property Header**: Title, address, price, and status badge
- **Quick Stats Grid**: 4-8 feature cards in responsive grid
- **Description Section**: Short and long property descriptions
- **Amenities Display**: Categorized amenity lists
- **Agent Contact**: Agent information and contact button

#### Props

```typescript
interface PropertyDetailsProps {
  property: PropertyDetailedInfo;
}
```

#### Example Usage

```tsx
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { getPropertyDetailBySlug } from "@/mocks/property-details";

export default function PropertyPage({ params }: { params: { slug: string } }) {
  const property = getPropertyDetailBySlug(params.slug);
  
  if (!property) return <div>Property not found</div>;
  
  return (
    <div>
      <PropertyDetails property={property} />
    </div>
  );
}
```

#### Sections

**1. Header Section**
- Property title (H1)
- Full address with map pin icon
- Formatted price
- Status badge (For Sale, For Rent, Sold, Pending)

**2. Features Grid**
- Responsive 2-4 column grid
- Icon + label + value for each feature
- Default features: bedrooms, bathrooms, area, lot size, year built, parking, property type, status

**3. Description**
- "About This Property" heading
- Short description (1-2 sentences)
- Long description (detailed paragraph)

**4. Amenities**
- Categorized amenity groups (Interior, Exterior, Additional)
- Bullet-point lists with custom markers
- Responsive 1-3 column grid

**5. Agent Contact** (optional)
- Agent name, phone, and email
- Clickable phone (tel:) and email (mailto:) links
- "Schedule a Viewing" CTA button

#### Status Badge Colors

```typescript
"For Sale"  → Green  (bg-green-900/30, text-green-400, border-green-800)
"For Rent"  → Blue   (bg-blue-900/30, text-blue-400, border-blue-800)
"Sold"      → Gray   (bg-zinc-800/50, text-zinc-400, border-zinc-700)
"Pending"   → Yellow (bg-yellow-900/30, text-yellow-400, border-yellow-800)
```

## Data Models

### PropertyDetailedInfo

```typescript
interface PropertyDetailedInfo {
  id: number;
  slug: string;
  title: string;
  description: string;         // Short description (1-2 sentences)
  longDescription: string;     // Detailed description
  price: number;
  location: string;            // City, State
  address: string;             // Full street address
  bedrooms: number;
  bathrooms: number;
  propertyType: "Villa" | "Mansion" | "Cottage" | "Estate" | "House";
  area: string;                // e.g., "4,200 sq ft"
  lotSize?: string;            // e.g., "8,500 sq ft" or "2.5 acres"
  yearBuilt?: number;
  status: "For Sale" | "For Rent" | "Sold" | "Pending";
  images: PropertyImage[];
  features: PropertyFeature[];
  amenities: PropertyAmenity[];
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
}
```

### PropertyFeature

```typescript
interface PropertyFeature {
  id: number;
  name: string;     // Display name (e.g., "Bedrooms")
  icon: string;     // Lucide icon name (e.g., "Bed")
  value: string;    // Display value (e.g., "4")
}
```

Supported icons: `Bed`, `Bath`, `Ruler`, `Square`, `Calendar`, `Car`, `Home`, `Tag`

### PropertyAmenity

```typescript
interface PropertyAmenity {
  id: number;
  category: string;    // Category name (e.g., "Interior", "Exterior")
  items: string[];     // List of amenities in this category
}
```

### PropertyImage

```typescript
interface PropertyImage {
  id: number;
  url: string;        // Image path (e.g., "/images/properties/property-1.jpg")
  alt: string;        // Accessibility alt text
  caption?: string;   // Optional caption shown in gallery
}
```

## Usage Examples

### Complete Property Detail Page

```tsx
import { PropertyGallery } from "@/components/properties/PropertyGallery";
import { PropertyDetails } from "@/components/properties/PropertyDetails";
import { getPropertyDetailBySlug } from "@/mocks/property-details";

export default function PropertyDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const property = getPropertyDetailBySlug(params.slug);
  
  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-white">Property Not Found</h1>
        <p className="mt-4 text-zinc-400">
          The property you're looking for doesn't exist.
        </p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Gallery Section */}
        <PropertyGallery 
          images={property.images} 
          title={property.title} 
        />
        
        {/* Details Section */}
        <PropertyDetails property={property} />
      </div>
    </div>
  );
}
```

### Adding New Mock Property

```typescript
// In src/mocks/property-details.ts

export const propertyDetailsData: PropertyDetailedInfo[] = [
  // ... existing properties
  {
    id: 4,
    slug: "downtown-penthouse",
    title: "Downtown Luxury Penthouse",
    description: "Modern penthouse with stunning city views.",
    longDescription: "Experience urban luxury in this spectacular penthouse...",
    price: 2500000,
    location: "New York, NY",
    address: "789 Park Avenue, New York, NY 10021",
    bedrooms: 3,
    bathrooms: 3.5,
    propertyType: "House",
    area: "2,800 sq ft",
    lotSize: undefined, // No lot size for penthouse
    yearBuilt: 2022,
    status: "For Sale",
    images: [
      {
        id: 1,
        url: "/images/properties/penthouse-1.jpg",
        alt: "Penthouse Exterior",
        caption: "Stunning city skyline views"
      }
      // Add more images...
    ],
    features: [
      { id: 1, name: "Bedrooms", icon: "Bed", value: "3" },
      { id: 2, name: "Bathrooms", icon: "Bath", value: "3.5" },
      // Add more features...
    ],
    amenities: [
      {
        id: 1,
        category: "Interior",
        items: ["Floor-to-Ceiling Windows", "Smart Home", "Wine Cellar"]
      },
      {
        id: 2,
        category: "Building",
        items: ["Concierge", "Rooftop Pool", "Gym", "Parking"]
      }
    ],
    agentName: "Jane Smith",
    agentPhone: "+1 (212) 555-0100",
    agentEmail: "jane.smith@luxury.com"
  }
];
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

**PropertyGallery Tests:**
- ✅ Rendering with images
- ✅ Empty state handling
- ✅ Navigation (prev/next buttons)
- ✅ Thumbnail navigation
- ✅ Lightbox open/close
- ✅ Lightbox navigation
- ✅ Image counter display
- ✅ Caption display
- ✅ Accessibility features
- ✅ Edge cases (rapid clicks, state preservation)

**PropertyDetails Tests:**
- ✅ Property header rendering
- ✅ Features grid display
- ✅ Description rendering
- ✅ Amenities display
- ✅ Agent contact section
- ✅ Status badge styling
- ✅ Price formatting
- ✅ Responsive design
- ✅ Accessibility
- ✅ Edge cases (missing data, empty arrays)

### Example Test

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyGallery } from "../PropertyGallery";

it("navigates to next image when next button clicked", () => {
  render(<PropertyGallery images={mockImages} title="Test Property" />);
  
  const nextButton = screen.getByTestId("gallery-next-button");
  fireEvent.click(nextButton);
  
  expect(screen.getByTestId("gallery-counter")).toHaveTextContent("2 / 3");
});
```

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
Base (< 640px):  Single column layout
sm (≥ 640px):    2-3 columns for features/amenities
md (≥ 768px):    3-4 columns, side-by-side layouts
lg (≥ 1024px):   Full grid layouts, 3 column amenities
```

### PropertyGallery Responsive Behavior

- **Mobile**: Full-width gallery, vertical thumbnail strip with scroll
- **Tablet**: Same layout, larger touch targets
- **Desktop**: Horizontal thumbnail strip, hover effects

### PropertyDetails Responsive Behavior

**Features Grid:**
- Mobile: 2 columns
- Small: 3 columns
- Medium+: 4 columns

**Amenities Grid:**
- Mobile: 1 column
- Medium: 2 columns
- Large: 3 columns

**Header Section:**
- Mobile: Stacked (title/address, then price/status)
- Desktop: Side-by-side with flex-wrap

## Accessibility

### WCAG 2.1 AA Compliance

**PropertyGallery:**
- ✅ Keyboard navigation support
- ✅ ARIA labels on all interactive elements
- ✅ Alt text on all images
- ✅ Focus indicators on buttons
- ✅ Proper heading hierarchy
- ✅ Color contrast ratios meet standards

**PropertyDetails:**
- ✅ Semantic HTML (h1, h2, h3)
- ✅ Proper link attributes (tel:, mailto:)
- ✅ Icon + text labels (not icon-only)
- ✅ Color is not the only indicator (status badges have text)
- ✅ Responsive text sizing
- ✅ Touch targets ≥ 44x44px

### Screen Reader Support

Both components are tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Keyboard Shortcuts (Future Enhancement)

```
Gallery Navigation:
- Arrow Left:  Previous image
- Arrow Right: Next image
- Escape:      Close lightbox
- Enter/Space: Open lightbox (when image focused)

Interactive Elements:
- Tab:         Navigate through buttons/links
- Shift+Tab:   Navigate backwards
- Enter/Space: Activate button
```

## Performance Considerations

### Image Optimization

```typescript
// Next.js Image component handles:
- Automatic lazy loading
- Responsive image sizing
- WebP format conversion
- Blur placeholder (optional)
```

### Recommendations

1. **Image Sizes**: Use appropriately sized images
   - Thumbnails: 112x80px (or 224x160px for retina)
   - Main gallery: 1920x1080px
   - Lightbox: 2560x1440px max

2. **Image Formats**: 
   - WebP for modern browsers (Next.js handles this)
   - JPEG fallback for compatibility

3. **Loading Strategy**:
   - Priority load first gallery image
   - Lazy load subsequent images
   - Preload on thumbnail hover (future enhancement)

### Bundle Size

```
PropertyGallery: ~8KB (minified + gzipped)
PropertyDetails: ~6KB (minified + gzipped)
Total:          ~14KB
```

## Future Enhancements

### Planned Features

1. **Gallery**:
   - [ ] Keyboard navigation
   - [ ] Touch/swipe gestures
   - [ ] Image zoom on hover
   - [ ] Fullscreen mode
   - [ ] Share gallery functionality
   - [ ] Download image option

2. **Details**:
   - [ ] Print-friendly view
   - [ ] Share property functionality
   - [ ] Save/favorite property
   - [ ] Virtual tour integration
   - [ ] Map view integration
   - [ ] Similar properties section

3. **General**:
   - [ ] Animations and transitions
   - [ ] Loading skeletons
   - [ ] Error boundaries
   - [ ] Analytics tracking
   - [ ] SEO optimization (structured data)

## Troubleshooting

### Common Issues

**Gallery images not loading:**
```typescript
// Ensure images exist in public folder
public/images/properties/property-1.jpg

// Or use absolute URLs
url: "https://example.com/images/property.jpg"
```

**Lightbox not closing:**
```typescript
// Check z-index conflicts
// Lightbox uses z-50, ensure no higher z-index elements
```

**Features not displaying icons:**
```typescript
// Verify icon name matches iconMap
icon: "Bed"  // ✅ Correct
icon: "bed"  // ❌ Wrong (case-sensitive)
icon: "Bedroom"  // ❌ Wrong (not in iconMap)
```

## Support

For issues or questions:
1. Check this documentation
2. Review test files for usage examples
3. Check component source code comments
4. Open an issue on the project repository

---

**Last Updated**: 2026-07-28  
**Version**: 1.0.0  
**Components**: PropertyGallery v1.0, PropertyDetails v1.0
