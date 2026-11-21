import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const AnswerCard = ({ answer, questionUserId, currentUser, onAccept, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(answer.content);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const {
        content,
        username,
        first_name,
        last_name,
        created_at,
        is_accepted,
        votes
    } = answer;

    const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });
    const displayName = username || `${first_name} ${last_name}`.trim();
    const isOwner = currentUser && currentUser.id === answer.user_id;
    const isQuestionOwner = currentUser && currentUser.id === questionUserId;

    const handleSaveEdit = async () => {
        // Implement edit functionality
        setIsEditing(false);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${
            is_accepted ? 'border-2 border-green-500' : ''
        }`}>
            <div className="flex items-start gap-4">
                {/* Vote buttons */}
                <div className="flex flex-col items-center">
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <span className="my-1 font-medium text-gray-700">{votes || 0}</span>
                    <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Answer content */}
                <div className="flex-1">
                    {is_accepted && (
                        <div className="mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Accepted Answer
                            </span>
                        </div>
                    )}

                    {isEditing ? (
                        <div>
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedContent(content);
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="prose max-w-none mb-4">
                                <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium">
                                                {displayName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="text-gray-700 font-medium">{displayName}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">answered {timeAgo}</span>
                                </div>

                                <div className="flex space-x-2">
                                    {isQuestionOwner && !is_accepted && (
                                        <button
                                            onClick={onAccept}
                                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                                        >
                                            Accept
                                        </button>
                                    )}
                                    
                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            
                                            {showDeleteConfirm ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={onDelete}
                                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnswerCard;
