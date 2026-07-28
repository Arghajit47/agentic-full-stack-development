import { ContactHeader } from "@/components/contact/ContactHeader";
import { GeneralContactForm } from "@/components/contact/GeneralContactForm";
import { OfficeLocations } from "@/components/contact/OfficeLocations";
import { PhotoGalleryMosaic } from "@/components/contact/PhotoGalleryMosaic";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <ContactHeader />
      <OfficeLocations />
      <PhotoGalleryMosaic />
      <GeneralContactForm />
    </main>
  );
}
