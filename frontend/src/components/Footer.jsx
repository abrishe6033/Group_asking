import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


                    {/* About Section */}

                    <div>
                        <h3 className="text-xl font-bold mb-4">About</h3>
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">Evangadi Networks</h4>
                        <p className="text-gray-300 mb-4">
                            No matter what stage of life you are in, whether you're just starting elementary school 
                            or being promoted to CEO of a Fortune 500 company, you have much to offer to those who 
                            are trying to follow in your footsteps.
                        </p>
                        <p className="text-gray-300 mb-4">
                            Whether you are willing to share your knowledge or you are just looking to meet mentors 
                            of your own, please start by joining the network here.
                        </p>
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            How it works
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <span className="text-gray-300 cursor-default">About Us</span>
                            </li>
                            <li>
                                <span className="text-gray-300 cursor-default">How it Works</span>
                            </li>
                            <li>
                                <span className="text-gray-300 cursor-default">FAQ</span>
                            </li>
                            <li>
                                <span className="text-gray-300 cursor-default">Contact</span>
                            </li>
                            <li>
                                <span className="text-gray-300 cursor-default">Privacy Policy</span>
                            </li>
                            <li>
                                <span className="text-gray-300 cursor-default">Terms of Service</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Evangadi Networks. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
