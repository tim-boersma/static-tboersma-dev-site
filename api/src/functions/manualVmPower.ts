import { app } from "@azure/functions";
import { HttpRequest, HttpResponseInit } from "@azure/functions/types/http";
import { InvocationContext } from "@azure/functions/types/InvocationContext";
import { getComputeClient, getRequestedState, getRequiredEnv, writeOverride } from "../utilities";

export async function manualVmPower(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {

  const storageConnection = getRequiredEnv("PLEX_STORAGE_CONNECTION_STRING");
  const tableName = getRequiredEnv("OVERRIDE_TABLE_NAME");
  const subscriptionId = getRequiredEnv("VM_SUBSCRIPTION_ID");
  const resourceGroup = getRequiredEnv("VM_RESOURCE_GROUP");
  const vmName = getRequiredEnv("VM_NAME");

  try {
    const requestedState = getRequestedState(request);
    context.log(`RequestedState=${requestedState}`);

    const client = getComputeClient(subscriptionId);

    const instanceView = await client.virtualMachines.instanceView(
      resourceGroup,
      vmName
    );

    const powerStatus = instanceView.statuses?.find(s =>
      s.code?.startsWith("PowerState/")
    )?.code;

    const canPowerOff = powerStatus === "PowerState/running";
    const canPowerOn =
      powerStatus === "PowerState/stopped" ||
      powerStatus === "PowerState/deallocated";

    if (requestedState && canPowerOn) {
      const overrideUntil = new Date(Date.now() + 4 * 60 * 60 * 1000);

      await writeOverride(storageConnection, tableName, overrideUntil);

      //nondeprecated methods don't allow for no-wait, more robust solution would involve implenting a queue to handle power operations
      await client.virtualMachines.beginStart(resourceGroup, vmName);

      context.log(`Starting VM until ${overrideUntil.toISOString()}`);

      return {
        status: 202,
        body: `VM starting. Override until ${overrideUntil.toISOString()}`
      };
    }

    if (!requestedState && canPowerOff) {

      //nondeprecated methods don't allow for no-wait, more robust solution would involve implenting a queue to handle power operations
      await client.virtualMachines.beginPowerOff(resourceGroup, vmName);

      await writeOverride(storageConnection, tableName, null);

      context.log("Stopping VM");

      return {
        status: 202,
        body: "VM stop initiated."
      };
    }

    return {
      status: 400,
      body: `Invalid operation. Current state: ${powerStatus}`
    };

  } catch (err: unknown) {
    if ((err as Error).message?.includes("state")) {
      return {
        status: 400,
        body: "Query param 'state' must be true or false."
      };
    }

    context.error(err);

    return {
      status: 500,
      body: "Failed to process VM request."
    };
  }
}

app.http("ManualVmPower", {
  methods: ["PUT"],
  route: "vm/manual",
  authLevel: "function",
  handler: manualVmPower
});

