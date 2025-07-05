import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import apiService from '../utils/axiosConfig';
import Loader from '../components/Loader';
import SearchInput from '../components/SearchInput';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    position: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    status: 'New',
    declaration: false,
    resume: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [resumeFileName, setResumeFileName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);


  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await apiService.getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);


  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = filters.status === '' || candidate.status === filters.status;
    const matchesPosition = filters.position === '' || candidate.position === filters.position;
    const matchesSearch = filters.search === '' || 
      candidate.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.position.toLowerCase().includes(filters.search.toLowerCase()) ||
      candidate.experience.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPosition && matchesSearch;
  });


  const positions = [...new Set(candidates.map((candidate) => candidate.position))];


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        resume: file
      });
      setResumeFileName(file.name);
    }
  };


  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!formData.name) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!formData.position) {
      errors.position = 'Position is required';
      isValid = false;
    }

    if (!formData.declaration) {
      errors.declaration = 'You must agree to the declaration';
      isValid = false;
    }

    if (!formData.resume) {
      errors.resume = 'Resume is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newCandidate = await apiService.createCandidate(formData);


      if (newCandidate.status === 'Selected') {
        await apiService.moveToEmployee(newCandidate._id);

        // alert('Candidate has been created and moved to Employees');

        window.location.href = '/employees';
      } else {
        setCandidates([...candidates, newCandidate]);
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        status: 'New',
        declaration: false,
        resume: null
      });
      setResumeFileName('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating candidate:', error);
      setError('Failed to create candidate. Please try again later.');
    }
  };


  const handleStatusChange = async (id, status) => {
    try {
      const updatedCandidate = await apiService.updateCandidateStatus(id, status);


      if (status === 'Selected') {
        await apiService.moveToEmployee(id);
        setCandidates(candidates.filter((candidate) => candidate._id !== id));

        // alert('Candidate has been moved to Employees');

        window.location.href = '/employees';
      } else {
        setCandidates(
          candidates.map((candidate) =>
            candidate._id === id ? updatedCandidate : candidate
          )
        );
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      setError('Failed to update candidate status. Please try again later.');
    }
  };


  const handleHire = async (id) => {
    try {
      await apiService.moveToEmployee(id);
      setCandidates(candidates.filter((candidate) => candidate._id !== id));
    } catch (error) {
      console.error('Error hiring candidate:', error);
      setError('Failed to hire candidate. Please try again later.');
    }
  };


  const handleDelete = async (id) => {
   
      try {
        await apiService.deleteCandidate(id);
        setCandidates(candidates.filter((candidate) => candidate._id !== id));
      } catch (error) {
        console.error('Error deleting candidate:', error);
        setError('Failed to delete candidate. Please try again later.');
      }
    
  };


  const handleDownloadResume = async (id) => {
    try {
      setIsDownloading(true);
      await apiService.downloadResume(id);
      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading resume:', error);
      setError('Failed to download resume. Please try again later.');
      setIsDownloading(false);
    }
  };


  const toggleActions = (id) => {
    setCurrentCandidate(currentCandidate === id ? null : id);
  };

  return (
    <div>
      {(loading || isDownloading) && <Loader />}
      <Header title="Candidates" />

      <div className="card">
        <div className="filters">
          <div className='flex'>
            <div className="filter-select">
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className='input-select'
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Selected">Selected</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-select">
              <select
                name="position"
                value={filters.position}
                onChange={handleFilterChange}
                className='input-select'
              >
                <option value="">All Positions</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="header-search">
            <p>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </p>
            <input 
              type="text" 
              placeholder="Search..." 
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className='flex items-center'>
            <button className="btn-add-candidate" onClick={() => setShowModal(true)}>
              Add Candidate
            </button>
          </div>

        </div>


        {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}



        {loading ? (
          <p>Loading candidates...</p>
        ) : filteredCandidates.length === 0 ? (
          <table className="table"  style={{
            borderRadius: '20px',
            overflow: 'hidden',
            marginLeft: '12px',
            border: '1px solid #e5e7eb',
            tableLayout: 'fixed',
            width: '100%',
            height: '838px',
            borderCollapse: 'collapse',
            backgroundColor: 'white'
          }}>
            <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                <th style={{ width: '5%', padding: '16px 8px', textAlign: 'left' }}>Sr no.</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Candidates Name</th>
                <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Email Address</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Phone Number</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Position</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Experience</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'auto', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                {/* <td colSpan="8" style={{ padding: '20px', textAlign: 'center', width: '100%' }}>No candidates found.</td> */}
              </tr>
            </tbody>
          </table>
        ) : (


          <table
            className="table"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              marginLeft: '12px',
              border: '1px solid #e5e7eb',
              tableLayout: 'fixed',
              marginLeft: '10px',
              height: '838px',
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white'
            }}
          >
            <thead style={{ backgroundColor: '#4D007D', color: 'white', display: 'block', width: '100%' }}>
              <tr style={{ display: 'flex', width: '100%' }}>
                <th style={{ width: '5%', padding: '16px 8px', textAlign: 'left' }}>Sr no.</th>
                <th style={{ width: '15%', padding: '16px 8px', textAlign: 'left' }}>Candidates Name</th>
                <th style={{ width: '20%', padding: '16px 8px', textAlign: 'left' }}>Email Address</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Phone Number</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Position</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Status</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Experience</th>
                <th style={{ width: '12%', padding: '16px 8px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody style={{ maxHeight: 'calc(838px - 53px)', overflowY: 'visible', display: 'block', width: '100%' }}>
              {filteredCandidates.map((candidate, index) => (
                <tr key={candidate._id} style={{ borderBottom: '1px solid #e5e7eb', display: 'flex', width: '100%' }}>
                  <td style={{ padding: '12px 8px', width: '5%' }}>{String(index + 1).padStart(2, '0')}</td>
                  <td style={{ padding: '12px 8px', width: '15%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.name}</td>
                  <td style={{ padding: '12px 8px', width: '20%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.email}</td>
                  <td style={{ padding: '12px 8px', width: '12%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.phone}</td>
                  <td style={{ padding: '12px 8px', width: '12%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.position}</td>
                  <td style={{ padding: '12px 8px', width: '12%' }}>
                    <StatusBadge
                      status={candidate.status}
                      onStatusChange={handleStatusChange}
                      id={candidate._id}
                    />
                  </td>
                  <td style={{ padding: '12px 8px', width: '12%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidate.experience || '-'}</td>
                  <td style={{ padding: '12px 8px', width: '12%' }}>
                    <div className="actions-menu">
                      <button
                        className="actions-toggle"
                        onClick={() => toggleActions(candidate._id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>

                      {currentCandidate === candidate._id && (
                        <div className="actions-dropdown">
                          {candidate.resume ? (
                            <div
                              className="actions-item"
                              onClick={() => handleDownloadResume(candidate._id)}
                              style={{ cursor: isDownloading ? 'wait' : 'pointer' }}
                            >
                              {isDownloading && currentCandidate === candidate._id ? 'Downloading...' : 'Download Resume'}
                            </div>
                          ) : (
                            <div className="actions-item disabled">No Resume Available</div>
                          )}
                         
                          <div
                            className="actions-item"
                            onClick={() => handleDelete(candidate._id)}
                          >
                            Delete Candidate
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

        
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal" style={{ borderRadius: '21px 21px 0px 0px' }}>
            <div className="modal-header" style={{ backgroundColor: '#4D007D', color: 'white', fontWeight: '500' }}>
              <div> </div>
              <h3 className="modal-title" style={{ color: 'white', fontWeight: '500' }}>Add New Candidate</h3>
              <button className="modal-close" style={{ color: 'white', fontWeight: '500' }} onClick={() => setShowModal(false)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.875 1.125L1.125 10.875M1.125 1.125L10.875 10.875" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </button>
            </div>

            <div className="modal-body" style={{ backgroundColor: 'white' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="name">Full Name*</label>
                    {formErrors.name && (
                      <div className="form-error">{formErrors.name}</div>
                    )}
                  </div>

                  <div className="floating-label-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="email">Email Address*</label>
                    {formErrors.email && (
                      <div className="form-error">{formErrors.email}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="phone">Phone Number*</label>
                    {formErrors.phone && (
                      <div className="form-error">{formErrors.phone}</div>
                    )}
                  </div>

                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="position">Position*</label>
                    {formErrors.position && (
                      <div className="form-error">{formErrors.position}</div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="floating-label-group">
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder=" "
                    />
                    <label htmlFor="experience">Experience*</label>
                  </div>

                  <div className="floating-label-group">
                    <div className="resume-upload">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        className="resume-input"
                        onChange={handleResumeUpload}
                        accept=".pdf,.doc,.docx"
                      />
                      <div
                        className="resume-upload-icon"
                        onClick={() => document.getElementById('resume').click()}
                        style={{ cursor: 'pointer' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>{resumeFileName || 'Upload Resume'}</span>
                      </div>
                    </div>
                    <label htmlFor="resume">Resume*</label>
                    {formErrors.resume && (
                      <div className="form-error">{formErrors.resume}</div>
                    )}
                  </div>
                </div>

                <div className="form-row declaration-row">
                  <div className="form-group checkbox-group" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    <div 
                      onClick={() => setFormData({ ...formData, declaration: !formData.declaration })}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {formData.declaration ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 10.25L8.5 12.75L14 7.25M4 19H16C17.6569 19 19 17.6569 19 16V4C19 2.34315 17.6569 1 16 1H4C2.34315 1 1 2.34315 1 4V16C1 17.6569 2.34315 19 4 19Z" stroke="#4D007D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 4C1 2.34315 2.34315 1 4 1H16C17.6569 1 19 2.34315 19 4V16C19 17.6569 17.6569 19 16 19H4C2.34315 19 1 17.6569 1 16V4Z" stroke="#4D007D" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <label 
                      onClick={() => setFormData({ ...formData, declaration: !formData.declaration })}
                      style={{
                        fontSize: '14px',
                        color: '#4b5563',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        color: '#a4a4a4',
                        cursor: 'pointer',
                        marginLeft: '4px'
                      }}
                    >
                      I hereby declare that the above information is true to the best of my knowledge and belief
                    </label>
                  </div>
                  {formErrors.declaration && (
                    <div className="form-error" style={{ marginTop: '4px' }}>{formErrors.declaration}</div>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;