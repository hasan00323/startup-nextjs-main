"use client";

import { Feature } from "@/types/feature";

const SingleFeature = ({ feature, index = 0 }: { feature: Feature; index?: number }) => {
  const { icon, title, paragraph } = feature;
  return (
    <div 
      className="
        group h-full rounded-3xl border border-black/5 bg-white/60 p-8 
        shadow-sm backdrop-blur-xl transition-all duration-300 
        hover:-translate-y-2 hover:shadow-xl hover:border-primary/20 
        dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-primary/30 
        opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]
      "
      style={{ animationDelay: `${150 + index * 100}ms` }}
    >
      <div className="mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white dark:bg-primary/20 dark:text-primary">
        {icon}
      </div>
      
      <h3 className="mb-4 text-xl font-extrabold text-black transition-colors duration-300 group-hover:text-primary dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        {title}
      </h3>
      
      <p className="text-base font-medium leading-relaxed text-body-color dark:text-body-color-dark">
        {paragraph}
      </p>
    </div>
  );
};

export default SingleFeature;