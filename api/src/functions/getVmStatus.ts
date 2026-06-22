
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getComputeClient, getRequiredEnv } from "../utilities";

export async function vmCurrentStatus(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {


  const subscriptionId: string = getRequiredEnv("VM_SUBSCRIPTION_ID");
  const resourceGroup: string = getRequiredEnv("VM_RESOURCE_GROUP");
  const vmName: string = getRequiredEnv("VM_NAME");

  try {
    context.log("VM status requested");

    const client = getComputeClient(subscriptionId);

    const instanceView = await client.virtualMachines.instanceView(
      resourceGroup,
      vmName
    );

    const powerState = instanceView.statuses
      ?.find(s => s.code?.startsWith("PowerState/"))
      ?.code
      ?.replace("PowerState/", "");

    return {
      status: 200,
      body: powerState ?? "unknown"
    };

  } catch (err: unknown) {
    context.error("VM status check failed", err);

    return {
      status: 500,
      body: "Failed to check VM status"
    };
  }
}

app.http("VmCurrentStatus", {
  methods: ["GET"],
  route: "vm/status",
  authLevel: "function",
  handler: vmCurrentStatus
});
