//Prebuilt components imports
import MainButton from "@components/ui/buttons/main";
import HazardButton from "@components/ui/buttons/hazard";
import AltButton from "@components/ui/buttons/alternate";

//Icons imports
import {
  IconAlertCircle,
} from "@tabler/icons-react";

interface ConfirmationCardProps {
  isOpen: boolean;
  title: string;
  message: string;
  actionType: "delete" | "role-change";
  memberName: string;
  newRole?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmationCard({
  isOpen,
  title,
  message,
  actionType,
  memberName,
  newRole,
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmationCardProps) {
  if(!isOpen) return null;

  const isDelete = actionType === "delete";

  return (
    <section
    className="fixed w-screen min-h-screen overflow-x-hidden p-10 z-30 bg-black/50 backdrop-blur flex justify-center items-center animate-fade-in-up"
    onClick={onCancel} >
      <div
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-md w-full shadow-2xl"
      onClick={(e) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
      }} >
        
        {/* Header */}
        <header
        className="flex items-center gap-3 mb-4">
          <div
          className={`p-2 rounded-lg
          ${isDelete ? "bg-red-900/20" : "bg-blue-900/20"}`}>
            <IconAlertCircle
            size={24}
            stroke={2}
            className={isDelete ? "text-red-500" : "text-blue-500"} />
          </div>
          <h3
          className="text-lg font-semibold text-white">
            {title}
          </h3>
        </header>

        {/* Message */}
        <p
        className="text-neutral-400 text-sm mb-6">
          {message}
        </p>

        {/* Member Info */}
        <article
        className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-neutral-700">

          <div
          className="flex flex-col gap-2">

            <div
            className="flex justify-between items-center">

              <span
              className="text-xs text-neutral-500 uppercase">
                Member
              </span>

              <span
              className="text-sm font-medium text-white">
                {memberName}
              </span>

            </div>

            {newRole && (
              <div
              className="flex justify-between items-center">

                <span
                className="text-xs text-neutral-500 uppercase">
                  New Role
                </span>

                <span
                className={`text-sm font-medium ${newRole === "admin" ? "text-green-500" : "text-blue-400"}`}>
                  {newRole.charAt(0).toUpperCase() + newRole.slice(1)}
                </span>

              </div>
            )}

          </div>

        </article>

        {isDelete && (
          <div className="bg-red-950 border border-red-900 rounded-lg p-3 mb-6">
            <p className="text-xs text-red-400">
              This action cannot be undone. The member will lose access to all team resources.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <AltButton
          size="w-auto"
          action={onCancel}
          isLoading={isLoading}>
            Cancel
          </AltButton>

          {
            isDelete ? (
              <HazardButton
              size="w-auto"
              action={onConfirm}
              isLoading={isLoading}>
                {isLoading ? "Processing" : "Delete"}
              </HazardButton>
            ) : (
              <MainButton
              size="w-auto"
              action={onConfirm}
              isLoading={isLoading}>
                {isLoading ? "Processing" : "Confirm"}
              </MainButton>
            )
          }
        </div>
      </div>
    </section>
  );
}
