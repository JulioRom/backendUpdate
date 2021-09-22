import { OPCUAClient, AttributeIds, TimestampsToReturn, StatusCodes, DataType } from "node-opcua";

////////////////////////////////////////////////////////////////////////////////////////
// TODO: dinamizar la funcion permitiendo añadir multiples nodeId en registros del OPC 
/////////////////////////////////////////////////////////////////////////////////////////77
const endpointUrl = "opc.tcp://192.168.0.1:6666";
const nodeId = "ns=4;i=2";

async function main() {

    try {
        //create the client with settings
        const client = OPCUAClient.create({
            endpointMustExist: false,
            connectionStrategy: {
                maxRetry: 2,
                initialDelay: 5,
                maxDelay: 10
            }
        });
        client.on("backoff", () => console.log("retrying connection"));

        //connect de client with the OPC UA server
        await client.connect(endpointUrl);


        const session = await client.createSession();

        const browseResult = await session.browse("RootFolder");

        console.log(browseResult.references.map((r) => r.browseName.toString()).join("\n"));

        const dataValue = await session.read({
            nodeId,
            attributeId: AttributeIds.Value
        });
        console.log(` value = ${dataValue.value.value.toString()}`);

        // step 5: install a subscription and monitored item
        const subscription = await session.createSubscription2({
            requestedPublishingInterval: 10,
            requestedLifetimeCount: 0.2, // 1000ms *100 every 2 minutes or so
            requestedMaxKeepAliveCount: 10, // every 10 seconds
            maxNotificationsPerPublish: 10,
            publishingEnabled: true,
            priority: 10
        });

        subscription
            .on("started", () => console.log("subscription started - subscriptionId=", subscription.subscriptionId))
            .on("keepalive", () => console.log("keepalive"))
            .on("terminated", () => console.log("subscription terminated"));


        const monitoredItem = await subscription.monitor({
            nodeId: nodeId,
            attributeId: AttributeIds.Value
        }, {
            samplingInterval: 100,
            discardOldest: true,
            queueSize: 10
        }, TimestampsToReturn.Both);


        monitoredItem.on("changed", (dataValue) =>
            console.log(` value = ${dataValue.value.value.toString()}`));

        await new Promise((resolve) => setTimeout(resolve, 500));

        await subscription.terminate();

        const statusCode = await session.write({
            nodeId: nodeId,
            attributeId: AttributeIds.Value,
            value: {
                statusCode: StatusCodes.Good,
                value: {
                    dataType: DataType.Boolean,
                    value: false
                }
            }
        });
        console.log("statusCode = ", statusCode.toString());

        console.log(" closing session");
        await session.close();

        await client.disconnect();
    } catch (err) {
        console.log("Error !!!", err);
        process.exit();
    }
}

main();