import { IconCheck } from "@tabler/icons-react";

interface Props {
  tier: string;
  slogan: string;
  price: number;
  type: "free" | "normal";
  benefits: string [];
  isRecomended?: boolean;
  action?: () => void;
  loading?: boolean;
}

export default function PricingCard(props: Props) {
  return (
    <div
    className="rounded-2xl border border-neutral-900 bg-[#111111] p-4 w-90 max-w-full flex flex-col items-start justify-start gap-2 h-auto min-h-120 animate-fade-in-up">
      <p
      className="text-2xl tracking-wide w-full text-start">
        {props.tier} tier
      </p>
      <p
      className="font-light">
        {props.slogan}
      </p>
      <p
      className="font-medium text-xl tracking-wider">
        ${props.price}
        <span
        className="text-base">
          {props.price > 0 && " /month"}
        </span>
      </p>

      {
        props.type === "free" ? (
          <button
          type="button"
          onClick={() => props.action}
          className="w-full rounded-xl border-2 border-neutral-800 p-2 text-sm mt-2 cursor-pointer duration-300 hover:bg-neutral-800 font-medium text-center">
            Start in NexZero
          </button>
        ) : (
          <button
          type="button"
          onClick={props.action}
          disabled={props.loading}
          className="w-full rounded-xl bg-main p-2 text-sm mt-2 cursor-pointer duration-300 hover:brightness-75 font-medium disabled:cursor-wait disabled:grayscale disabled:hover:brightness-100">
            Get {props.tier.toLowerCase()}
          </button>
        )
      }

      <div
      className="mt-5 flex flex-col gap-1 w-full items-center justify-center text-start">
        {
          props.benefits.map((content, index) =>
            <p
            key={index}
            className="flex gap-2 w-full items-center">
              <IconCheck
              size={15}
              stroke={3} />
              {content}
            </p>
          )
        }
      </div>
    </div>
  )
}