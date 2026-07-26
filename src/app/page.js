import Stats from "@/components/Stats";
import Banner from "../components/Banner";
import About from "@/components/About";
import ClientFeedback from "@/components/Feedback";
import FeaturedLatest from "@/components/FeaturedLatest";

export const dynamic = 'force-dynamic';

export default function Home() {
  return <>
    <Banner />
    <Stats />
    <FeaturedLatest />
    <About />
    <ClientFeedback />
  </>
}
