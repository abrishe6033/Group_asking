import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { questionAPI } from '../services/api';
import QuestionCard from '../components/QuestionCard';
// import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (searchResults) {
            return;
        }
        
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await questionAPI.getQuestions(page);
                setQuestions(response.data.questions);
                setTotalPages(response.data.totalPages);
                setError('');
            } catch (error) {
                setError('Failed to fetch questions');
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchQuestions();
    }, [page, searchResults]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setSearchResults(null);
            return;
        }

        try {
            setLoading(true);
            const response = await questionAPI.searchQuestions(searchTerm);
            setSearchResults(response.data.questions);
            setError('');
        } catch (error) {
            setError('Search failed');
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults(null);
    };

    const displayedQuestions = searchResults || questions;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Welcome Banner */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Welcome{user ? `, ${user.firstName || user.username}` : ' to Evangadi Networks'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Ask questions, share knowledge, and connect with the community
                            </p>
                        </div>
                        {user && (
                            <Link
                                to="/ask"
                                className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                            >
                                + Ask Question
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search Bar */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Search
                                </button>
                                {searchResults && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </form>
                            {searchResults && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Found {searchResults.length} results
                                </p>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {/* Questions List */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading questions...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {displayedQuestions.length === 0 ? (
                                        <div className="text-center py-12 bg-white rounded-lg shadow">
                                            <p className="text-gray-500 text-lg">No questions found.</p>
                                            {user ? (
                                                <Link
                                                    to="/ask"
                                                    className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                                                >
                                                    Be the first to ask a question!
                                                </Link>
                                            ) : (
                                                <Link
                                                    to="/signin"
                                                    className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                                                >
                                                    Sign in to ask a question
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        displayedQuestions.map((question) => (
                                            <QuestionCard key={question.id} question={question} /> 
                                        ))
                                    )}
                                </div>

                                {/* Pagination */}
                                {!searchResults && totalPages > 1 && (
                                    <div className="flex justify-center mt-8 space-x-2">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 bg-black"
                                        >

                                            Previous

                                        </button>
                                        <span className="px-4 py-2">
                                            Page {page} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>


                    {/* Sidebar */}
                    {/* <Sidebar /> */}



                </div>
            </div>
        </div>
    );
};

export default Dashboard;
