"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbQuery = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class MongodbQuery {
    constructor() {
        this.description = {
            displayName: 'Mongo Query',
            name: 'mongo-query',
            icon: { light: 'file:example.svg', dark: 'file:example.dark.svg' },
            group: ['input'],
            version: 1,
            description: 'Basic Example Node',
            defaults: {
                name: 'Mongo Query',
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            usableAsTool: true,
            credentials: [
                {
                    name: "mongoDb",
                    required: true
                }
            ],
            properties: [
                {
                    displayName: 'OK',
                    name: 'mongodbcredentials',
                    type: 'string',
                    default: '',
                    placeholder: 'Connection URL',
                    description: 'Mongo Connection URL',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        let item;
        let myString;
        for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
            try {
                myString = this.getNodeParameter('myString', itemIndex, '');
                item = items[itemIndex];
                item.json.myString = myString;
            }
            catch (error) {
                if (this.continueOnFail()) {
                    items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
                }
                else {
                    if (error.context) {
                        error.context.itemIndex = itemIndex;
                        throw error;
                    }
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), error, {
                        itemIndex,
                    });
                }
            }
        }
        return [items];
    }
}
exports.MongodbQuery = MongodbQuery;
//# sourceMappingURL=MongodbQuery.node.js.map