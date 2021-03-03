export function identity<T>(e: T): T {
  return e
}

export function groupBy<T,K>(list: T[], groupFn: (e: T) => K): Map<K,T[]> {
  return groupByAndMap(list, groupFn, identity)
}

export function groupByAndMap<T,K,R>(list: T[], groupFn: (e: T) => K, mapFn: (e: T) => R): Map<K,R[]> {
  return list.reduce((map: Map<K,R[]>, element: T) => {
    const key = groupFn(element);
    const previousValue = map.get(key) ?? [];
    previousValue.push(mapFn(element));
    map.set(key, previousValue);
    return map;
  },new Map<K, R[]>())
}
