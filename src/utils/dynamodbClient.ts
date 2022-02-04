import { DynamoDB } from "aws-sdk"


const options = {
    region: "localhost",
    //dynamodb-local
    endpoint: "http://localhost:8000",
    accessKeyId: "x",
    secretAccessKey: "x"
}

export const document = new DynamoDB.DocumentClient(options)