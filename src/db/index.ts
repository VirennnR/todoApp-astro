import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import Database from "better-sqlite3";
import { todos } from "./schema";

// Define types for our database operations
type TodoInsert = typeof todos.$inferInsert;
type TodoSelect = typeof todos.$inferSelect;

// Initialize SQLite database
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite);

// Create tables if they don't exist
const initDb = () => {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TEXT NOT NULL,
      completed INTEGER DEFAULT 0
    );
  `);
};

initDb();

// DB operations with proper typing
export const todoDb = {
  getAll: async (): Promise<TodoSelect[]> => {
    return await db.select().from(todos).all();
  },

  create: async (data: {
    title: string;
    description: string;
    created_at: string;
    completed?: boolean;
  }) => {
    try {
      const result = await db
        .insert(todos)
        .values({
          title: data.title,
          description: data.description,
          created_at: data.created_at,
          completed: data.completed ?? false,
        })
        .returning()
        .get();

      console.log("Created todo:", result);
      return result.id;
    } catch (error) {
      console.error("Failed to create todo:", error);
      throw error;
    }
  },

  update: async (
    id: number,
    data: Partial<TodoInsert>
  ): Promise<TodoSelect | undefined> => {
    return await db
      .update(todos)
      .set(data)
      .where(eq(todos.id, id))
      .returning()
      .get();
  },

  delete: async (id: number): Promise<TodoSelect | undefined> => {
    return await db.delete(todos).where(eq(todos.id, id)).returning().get();
  },

  toggleComplete: async (id: number): Promise<TodoSelect | undefined> => {
    const todo = await db.select().from(todos).where(eq(todos.id, id)).get();

    if (todo) {
      return await db
        .update(todos)
        .set({ completed: !todo.completed })
        .where(eq(todos.id, id))
        .returning()
        .get();
    }

    return undefined;
  },
};
