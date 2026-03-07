"use client";

import SectionTitle from "../Common/SectionTitle";
import SingleFeature from "./SingleFeature";
import featuresData from "./featuresData";

const Features = () => {
  return (
    <section id="features" className="relative z-10 overflow-hidden py-16 md:py-20 lg:py-28">
      
      <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[150px] dark:bg-primary/10"></div>

      <div className="container">
        <div className="opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]">
          <SectionTitle
            title="Main Features"
            paragraph="A powerful set of features designed to simplify course management, enhance user experience, and ensure a secure and scalable learning platform."
            center
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {featuresData.map((feature, index) => (
            <SingleFeature key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Features;