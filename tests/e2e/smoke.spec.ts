import { test, expect } from "@playwright/test"

test.describe("Smoke — public pages", () => {
  test("landing renders hero + CTAs", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByText("Comunidades + Cursos")).toBeVisible()
    await expect(
      page.getByRole("link", { name: /começar grátis/i }),
    ).toBeVisible()
    await expect(page.getByRole("link", { name: /^entrar$/i })).toBeVisible()
  })

  test("login page renders form", async ({ page }) => {
    await page.goto("/login")
    await expect(page.locator("input[type=email]")).toBeVisible()
  })

  test("signup page renders form", async ({ page }) => {
    await page.goto("/signup")
    await expect(page.locator("input[type=email]")).toBeVisible()
  })

  test("not-found page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-xyz")
    expect(response?.status()).toBe(404)
    await expect(page.getByText(/não encontrada/i)).toBeVisible()
  })

  test("robots.txt available", async ({ page }) => {
    const response = await page.goto("/robots.txt")
    expect(response?.status()).toBe(200)
  })

  test("sitemap.xml available", async ({ page }) => {
    const response = await page.goto("/sitemap.xml")
    expect(response?.status()).toBe(200)
  })

  test("protected route redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/account")
    await page.waitForURL(/\/login/)
    expect(page.url()).toContain("/login")
  })
})
