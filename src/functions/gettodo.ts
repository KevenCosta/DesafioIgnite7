import { document } from "../utils/dynamodbClient"

export const handler = async (event)=>{
    const {user_id} = event.pathParameters;

    const response = await document.query({
        TableName: "todo",
        IndexName: "user_id_index",
        KeyConditionExpression: "#user_id = :v_user_id",
        ExpressionAttributeNames: {
            "#user_id": "user_id"
        },
        ExpressionAttributeValues: {
            ":v_user_id": user_id
        }
    }).promise();
    
    const userAlreadyExists = response.Items[0];

    if(!userAlreadyExists){
        return {
            statusCode: 204,
            body: JSON.stringify({
            message: "Todo list empty for the filter!",
            todo:userAlreadyExists
            })
        }
    }

    return {
        statusCode: 200,
            body: JSON.stringify({
            todo:userAlreadyExists
            })
    }
}