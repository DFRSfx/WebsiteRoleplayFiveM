import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Stethoscope, Wrench, Briefcase, ChevronRight, ChevronLeft } from 'lucide-react';

const JobApplicationPage: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    characterName: '',
    hoursPlayed: '',
    experience: '',
    motivation: '',
    availability: '',
    additionalInfo: '',
    discord: '',
    email: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const jobs = [
    {
      id: 'police',
      title: 'Police Department',
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-blue-500',
    },
    {
      id: 'ems',
      title: 'Emergency Medical Services',
      icon: <Stethoscope className="w-8 h-8" />,
      color: 'bg-red-500',
    },
    {
      id: 'mechanic',
      title: 'Mechanic',
      icon: <Wrench className="w-8 h-8" />,
      color: 'bg-yellow-500',
    },
    {
      id: 'legal',
      title: 'Legal Services',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'bg-green-500',
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    setIsSubmitted(true);
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    setCurrentStep(2);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-surface-50 dark:bg-surface-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
            In-Game <span className="text-primary-500">Job Application</span>
          </h1>
          <p className="text-center text-surface-600 dark:text-surface-300 mb-12 max-w-2xl mx-auto">
            Apply for an in-character job to enhance your roleplaying experience. Choose a profession that aligns with your character's story and goals.
          </p>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-700 dark:bg-surface-800 p-8 rounded-xl shadow-md text-center"
            >
              <div className="w-20 h-20 mx-auto bg-success-50 dark:bg-success-900/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-success-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-surface-800 dark:text-white">Application Submitted Successfully!</h2>
              <p className="text-surface-600 dark:text-surface-300 mb-6">
                Thank you for applying to join our {selectedJob && jobs.find(job => job.id === selectedJob)?.title} team. Our staff will review your application and contact you via Discord within 3-5 days.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-primary-500 text-white px-6 py-3 rounded-md hover:bg-primary-600 transition-colors"
              >
                Return to Home
              </button>
            </motion.div>
          ) : (
            <div className="bg-gray-700 dark:bg-surface-800 rounded-xl shadow-md overflow-hidden">
              {/* Progress bar */}
              <div className="p-4 md:p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-surface-600 dark:text-surface-300">
                    Step {currentStep} of 3
                  </div>
                  <div className="text-sm font-medium text-surface-600 dark:text-surface-300">
                    {Math.round((currentStep / 3) * 100)}% Complete
                  </div>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                  <motion.div 
                    className="bg-primary-500 h-2.5 rounded-full"
                    initial={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Step content */}
              <div className="p-6 md:p-8">
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 text-surface-800 dark:text-white">Select a Job to Apply For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {jobs.map((job) => (
                        <motion.button
                          key={job.id}
                          onClick={() => handleJobSelect(job.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-surface-50 dark:bg-surface-700 rounded-lg p-4 flex items-center hover:shadow-md transition-all border border-surface-200 dark:border-surface-600"
                        >
                          <div className={`w-12 h-12 rounded-full ${job.color} flex items-center justify-center text-white mr-4`}>
                            {job.icon}
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-surface-800 dark:text-white">{job.title}</h3>
                            <p className="text-sm text-surface-500 dark:text-surface-400">Click to apply</p>
                          </div>
                          <ChevronRight className="ml-auto text-surface-400" size={20} />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 text-surface-800 dark:text-white">
                      Character Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="characterName" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Character Full Name</label>
                        <input
                          type="text"
                          id="characterName"
                          name="characterName"
                          value={formData.characterName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                    
                      
                      <div>
                        <label htmlFor="hoursPlayed" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Hours Played on Server</label>
                        <input
                          type="number"
                          id="hoursPlayed"
                          name="hoursPlayed"
                          value={formData.hoursPlayed}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="e.g. 50"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Relevant Experience</label>
                        <textarea
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Describe any relevant experience your character has for this role..."
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <h2 className="text-xl font-semibold mb-6 text-surface-800 dark:text-white">
                      Additional Information
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="motivation" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Motivation</label>
                        <textarea
                          id="motivation"
                          name="motivation"
                          value={formData.motivation}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Why does your character want this job?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="availability" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Availability</label>
                        <input
                          type="text"
                          id="availability"
                          name="availability"
                          value={formData.availability}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="When is your character typically available?"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="additionalInfo" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Additional Information (Optional)</label>
                        <textarea
                          id="additionalInfo"
                          name="additionalInfo"
                          value={formData.additionalInfo}
                          onChange={handleInputChange}
                          rows={2}
                          className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Anything else you'd like to share..."
                        />
                      </div>
                      
                      <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                        <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-white">Contact Information (OOC)</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="discord" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Discord Username</label>
                            <input
                              type="text"
                              id="discord"
                              name="discord"
                              value={formData.discord}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="username#0000"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email (Optional)</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 rounded-md border border-surface-300 dark:border-surface-700 bg-gray-700 dark:bg-surface-800 text-surface-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="your@email.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="p-6 border-t border-surface-200 dark:border-surface-700 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-md flex items-center gap-2 ${
                    currentStep === 1
                      ? 'bg-surface-200 dark:bg-surface-700 text-surface-400 dark:text-surface-500 cursor-not-allowed'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;