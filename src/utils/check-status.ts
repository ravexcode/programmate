export default function checkStatus(s: number) {
  if(s >= 500) return "critic";
  else if (s >= 205) return "warn";
  return "valid";
}