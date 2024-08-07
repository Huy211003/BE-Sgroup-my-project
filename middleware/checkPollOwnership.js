const db = require('../database/connection');

const checkPollOwnership = async (req, res, next) => {
    try {
        const { pollId } = req.params;
        const userId = req.user.user_id;

        const query = 'SELECT user_id FROM polls WHERE poll_id = ?';
        const [rows] = await db.execute(query, [pollId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        const poll = rows[0];

        if (poll.user_id !== userId) {
            return res.status(403).json({ message: 'Forbidden: You are not allowed to modify this poll' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = checkPollOwnership;
