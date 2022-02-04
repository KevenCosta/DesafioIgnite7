import { document } from "../utils/dynamodbClient"
import { v4 as uuid } from 'uuid';

interface IRequest {
    title:string;
    deadline: Date;
}

interface ICreateTodo {
    id: string;
    user_id: string;
    title: string;
    done: boolean;
    deadline: Date;
}

export const handler = async (event)=>{
    const {user_id} = event.pathParameters;
    const {title, deadline} = JSON.parse(event.body) as IRequest
    
    const todo:ICreateTodo = {
        id: uuid(),
        user_id: user_id,
        title: title,
        done: false,
        deadline:deadline
    }
    
    //insert na tabela
    await document.put({
        TableName: "todo",
        Item: {
            id: todo.id,
            user_id: todo.user_id,
            title: todo.title,
            done: todo.done,
            deadline: todo.deadline
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
        message: "Todo created!",
        todo: todo
        })
    }
}