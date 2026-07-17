import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Testimonials } from "@/components/home/Testimonials";

export default function EmptyPropertiesHarness() {
  return (
    <div className="flex flex-col flex-1 bg-zinc-950 font-sans">
      <FeaturedProperties data={[]} />
      <Testimonials />
    </div>
  );
}