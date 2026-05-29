//Icons imports
import { IconCheck } from "@tabler/icons-react";

export default function PricingCard(props: {
  isRecomended?: boolean;
  plan: string;
  cost: string;
  benefits: Array<string>;
  action?: () => void;
}){
  const pricingCardClassess : string = "flex flex-col px-6 py-4 rounded-xl h-100 shadow-lg shadow-ultramarine-950/50 mb-10 w-60 timeline-view-y animate-fade-in animate-range-[entry_0%_cover_30%] relative border cursor-default " + (props.isRecomended ? "scale-110 border-blue-600 bg-blue-800/20 backdrop-brightness-40 backdrop-blur-2xl" : "border-neutral-600 bg-neutral-950");

  return (
    <div
    className={pricingCardClassess}>
      {props.isRecomended ? (
        <div>
          <span
          className="absolute -translate-y-6 -translate-x-8 px-3 py-1 rounded-md bg-main text-sm">
            Recomended
          </span>

          <span className="h-5 md:h-3 block"></span>
        </div>
      ) : null}
      <p className="text-sm font-semibold text-center">{props.plan}</p>
      <h3 className="text-2xl font-bold mb-3 text-sky-600 tracking-wide text-center">
        {props.cost}
        <span
        className="text-sm text-text/50 font-light ml-1 tracking-widest">
          /month
        </span>
      </h3>

      {props.benefits.map((value : string, index : number) => (
        <div
        key={index}
        className="text-text justify-start items-center flex gap-1 font-light tracking-wide">
          <IconCheck size={15} stroke={2.3} /> {value}
        </div>
      ))}

      <button
      type="button"
      className="w-full text-text bg-main disabled:grayscale disabled:hover:translate-y-0 disabled:hover:brightness-100 mt-auto tracking-wider py-2 rounded-full duration-300 hover:brightness-130 cursor-pointer hover:-translate-y-0.5 relative"
      onClick={props.action}
      disabled={!props.action}>
        Get started
      </button>
    </div>
  )
}