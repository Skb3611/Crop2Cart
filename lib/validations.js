import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  role: z.enum(["buyer", "farmer"]),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits" }).optional().or(z.literal('')),
  latitude: z.union([z.string(), z.number()]).optional(),
  longitude: z.union([z.string(), z.number()]).optional(),
}).superRefine((data, ctx) => {
  if (data.role === "buyer") {
    if (!data.address || data.address.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Address is required",
        path: ["address"],
      });
    }
    if (!data.city || data.city.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required",
        path: ["city"],
      });
    }
    if (!data.pincode || data.pincode.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Pincode is required",
        path: ["pincode"],
      });
    }
  }

  if (data.role === "farmer") {
    if (!data.latitude) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Latitude is required",
        path: ["latitude"],
      });
    }
    if (!data.longitude) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Longitude is required",
        path: ["longitude"],
      });
    }
  }
});

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  category: z.enum(["Fruit", "Vegetable", "Grain", "Rice"]),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  image: z.string().url({ message: "Invalid URL" }).optional().or(z.literal('')),
});
