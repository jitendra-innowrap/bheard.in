import { ReactNode } from "react";

type BentoGridProps = {
  items: ReactNode[];
  variant?: "2col" | "3col" | "asymmetric";
};

const variantMap = {
  "2col": "grid-cols-1 md:grid-cols-2",
  "3col": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  asymmetric: "grid-cols-1 md:grid-cols-6",
};

export default function BentoGrid({ items, variant = "3col" }: BentoGridProps) {
  return (
    <div className={`grid gap-6 ${variantMap[variant]}`}>
      {items.map((item, index) => {
        if (variant !== "asymmetric") {
          return <div key={index}>{item}</div>;
        }
        const isLarge = index === 0;
        return (
          <div key={index} className={isLarge ? "md:col-span-4 md:row-span-2" : "md:col-span-2"}>
            {item}
          </div>
        );
      })}
    </div>
  );
}
