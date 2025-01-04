import {
    boolean,
    integer,
    pgTable,
    PgVector,
    serial,
    text,
    timestamp,
    uuid,
    vector
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
    id: serial().primaryKey(),
    email: text().notNull(),
    password: text().notNull(),
    name: text().notNull(),
    type: text().notNull().default("applicant"),
    contact: text(),
    resume: text(),
    resumeEmbeddings: vector({dimensions: 768})
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
    }).notNull(),
    embeddings: vector({dimensions: 768})
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