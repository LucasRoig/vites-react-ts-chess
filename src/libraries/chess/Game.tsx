import {NormalizedGame} from "./NormalizedGame";

export type Headers = {
  [key: string]: string
}

export enum HeadersKeys {
  Event = "Event",
  Site = "Site",
  Date = "Date",
  Round = "Round",
  White = "White",
  Black = "Black",
  Result = "Result",
}

export function setHeader(game: NormalizedGame, key: HeadersKeys, value: string) {
  game.headers[key] = value
}

export function getHeader(gameOrHeaders: Headers | NormalizedGame, key: HeadersKeys): string {
  if (gameOrHeaders.headers) {
    return (gameOrHeaders as NormalizedGame).headers[key] || ""
  } else {
    return (gameOrHeaders as Headers)[key] || ""
  }
}

export function gameToString(gameOrHeaders: Headers | NormalizedGame): string {
  const headers: Headers = (gameOrHeaders as NormalizedGame).headers || gameOrHeaders as Headers;
  if (getHeader(headers, HeadersKeys.Black)) {
    return getHeader(headers, HeadersKeys.White) + " - " + getHeader(headers, HeadersKeys.Black)
  } else {
    return getHeader(headers, HeadersKeys.White)
  }
}
