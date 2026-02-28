import { MongoClient, ObjectId } from 'mongodb';
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
// import { MongoDb } from '../../Credentials/Mongodb.Credentials';

export class MongodbQuery implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mongo JSON Query Builder',
		name: 'mongoJsonQueryBuilder',
		icon: { light: 'file:mongo-json-query-builder.svg', dark: 'file:mongo-json-query-builder.svg' },
		group: ['input'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {
			name: 'Mongo JSON Query Builder',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: "mongoDb",
				required: true
			}
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: "Find",
						value: "find",
						description: "Mongo find operation",
					},
					{
						name: "Insert",
						value: "insert",
						description: "Mongo insert operation"
					},
					{
						name: "Update",
						value: "update",
						description: "Mongo update operation"
					},
					{
						name: "Delete",
						value: "delete",
						description: "Mongo delete operation"
					}
				],
				default: 'find',
				description: 'Select the operation for query',
			},
			{
				displayName: 'Collection',
				name: 'collection',
				type: 'string',
				default: '',
				required: true,
				description: 'Select the operation for query',
			},
			{
				displayName: 'Query (JSON)',
				name: 'query',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['find', 'delete'],
					},
				},
				description: 'A JSON object defining the search query. Example: {"name": "John"}',
			},
			{
				displayName: 'Filter (JSON)',
				name: 'updateFilter',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'A JSON object defining the filter condition. Example: {"_id": "123"}',
			},
			{
				displayName: 'Update (JSON)',
				name: 'updateData',
				type: 'json',
				default: '{"$set": {}}',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'A JSON object defining the update operations. Example: {"$set": {"status": "active"}}',
			},
			{
				displayName: 'Upsert',
				name: 'upsert',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'Whether to perform an insert if no documents match the update filter',
			},
			{
				displayName: 'Return Updated Document',
				name: 'returnUpdatedDocument',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				description: 'Whether to return the modified document instead of the update stats. Note: This will only update and return the first matching document.',
			},
			{
				displayName: 'Document(s) (JSON)',
				name: 'insertDocument',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['insert'],
					},
				},
				description: 'A JSON object (or array of objects) defining the document(s) to insert. Example: {"name": "John", "age": 30}',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['find'],
					},
				},
				options: [
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 10,
						description: 'Max number of results to return',
					},
					{
						displayName: 'Skip',
						name: 'skip',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						description: 'Number of results to skip',
					},
					{
						displayName: 'Sort (JSON)',
						name: 'sort',
						type: 'json',
						default: '{}',
						description: 'A JSON object defining the sorting order. Example: {"createdAt": -1}',
					},
					{
						displayName: 'Projection (JSON)',
						name: 'projection',
						type: 'json',
						default: '{}',
						description: 'A JSON object defining which fields to include/exclude. Example: {"_id": 0, "name": 1}',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const credentials = await this.getCredentials('mongoDb');
		const client = new MongoClient(credentials.connectionString as string);
		await client.connect();
		try {
			const db = client.db(credentials.database as string);
			db.databaseName;
			const length = items.length;
			for (let itemIndex = 0; itemIndex < length; itemIndex++) {
				try {
					const operation = this.getNodeParameter('operation', itemIndex) as string;
					const collectionName = this.getNodeParameter('collection', itemIndex) as string;
					const query = this.getNodeParameter('query', itemIndex, {}) as string;
					this.logger.debug("geelo", { query });
					const parsedQuery = typeof query === 'string' ? JSON.parse(query || '{}') : query;
					this.logger.debug("parsedQuery", { parsedQuery });
					if (operation === 'find') {
						for (const key in parsedQuery) {
							const value = parsedQuery[key];
							if (value && typeof value === "object" && "$oid" in value && typeof value.$oid === "string"
							) {
								parsedQuery[key] = new ObjectId(value.$oid);
							}
						}
						const options = this.getNodeParameter('options', itemIndex, {}) as any;

						const limit = options.limit as number | undefined;
						const skip = options.skip as number | undefined;
						const sortCode = options.sort as string | undefined;
						const projectionCode = options.projection as string | undefined;

						const sort = sortCode ? (typeof sortCode === 'string' ? JSON.parse(sortCode) : sortCode) : undefined;
						const projection = projectionCode ? (typeof projectionCode === 'string' ? JSON.parse(projectionCode) : projectionCode) : undefined;

						const collection = db.collection(collectionName);

						let findCursor = collection.find(parsedQuery);

						if (sort) {
							findCursor = findCursor.sort(sort);
						}

						if (skip !== undefined) {
							findCursor = findCursor.skip(skip);
						}

						if (limit !== undefined) {
							findCursor = findCursor.limit(limit);
						}

						if (projection) {
							findCursor = findCursor.project(projection);
						}


						const resultItems = await findCursor.toArray();

						// If no items were returned, clear the input item to avoid returning empty results
						if (resultItems.length === 0) {
							items[itemIndex].json = {};
						} else {
							resultItems.forEach((result, index) => {
								if (index === 0) {
									// For the first item, replace the existing item
									items[itemIndex].json = result;
								} else {
									// For subsequent items, add to the output data
									items.push({
										json: result,
										pairedItem: itemIndex,
									});
								}
							});
						}

					} else if (operation === 'update') {
						const updateFilterStr = this.getNodeParameter('updateFilter', itemIndex, {}) as string;
						const updateDataStr = this.getNodeParameter('updateData', itemIndex, {}) as string;

						let updateFilter = typeof updateFilterStr === 'string' ? JSON.parse(updateFilterStr || '{}') : updateFilterStr;
						const updateData = typeof updateDataStr === 'string' ? JSON.parse(updateDataStr || '{"$set": {}}') : updateDataStr;

						const upsert = this.getNodeParameter('upsert', itemIndex, false) as boolean;
						const returnUpdatedDocument = this.getNodeParameter('returnUpdatedDocument', itemIndex, false) as boolean;

						const collection = db.collection(collectionName);

						let result;
						try {
							for (const key in updateFilter) {
								const value = updateFilter[key];

								if (value && typeof value === "object" && "$oid" in value && typeof value.$oid === "string"
								) {
									updateFilter[key] = new ObjectId(value.$oid);
								}
							}
							result = await collection.updateMany(updateFilter, updateData, { upsert });
							if (returnUpdatedDocument) {
								const returnCursor = collection.find(updateFilter);
								const returnResult = await returnCursor.toArray();
								returnResult.forEach((result, index) => {
									if (index === 0) {
										items[itemIndex].json = result;
									} else {
										items.push({
											json: result,
											pairedItem: itemIndex,
										});
									}
								});
							} else {
								items[itemIndex].json = {
									matchedCount: result.matchedCount,
									modifiedCount: result.modifiedCount,
								}
								if (result.upsertedId) {
									items[itemIndex].json.upsertedId = result.upsertedId;
									items[itemIndex].json.upsertedCount = result.upsertedCount;
								}
							}
						} catch (error) {
							items[itemIndex].json = { error: error.message };
							if (!this.continueOnFail()) {
								throw error;
							}
						}

					} else if (operation === 'delete') {
						let deleteQueryStr = this.getNodeParameter('query', itemIndex, {}) as string;
						let deleteQuery = typeof deleteQueryStr === 'string' ? JSON.parse(deleteQueryStr || '{}') : deleteQueryStr;
						const collection = db.collection(collectionName);
						try {
							for (const key in deleteQuery) {
								const value = deleteQuery[key];

								if (value && typeof value === "object" && "$oid" in value && typeof value.$oid === "string") {
									deleteQuery[key] = new ObjectId(value.$oid);
								}
							}

							const result = await collection.deleteMany(deleteQuery);

							items[itemIndex].json = {
								deletedCount: result.deletedCount,
								acknowledged: result.acknowledged
							};
						} catch (error) {
							items[itemIndex].json = { error: error.message };
							if (!this.continueOnFail()) {
								throw error;
							}
						}
					} else if (operation === 'insert') {
						const insertDocStr = this.getNodeParameter('insertDocument', itemIndex, {}) as string;
						const insertDoc = typeof insertDocStr === 'string' ? JSON.parse(insertDocStr || '{}') : insertDocStr;

						const collection = db.collection(collectionName);
						try {
							if (Array.isArray(insertDoc)) {
								await collection.insertMany(insertDoc);

								insertDoc.forEach((doc, index) => {
									if (index === 0) {
										items[itemIndex].json = doc;
									} else {
										items.push({
											json: doc,
											pairedItem: itemIndex,
										});
									}
								});
							} else {
								await collection.insertOne(insertDoc);
								items[itemIndex].json = {
									...insertDoc
								};
							}
						} catch (error) {
							items[itemIndex].json = { error: error.message };
							if (!this.continueOnFail()) {
								throw error;
							}
						}
					} else {
						// Fallback for missing operation
						items[itemIndex].json = { error: 'Operation not implemented' };
					}

				} catch (error) {
					// This node should never fail but we want to showcase how
					// to handle errors.
					if (this.continueOnFail()) {
						items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
					} else {
						// Adding `itemIndex` allows other workflows to handle this error
						if (error.context) {
							// If the error thrown already contains the context property,
							// only append the itemIndex
							error.context.itemIndex = itemIndex;
							throw error;
						}
						throw new NodeOperationError(this.getNode(), error, {
							itemIndex,
						});
					}
				}
			}
		} finally {
			await client.close();
		}
		return [items];
	}
}
