
import { z } from 'zod';

// Predefined expense categories
export const expenseCategoryEnum = z.enum([
  'Food',
  'Transport', 
  'Utilities',
  'Entertainment',
  'Shopping'
]);

export type ExpenseCategory = z.infer<typeof expenseCategoryEnum>;

// Expense schema
export const expenseSchema = z.object({
  id: z.number(),
  amount: z.number().positive(),
  category: expenseCategoryEnum,
  date: z.coerce.date(),
  description: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Expense = z.infer<typeof expenseSchema>;

// Input schema for creating expenses
export const createExpenseInputSchema = z.object({
  amount: z.number().positive(),
  category: expenseCategoryEnum,
  date: z.coerce.date(),
  description: z.string().nullable()
});

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;
