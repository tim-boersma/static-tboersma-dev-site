import { HttpRequest } from "@azure/functions/types/http";
import { TableClient } from'@azure/data-tables'
import { DefaultAzureCredential } from'@azure/identity'
import { ComputeManagementClient } from '@azure/arm-compute';

export function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

export function getOverrideTableClient(connectionString: string, tableName: string): TableClient {
    return TableClient.fromConnectionString(connectionString, tableName);
}

export async function writeOverride(
    storageConnection: string,
    tableName: string,
    overrideUntil: Date | null
): Promise<void> {
    const tableClient = getOverrideTableClient(storageConnection, tableName);

    const entity = {
        partitionKey: "vm",
        rowKey: "override",
        OverrideUntil: overrideUntil ? overrideUntil.toISOString() : ""
    };

    await tableClient.upsertEntity(entity);
}

export function getRequestedState(request: HttpRequest): boolean {
    const state = request.query.get("state");

    if (!state || (state !== "true" && state !== "false")) {
        throw new Error(`Invalid state value: ${state}`);
    }

    return state === "true";
}

export function getComputeClient(subscriptionId: string): ComputeManagementClient {
    const credential = new DefaultAzureCredential();
    return new ComputeManagementClient(credential, subscriptionId);
}
