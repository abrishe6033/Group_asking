const { pool } = require('../config/db');
const { validationResult } = require('express-validator');

// @desc    Get all questions with pagination
// @route   GET /api/questions
const getQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Get questions with user info and answer count
        
        const [questions] = await pool.query(`
            SELECT 
                q.*,
                u.username,
                u.first_name,
                u.last_name,
                u.profile_pic,
                (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as total_answers
            FROM questions q
            JOIN users u ON q.user_id = u.id
            ORDER BY q.created_at DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        // Get total count for pagination
        const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM questions');
        const total = totalResult[0].total;

        res.json({
            success: true,
            questions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalQuestions: total
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching questions'
        });
    }
};

// @desc    Get single question with answers
// @route   GET /api/questions/:id
const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.id;

        // Get question details
        const [questions] = await pool.query(`
            SELECT 
                q.*,
                u.username,
                u.first_name,
                u.last_name,
                u.profile_pic,
                u.reputation
            FROM questions q
            JOIN users u ON q.user_id = u.id
            WHERE q.id = ?
        `, [questionId]);

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Increment view count
        await pool.query(
            'UPDATE questions SET views = views + 1 WHERE id = ?',
            [questionId]
        );

        // Get answers for this question
        const [answers] = await pool.query(`
            SELECT 
                a.*,
                u.username,
                u.first_name,
                u.last_name,
                u.profile_pic,
                u.reputation
            FROM answers a
            JOIN users u ON a.user_id = u.id
            WHERE a.question_id = ?
            ORDER BY 
                a.is_accepted DESC,
                a.votes DESC,
                a.created_at ASC
        `, [questionId]);

        res.json({
            success: true,
            question: questions[0],
            answers
        });
    } catch (error) {
        console.error('Get question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching question'
        });
    }
};

// @desc    Create a question
// @route   POST /api/questions
const createQuestion = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { title, content, tags } = req.body;
        const userId = req.user.id;

        const [result] = await pool.query(
            'INSERT INTO questions (user_id, title, content, tags) VALUES (?, ?, ?, ?)',
            [userId, title, content, tags || '']
        );

        // Get the created question
        const [newQuestion] = await pool.query(`
            SELECT 
                q.*,
                u.username,
                u.first_name,
                u.last_name
            FROM questions q
            JOIN users u ON q.user_id = u.id
            WHERE q.id = ?
        `, [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question: newQuestion[0]
        });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating question'
        });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const userId = req.user.id;
        const { title, content, tags } = req.body;

        // Check if question exists and belongs to user
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

        if (questions[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this question'
            });
        }

        await pool.query(
            'UPDATE questions SET title = ?, content = ?, tags = ? WHERE id = ?',
            [title, content, tags, questionId]
        );

        res.json({
            success: true,
            message: 'Question updated successfully'
        });
    } catch (error) {
        console.error('Update question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating question'
        });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const userId = req.user.id;

        // Check if question exists and belongs to user
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

        if (questions[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this question'
            });
        }

        await pool.query('DELETE FROM questions WHERE id = ?', [questionId]);

        res.json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        console.error('Delete question error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting question'
        });
    }
};

// @desc    Search questions
// @route   GET /api/questions/search
const searchQuestions = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const [questions] = await pool.query(`
            SELECT 
                q.*,
                u.username,
                u.first_name,
                u.last_name,
                (SELECT COUNT(*) FROM answers WHERE question_id = q.id) as answer_count
            FROM questions q
            JOIN users u ON q.user_id = u.id
            WHERE q.title LIKE ? OR q.content LIKE ? OR q.tags LIKE ?
            ORDER BY q.created_at DESC
            LIMIT 20
        `, [`%${q}%`, `%${q}%`, `%${q}%`]);

        res.json({
            success: true,
            questions
        });
    } catch (error) {
        console.error('Search questions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching questions'
        });
    }
};

module.exports = {
    getQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    searchQuestions
};