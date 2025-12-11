import Hero from "@/components/Hero";
import WishCounter from "@/components/WishCounter";
import WishBoard from "@/components/WishBoard";
import EventsSection from "@/components/EventsSection";

import { getWishes } from "@/actions/wishes";
import { getEvents } from "@/actions/events";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const wishes = await getWishes()
  const events = await getEvents()

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <WishCounter />

      <div className="w-full">
        {/* Wishes Section */}
        <section className="bg-[#FEF9E7] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <WishBoard initialWishes={wishes} />
          </div>
        </section>

        {/* Events Section */}
        <section className="bg-[#FEF9E7] py-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <EventsSection events={events} className="px-0" />
          </div>
        </section>
      </div>


    </div>
  );
}
