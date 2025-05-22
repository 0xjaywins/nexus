import { notificationConfig, tokens } from "../config/config";

// Interface for notification request payload
interface NotificationRequest {
  target_fids: number[]; // Farcaster IDs of users to notify
  notification: {
    title: string;
    body: string;
    target_url: string;
    uuid: string; // Unique identifier for the notification
  };
}

// Interface for notification delivery response
interface NotificationDelivery {
  fid: number;
  status: string; // e.g., "success", "failed"
}

// Neynar API base URL and key (from environment variable)
const NEYNAR_API_URL = "https://api.neynar.com";
const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
  throw new Error(
    "NEXT_PUBLIC_NEYNAR_API_KEY is not set in environment variables"
  );
}

/**
 * Publishes notifications to Frame interactors
 * @param targetFids - Array of Farcaster IDs to notify
 * @param title - Notification title
 * @param body - Notification body text
 * @param targetUrl - URL to direct users to
 * @returns Promise<NotificationDelivery[]> - Array of delivery statuses
 */
export async function publishFrameNotifications(
  targetFids: number[],
  title: string,
  body: string,
  targetUrl: string
): Promise<NotificationDelivery[]> {
  try {
    const requestBody: NotificationRequest = {
      target_fids: targetFids,
      notification: {
        title,
        body,
        target_url: targetUrl,
        uuid: crypto.randomUUID(), // Generate a unique UUID
      },
    };

    const response = await fetch(
      `${NEYNAR_API_URL}/v2/farcaster/frame/notifications`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NEYNAR_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.notification_deliveries || [];
  } catch (error) {
    console.error("Error publishing frame notifications:", error);
    throw new Error("Failed to publish frame notifications");
  }
}

/**
 * Handles incoming webhook events from NEYNAR_WEBHOOK_URL
 * @param event - Webhook event payload (structure depends on Neynar's implementation)
 * @returns Promise<void> - Processes the event (e.g., extracts price alerts or trends)
 */
export async function handleWebhookEvent(event: any): Promise<void> {
  try {
    console.log("Webhook event received:", event);

    // Customize this logic based on Neynar's webhook payload structure
    // Example: Check for price changes or trending tokens
    if (event.type === "price_update") {
      const { token, price, changePercentage } = event.data;
      if (
        notificationConfig.priceAlert.supportedTokens.includes(
          token.toUpperCase()
        ) &&
        Math.abs(changePercentage) >=
          notificationConfig.priceAlert.defaultThreshold
      ) {
        // Trigger notification (e.g., call publishFrameNotifications)
        console.log(
          `Price alert for ${token}: $${price} (${changePercentage}%)`
        );
      }
    } else if (event.type === "trending_token") {
      const { symbol, follows } = event.data;
      if (follows >= notificationConfig.trendingAlert.minFollows) {
        console.log(`Trending token: ${symbol} with ${follows} follows`);
      }
    }

    // Add your business logic here (e.g., store data, dispatch notifications)
  } catch (error) {
    console.error("Error processing webhook event:", error);
    throw new Error("Failed to process webhook event");
  }
}
