import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
	const HOST = process.env.DB_HOST || 'localhost';
	const PORT = process.env.DB_PORT || 27017;
	const DATABASE = process.env.DB_DATABASE || 'files_manager';
	const url = `mongodb://${HOST}:${PORT}/${DATABASE}`;
	
	this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
	this.client.connect();
    }

    isAlive() {
	return this.client.isConnected();
    }

    async nbUsers() {
	const usersDb = this.client.db().collection('users');
	const numUsers = await usersDb.countDocuments();
	return numUsers;
    }

    async nbFiles() {
	const filesDb = this.client.db().collection('files');
	const numFiles = await filesDb.countDocuments();
	return numFiles;
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
