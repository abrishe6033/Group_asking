import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-full md:w-80 space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          About Evangadi Networks
        </h3>
        <p className="text-gray-600 mb-4">
          No matter what stage of life you are in, whether you're just starting
          elementary school or being promoted to CEO of a Fortune 500 company,
          you have much to offer to those who are trying to follow in your
          footsteps.
        </p>
        <p className="text-gray-600 mb-4">
          Whether you are willing to share your knowledge or you are just
          looking to meet mentors of your own, please start by joining the
          network here.
        </p>
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          How it works
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Network Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Questions</span>
            <span className="font-semibold text-gray-900">1,234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Answers</span>
            <span className="font-semibold text-gray-900">5,678</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Members</span>
            <span className="font-semibold text-gray-900">890</span>
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "javascript",
            "react",
            "node.js",
            "python",
            "css",
            "html",
            "mongodb",
            "mysql",
          ].map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag}`}
              className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* User Info (if logged in) */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile</h3>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Questions Asked</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Answers Given</span>
              <span className="font-semibold text-gray-900">0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
