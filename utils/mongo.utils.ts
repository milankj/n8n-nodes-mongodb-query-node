import { MongoClient } from 'mongodb';

export async function connectMongodbClient(){

    const connectionString = '';

    await MongoClient.connect(connectionString);
}