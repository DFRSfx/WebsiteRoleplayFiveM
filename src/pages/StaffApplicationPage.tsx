import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StaffApplicationFormData } from '../types';
import { useCandidature } from '../contexts/CandidatureContext';
import { useNavigate } from 'react-router-dom';

const StaffApplicationPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StaffApplicationFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCandidature } = useCandidature();
  const navigate = useNavigate();
  
  const onSubmit = (data: StaffApplicationFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      // Create a new candidature with the form data
      const newCandidature = {
        id: Date.now().toString(),
        ...data,
        date: new Date(),
        status: 'pending' as const
      };
      
      addCandidature(newCandidature);
      setIsSubmitting(false);
      
      // Show success message and redirect
      alert('Your application has been submitted successfully!');
      navigate('/candidatures');
    }, 1500);
  };
  
  return (
    <div className="pt-24 pb-16 bg-gray-900 min-h-screen animate-fadeIn">
      <div className="container-custom max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-4">Join Our Staff Team</h1>
        <p className="text-gray-400 mb-8">
          Looking to contribute to the Enigma RP community? Apply to join our staff team and help make our server better for everyone.
        </p>
        
        <div className="bg-gray-800 rounded-lg p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className="input"
                  placeholder="Your full name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-white mb-2">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="your.email@example.com"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="age" className="block text-white mb-2">Age</label>
                <input
                  id="age"
                  type="number"
                  className="input"
                  placeholder="Your age"
                  {...register("age", { 
                    required: "Age is required",
                    min: {
                      value: 18,
                      message: "You must be at least 18 years old"
                    },
                    max: {
                      value: 99,
                      message: "Invalid age"
                    }
                  })}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
              </div>
              
              <div>
                <label htmlFor="discord" className="block text-white mb-2">Discord Username</label>
                <input
                  id="discord"
                  type="text"
                  className="input"
                  placeholder="username#1234"
                  {...register("discord", { required: "Discord username is required" })}
                />
                {errors.discord && <p className="text-red-500 text-sm mt-1">{errors.discord.message}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="hours" className="block text-white mb-2">
                How many hours per week can you contribute?
              </label>
              <input
                id="hours"
                type="number"
                className="input"
                placeholder="Hours per week"
                {...register("hours", { 
                  required: "Hours is required",
                  min: {
                    value: 5,
                    message: "Minimum 5 hours per week required"
                  },
                  max: {
                    value: 100,
                    message: "Please enter a reasonable amount of hours"
                  }
                })}
              />
              {errors.hours && <p className="text-red-500 text-sm mt-1">{errors.hours.message}</p>}
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-white mb-2">
                Previous Experience
              </label>
              <textarea
                id="experience"
                className="input min-h-[100px]"
                placeholder="Describe your previous experience as staff on other servers..."
                {...register("experience", { 
                  required: "Experience information is required",
                  minLength: {
                    value: 50,
                    message: "Please provide a detailed description (at least 50 characters)"
                  }
                })}
              />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
            </div>
            
            <div>
              <label htmlFor="why" className="block text-white mb-2">
                Why do you want to join our staff team?
              </label>
              <textarea
                id="why"
                className="input min-h-[100px]"
                placeholder="Tell us why you want to join our staff team..."
                {...register("why", { 
                  required: "This field is required",
                  minLength: {
                    value: 50,
                    message: "Please provide a detailed description (at least 50 characters)"
                  }
                })}
              />
              {errors.why && <p className="text-red-500 text-sm mt-1">{errors.why.message}</p>}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffApplicationPage;