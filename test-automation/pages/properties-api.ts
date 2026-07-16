import { expect } from "@playwright/test";
import { BaseAPI, type Response } from "@base/api-base";

export interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  imageUrl: string;
  isFeatured: boolean;
  galleryUrls: string[];
  features: string[];
}

const PATH = "/api/properties/featured";

/** Page-specific actions/assertions for the Featured Properties API. */
export class PropertiesAPI extends BaseAPI {
  async fetchFeatured(): Promise<Response> {
    return this.get(PATH);
  }

  getProperties(res: Response): Property[] {
    return BaseAPI.assertArray(res) as Property[];
  }

  assertAllFeatured(props: Property[]): void {
    expect(props.every((p) => p.isFeatured === true), "all isFeatured=true").toBe(true);
  }

  assertArraysParsed(props: Property[]): void {
    for (const p of props) {
      expect(Array.isArray(p.galleryUrls), `galleryUrls array for ${p.slug}`).toBe(true);
      expect(Array.isArray(p.features), `features array for ${p.slug}`).toBe(true);
      expect(typeof p.galleryUrls, "galleryUrls not raw JSON").not.toBe("string");
      expect(typeof p.features, "features not raw JSON").not.toBe("string");
    }
  }

  assertHasGalleryImages(props: Property[]): void {
    expect(props[0].galleryUrls.length, "first property has gallery images").toBeGreaterThan(0);
    expect(typeof props[0].galleryUrls[0], "gallery item is string").toBe("string");
  }
}