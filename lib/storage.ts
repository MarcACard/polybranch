export const StorageKeys = {
    API_KEYS: "polybranch_api_keys",
    MODELS:"polybranch_models"
} as const

export const storage = {
    get: <T>(key: string): T | null => {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
    },
    set: <T>(key: string, value: T): void => {
        localStorage.setItem(key, JSON.stringify(value))
    }
}