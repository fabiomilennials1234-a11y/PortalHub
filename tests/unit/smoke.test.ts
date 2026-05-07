import { describe, it, expect } from "vitest"
import { ROUTES, APP_NAME } from "@/lib/constants"

describe("foundation smoke", () => {
  it("constants are defined", () => {
    expect(APP_NAME).toBe("PortalHub")
    expect(ROUTES.home).toBe("/")
  })
})
