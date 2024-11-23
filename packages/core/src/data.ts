import { ColumnDefinition } from './types';
import { faker } from '@faker-js/faker';

export const columns: ColumnDefinition[] = [
  { field: 'id', header: 'ID', type: 'string', width: 100 },
  { field: 'name', header: 'Name', type: 'string', width: 150 },
  { field: 'email', header: 'Email', type: 'string', width: 200 },
  { field: 'age', header: 'Age', type: 'number', width: 80 },
  { field: 'salary', header: 'Salary', type: 'currency', width: 120 },
  { field: 'department', header: 'Department', type: 'string', width: 150 },
  { field: 'position', header: 'Position', type: 'string', width: 150 },
  { field: 'startDate', header: 'Start Date', type: 'date', width: 120 },
  { field: 'isActive', header: 'Active', type: 'boolean', width: 80 },
  {
    field: 'performance',
    header: 'Performance',
    type: 'percentage',
    width: 100,
  },
  { field: 'phone', header: 'Phone', type: 'string', width: 130 },
  { field: 'address', header: 'Address', type: 'string', flex: 1 },
  { field: 'city', header: 'City', type: 'string', width: 120 },
  { field: 'country', header: 'Country', type: 'string', width: 120 },
  { field: 'projects', header: 'Projects', type: 'number', width: 100 },
  { field: 'rating', header: 'Rating', type: 'number', width: 100 },
  {
    field: 'lastEvaluation',
    header: 'Last Evaluation',
    type: 'date',
    width: 120,
  },
  { field: 'bonus', header: 'Bonus', type: 'currency', width: 120 },
  { field: 'efficiency', header: 'Efficiency', type: 'percentage', width: 100 },
  { field: 'team', header: 'Team', type: 'string', width: 150 },
  { field: 'skills', header: 'Skills', type: 'string', width: 200 },
  {
    field: 'certifications',
    header: 'Certifications',
    type: 'number',
    width: 100,
  },
  { field: 'overtime', header: 'Overtime Hours', type: 'number', width: 120 },
  {
    field: 'vacationDays',
    header: 'Vacation Days',
    type: 'number',
    width: 120,
  },
  { field: 'trainings', header: 'Trainings', type: 'number', width: 100 },
  { field: 'reportsTo', header: 'Reports To', type: 'string', width: 150 },
  { field: 'office', header: 'Office', type: 'string', width: 120 },
  { field: 'expenses', header: 'Expenses', type: 'currency', width: 120 },
  {
    field: 'satisfaction',
    header: 'Satisfaction',
    type: 'percentage',
    width: 100,
  },
  { field: 'notes', header: 'Notes', type: 'string', flex: 1 },
];

// Cache for storing generated data
let cachedData: Record<string, any>[] | null = null;
let cachedRows: number | null = null;

const departments = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'IT',
  'Legal',
];
const positions = [
  'Manager',
  'Senior',
  'Junior',
  'Lead',
  'Associate',
  'Director',
  'Coordinator',
];
const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Omega'];
const skills = [
  'JavaScript',
  'Python',
  'Java',
  'SQL',
  'React',
  'Angular',
  'Node.js',
  'AWS',
];

export const getColumns = (): ColumnDefinition[] => columns;

// packages/core/src/data.ts

// const departments = ['Sales', 'Engineering', 'Marketing', 'HR', 'Finance'];
// const positions = ['Manager', 'Developer', 'Analyst', 'Designer', 'Consultant'];
// const teams = ['Team A', 'Team B', 'Team C', 'Team D'];
// const skills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Python'];

export function generateGridData(rows: number = 100000): Promise<any[]> {
  return new Promise((resolve) => {
    const data = Array.from({ length: rows }, (_, index) => ({
      id: `EMP${String(index + 1).padStart(6, '0')}`,
      name: `Employee ${index + 1}`,
      email: `employee${index + 1}@example.com`,
      age: 22 + (index % 43), // Age between 22 and 65
      salary: 30000 + index * 1000, // Salary between 30000 and 150000
      department: departments[index % departments.length],
      position: positions[index % positions.length],
      startDate: new Date(2013 + (index % 10), 0, 1).toISOString(),
      isActive: index % 2 === 0,
      performance: (index % 100) / 100, // Performance between 0 and 1
      phone: `+1-555-${String(1000 + index).padStart(4, '0')}`,
      address: `123 Main St, Suite ${index + 1}`,
      city: `City ${index + 1}`,
      country: `Country ${index + 1}`,
      projects: 1 + (index % 10),
      rating: 1 + (index % 5),
      lastEvaluation: new Date(2023 - (index % 3), 0, 1).toISOString(),
      bonus: 0 + index * 100,
      efficiency: (index % 100) / 100, // Efficiency between 0 and 1
      team: teams[index % teams.length],
      skills: skills.slice(0, 1 + (index % 4)).join(', '), // Randomly select 1 to 4 skills
      certifications: 0 + (index % 6),
      overtime: 0 + (index % 100),
      vacationDays: 0 + (index % 26),
      trainings: 0 + (index % 11),
      reportsTo: `Manager ${index + 1}`,
      office: `Office ${index + 1}`,
      expenses: 0 + index * 50,
      satisfaction: (index % 100) / 100, // Satisfaction between 0 and 1
      notes: `Note for employee ${index + 1}`,
    }));
    resolve(data);
  });
}
