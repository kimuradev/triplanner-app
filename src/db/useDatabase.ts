import { drizzle } from "drizzle-orm/expo-sqlite"
import { useSQLiteContext } from "expo-sqlite"

export function useDatabase<T extends Record<string, unknown>>({ schema }: { schema: T }) {
    const database = useSQLiteContext()
    const db = drizzle<T>(database, { schema: schema })

    return {
        db
    }
}