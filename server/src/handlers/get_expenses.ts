
import { db } from '../db';
import { expensesTable } from '../db/schema';
import { type Expense } from '../schema';
import { desc } from 'drizzle-orm';

export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const results = await db.select()
      .from(expensesTable)
      .orderBy(desc(expensesTable.date))
      .execute();

    // Convert numeric and date fields to proper types
    return results.map(expense => ({
      ...expense,
      amount: parseFloat(expense.amount),
      date: new Date(expense.date)
    }));
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    throw error;
  }
};
