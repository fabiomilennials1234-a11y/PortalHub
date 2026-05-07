import { describe, it, expect } from "vitest"
import { ROUTES, LIMITS, APP_NAME } from "@/lib/constants"

describe("constants", () => {
  it("APP_NAME is PortalHub", () => {
    expect(APP_NAME).toBe("PortalHub")
  })

  it("ROUTES generates correct paths", () => {
    expect(ROUTES.community("my-org")).toBe("/my-org/community")
    expect(ROUTES.post("my-org", "123")).toBe("/my-org/community/123")
    expect(ROUTES.course("my-org", "abc")).toBe("/my-org/courses/abc")
    expect(ROUTES.lesson("my-org", "abc", "l1")).toBe("/my-org/courses/abc/l1")
    expect(ROUTES.members("my-org")).toBe("/my-org/members")
    expect(ROUTES.profile("my-org", "u1")).toBe("/my-org/members/u1")
    expect(ROUTES.settings("my-org")).toBe("/my-org/settings")
  })

  it("LIMITS are reasonable", () => {
    expect(LIMITS.POST_TITLE_MAX).toBe(200)
    expect(LIMITS.PAGE_SIZE).toBe(20)
    expect(LIMITS.AVATAR_MAX_SIZE).toBe(5 * 1024 * 1024)
  })
})
