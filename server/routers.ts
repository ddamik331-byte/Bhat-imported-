import { COOKIE_NAME } from "@shared/const";
import { notifyOwner } from "./_core/notification";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, getUniqueCategories, createProduct, updateProduct, deleteProduct, getAdminByUsername } from "./db";
import { verifyPassword } from "./auth";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    getAll: publicProcedure.query(() => getAllProducts()),
    getById: publicProcedure.input(z.number()).query(({ input }) => getProductById(input)),
    getCategories: publicProcedure.query(() => getUniqueCategories()),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          price: z.number().int().positive(),
          category: z.string().min(1),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createProduct(input);
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().min(1).optional(),
          price: z.number().int().positive().optional(),
          category: z.string().min(1).optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          imageKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data);
      }),
    delete: publicProcedure.input(z.number()).mutation(async ({ input }) => {
      return deleteProduct(input);
    }),
  }),
  admin: router({
    login: publicProcedure
      .input(
        z.object({
          username: z.string(),
          password: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const admin = await getAdminByUsername(input.username);
        if (!admin || !verifyPassword(input.password, admin.passwordHash)) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }
        return {
          success: true,
          adminId: admin.id,
          username: admin.username,
        };
      }),
  }),
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          subject: z.string().min(1),
          message: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        try {
          await notifyOwner({
            title: `New Contact Form Submission from ${input.name}`,
            content: `Email: ${input.email}\nSubject: ${input.subject}\n\nMessage:\n${input.message}`,
          });
        } catch (error) {
          console.error("Failed to notify owner:", error);
        }
        console.log("Contact form submission:", input);
        return {
          success: true,
          message: "Your message has been received. We will get back to you soon.",
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
