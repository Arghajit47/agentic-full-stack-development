"use client";

import { useSyncExternalStore } from "react";
import { ContactHeader } from "@/components/contact/ContactHeader";
import { GeneralContactForm } from "@/components/contact/GeneralContactForm";
import { OfficeLocations } from "@/components/contact/OfficeLocations";
import { PhotoGalleryMosaic } from "@/components/contact/PhotoGalleryMosaic";
import { type OfficeLocation } from "@/components/contact/OfficeLocationCard";
import { useContactOffices, useContactGallery } from "@/lib/api";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function ContactPage() {
  const mounted = useMounted();
  const {
    data: offices,
    error: officesError,
    isLoading: officesLoading,
    mutate: mutateOffices,
  } = useContactOffices();
  const {
    data: gallery,
    error: galleryError,
    isLoading: galleryLoading,
    mutate: mutateGallery,
  } = useContactGallery();

  const loading = !mounted || officesLoading || galleryLoading;
  const error = mounted ? officesError ?? galleryError : null;
  const hasEmptyData = mounted && offices?.length === 0 && gallery?.length === 0;

  if (loading) {
    return (
      <main data-testid="contact-page-loading" className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-800 border-t-violet-600" />
          <p className="mt-4 text-zinc-400">Loading contact information...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main data-testid="contact-page-error" className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-white">Unable to load contact information</h2>
          <p className="mt-2 text-zinc-400">{error.message}</p>
          <button
            onClick={() => {
              void mutateOffices();
              void mutateGallery();
            }}
            className="mt-6 rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400"
            type="button"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  if (hasEmptyData) {
    return (
      <main data-testid="contact-page-empty" className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-white">No contact information available</h2>
          <p className="mt-2 text-zinc-400">Check back later.</p>
        </div>
      </main>
    );
  }

  const officeLocations: OfficeLocation[] = (offices ?? []).map((office) => ({
    id: office.id,
    name: office.title,
    address: office.address,
    city: "",
    state: "",
    zipCode: "",
    phone: office.phone,
    email: office.email,
    hours: { weekdays: "9:00 AM - 6:00 PM", weekends: "Closed" },
  }));

  return (
    <main data-testid="contact-page" className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <ContactHeader />
      <OfficeLocations offices={officeLocations} />
      <PhotoGalleryMosaic images={gallery?.map((img) => ({ id: img.id, url: img.imageUrl, alt: img.caption ?? "", caption: img.caption }))} />
      <GeneralContactForm />
    </main>
  );
}
