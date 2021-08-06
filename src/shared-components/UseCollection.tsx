import { useState } from "react";

interface StateCollection<T> {
  value: T[]
  set: (value: T[]) => void
  remove: (value: T) => void
  add: (value: T) => void
}

export function useCollection<T>(initialState: T[] = []): StateCollection<T> {
  const [collection, setCollection] = useState<T[]>(initialState)

  return {
    value: collection,
    set: (t) => setCollection(t),
    add: (t) => setCollection([...collection, t]),
    remove: (t )=> setCollection(collection.filter(i => i !== t))
  }
}
