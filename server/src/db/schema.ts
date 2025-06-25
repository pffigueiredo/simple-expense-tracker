
import { serial, numeric, text, pgTable, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';

// Define the expense category enum
export const expenseCategoryEnum = pgEnum('expense_category', [
  'Food',
  'Transport',
  'Utilities', 
  'Entertainment',
  'Shopping'
]);

export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  category: expenseCategoryEnum('category').notNull(),
  date: date('date').notNull(),
  description: text('description'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type Expense = typeof expensesTable.$inferSelect;
export type NewExpense = typeof expensesTable.$inferInsert;

// Export all tables for proper query building
export const tables = { expenses: expensesTable };
