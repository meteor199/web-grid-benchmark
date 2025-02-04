import { ColumnDefinition } from './types';
import { faker } from '@faker-js/faker';

export const columns: ColumnDefinition[] = [
  { field: 'id', header: 'ID', type: 'string', width: 120, pinned: true },
  {
    field: 'name',
    header: 'Name',
    type: 'string',
    width: 150,
    pinned: true,
    sortable: true,
  },
  { field: 'email', header: 'Email', type: 'string', width: 250 },
  { field: 'age', header: 'Age', type: 'number', width: 80, sortable: true },
  { field: 'salary', header: 'Salary', type: 'currency', width: 120 },
  {
    field: 'department',
    header: 'Department',
    type: 'string',
    width: 150,
    filterable: true,
  },
  {
    field: 'performance',
    header: 'Performance',
    type: 'percentage',
    width: 100,
  },
  { field: 'position', header: 'Position', type: 'string', width: 150 },
  { field: 'startDate', header: 'Start Date', type: 'date', width: 150 },
  { field: 'isActive', header: 'Active', type: 'boolean', width: 80 },

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

export const DATA_ENUM_DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
  'IT',
  'Legal',
];
export const DEPARTMENT_COLORS: { [key: string]: string } = {
  Engineering: '#e6f3ff', // 
  Sales: '#fff0e6', // 
  Marketing: '#f0e6ff', // 
  HR: '#e6ffed', // 
  Finance: '#fff0f0', // 
  Operations: '#f0f0e6', // 
  IT: '#e6fff0', // 
  Legal: '#f0f0ff', // 
};

export function getDepartmentColor(department: string): string {
  return DEPARTMENT_COLORS[department] || '#ccc';
}

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

export async function generateGridData(): Promise<EmployeeModel[]> {
  return (await fetch(`http://${getBaseUrl()}/test-data.json`)).json();
}
export interface EmployeeModel {
  id: string;
  name: string;
  email: string;
  age: number;
  salary: number;
  department: string;
  position: string;
  startDate: string;
  isActive: boolean;
  performance: number;
  phone: string;
  address: string;
  city: string;
  country: string;
  projects: number;
  rating: number;
  lastEvaluation: string;
  bonus: number;
  efficiency: number;
  team: string;
  skills: string;
  certifications: number;
  overtime: number;
  vacationDays: number;
  trainings: number;
  reportsTo: string;
  office: string;
  expenses: number;
  satisfaction: number;
  notes: string;
}
export function generateGridDataItem(index: number): EmployeeModel {
  return {
    id: `EMP${String(index + 1).padStart(6, '0')}`,
    name: `Employee ${index + 1}`,
    email: `employee${index + 1}@example.com`,
    age: 22 + (index % 43), // Age between 22 and 65
    salary: 30000 + index * 1000, // Salary between 30000 and 150000
    department: DATA_ENUM_DEPARTMENTS[index % DATA_ENUM_DEPARTMENTS.length],
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
  };
}

export function isDev() {
  return ['/', '/index.html', ''].includes(
    globalThis?.location?.pathname
  )
}

/**
 * Base URL for API requests.
 * Use 'localhost:6174' during development and the test server's domain for benchmark testing.
 */
function getBaseUrl() {
  const baseUrl = isDev()
    ? 'localhost:6174'
    : globalThis?.location?.host;

  return baseUrl;
}

export function generateGridDataUseFaker(index: number): EmployeeModel {
  return {
    id: `EMP${String(index + 1).padStart(6, '0')}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 22, max: 65 }),
    salary: faker.number.float({ min: 30000, max: 150000, fractionDigits: 2 }),
    department: faker.helpers.arrayElement(DATA_ENUM_DEPARTMENTS),
    position: faker.helpers.arrayElement(positions),
    startDate: faker.date.past({ years: 10 }).toISOString(),
    isActive: faker.datatype.boolean(),
    performance: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    projects: faker.number.int({ min: 1, max: 10 }),
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    lastEvaluation: faker.date.recent({ days: 90 }).toISOString(),
    bonus: faker.number.float({ min: 0, max: 20000, fractionDigits: 2 }),
    efficiency: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    team: faker.helpers.arrayElement(teams),
    skills: faker.helpers.arrayElements(skills, { min: 1, max: 4 }).join(', '),
    certifications: faker.number.int({ min: 0, max: 5 }),
    overtime: faker.number.float({ min: 0, max: 100, fractionDigits: 1 }),
    vacationDays: faker.number.int({ min: 0, max: 25 }),
    trainings: faker.number.int({ min: 0, max: 10 }),
    reportsTo: faker.person.fullName(),
    office: faker.location.city(),
    expenses: faker.number.float({ min: 0, max: 5000, fractionDigits: 2 }),
    satisfaction: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    notes: faker.lorem.sentence(),
  };
}

export function startWs(
  query: { count?: number; interval?: number; isPushAllData?: boolean; total?: number } | undefined,
  callback: (data: EmployeeModel[]) => void,
  endCallback?: () => void,
) {
  const options = Object.assign(
    { count: 10, interval: 500, isPushAllData: false, total: 100000 },
    query || {}
  );

  const ws = new WebSocket(
    `ws://${getBaseUrl()}?count=${options.count}&interval=${options.interval}&total=${options.total}&isPushAllData=${options.isPushAllData ? '1' : '0'}`
  );

  // 
  ws.addEventListener('message', (event) => {
    if (event.data === 'null') {
      endCallback?.();
      return;
    }
    
    const data = JSON.parse(event.data);
    callback(data);
  });

  // 
  ws.addEventListener('close', () => {
    console.log('ws close');
  });
  closeWsFn = () => {
    ws.close();
  };
  return new Promise<void>((resolve, reject) => {
    // 
    ws.addEventListener('open', () => {
      console.log('ws connected');
      resolve();
    });
    ws.addEventListener('error', () => {
      console.log('ws connected');
      reject();
    });
  });
}
let closeWsFn: any;
export function stopWs() {
  closeWsFn?.();
}

export const GRID_CONFIG = {
  rowHeight: 24,
  // gridHeight: 800,
  // gridWidth: 1280,

  gridHeight: 600,
  gridWidth: 1080,
};

if (globalThis.document) {
  setTimeout(() => {
    const style = globalThis.document.createElement('style');
    style.innerHTML = `
    .grid-container {
      width: ${GRID_CONFIG.gridWidth}px;
      height: ${GRID_CONFIG.gridHeight}px;
    }
  `;
    globalThis.document.head.appendChild(style);
  });
}

export const GRID_CONFIG_STYLE_COL = 'department';
export const GRID_CONFIG_PERCENTAGE_COL = 'performance';
export const GRID_CONFIG_ICON_COL = 'name';


export async function updateDataByWs(gridData: EmployeeModel[], callback: () => void) {

  const map = new Map();
  gridData.forEach((item) => {
    map.set(item.id, item);
  });

  await startWs(undefined, (data) => {
    data.forEach((item) => {
      if (map.has(item.id)) {
        Object.assign(map.get(item.id), item);
      }
    });
    callback();
  });

}