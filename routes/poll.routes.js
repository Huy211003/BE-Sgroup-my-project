const express = require('express')
const router = express.Router();
const pollController = require('../controllers/poll.controller')
const authenticateToken = require('../middleware/auth');
const checkPollOwnership  = require('../middleware/checkPollOwnership');

router.put('/:pollId', authenticateToken.authenticateToken, checkPollOwnership, pollController.updatePoll);
router.delete('/:pollId', authenticateToken.authenticateToken, checkPollOwnership, pollController.deletePoll);

router.post('/create', authenticateToken.authenticateToken, pollController.createPoll);
router.get('/:pollId', authenticateToken.authenticateToken, pollController.getPoll);
router.post('/:pollId/options', authenticateToken.authenticateToken, pollController.createOption);
router.post('/:pollId/vote', authenticateToken.authenticateToken, pollController.vote);
router.delete('/:pollId/vote', authenticateToken.authenticateToken, pollController.unVote);
router.post('/:pollId/change-vote', authenticateToken.authenticateToken, pollController.changeVote);

module.exports = router;