import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const QuestionCard = ({ question }) => {
  const {
    id,
    title,
    content,
    username,
    first_name,
    last_name,
    created_at,
    answers_count,
    views,
    votes,
    tags,
  } = question;

  const timeAgo = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });
  const displayName = username || `${first_name} ${last_name}`.trim();

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Stats */}
          <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
            <div className="text-center">
              <div className="font-bold text-gray-700">{votes}</div>
              <div>votes</div>
            </div>
            <div
              className={`text-center ${answers_count > 0 ? "text-green-600 font-bold" : ""}`}
            >
              <div className="font-bold">{answers_count || 0}</div>
              <div>answers</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{views || 0}</div>
              <div>views</div>
            </div>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <Link to={`/question/${id}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600 hover:text-blue-800 mb-2">
                {title} 
                                <span  className="mr-300 text-align-corner">   </span>

              </h2>
            </Link>

            <p className="text-gray-600 mb-3 line-clamp-2">{content}


            </p>

            {/* Tags */}
            {tags && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* User Info */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 font-medium">{displayName}</span>
                <span className="text-gray-500">asked {timeAgo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
