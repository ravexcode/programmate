"use client";

import { useRef, useState } from "react";

import CreatorForm from "@/components/forms/creator-form";
import CreatorInput from "@/components/forms/creator-inputs";
import DateInput from "@/components/forms/date-input";
import OptionsInput from "@/components/forms/options-input";

import animationClose from "@/hooks/useAnimationClose";

import type {
  CalendarDate,
  CalendarDateColors,
  CalendarDateType,
} from "@/types/team.types";

type Props = {
  onSubmit: (event: CalendarDate) => void;
  onClose: () => void;
};

const EVENT_TYPES: CalendarDateType[] = [
  "deadline",
  "meeting",
  "request",
  "online-meeting",
  "target-start",
];

const EVENT_COLORS: CalendarDateColors[] = [
  "blue",
  "cyan",
  "teal",
  "yellow",
  "orange",
  "red",
  "violet",
  "purple",
  "rose",
  "neutral",
];

export default function CreateEventModal({ onSubmit, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [type, setType] = useState<CalendarDateType>("deadline");
  const [color, setColor] = useState<CalendarDateColors>("blue");

  function handleClose() {
    if (!ref.current) return;

    ref.current.classList.add("animate-fade-out-down");
    animationClose(ref.current, "fade-out-down", "hidden", "flex");
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      title,
      description,
      date: new Date(date),
      type,
      color,
      creatorId: "",
      creator: { id: "", email: "", username: "" },
    });

    handleClose();
  }

  return (
    <div
      ref={ref}
      className="fixed flex items-start justify-center p-10 z-10 backdrop-blur backdrop-brightness-50 w-screen h-screen animate-fade-in-up animate-duration-300"
      onClick={(e) => {
        if (e.target === ref.current) handleClose();
      }}
    >
      <CreatorForm
        action={handleSubmit}
        title="Create a new event"
        actionIsDisabled={!title || !date}
        disabledMessage="Set title and date"
        hideAction={handleClose}
      >
        <CreatorInput
          label="Title"
          placeholder="e.g. API Refactor deadline"
          value={title}
          onChange={(e) => setTitle(e.target.value ?? "")}
          required
        />

        <CreatorInput
          type="textarea"
          label="Description"
          placeholder="e.g. Complete the refactor for..."
          value={description}
          onChange={(e) => setDescription(e.target.value ?? "")}
        />

        <DateInput
          value={date}
          onChange={(e) => setDate(e.target.value)}
          label="Date"
          required
        />

        <OptionsInput
          label="Type"
          value={type}
          onChange={(v) => setType(v as CalendarDateType)}
          options={EVENT_TYPES}
        />

        <OptionsInput
          label="Color"
          value={color}
          onChange={(v) => setColor(v as CalendarDateColors)}
          options={EVENT_COLORS}
        />

        <div className="h-2 w-full block" />
      </CreatorForm>
    </div>
  );
}
