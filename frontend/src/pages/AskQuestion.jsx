import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionAPI } from '../services/api';

const AskQuestion = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/signin');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 10) {
            newErrors.title = 'Title must be at least 10 characters';
        } else if (formData.title.length > 255) {
            newErrors.title = 'Title must be less than 255 characters';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Question details are required';
        } else if (formData.content.length < 20) {
            newErrors.content = 'Question details must be at least 20 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            await questionAPI.createQuestion(formData);
            navigate('/');
        } catch (error) {
            setErrors({
                submit: error.response?.data?.message || 'Failed to create question'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
                    <p className="text-gray-600 mb-8">
                        Be specific and imagine you're asking a question to another person
                    </p>

                    {errors.submit && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. How to center a div with CSS?"
                                className={`w-full px-4 py-3 border ${
                                    errors.title ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Be specific and concise (10-255 characters)
                            </p>
                        </div>

                        {/* Content */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Details
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                rows="8"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Provide more details about your question. Include what you've tried and what you're trying to achieve."
                                className={`w-full px-4 py-3 border ${
                                    errors.content ? 'border-red-300' : 'border-gray-300'
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Minimum 20 characters. Describe your problem in detail.
                            </p>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="e.g. javascript react css (comma separated)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Add up to 5 tags to describe what your question is about
                            </p>
                        </div>

                        {/* Preview Section */}
                        {formData.title && formData.content && (
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">{formData.content}</p>
                                    {formData.tags && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {formData.tags.split(',').map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting...
                                    </>
                                ) : (
                                    'Post Question'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-blue-900 mb-4">Tips for asking a good question</h2>
                    <ul className="space-y-2 text-blue-800">
                        <li className="flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Summarize your problem in a one-line title
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Describe what you've tried and what you're trying to achieve
                        </li>
                        <li className="flex items-start">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Add relevant tags to help others find your question
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AskQuestion;
