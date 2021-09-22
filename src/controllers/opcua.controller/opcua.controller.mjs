import { OPCUAClient, AttributeIds, TimestampsToReturn, StatusCodes, DataType } from "node-opcua";

const greenLight = "ns=4;i=5";
const blueLight = { nodeId: "ns=4;i=2", attributeId: AttributeIds.Value };
const nodeId = "ns=4;i=2";
const endpointUrl = "opc.tcp://192.168.0.1:4840";

const options = {
    requestedPublishingInterval: 10,
    requestedLifetimeCount: 100, // 1000ms *100 every 2 minutes or so
    requestedMaxKeepAliveCount: 5,// every 10 seconds
    maxNotificationsPerPublish: 10,
    publishingEnabled: true,
    priority: 10
};
const clientSettings =  {
    endpointMustExist: false,
    connectionStrategy: {
        maxRetry: 5,
        initialDelay: 5,
        maxDelay: 10
    }
};
const booleanTrue = {
    dataType: DataType.Boolean,
    value: true
}
const dataWrite = {
    nodeId: greenLight,
    attributeId: AttributeIds.Value,
    value: {
        statusCode: StatusCodes.Good,
        value: booleanTrue
    }
};
const motinorSettings = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 10
}

export const reader = async (nodeId) => {

    try {
        //create the client with settings
        const client = OPCUAClient.create(clientSettings);
        client.on("backoff", () => console.log("retrying connection"));

        //connect de client with the OPC UA server 
        await client.connect(endpointUrl);

        const session = await client.createSession();

        const browseResult = await session.browse("RootFolder");

        // console.log(browseResult.references.map((r) => r.browseName.toString()).join("\n"));

        // Read the node and attributes
        const dataValue = await session.read({ nodeId: nodeId, attributeId: AttributeIds.Value });
        /* console.log(` value = ${dataValue.value.value}`);
        
        console.log(" closing session"); */
        
        await session.close();
        
        await client.disconnect();
        return  dataValue.value.value
    }
    catch (err) {
        console.log("Error !!!", err);
        process.exit();
    }
};

export const allocator = async (nodeId) => {

    try {
        //create the client with settings
        /* console.time("allocator")

        console.time("client"); */
        const client = OPCUAClient.create(clientSettings);
        client.on("backoff", () => console.log("retrying connection"));
        /* console.timeEnd("client") */

        //connect de client with the OPC UA server 
        /* console.time("URL"); */
        await client.connect(endpointUrl);
        /* console.timeEnd("URL")

        console.time("seasson") */
        const session = await client.createSession();
       /*  console.timeEnd("seasson"); */

        /* const subscription = await session.createSubscription2(options);
        console.log("4 Suscription started");

        subscription
            .on("started", () => console.log("subscription started - subscriptionId=", subscription.subscriptionId))
            .on("keepalive", () => console.log("keepalive"))
            .on("terminated", () => console.log("subscription terminated"));


        const monitoredItem = await subscription.monitor(blueLight, motinorSettings, TimestampsToReturn.Both);


        monitoredItem.on("changed", (dataValue) =>
            console.log(` value = ${dataValue.value.value.toString()}`));

        await new Promise((resolve) => setTimeout(resolve, 5));
        
        await subscription.terminate(); */

        /* console.time("Writing") */
        const statusCode = await session.write({
            nodeId: nodeId,
            attributeId: AttributeIds.Value,
            value: {
                statusCode: StatusCodes.Good,
                value: booleanTrue
            }
        });
        //console.log("6 statusCode = ", statusCode.toString());
        /* console.timeEnd("Writing")

        console.time("Close Session") */
        await session.close();
        /* console.timeEnd("Close Session")

        console.time("disconnect") */
        await client.disconnect();
        /* console.timeEnd("disconnect")

        console.timeEnd("allocator") */
        
    }
    catch (err) {
        console.log("Error !!!", err);
        process.exit();
    }
};


/* const value = await reader(nodeId);

console.log("value:", value);
allocator(); */