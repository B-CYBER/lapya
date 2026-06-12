import { getToken } from "@/lib/api";
import type { ChatMessage } from "@/types/chat";

interface StreamOptions {
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

/**
 * Calls POST /api/chat and streams `data: ` SSE chunks back via the supplied
 * callbacks. The reply is rendered token-by-token in the caller's UI.
 * Returns the AbortController so the caller can cancel on unmount.
 */
export function streamChat(
  messages: ChatMessage[],
  { onChunk, onDone, onError }: StreamOptions,
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const token = getToken();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data: ")) continue;
          const payload = event.slice(6);
          if (payload === "[DONE]") {
            onDone();
            return;
          }
          onChunk(payload);
        }
      }
      onDone();
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      onError(err instanceof Error ? err : new Error(String(err)));
    }
  })();

  return controller;
}
