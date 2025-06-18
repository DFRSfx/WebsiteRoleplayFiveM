import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Disc as Discord, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-red-800 text-white p-2 rounded-md">
                <span className="font-bold text-xl">E</span>
              </div>
              <span className="font-bold text-xl text-white">Enigma RP</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Experience the ultimate FiveM roleplay server. Join our community today!
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link to="/store" className="text-gray-400 hover:text-red-400 transition-colors">Store</Link></li>
              <li><Link to="/staff-application" className="text-gray-400 hover:text-red-400 transition-colors">Join Staff</Link></li>
              <li><Link to="/candidatures" className="text-gray-400 hover:text-red-400 transition-colors">Candidatures</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-red-400 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                <Discord className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
            </div>
            <p className="mt-4 text-gray-400">
              Join our Discord server for community updates and support.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Enigma RP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;