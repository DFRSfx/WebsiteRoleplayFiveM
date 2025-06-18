import React from 'react';
import { useCandidature } from '../contexts/CandidatureContext';
import CandidatureCard from '../components/candidature/CandidatureCard';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const CandidaturesPage: React.FC = () => {
  const { candidatures } = useCandidature();
  
  const pendingCandidatures = candidatures.filter(c => c.status === 'pending');
  const approvedCandidatures = candidatures.filter(c => c.status === 'approved');
  const rejectedCandidatures = candidatures.filter(c => c.status === 'rejected');
  
  return (
    <div className="pt-24 pb-16 bg-gray-900 min-h-screen animate-fadeIn">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Staff Candidatures</h1>
            <p className="text-gray-400">
              View all submitted applications to join our staff team.
            </p>
          </div>
          <Link to="/staff-application" className="btn btn-primary mt-4 sm:mt-0 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Apply to Join
          </Link>
        </div>
        
        {candidatures.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-lg mb-4">No applications have been submitted yet.</p>
            <Link to="/staff-application" className="btn btn-primary">
              Be the first to apply
            </Link>
          </div>
        ) : (
          <>
            {pendingCandidatures.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></span>
                  Pending Applications ({pendingCandidatures.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingCandidatures.map(candidature => (
                    <CandidatureCard key={candidature.id} candidature={candidature} />
                  ))}
                </div>
              </div>
            )}
            
            {approvedCandidatures.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                  Approved Applications ({approvedCandidatures.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedCandidatures.map(candidature => (
                    <CandidatureCard key={candidature.id} candidature={candidature} />
                  ))}
                </div>
              </div>
            )}
            
            {rejectedCandidatures.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                  Rejected Applications ({rejectedCandidatures.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rejectedCandidatures.map(candidature => (
                    <CandidatureCard key={candidature.id} candidature={candidature} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidaturesPage;