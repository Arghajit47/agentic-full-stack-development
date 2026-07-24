"use client";

import { useSyncExternalStore } from "react";
import { ServicesPageContent } from "@/components/sections/Services";
import { useServices } from "@/lib/api";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function ServicesPage() {
  const mounted = useMounted();
  const { data: servicesData, isLoading, error, mutate: retry } = useServices();

  const data = mounted ? servicesData : null;
  const loading = mounted ? isLoading : false;
  const errorState = mounted ? error : null;

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 font-sans text-zinc-100">
      <ServicesPageContent data={data} isLoading={loading} error={errorState} retry={() => retry()} />
    </div>
  );
}
