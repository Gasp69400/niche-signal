export function redirectToPricing() {
  window.location.hash = "pricing";
  const el = document.getElementById("pricing");
  el?.scrollIntoView({ behavior: "smooth" });
}
