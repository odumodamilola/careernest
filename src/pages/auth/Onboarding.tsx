import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function OnboardingSteps() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Basic Profile
  const [headline, setHeadline] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  
  // Step 2: Skills & Interests
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');
  
  // Step 3: Goals
  const [goals, setGoals] = useState<string[]>([]);
  
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
  
  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };
  
  const handleGoalChange = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };
  
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleFinish = async () => {
    setLoading(true);
    
    try {
      await updateProfile({
        headline,
        profileComplete: true,
      });
      
      navigate('/');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center text-lg font-medium ${
                  currentStep >= step
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
              <div className="text-sm mt-2 text-gray-500">
                {step === 1 && 'Basic Profile'}
                {step === 2 && 'Skills & Interests'}
                {step === 3 && 'Goals & Preferences'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Tell us about yourself</h2>
            <p className="text-gray-500 mb-6">
              This information helps personalize your experience and connect with relevant opportunities.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="headline" className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Headline
                </label>
                <input
                  id="headline"
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer at Tech Company"
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g., United States"
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., San Francisco"
                  className="input"
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Skills & Interests</h2>
            <p className="text-gray-500 mb-6">
              Add your skills and interests to help us match you with relevant content and connections.
            </p>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div className="flex">
                  <input
                    id="skills"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    placeholder="e.g., React, Python, UX Design"
                    className="input rounded-r-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn-primary rounded-l-none px-4"
                  >
                    Add
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill}
                      className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="flex">
                  <input
                    id="interests"
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                    placeholder="e.g., Machine Learning, Web Development"
                    className="input rounded-r-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="btn-primary rounded-l-none px-4"
                  >
                    Add
                  </button>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <div
                      key={interest}
                      className="inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => handleRemoveInterest(interest)}
                        className="ml-2 text-teal-600 hover:text-teal-800"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Goals & Preferences</h2>
            <p className="text-gray-500 mb-6">
              Tell us what you're looking to achieve on CareerNest.
            </p>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-3">
                What are your primary goals? (Select all that apply)
              </p>
              
              <div className="space-y-3">
                {[
                  'Find a new job or career opportunity',
                  'Connect with mentors in my field',
                  'Improve my skills through courses and learning paths',
                  'Network with other professionals',
                  'Find freelance or contract work',
                  'Recruit talent for my company',
                ].map((goal) => (
                  <label key={goal} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={goals.includes(goal)}
                      onChange={() => handleGoalChange(goal)}
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    />
                    <span className="text-gray-700">{goal}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`btn-outline px-4 py-2 ${
            currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Back
        </button>
        
        {currentStep < 3 ? (
          <button type="button" onClick={handleNext} className="btn-primary px-4 py-2">
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="btn-primary px-4 py-2"
          >
            {loading ? 'Finishing...' : 'Finish Setup'}
          </button>
        )}
      </div>
    </div>
  );
}