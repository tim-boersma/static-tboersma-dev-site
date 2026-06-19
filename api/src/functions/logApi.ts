import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as appInsights from "applicationinsights";

const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;

if (connectionString && !appInsights.defaultClient) {
  appInsights.setup(connectionString)
    .setAutoCollectConsole(false)
    .setAutoCollectExceptions(false)
    .setAutoCollectRequests(false)
    .start();
}

type ProxyErrorContext = {
  route?: string;
  targetPath?: string;
  method?: string;
  upstreamStatus?: number | string;
};

type LogPayload = {
  message?: string;
  error?: unknown;
  context?: ProxyErrorContext;
};

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(typeof error === "string" ? error : JSON.stringify(error));
}

export async function logHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  try {
    const body = (await request.json()) as LogPayload;

    const client = appInsights.defaultClient;

    if (!client) {
      context.warn("App Insights not configured");
      return { status: 202 };
    }

    const trackedError = toError(body.error ?? body.message ?? "Unknown error");

    client.trackException({
      exception: trackedError,
      properties: {
        route: body.context?.route,
        targetPath: body.context?.targetPath,
        method: body.context?.method,
        upstreamStatus: body.context?.upstreamStatus
          ? String(body.context.upstreamStatus)
          : "unknown",
      }
    });

    // Optional: add trace log too
    if (body.message) {
      client.trackTrace({
        message: body.message,
        properties: body.context
      });
    }

    client.flush();

    return { status: 202 };

  } catch (err) {
    context.error("Log API failed", err);

    return {
      status: 400,
      body: "Invalid log payload"
    };
  }
}

app.http("LogApi", {
  methods: ["POST"],
  route: "log",
  authLevel: "function",
  handler: logHandler,
});