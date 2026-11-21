const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// @desc    Create an answer
// @route   POST /api/answers
const createAnswer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { questionId, content } = req.body;
        const userId = req.user.id;

        // Check if question exists
        const [questions] = await pool.query(
            'SELECT * FROM questions WHERE id = ?',
            [questionId]
        );

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Insert answer
        const [result] = await pool.query(
            'INSERT INTO answers (question_id, user_id, content) VALUES (?, ?, ?)',
            [questionId, userId, content]
        );

        // Update answer count in questions table
        await pool.query(
            'UPDATE questions SET answers_count = answers_count + 1 WHERE id = ?',
            [questionId]
        );

        // Get the created answer with user info
        const [newAnswer] = await pool.query(`
            SELECT 
                a.*,
                u.username,
                u.first_name,
                u.last_name,
                u.profile_pic
            FROM answers a
            JOIN users u ON a.user_id = u.id
            WHERE a.id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Answer posted successfully',
            answer: newAnswer[0]
        });
    } catch (error) {
        console.error('Create answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while posting answer'
        });
    }
};

// @desc    Update an answer
// @route   PUT /api/answers/:id
const updateAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;
        const userId = req.user.id;
        const { content } = req.body;

        // Check if answer exists and belongs to user
        const [answers] = await pool.query(
            'SELECT * FROM answers WHERE id = ?',
            [answerId]
        );

        if (answers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        if (answers[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this answer'
            });
        }

        await pool.query(
            'UPDATE answers SET content = ? WHERE id = ?',
            [content, answerId]
        );

        res.json({
            success: true,
            message: 'Answer updated successfully'
        });
    } catch (error) {
        console.error('Update answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating answer'
        });
    }
};

// @desc    Delete an answer
// @route   DELETE /api/answers/:id
const deleteAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;
        const userId = req.user.id;

        // Check if answer exists and belongs to user
        const [answers] = await pool.query(
            'SELECT * FROM answers WHERE id = ?',
            [answerId]
        );

        if (answers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        if (answers[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this answer'
            });
        }

        const questionId = answers[0].question_id;

        // Delete answer
        await pool.query('DELETE FROM answers WHERE id = ?', [answerId]);

        // Update answer count in questions table
        await pool.query(
            'UPDATE questions SET answers_count = answers_count - 1 WHERE id = ?',
            [questionId]
        );

        res.json({
            success: true,
            message: 'Answer deleted successfully'
        });
    } catch (error) {
        console.error('Delete answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting answer'
        });
    }
};

// @desc    Accept an answer
// @route   PUT /api/answers/:id/accept
const acceptAnswer = async (req, res) => {
    try {
        const answerId = req.params.id;
        const userId = req.user.id;

        // Get answer with question info
        const [answers] = await pool.query(`
            SELECT a.*, q.user_id as question_owner_id
            FROM answers a
            JOIN questions q ON a.question_id = q.id
            WHERE a.id = ?
        `, [answerId]);

        if (answers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        const answer = answers[0];

        // Check if user is the question owner
        if (answer.question_owner_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Only the question owner can accept an answer'
            });
        }

        // First, unaccept all other answers for this question
        await pool.query(
            'UPDATE answers SET is_accepted = FALSE WHERE question_id = ?',
            [answer.question_id]
        );

        // Accept this answer
        await pool.query(
            'UPDATE answers SET is_accepted = TRUE WHERE id = ?',
            [answerId]
        );

        res.json({
            success: true,
            message: 'Answer accepted successfully'
        });
    } catch (error) {
        console.error('Accept answer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while accepting answer'
        });
    }
};

module.exports = {
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer
};