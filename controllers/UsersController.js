import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { createHash } from 'crypto';

class UsersController {
    static async postNew(req, res) {
	const { email } = req.body;
	const { password } = req.body;
	if (!email) {
	    res.status(400).json({ error: 'Missing email' });
	    return;
	}
	if (!password) {
	    res.status(400).json({ error: 'Missing password' });
	    return;
	}
	const users = dbClient.client.db().collection('users');

	const existingUser = await users.findOne({ email });

	if (existingUser) {
	    res.status(400).json({ error: 'Already exist' });
	    return;
	}

	const hshdPwd = createHash('sha1').update(password).digest('hex');
	const newUser = await users.insertOne({
	    email,
	    password: hshdPwd,
	});
	res.status(201).json({
	    id: newUser.insertedId,
	    email,
	});
    }
}

module.exports = UsersController;
