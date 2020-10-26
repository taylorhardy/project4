import * as AWS from 'aws-sdk';
import { TodoItem } from '../models/TodoItem';
import * as uuid from 'uuid';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
const docClient = new AWS.DynamoDB.DocumentClient();

export async function getAllTodos(user): Promise<TodoItem[]> {
    const todos = await docClient.query({
        TableName: process.env.TODO_TABLE,
        IndexName: process.env.CREATED_AT_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': user
        },
    }).promise();

    return todos.Items as TodoItem[];
};

export async function createTodo(user: string, item: TodoItem): Promise<TodoItem> {
    const todoId = uuid.v4();
    const today = new Date();
    const newTodo: CreateTodoRequest = {
        userId: user,
        todoId: todoId,
        createdAt: today.toISOString(),
        name: item.name,
        dueDate: item.dueDate,
        done: false,
        attachmentUrl: `https://${process.env.ATTACHMENT_BUCKET}.s3.amazonaws.com/${todoId}`
    };

    await docClient.put({
        TableName: process.env.TODO_TABLE,
        Item: newTodo
    }).promise()

    return newTodo as TodoItem;
};

export async function deleteTodo(user: string, todoId) {
    await docClient.delete({
        TableName: process.env.TODO_TABLE,
        Key: {
            userId: user,
            todoId: todoId
        }
    }).promise()
};

export async function updateTodo(user, todoId, updatedTodo) {
    const item = await docClient.update({
        TableName: process.env.TODO_TABLE,
        Key: {
            userId: user,
            todoId: todoId
        },
        UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done ",
        ExpressionAttributeValues: {
            ":name": updatedTodo.name,
            ":dueDate": updatedTodo.dueDate,
            ":done": updatedTodo.done
        },
        ExpressionAttributeNames: {
            "#name": "name"
        }
    }).promise();
};