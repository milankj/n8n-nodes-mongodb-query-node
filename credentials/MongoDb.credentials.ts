import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class MongoDb implements ICredentialType {
    name = 'mongoDb';
    displayName = 'MongoDB';
    documentationUrl = '';
    properties: INodeProperties[] = [
        {
            displayName: 'Database',
            name: 'database',
            type: 'string',
            default: '',
            required: true,
        },
        {
            displayName: 'Connection Type',
            name: 'connectionType',
            type: 'options',
            options: [
                {
                    name: 'Connection String',
                    value: 'connectionString',
                },
                {
                    name: 'Host and Port',
                    value: 'hostAndPort',
                },
            ],
            default: 'connectionString',
        },
        {
            displayName: 'Connection String',
            name: 'connectionString',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['connectionString'],
                },
            },
            description: 'The connection string for your MongoDB database (e.g. mongodb+srv://user:pass@cluster.mongodb.net/test)',
        },
        {
            displayName: 'Host',
            name: 'host',
            type: 'string',
            default: 'localhost',
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['hostAndPort'],
                },
            },
        },
        {
            displayName: 'Port',
            name: 'port',
            type: 'number',
            default: 27017,
            required: true,
            displayOptions: {
                show: {
                    connectionType: ['hostAndPort'],
                },
            },
        },
        {
            displayName: 'User',
            name: 'user',
            type: 'string',
            default: '',
            displayOptions: {
                show: {
                    connectionType: ['hostAndPort'],
                },
            },
        },
        {
            displayName: 'Password',
            name: 'password',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            displayOptions: {
                show: {
                    connectionType: ['hostAndPort'],
                },
            },
        },
    ];
}
