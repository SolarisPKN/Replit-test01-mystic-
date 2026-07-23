import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  paymentType: text("payment_type"), // monthly | weekly | per_class
  // Flexibility scores 0-10 for 4 poses
  flexForwardBend: integer("flex_forward_bend"),    // Paschimottanasana
  flexBackwardBend: integer("flex_backward_bend"),  // Ustrasana
  flexSideBend: integer("flex_side_bend"),          // Trikonasana
  flexSeatedTwist: integer("flex_seated_twist"),    // Ardha Matsyendrasana
  medicalNotes: text("medical_notes"),
  observations: text("observations"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
