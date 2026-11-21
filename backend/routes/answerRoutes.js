const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer
} = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const answerValidation = [
    body('content')
        .notEmpty().withMessage('Answer content is required')
        .isLength({ min: 10 }).withMessage('Answer must be at least 10 characters'),
    body('questionId')
        .notEmpty().withMessage('Question ID is required')
        .isInt().withMessage('Invalid question ID')
];

// Routes
router.post('/', protect, answerValidation, createAnswer);
router.put('/:id', protect, answerValidation, updateAnswer);
router.delete('/:id', protect, deleteAnswer);
router.put('/:id/accept', protect, acceptAnswer);

module.exports = router;