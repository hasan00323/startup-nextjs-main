import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Brands from "@/components/Brands";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";
import CoursesPage from "@/components/Courses";

export const metadata: Metadata = {
  title: "Future Dev "
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
      <Brands />
      <CoursesPage />
      <AboutSectionOne />
      <AboutSectionTwo />
      <Contact />
    </>
  );
}
