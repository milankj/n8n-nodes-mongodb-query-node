# n8n-nodes-mongodb-query-node

This is an n8n community node for executing complex MongoDB operations directly via JSON queries.

The primary motivation for this node is the limitations of the official n8n MongoDB node. The original node does not allow you to easily use advanced MongoDB update operators—specifically operators like `$pull` to remove items from arrays, or passing entirely native JSON objects as queries to the database. This node bridges that gap by allowing you to map raw JSON directly into `find`, `insert`, `update`, and `delete` operations.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Features & Highlights

- **Advanced Update Operations**: Send raw JSON for the Update document (e.g., `{"$set": {"status": "active"}, "$inc": {"loginCount": 1}}`). This allows you to utilize everything MongoDB's driver supports natively!
- **Raw JSON Queries**: Construct dynamic JSON inputs through n8n expressions and pass them directly into MongoDB's `find`, `update`, `delete`, or `insert` actions.
- **Support for ObjectIds**: The node evaluates `{"$oid": "..."}` objects inside your filter queries and seamlessly parses them into actual MongoDB `ObjectId` types before querying the database.

## Operations

* **Find**: Retrieve documents using a JSON filter query. Supports sorting, skipping, limiting, and projection.
* **Insert**: Insert single or multiple documents defined via JSON.
* **Update**: Update documents matching a JSON filter query with a JSON update payload. Supports `upsert` and an option to return the updated document.
* **Delete**: Delete documents matching a given JSON filter query.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation. You can install it via the npm package name: `n8n-nodes-mongodb-query-node`.

## Compatibility

Tested against n8n ^1.0.0 and MongoDB driver ^7.1.0.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
