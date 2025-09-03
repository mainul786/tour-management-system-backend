import z from "zod";

export const createDivisionZodSchmea = z.object({
  name: z.string(),
  slug: z.string(),
  thumbnail: z.string().optional(),
  descript: z.string().optional(),
});

export const updateDivisionZodSchmea = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
