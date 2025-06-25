
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { expensesTable } from '../db/schema';
import { getExpenses } from '../handlers/get_expenses';

describe('getExpenses', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no expenses exist', async () => {
    const result = await getExpenses();
    
    expect(result).toEqual([]);
  });

  it('should return all expenses ordered by date (newest first)', async () => {
    // Create test expenses with different dates
    const expense1 = {
      amount: '25.50',
      category: 'Food' as const,
      date: '2024-01-15',
      description: 'Lunch at cafe'
    };

    const expense2 = {
      amount: '15.75',
      category: 'Transport' as const,
      date: '2024-01-17',
      description: 'Bus fare'
    };

    const expense3 = {
      amount: '45.00',
      category: 'Shopping' as const,
      date: '2024-01-16',
      description: 'Groceries'
    };

    // Insert expenses in random order
    await db.insert(expensesTable).values([expense1, expense2, expense3]).execute();

    const result = await getExpenses();

    expect(result).toHaveLength(3);
    
    // Verify ordering - newest date first (2024-01-17, 2024-01-16, 2024-01-15)
    expect(result[0].description).toEqual('Bus fare');
    expect(result[1].description).toEqual('Groceries');
    expect(result[2].description).toEqual('Lunch at cafe');

    // Verify numeric conversion
    expect(typeof result[0].amount).toBe('number');
    expect(result[0].amount).toEqual(15.75);
    expect(result[1].amount).toEqual(45.00);
    expect(result[2].amount).toEqual(25.50);

    // Verify date conversion
    expect(result[0].date).toBeInstanceOf(Date);
    expect(result[1].date).toBeInstanceOf(Date);
    expect(result[2].date).toBeInstanceOf(Date);

    // Verify all fields are present
    result.forEach(expense => {
      expect(expense.id).toBeDefined();
      expect(expense.amount).toBeDefined();
      expect(expense.category).toBeDefined();
      expect(expense.date).toBeInstanceOf(Date);
      expect(expense.created_at).toBeInstanceOf(Date);
    });
  });

  it('should handle null descriptions correctly', async () => {
    const expenseWithNullDescription = {
      amount: '30.00',
      category: 'Utilities' as const,
      date: '2024-01-10',
      description: null
    };

    await db.insert(expensesTable).values(expenseWithNullDescription).execute();

    const result = await getExpenses();

    expect(result).toHaveLength(1);
    expect(result[0].description).toBeNull();
    expect(result[0].amount).toEqual(30.00);
    expect(result[0].category).toEqual('Utilities');
    expect(result[0].date).toBeInstanceOf(Date);
  });
});
