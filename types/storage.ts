import { StorageKeys } from "@/constants/storage-keys"

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];