import React from 'react';
import { Calendar, Mail, Clock } from 'lucide-react';
import { Candidature } from '../../types';
import { formatDate } from '../../utils/formatters';

interface CandidatureCardProps {
  candidature: Candidature;
}

const CandidatureCard: React.FC<CandidatureCardProps> = ({ candidature }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-800';
      case 'rejected':
        return 'bg-red-800';
      default:
        return 'bg-yellow-800';
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">{candidature.name}</h3>
            <div className="flex items-center text-gray-400 mt-1">
              <Mail className="h-4 w-4 mr-1" />
              <span className="text-sm">{candidature.email}</span>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getStatusColor(candidature.status)}`}>
            {candidature.status.charAt(0).toUpperCase() + candidature.status.slice(1)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(candidature.date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{candidature.hours} hrs/week</span>
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="text-white font-medium mb-1">Experience</h4>
          <p className="text-gray-400 text-sm line-clamp-2">{candidature.experience}</p>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-1">Why Join Us</h4>
          <p className="text-gray-400 text-sm line-clamp-2">{candidature.why}</p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Discord: {candidature.discord}</span>
            <span className="text-sm text-gray-400">Age: {candidature.age}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatureCard;