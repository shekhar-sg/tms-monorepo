export type Priority = "none" | "urgent" | "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  description?: string;
  column: string;
  priority: Priority;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  labels: string[];
  dueDate?: string;
};

export type BoardItems = Record<string, Task[]>;

export type Column = {
  id: string;
  title: string;
};

export const columns: Column[] = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "review",
    title: "Review",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const initialItems: BoardItems = {
  todo: [
    {
      id: "task-1",
      title: "Design Homepage",
      description: "Create the initial homepage design and responsive layouts.",
      column: "todo",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Design", "Frontend"],
      dueDate: "2026-08-12",
    },
    {
      id: "task-2",
      title: "Create Login Page",
      description: "Implement the login page based on the Figma design.",
      column: "todo",
      priority: "urgent",
      assignee: {
        id: "user-2",
        name: "Rahul Sharma",
      },
      labels: ["Frontend", "Authentication"],
      dueDate: "2026-08-11",
    },
    {
      id: "task-3",
      title: "Setup Authentication Flow",
      column: "todo",
      priority: "high",
      assignee: {
        id: "user-3",
        name: "Ankit Verma",
      },
      labels: ["Backend", "Authentication"],
      dueDate: "2026-08-15",
    },
    {
      id: "task-4",
      title: "Create Dashboard Layout",
      column: "todo",
      priority: "medium",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Design", "Frontend"],
      dueDate: "2026-08-16",
    },
    {
      id: "task-5",
      title: "Define Database Schema",
      column: "todo",
      priority: "high",
      assignee: {
        id: "user-4",
        name: "Priya Singh",
      },
      labels: ["Backend", "Database"],
      dueDate: "2026-08-14",
    },
    {
      id: "task-6",
      title: "Create User Management UI",
      column: "todo",
      priority: "medium",
      labels: ["Frontend", "Users"],
    },
    {
      id: "task-7",
      title: "Add Empty States",
      column: "todo",
      priority: "low",
      labels: ["Frontend", "UI"],
    },
  ],

  "in-progress": [
    {
      id: "task-8",
      title: "Build Sidebar Navigation",
      column: "in-progress",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "Navigation"],
      dueDate: "2026-08-11",
    },
    {
      id: "task-9",
      title: "Implement Kanban Board",
      description: "Build columns, cards and board interactions.",
      column: "in-progress",
      priority: "urgent",
      assignee: {
        id: "user-2",
        name: "Rahul Sharma",
      },
      labels: ["Frontend", "Kanban"],
      dueDate: "2026-08-13",
    },
    {
      id: "task-10",
      title: "Implement Drag and Drop",
      column: "in-progress",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "Kanban"],
      dueDate: "2026-08-14",
    },
    {
      id: "task-11",
      title: "Create Task Modal",
      column: "in-progress",
      priority: "medium",
      assignee: {
        id: "user-3",
        name: "Ankit Verma",
      },
      labels: ["Frontend", "Forms"],
      dueDate: "2026-08-15",
    },
    {
      id: "task-12",
      title: "Connect Task API",
      column: "in-progress",
      priority: "high",
      assignee: {
        id: "user-4",
        name: "Priya Singh",
      },
      labels: ["Backend", "API"],
      dueDate: "2026-08-17",
    },
    {
      id: "task-13",
      title: "Implement Task Filtering",
      column: "in-progress",
      priority: "medium",
      labels: ["Frontend", "Filters"],
    },
  ],

  review: [
    {
      id: "task-14",
      title: "Review Dashboard Design",
      column: "review",
      priority: "medium",
      assignee: {
        id: "user-2",
        name: "Rahul Sharma",
      },
      labels: ["Design", "Review"],
      dueDate: "2026-08-11",
    },
    {
      id: "task-15",
      title: "Review Authentication API",
      column: "review",
      priority: "high",
      assignee: {
        id: "user-3",
        name: "Ankit Verma",
      },
      labels: ["Backend", "Authentication"],
      dueDate: "2026-08-12",
    },
    {
      id: "task-16",
      title: "Review Kanban Components",
      column: "review",
      priority: "medium",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "Kanban"],
    },
    {
      id: "task-17",
      title: "Test Responsive Layout",
      column: "review",
      priority: "low",
      labels: ["Testing", "Frontend"],
      dueDate: "2026-08-16",
    },
    {
      id: "task-18",
      title: "Review API Error Handling",
      column: "review",
      priority: "high",
      assignee: {
        id: "user-4",
        name: "Priya Singh",
      },
      labels: ["Backend", "API"],
      dueDate: "2026-08-14",
    },
  ],

  done: [
    {
      id: "task-19",
      title: "Setup Next.js Application",
      column: "done",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "Setup"],
      dueDate: "2026-08-05",
    },
    {
      id: "task-20",
      title: "Configure Tailwind CSS",
      column: "done",
      priority: "medium",
      assignee: {
        id: "user-2",
        name: "Rahul Sharma",
      },
      labels: ["Frontend", "Setup"],
      dueDate: "2026-08-06",
    },
    {
      id: "task-21",
      title: "Configure shadcn/ui",
      column: "done",
      priority: "medium",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "UI"],
      dueDate: "2026-08-07",
    },
    {
      id: "task-22",
      title: "Setup Monorepo",
      column: "done",
      priority: "high",
      assignee: {
        id: "user-3",
        name: "Ankit Verma",
      },
      labels: ["Architecture", "Setup"],
      dueDate: "2026-08-04",
    },
    {
      id: "task-23",
      title: "Create Dashboard Sidebar",
      column: "done",
      priority: "high",
      assignee: {
        id: "user-1",
        name: "Shekhar Gupta",
      },
      labels: ["Frontend", "Navigation"],
      dueDate: "2026-08-08",
    },
  ],
};


export interface Project {
  id: string;
  title: string;
  priority: Priority;
  lead?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Website Redesign",
    priority: "high",
    lead: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
    },
    dueDate: "Aug 18, 2026",
  },
  {
    id: "project-2",
    title: "Mobile App Development",
    priority: "urgent",
    lead: {
      id: "user-2",
      name: "Sarah Williams",
      avatar: "/avatars/sarah.jpg",
    },
    dueDate: "Aug 25, 2026",
  },
  {
    id: "project-3",
    title: "Marketing Campaign",
    priority: "medium",
    lead: {
      id: "user-3",
      name: "Michael Chen",
    },
    dueDate: "Sep 02, 2026",
  },
  {
    id: "project-4",
    title: "Customer Portal",
    priority: "high",
    lead: {
      id: "user-4",
      name: "Emily Davis",
    },
    dueDate: "Sep 10, 2026",
  },
  {
    id: "project-5",
    title: "Internal Admin Dashboard",
    priority: "low",
    lead: {
      id: "user-5",
      name: "Daniel Wilson",
      avatar: "/avatars/daniel.jpg",
    },
    dueDate: "Sep 15, 2026",
  },
  {
    id: "project-6",
    title: "API Migration",
    priority: "urgent",
    lead: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/avatars/alex.jpg",
    },
    dueDate: "Aug 30, 2026",
  },
  {
    id: "project-7",
    title: "Analytics & Reporting",
    priority: "medium",
    lead: {
      id: "user-6",
      name: "Olivia Martin",
    },
    dueDate: "Sep 22, 2026",
  },
  {
    id: "project-8",
    title: "Design System",
    priority: "high",
    lead: {
      id: "user-7",
      name: "James Taylor",
    },
    dueDate: "Oct 01, 2026",
  },
  {
    id: "project-9",
    title: "Performance Optimization",
    priority: "low",
    lead: {
      id: "user-3",
      name: "Michael Chen",
    },
  },
  {
    id: "project-10",
    title: "Authentication Upgrade",
    priority: "none",
    lead: {
      id: "user-4",
      name: "Emily Davis",
    },
    dueDate: "Oct 12, 2026",
  },
];