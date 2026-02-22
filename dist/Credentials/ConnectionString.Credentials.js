"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDb = void 0;
class MongoDb {
    constructor() {
        this.name = 'mongoDb';
        this.displayName = 'MongoDB';
        this.properties = [
            {
                displayName: 'Connection String',
                name: 'connectionString',
                type: 'string',
                default: '',
                required: true,
            },
        ];
    }
}
exports.MongoDb = MongoDb;
//# sourceMappingURL=ConnectionString.Credentials.js.map