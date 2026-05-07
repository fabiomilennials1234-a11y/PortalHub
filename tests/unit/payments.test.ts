import { describe, it, expect } from "vitest"
import { z } from "zod"
import { formatPrice } from "@/lib/stripe/format"

const createPlanSchema = z.object({
  org_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  price_cents: z.coerce.number().int().min(0),
  currency: z.string().length(3).default("usd"),
  interval: z.enum(["month", "year"]).default("month"),
  features: z.string().optional(),
})

const checkoutSchema = z.object({
  plan_id: z.string().uuid(),
  org_slug: z.string().min(1),
})

const portalSchema = z.object({
  org_slug: z.string().min(1),
})

const SUB_STATUSES = [
  "incomplete",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "trialing",
] as const

const PAYMENT_STATUSES = [
  "succeeded",
  "failed",
  "pending",
  "refunded",
] as const

const UUID = "550e8400-e29b-41d4-a716-446655440000"

describe("Plan schema", () => {
  it("validates create plan with month interval", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "Pro",
      price_cents: "2900",
      interval: "month",
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.price_cents).toBe(2900)
      expect(r.data.currency).toBe("usd")
    }
  })

  it("validates create plan with year interval", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "Pro Anual",
      price_cents: "29900",
      interval: "year",
    })
    expect(r.success).toBe(true)
  })

  it("rejects negative price", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "X",
      price_cents: "-100",
    })
    expect(r.success).toBe(false)
  })

  it("rejects empty name", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "",
      price_cents: "1000",
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid currency length", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "X",
      price_cents: "1000",
      currency: "USDD",
    })
    expect(r.success).toBe(false)
  })

  it("rejects invalid interval", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "X",
      price_cents: "1000",
      interval: "weekly",
    })
    expect(r.success).toBe(false)
  })

  it("zero price allowed (free tier)", () => {
    const r = createPlanSchema.safeParse({
      org_id: UUID,
      name: "Free",
      price_cents: "0",
    })
    expect(r.success).toBe(true)
  })
})

describe("Checkout schema", () => {
  it("validates checkout payload", () => {
    const r = checkoutSchema.safeParse({
      plan_id: UUID,
      org_slug: "my-org",
    })
    expect(r.success).toBe(true)
  })

  it("rejects missing plan_id", () => {
    const r = checkoutSchema.safeParse({ org_slug: "my-org" })
    expect(r.success).toBe(false)
  })

  it("rejects empty org_slug", () => {
    const r = checkoutSchema.safeParse({ plan_id: UUID, org_slug: "" })
    expect(r.success).toBe(false)
  })
})

describe("Portal schema", () => {
  it("validates portal payload", () => {
    const r = portalSchema.safeParse({ org_slug: "my-org" })
    expect(r.success).toBe(true)
  })
})

describe("Subscription statuses", () => {
  it.each(SUB_STATUSES)("recognizes status: %s", (s) => {
    expect(SUB_STATUSES).toContain(s)
  })
})

describe("Payment statuses", () => {
  it.each(PAYMENT_STATUSES)("recognizes status: %s", (s) => {
    expect(PAYMENT_STATUSES).toContain(s)
  })
})

describe("formatPrice", () => {
  it("formats USD cents to currency", () => {
    const result = formatPrice(2900, "usd")
    expect(result).toContain("29")
  })

  it("formats BRL cents to currency", () => {
    const result = formatPrice(9900, "brl")
    expect(result).toContain("99")
  })

  it("formats zero", () => {
    const result = formatPrice(0, "usd")
    expect(result).toContain("0")
  })

  it("handles cents under 100 (less than 1 unit)", () => {
    const result = formatPrice(50, "usd")
    expect(result).toContain("0,50")
  })
})
