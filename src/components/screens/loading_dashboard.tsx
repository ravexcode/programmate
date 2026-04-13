export default function LoadingDashboard() {
  return (
    <div
    className="bg-black fixed top-0 left-0 h-screen w-screen z-999 animate-fade-in">
      <div
      className="animate-pulse flex flex-col justify-center items-center h-full w-full">
        <img
        src="/logos/white.svg"
        alt="Logo made by RavexCode"
        className="aspect-square w-10"/>
        
        <p className="font-lg font-light">Loading your data...</p>
      </div>
    </div>
  )
}