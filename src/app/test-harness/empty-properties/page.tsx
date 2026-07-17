import FeaturedProperties from "@/components/home/FeaturedProperties";
import Testimonials from "@/components/home/Testimonials";

export default function EmptyPropertiesHarness() {
  return (
    <div className="flex flex-col flex-1 bg-white font-sans">
      <FeaturedProperties properties={[]} />
      <Testimonials />
    </div>
  );
}