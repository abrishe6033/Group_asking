const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    searchQuestions
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const questionValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 10, max: 255 }).withMessage('Title must be between 10 and 255 characters'),
    body('content')
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 20 }).withMessage('Content must be at least 20 characters')
];

// Routes
router.get('/search', searchQuestions);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/', protect, questionValidation, createQuestion);
router.put('/:id', protect, questionValidation, updateQuestion);
router.delete('/:id', protect, deleteQuestion);

module.exports = router;