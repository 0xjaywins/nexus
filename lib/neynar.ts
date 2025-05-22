"use server";
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_NEYNAR_API_KEY!,
});

const client = async () => {
  return new NeynarAPIClient(config);
};
export default client;
