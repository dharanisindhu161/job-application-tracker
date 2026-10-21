const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to safely read JSON file
function readJson(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultValue;
  }
}

// Helper to safely write JSON file
function writeJson(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    throw err;
  }
}

// Initial seed data generator
function seedInitialData() {
  const users = readJson(USERS_FILE, []);
  let demoUser = users.find(u => u.email === 'demo@jobtracker.com');

  if (!demoUser) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('demo1234', salt);
    demoUser = {
      id: 'demo-user-id-001',
      name: 'Demo Candidate',
      email: 'demo@jobtracker.com',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(demoUser);
    writeJson(USERS_FILE, users);
  }

  const applications = readJson(APPLICATIONS_FILE, []);
  const demoApps = applications.filter(a => a.userId === demoUser.id);

  if (demoApps.length === 0) {
    const sampleApps = [
      {
        id: 'app-001',
        userId: demoUser.id,
        company: 'Stripe',
        role: 'Senior Full Stack Engineer',
        jobLink: 'https://stripe.com/jobs/full-stack-engineer',
        salaryExpectation: 165000,
        applicationDate: '2026-10-10',
        status: 'Interview',
        interviewDates: [
          {
            id: 'int-1',
            date: '2026-10-18T10:00:00.000Z',
            round: 'Recruiter Screen',
            notes: 'Discussion about experience with distributed systems and APIs.',
            completed: true
          },
          {
            id: 'int-2',
            date: '2026-10-25T14:30:00.000Z',
            round: 'System Design Interview',
            notes: 'Prepare payment pipeline architecture and cache invalidation.',
            completed: false
          }
        ],
        notes: 'Tech stack matches perfectly: Node.js, React, PostgreSQL. Strong recruiter rapport.',
        createdAt: '2026-10-10T09:00:00.000Z',
        updatedAt: '2026-10-18T11:00:00.000Z'
      },
      {
        id: 'app-002',
        userId: demoUser.id,
        company: 'Vercel',
        role: 'Frontend Architect',
        jobLink: 'https://vercel.com/careers/frontend-architect',
        salaryExpectation: 175000,
        applicationDate: '2026-10-05',
        status: 'Offer',
        interviewDates: [
          {
            id: 'int-3',
            date: '2026-10-12T15:00:00.000Z',
            round: 'Technical Deep-Dive',
            notes: 'Discussed SSR, Edge runtime, and Next.js compiler performance.',
            completed: true
          },
          {
            id: 'int-4',
            date: '2026-10-16T16:00:00.000Z',
            round: 'VP of Engineering Round',
            notes: 'Culture, product roadmap, and technical leadership discussion.',
            completed: true
          }
        ],
        notes: 'Received written offer: $175,000 base + equity package. Decision deadline Nov 1st.',
        createdAt: '2026-10-05T08:30:00.000Z',
        updatedAt: '2026-10-19T17:00:00.000Z'
      },
      {
        id: 'app-003',
        userId: demoUser.id,
        company: 'Linear',
        role: 'Product Engineer',
        jobLink: 'https://linear.app/careers',
        salaryExpectation: 155000,
        applicationDate: '2026-10-14',
        status: 'Interview',
        interviewDates: [
          {
            id: 'int-5',
            date: '2026-10-26T16:00:00.000Z',
            round: 'Pair Programming Exercise',
            notes: 'Live UI coding focusing on responsiveness and keyboard shortcuts.',
            completed: false
          }
        ],
        notes: 'Excited about their focus on high craftsmanship and speed. Reviewing sync engine docs.',
        createdAt: '2026-10-14T11:20:00.000Z',
        updatedAt: '2026-10-14T11:20:00.000Z'
      },
      {
        id: 'app-004',
        userId: demoUser.id,
        company: 'Datadog',
        role: 'Backend Platform Engineer',
        jobLink: 'https://careers.datadoghq.com',
        salaryExpectation: 160000,
        applicationDate: '2026-10-18',
        status: 'Applied',
        interviewDates: [],
        notes: 'Applied through employee referral from Alex on the telemetry team.',
        createdAt: '2026-10-18T14:15:00.000Z',
        updatedAt: '2026-10-18T14:15:00.000Z'
      },
      {
        id: 'app-005',
        userId: demoUser.id,
        company: 'Figma',
        role: 'Software Engineer - Canvas',
        jobLink: 'https://www.figma.com/careers',
        salaryExpectation: 170000,
        applicationDate: '2026-09-28',
        status: 'Rejected',
        interviewDates: [
          {
            id: 'int-6',
            date: '2026-10-04T13:00:00.000Z',
            round: 'Screening',
            notes: 'Good conversation, but team decided to prioritize candidates with C++/Wasm graphics background.',
            completed: true
          }
        ],
        notes: 'Constructive feedback received. Recommended to reapply in 6 months.',
        createdAt: '2026-09-28T10:00:00.000Z',
        updatedAt: '2026-10-06T12:00:00.000Z'
      },
      {
        id: 'app-006',
        userId: demoUser.id,
        company: 'Airbnb',
        role: 'Full Stack Software Engineer',
        jobLink: 'https://careers.airbnb.com',
        salaryExpectation: 168000,
        applicationDate: '2026-10-19',
        status: 'Applied',
        interviewDates: [],
        notes: 'Applied via company careers portal for guest experience team.',
        createdAt: '2026-10-19T16:40:00.000Z',
        updatedAt: '2026-10-19T16:40:00.000Z'
      }
    ];

    applications.push(...sampleApps);
    writeJson(APPLICATIONS_FILE, applications);
  }
}

// Seed on module load
seedInitialData();

// Export database operations
module.exports = {
  USERS_FILE,
  APPLICATIONS_FILE,
  readJson,
  writeJson,
  seedInitialData,

  // User queries
  findUserByEmail(email) {
    const users = readJson(USERS_FILE, []);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserById(id) {
    const users = readJson(USERS_FILE, []);
    return users.find(u => u.id === id);
  },

  createUser(userData) {
    const users = readJson(USERS_FILE, []);
    users.push(userData);
    writeJson(USERS_FILE, users);
    return userData;
  },

  // Application queries
  findApplications(userId, { status, search, sortBy = 'applicationDate', sortOrder = 'desc' } = {}) {
    let apps = readJson(APPLICATIONS_FILE, []).filter(a => a.userId === userId);

    // Filter by status
    if (status && status !== 'All') {
      apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by search term
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      apps = apps.filter(a =>
        (a.company && a.company.toLowerCase().includes(q)) ||
        (a.role && a.role.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      );
    }

    // Sorting
    apps.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'salaryExpectation') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else if (sortBy === 'applicationDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return apps;
  },

  findApplicationById(id, userId) {
    const apps = readJson(APPLICATIONS_FILE, []);
    return apps.find(a => a.id === id && a.userId === userId);
  },

  createApplication(appData) {
    const apps = readJson(APPLICATIONS_FILE, []);
    apps.push(appData);
    writeJson(APPLICATIONS_FILE, apps);
    return appData;
  },

  updateApplication(id, userId, updates) {
    const apps = readJson(APPLICATIONS_FILE, []);
    const index = apps.findIndex(a => a.id === id && a.userId === userId);
    if (index === -1) return null;

    apps[index] = {
      ...apps[index],
      ...updates,
      id: apps[index].id,
      userId: apps[index].userId,
      updatedAt: new Date().toISOString()
    };

    writeJson(APPLICATIONS_FILE, apps);
    return apps[index];
  },

  updateStatus(id, userId, newStatus) {
    const apps = readJson(APPLICATIONS_FILE, []);
    const index = apps.findIndex(a => a.id === id && a.userId === userId);
    if (index === -1) return null;

    apps[index].status = newStatus;
    apps[index].updatedAt = new Date().toISOString();

    writeJson(APPLICATIONS_FILE, apps);
    return apps[index];
  },

  deleteApplication(id, userId) {
    const apps = readJson(APPLICATIONS_FILE, []);
    const initialLen = apps.length;
    const filtered = apps.filter(a => !(a.id === id && a.userId === userId));

    if (filtered.length === initialLen) {
      return false;
    }

    writeJson(APPLICATIONS_FILE, filtered);
    return true;
  },

  getStats(userId) {
    const apps = readJson(APPLICATIONS_FILE, []).filter(a => a.userId === userId);

    const total = apps.length;
    const stages = {
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    let salarySum = 0;
    let salaryCount = 0;
    let minSalary = null;
    let maxSalary = null;

    const upcomingInterviews = [];
    const now = new Date();

    apps.forEach(app => {
      // Stage counting
      const st = app.status;
      if (stages[st] !== undefined) {
        stages[st]++;
      } else {
        stages[st] = 1;
      }

      // Salary aggregation
      const sal = Number(app.salaryExpectation);
      if (!isNaN(sal) && sal > 0) {
        salarySum += sal;
        salaryCount++;
        if (minSalary === null || sal < minSalary) minSalary = sal;
        if (maxSalary === null || sal > maxSalary) maxSalary = sal;
      }

      // Upcoming interviews
      if (Array.isArray(app.interviewDates)) {
        app.interviewDates.forEach(interview => {
          const d = new Date(interview.date);
          if (d >= now && !interview.completed) {
            upcomingInterviews.push({
              applicationId: app.id,
              company: app.company,
              role: app.role,
              date: interview.date,
              round: interview.round,
              notes: interview.notes
            });
          }
        });
      }
    });

    upcomingInterviews.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const avgSalary = salaryCount > 0 ? Math.round(salarySum / salaryCount) : 0;
    const interviewRate = total > 0 ? Math.round(((stages.Interview + stages.Offer) / total) * 100) : 0;
    const offerRate = total > 0 ? Math.round((stages.Offer / total) * 100) : 0;

    return {
      total,
      stages,
      metrics: {
        interviewRate,
        offerRate,
        averageSalary: avgSalary,
        minSalary: minSalary || 0,
        maxSalary: maxSalary || 0,
        salaryCount
      },
      upcomingInterviews,
      recentApplications: apps
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.applicationDate).getTime() - new Date(a.createdAt || a.applicationDate).getTime())
        .slice(0, 5)
    };
  }
};
