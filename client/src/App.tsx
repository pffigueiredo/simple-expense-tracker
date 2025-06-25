
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { Expense, CreateExpenseInput, ExpenseCategory } from '../../server/src/schema';

const categoryColors: Record<ExpenseCategory, string> = {
  'Food': 'bg-green-100 text-green-800',
  'Transport': 'bg-blue-100 text-blue-800',
  'Utilities': 'bg-yellow-100 text-yellow-800',
  'Entertainment': 'bg-purple-100 text-purple-800',
  'Shopping': 'bg-pink-100 text-pink-800'
};

const categoryIcons: Record<ExpenseCategory, string> = {
  'Food': '🍽️',
  'Transport': '🚗',
  'Utilities': '⚡',
  'Entertainment': '🎬',
  'Shopping': '🛍️'
};

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateExpenseInput>({
    amount: 0,
    category: 'Food',
    date: new Date(),
    description: null
  });

  const loadExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await trpc.getExpenses.query();
      setExpenses(result);
    } catch (error) {
      console.error('Failed to load expenses:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await trpc.createExpense.mutate(formData);
      setExpenses((prev: Expense[]) => [response, ...prev]);
      // Reset form
      setFormData({
        amount: 0,
        category: 'Food',
        date: new Date(),
        description: null
      });
    } catch (error) {
      console.error('Failed to create expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<ExpenseCategory, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💰 Expense Tracker</h1>
          <p className="text-gray-600">Keep track of your spending with ease</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ➕ Add New Expense
                </CardTitle>
                <CardDescription>
                  Record your spending to stay on budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateExpenseInput) => ({ 
                          ...prev, 
                          amount: parseFloat(e.target.value) || 0 
                        }))
                      }
                      step="0.01"
                      min="0"
                      required
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: ExpenseCategory) =>
                        setFormData((prev: CreateExpenseInput) => ({ 
                          ...prev, 
                          category: value 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food">
                          <span className="flex items-center gap-2">
                            🍽️ Food
                          </span>
                        </SelectItem>
                        <SelectItem value="Transport">
                          <span className="flex items-center gap-2">
                            🚗 Transport
                          </span>
                        </SelectItem>
                        <SelectItem value="Utilities">
                          <span className="flex items-center gap-2">
                            ⚡ Utilities
                          </span>
                        </SelectItem>
                        <SelectItem value="Entertainment">
                          <span className="flex items-center gap-2">
                            🎬 Entertainment
                          </span>
                        </SelectItem>
                        <SelectItem value="Shopping">
                          <span className="flex items-center gap-2">
                            🛍️ Shopping
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date.toISOString().split('T')[0]}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateExpenseInput) => ({ 
                          ...prev, 
                          date: new Date(e.target.value) 
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="What did you spend on?"
                      value={formData.description || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev: CreateExpenseInput) => ({
                          ...prev,
                          description: e.target.value || null
                        }))
                      }
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting || formData.amount <= 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Expense'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 Spending Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-900">
                    ${totalExpenses.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Total Spent</div>
                </div>
                
                {Object.entries(expensesByCategory).length > 0 && (
                  <div className="space-y-2">
                    {Object.entries(expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {categoryIcons[category as ExpenseCategory]}
                          {category}
                        </span>
                        <span className="font-semibold">${amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    📝 Recent Expenses
                  </span>
                  <Badge variant="secondary">
                    {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your spending history
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading expenses...
                  </div>
                ) : expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💸</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No expenses yet
                    </h3>
                    <p className="text-gray-600">
                      Add your first expense to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {expenses.map((expense: Expense) => (
                      <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {categoryIcons[expense.category]}
                            </div>
                            <div>
                              <div className="font-semibold text-lg">
                                ${expense.amount.toFixed(2)}
                              </div>
                              <Badge 
                                className={`${categoryColors[expense.category]} text-xs`}
                                variant="secondary"
                              >
                                {expense.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <div>{expense.date.toLocaleDateString()}</div>
                            <div className="text-xs">
                              {expense.created_at.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        {expense.description && (
                          <>
                            <Separator className="my-2" />
                            <p className="text-gray-700 text-sm">
                              {expense.description}
                            </p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
