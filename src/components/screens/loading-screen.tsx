//Next imports
import Image from "next/image"

export default function LoadingScreen() {
  return (
    <div
    className="bg-black fixed top-0 left-0 h-screen w-screen z-999 animate-fade-in flex items-center justify-center">
      <Image
      src="/logos/white.svg"
      alt="Logo made by RavexCode"
      className="aspect-square w-10 animate-impulse-rotation-right animate-iteration-count-infinite"
      width={50}
      height={50}
      preload
      loading="eager"
      />
    </div>
  )
}