
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { expensesTable } from '../db/schema';
import { type CreateExpenseInput } from '../schema';
import { createExpense } from '../handlers/create_expense';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateExpenseInput = {
  amount: 25.50,
  category: 'Food',
  date: new Date('2024-01-15'),
  description: 'Lunch at restaurant'
};

describe('createExpense', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an expense', async () => {
    const result = await createExpense(testInput);

    // Basic field validation
    expect(result.amount).toEqual(25.50);
    expect(typeof result.amount).toBe('number');
    expect(result.category).toEqual('Food');
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.getFullYear()).toEqual(2024);
    expect(result.date.getMonth()).toEqual(0); // January is 0
    expect(result.date.getDate()).toEqual(15);
    expect(result.description).toEqual('Lunch at restaurant');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save expense to database', async () => {
    const result = await createExpense(testInput);

    // Query using proper drizzle syntax
    const expenses = await db.select()
      .from(expensesTable)
      .where(eq(expensesTable.id, result.id))
      .execute();

    expect(expenses).toHaveLength(1);
    expect(parseFloat(expenses[0].amount)).toEqual(25.50);
    expect(expenses[0].category).toEqual('Food');
    expect(expenses[0].description).toEqual('Lunch at restaurant');
    expect(expenses[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle null description', async () => {
    const inputWithNullDescription: CreateExpenseInput = {
      amount: 15.99,
      category: 'Transport',
      date: new Date('2024-02-10'),
      description: null
    };

    const result = await createExpense(inputWithNullDescription);

    expect(result.description).toBeNull();
    expect(result.amount).toEqual(15.99);
    expect(result.category).toEqual('Transport');
  });

  it('should handle different expense categories', async () => {
    const categories: Array<CreateExpenseInput['category']> = [
      'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping'
    ];

    for (const category of categories) {
      const input: CreateExpenseInput = {
        amount: 10.00,
        category,
        date: new Date('2024-03-01'),
        description: `Test ${category} expense`
      };

      const result = await createExpense(input);
      expect(result.category).toEqual(category);
    }
  });
});
