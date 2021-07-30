import {useState} from "react";

function usePromise<T>(p: () => Promise<T>, onError: (cause: any) => void = (cause) => {throw cause}, onSuccess: (data: T) => void = () => {}): {
  isLoading: boolean, data: T | undefined, call: () => Promise<T>
} {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<T | undefined>(undefined)
  const call = () => {
    return p().then(res => {
      setIsLoading(false)
      setData(res)
      onSuccess(res)
      return res
    }, err => {
      setIsLoading(false)
      onError(err)
      throw err
    })
  }
  return {isLoading, data, call}
}

export default usePromise;
