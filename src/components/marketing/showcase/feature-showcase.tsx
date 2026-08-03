//Next imports
import Link from "next/link";

//Hooks imports
import { IconCheck, IconArrowUpRight } from "@tabler/icons-react";

interface Props {
  overline: string;
  title: React.ReactNode;
  description: string;
  bullets?: string[];
  link?: string;
  linkLabel?: string;
  reverse?: boolean;
  children: React.ReactNode;
}

export default function FeatureShowcase(props: Props) {
  return (
    <section
    className="w-full max-w-300 flex flex-col items-center px-4 mt-40">
      <div
      className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center timeline-view-y animate-fade-in-up animate-range-[entry_0%_cover_30%]">
        <div
        className={"w-full flex flex-col items-start gap-5 " + (props.reverse && "md:order-2")}>
          <p
          className="text-sm font-medium text-main uppercase tracking-widest">
            {props.overline}
          </p>

          <p
          className="text-4xl font-bold tracking-wide">
            {props.title}
          </p>

          <p
          className="opacity-80 leading-relaxed">
            {props.description}
          </p>

          {
            props.bullets && (
              <div
              className="flex flex-col gap-2 w-full">
                {
                  props.bullets.map((bullet) => (
                    <p
                    key={bullet}
                    className="flex gap-2 items-center text-sm opacity-90">
                      <IconCheck
                      size={18}
                      stroke={2.5}
                      className="text-main" />
                      {bullet}
                    </p>
                  ))
                }
              </div>
            )
          }

          {
            props.link && (
              <Link
              href={props.link}
              className="mt-2 group flex items-center gap-2 rounded-full bg-main px-8 py-2 duration-200 hover:brightness-80">
                {props.linkLabel ?? "Learn more"}
                <IconArrowUpRight
                size={16}
                stroke={2}
                className="duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            )
          }
        </div>

        <div
        className={"w-full flex items-center justify-center " + (props.reverse && "md:order-1")}>
          {props.children}
        </div>
      </div>
    </section>
  )
}
