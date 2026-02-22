import { ICredentialType, INodeProperties } from 'n8n-workflow';
export class MongoDb implements ICredentialType {
  name = 'mongoDb';
  displayName = 'MongoDB';
  properties: INodeProperties[] = [
    {
      displayName: 'Connection String',
      name: 'connectionString',
      type: 'string',
      default: '',
      required: true,
    },
  ]
}
