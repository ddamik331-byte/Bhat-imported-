import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  const ctx = createPublicContext();
  const caller = appRouter.createCaller(ctx);

  describe("getAll", () => {
    it("returns an array of products", async () => {
      const products = await caller.products.getAll();
      expect(Array.isArray(products)).toBe(true);
    });
  });

  describe("getCategories", () => {
    it("returns an array of categories", async () => {
      const categories = await caller.products.getCategories();
      expect(Array.isArray(categories)).toBe(true);
    });
  });

  describe("create", () => {
    it("creates a new product", async () => {
      const result = await caller.products.create({
        name: "Test Product",
        price: 9999,
        category: "Test Category",
        description: "Test description",
        imageUrl: "https://example.com/image.jpg",
      });
      expect(result).toBeDefined();
    });

    it("validates required fields", async () => {
      try {
        await caller.products.create({
          name: "",
          price: 0,
          category: "",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("getById", () => {
    it("returns a product by ID", async () => {
      const products = await caller.products.getAll();
      if (products.length > 0) {
        const product = await caller.products.getById(products[0].id);
        expect(product).toBeDefined();
        expect(product?.id).toBe(products[0].id);
      }
    });

    it("returns undefined for non-existent product", async () => {
      const product = await caller.products.getById(99999);
      expect(product).toBeUndefined();
    });
  });

  describe("update", () => {
    it("updates a product", async () => {
      const products = await caller.products.getAll();
      if (products.length > 0) {
        const productId = products[0].id;
        const result = await caller.products.update({
          id: productId,
          name: "Updated Product",
          price: 19999,
        });
        expect(result).toBeDefined();
      }
    });
  });

  describe("delete", () => {
    it("deletes a product", async () => {
      // Create a product first
      const created = await caller.products.create({
        name: "Product to Delete",
        price: 5000,
        category: "Temp",
      });

      // Get the created product ID from the database
      const products = await caller.products.getAll();
      const productToDelete = products.find((p) => p.name === "Product to Delete");

      if (productToDelete) {
        const result = await caller.products.delete(productToDelete.id);
        expect(result).toBeDefined();
      }
    });
  });
});
