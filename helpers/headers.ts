const AGENT = process.env.NEXT_PUBLIC_AGENT ?? "";
const HOST = process.env.NEXT_PUBLIC_HOST ?? "";

export const baseHeaders = new Headers({
  "User-Agent": AGENT,
  host: HOST,
});
