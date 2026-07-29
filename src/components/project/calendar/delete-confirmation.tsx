"use client";

import { useRef } from "react";

import HazardButton from "@/components/ui/buttons/hazard";
import AltButton from "@/components/ui/buttons/alternate";

import { IconAlertTriangle } from "@tabler/icons-react";

import animationClose from "@/hooks/useAnimationClose";

type Props = {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteConfirmation({
  title,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleCancel() {
    if (!ref.current) return;

    ref.current.classList.add("animate-fade-out-down");
    animationClose(ref.current, "fade-out-down", "hidden", "flex");
    onCancel();
  }

  return (
    <div
      ref={ref}
      className="fixed flex items-center justify-center p-10 z-20 backdrop-blur backdrop-brightness-50 w-screen h-screen animate-fade-in-up animate-duration-300"
      onClick={(e) => {
        if (e.target === ref.current) handleCancel();
      }}
    >
      <div
        className="bg-neutral-950 border border-neutral-800 rounded-sm p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => {
          e.stopPropagation();
          e.nativeEvent.stopPropagation();
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-sm bg-red-950/50">
            <IconAlertTriangle size={22} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-text">
            Delete event
          </h3>
        </div>

        <p className="text-sm text-neutral-400 mb-4">
          Are you sure you want to delete &quot;{title}&quot;? This action
          cannot be undone.
        </p>

        <div className="bg-red-950/20 border border-red-900/30 rounded-sm p-3 mb-6">
          <p className="text-xs text-red-400">
            All event data will be permanently removed from the team calendar.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <AltButton size="w-full" action={handleCancel}>
            Cancel
          </AltButton>

          <HazardButton size="w-full" action={onConfirm}>
            Delete
          </HazardButton>
        </div>
      </div>
    </div>
  );
}
