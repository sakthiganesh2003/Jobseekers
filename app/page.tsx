'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Jobseeker {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  location: string;
  experienceYears: number;
}

export default function Jobseekers() {
  const [jobseekers, setJobseekers] = useState<Jobseeker[]>([]);
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [location, setLocation] = useState('');
  const [minExp, setMinExp] = useState('');
  const [maxExp, setMaxExp] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchJobseekers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (skill) params.append('skill', skill);
      if (location) params.append('location', location);
      if (minExp) params.append('minExp', minExp);
      if (maxExp) params.append('maxExp', maxExp);
      
      const res = await fetch(`/api/jobseekers?${params}`);
      const data = await res.json();
      setJobseekers(data);
    } catch (error) {
      console.error('Error fetching jobseekers:', error);
      toast.error('Failed to fetch jobseekers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobseekers();
  }, [name, skill, location, minExp, maxExp]);

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this jobseeker?')) {
      try {
        const res = await fetch(`/api/jobseekers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Jobseeker deleted successfully');
          fetchJobseekers();
        } else {
          toast.error('Failed to delete jobseeker');
        }
      } catch (error) {
        console.error('Error deleting jobseeker:', error);
        toast.error('Error deleting jobseeker');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Jobseekers Directory
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and search through all registered jobseekers
            </p>
          </div>
          <Link
            href="/jobseekers/create"
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Jobseeker
          </Link>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Jobseekers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Search by name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                Skill
              </label>
              <input
                id="skill"
                type="text"
                placeholder="Search by skill"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="Filter by location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="minExp" className="block text-sm font-medium text-gray-700 mb-1">
                Min Experience
              </label>
              <input
                id="minExp"
                type="number"
                min="0"
                placeholder="Min years"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="maxExp" className="block text-sm font-medium text-gray-700 mb-1">
                Max Experience
              </label>
              <input
                id="maxExp"
                type="number"
                min="0"
                placeholder="Max years"
                value={maxExp}
                onChange={(e) => setMaxExp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : jobseekers.length > 0 ? (
                  jobseekers.map((jobseeker) => (
                    <tr
                      key={jobseeker.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {jobseeker.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {jobseeker.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {jobseeker.phone}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {jobseeker.skills.split(',').map((skill, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {jobseeker.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {jobseeker.experienceYears} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <Link
                            href={`/jobseekers/${jobseeker.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(jobseeker.id)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="mt-4 text-lg font-medium text-gray-700">No jobseekers found</p>
                        <p className="mt-1 text-gray-500">Try adjusting your search filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}