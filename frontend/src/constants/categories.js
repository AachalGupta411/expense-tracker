/** Must match backend ExpenseCategory enum values */
export const EXPENSE_CATEGORIES = [
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'bills', label: 'Bills' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
]

export function categoryLabel(value) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

const tint = {
  food: '#f97316',
  transport: '#3b82f6',
  shopping: '#a855f7',
  bills: '#eab308',
  entertainment: '#ec4899',
  health: '#22c55e',
  other: '#64748b',
}

export function categoryTint(value) {
  return tint[value] ?? tint.other
}
