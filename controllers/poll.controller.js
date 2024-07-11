const db = require('../database/connection');

const createPoll = async (req, res,) => {
    try {
        // console.log('req.user:', req.user);
        const { title } = req.body;
        const userId = req.user.user_id;
        const query = 'INSERT INTO polls (title, user_id, createdAt, isLocked) VALUES (?, ?, NOW(), false)';
        const [result] = await db.execute(query, [title, userId])
        res.status(201).json({ message: 'Poll created successfully', pollId: result.insertId })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' })
    }
};

const updatePoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { title } = req.body;
        const query = 'UPDATE polls SET title = ? WHERE poll_id = ?';
        const [result] = await db.execute(query, [title, pollId]);
        res.status(200).json({ message: 'Poll updated successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deletePoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const query = 'DELETE FROM polls WHERE poll_id = ?';
        const [result] = await db.execute(query, [pollId]);
        res.status(200).json({ message: 'Poll deleted successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getPoll = async (req, res) => {
    try {
        const { pollId } = req.params;
        const query = 'SELECT * FROM polls WHERE poll_id = ?';
        const [rows] = await db.execute(query, [pollId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const poll = rows[0];
        res.status(200).json({ message: 'Poll retrieved successfully', poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const createOption = async (req, res) => {
    try {
        const { content } = req.body;
        const { pollId } = req.params;
        const query = 'INSERT INTO options (content, createdAt, poll_id) VALUES (?, NOW(), ?)';
        await db.execute(query, [content, pollId]);
        res.status(201).json({ message: 'Option created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' });
    }
}

const vote = async (req, res) => {
    try {
        const { optionId } = req.body;
        const userId = req.user.user_id;
        const query = 'INSERT INTO submission (user_id, option_id) VALUES (?, ?)';
        await db.execute(query, [userId, optionId]);
        res.status(200).json({ message: 'Vote submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const unVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const userId = req.user.user_id;
        const query = 'DELETE s FROM submission s JOIN options o ON s.option_id = o.option_id WHERE s.user_id = ? AND o.poll_id = ?';
        const values = [userId, pollId]
        const [result] = await db.execute(query, values);
        res.status(200).json({ message: 'Vote cancelled successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server Error' });
    }
}

const changeVote = async (req, res) => {
    try {
        const { pollId } = req.params;
        const { newOptionId } = req.body;
        const userId = req.user.user_id;

        const deleteQuery = 'DELETE s FROM submission s JOIN options o ON s.option_id = o.option_id WHERE s.user_id = ? AND o.poll_id = ?';
        await db.execute(deleteQuery, [userId, pollId]);

        const insertQuery = 'INSERT INTO submission (user_id, option_id) VALUES (?,?)';
        await db.execute(insertQuery, [userId, newOptionId]);

        res.status(200).json({ message: 'Vote changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = {
    createPoll,
    createOption,
    vote,
    unVote,
    updatePoll,
    deletePoll,
    getPoll,
    changeVote,
};