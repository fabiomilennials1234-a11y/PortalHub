export function formatPrice(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100)
}
