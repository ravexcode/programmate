export default function checkStatus(s: number) {
  if(s >= 500) return "critic";

  return "warn"
}