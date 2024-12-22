import {
    boolean,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    uuid
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: serial().primaryKey(),
    email: text().notNull(),
    password: text().notNull(),
    name: text().notNull(),
    type: text().notNull().default("applicant"),
    contact: text()
});

export const sessions = pgTable("sessions", {
    id: uuid().defaultRandom().primaryKey(),
    userId: integer().references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    createdAt: timestamp().defaultNow()
})

export const jobs = pgTable("jobs", {
    id: serial().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    experience: text().default("Entry level"),
    department: text().notNull(),
    userId: integer().references(() => users.id, {
        onDelete: "cascade"
    }).notNull()
});

export const skills = pgTable("skills", {
    id: serial().primaryKey(),
    name: text().notNull(),
    jobId: integer().references(() => jobs.id, {
        onDelete: "cascade"
    }).notNull()
});

export const applications = pgTable("applications", {
    id: serial().primaryKey(),
    userId: integer().references(() => users.id, {
        onDelete: "cascade"
    }),
    jobId: integer().references(() => jobs.id, {
        onDelete: "cascade"
    }),
    resume: text().notNull(),
    score: integer().notNull().default(0),
    suggestions: text(),
    status: text().default("pending")
})

export const messages = pgTable("messages", {
    id: serial().primaryKey(),
    applicationId: integer().references(() => applications.id, {
        onDelete: "cascade"
    }),
    content: text().notNull(),
    role: text().default("user").notNull()
});