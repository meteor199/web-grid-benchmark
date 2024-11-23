import { faker } from '@faker-js/faker';

const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'IT', 'Legal'];
const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Associate', 'Director', 'Coordinator'];
const teams = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Omega'];
const skills = ['JavaScript', 'Python', 'Java', 'SQL', 'React', 'Angular', 'Node.js', 'AWS'];

self.onmessage = (e: MessageEvent) => {
  const { rows, seed } = e.data;
  
  // Set seed for consistent data generation
  faker.seed(seed);

  const data = Array.from({ length: rows }, (_, index) => ({
    id: `EMP${String(index + 1).padStart(6, '0')}`,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 22, max: 65 }),
    salary: faker.number.float({ min: 30000, max: 150000, precision: 2 }),
    department: faker.helpers.arrayElement(departments),
    position: faker.helpers.arrayElement(positions),
    startDate: faker.date.past({ years: 10 }).toISOString(),
    isActive: faker.datatype.boolean(),
    performance: faker.number.float({ min: 0, max: 1, precision: 2 }),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    projects: faker.number.int({ min: 1, max: 10 }),
    rating: faker.number.float({ min: 1, max: 5, precision: 1 }),
    lastEvaluation: faker.date.recent({ days: 90 }).toISOString(),
    bonus: faker.number.float({ min: 0, max: 20000, precision: 2 }),
    efficiency: faker.number.float({ min: 0, max: 1, precision: 2 }),
    team: faker.helpers.arrayElement(teams),
    skills: faker.helpers.arrayElements(skills, { min: 1, max: 4 }).join(', '),
    certifications: faker.number.int({ min: 0, max: 5 }),
    overtime: faker.number.float({ min: 0, max: 100, precision: 1 }),
    vacationDays: faker.number.int({ min: 0, max: 25 }),
    trainings: faker.number.int({ min: 0, max: 10 }),
    reportsTo: faker.person.fullName(),
    office: faker.location.city(),
    expenses: faker.number.float({ min: 0, max: 5000, precision: 2 }),
    satisfaction: faker.number.float({ min: 0, max: 1, precision: 2 }),
    notes: faker.lorem.sentence()
  }));

  self.postMessage(data);
};