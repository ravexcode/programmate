//Config button
export default function ActionButton({
  title,
  action,
  children,
  isDangerous
}: {
  title: string;
  action: () => void;
  children?: React.ReactNode;
  isDangerous?: boolean;
}) {
  return (
    <button
    className={"py-4 rounded-lg flex justify-between items-center px-8 gap-5 border  duration-200  hover:-translate-y-1 w-full outline-none bg-[#101010] cursor-pointer text-center " + (isDangerous ? "border-red-900/40 hover:border-red-700" : "border-neutral-900 hover:border-main")}
    onClick={action}>
      <p
      className="text-lg tracking-wide">
        { title }
      </p>
      { children }
    </button>
  )
}