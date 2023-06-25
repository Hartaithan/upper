const AGENT = process.env.NEXT_PUBLIC_SERVICE_AGENT ?? "";
const HOST = process.env.NEXT_PUBLIC_SERVICE_HOST ?? "";

export const baseHeaders = new Headers({
  "User-Agent": AGENT,
  host: HOST,
});
