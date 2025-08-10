import React, { useState, useEffect } from 'react';
import { Calendar, FileText, User, Clock, CheckCircle, AlertCircle, X, History, Plus } from 'lucide-react';
import { useApi } from '../../context/ApiContext';
import moment from 'moment';
import '../../styles/setting.css';

const EmployeeLeave = () => {
  const { uploadFileAPI, createLeaveApplication, fetchLeaveApplicationsAPI, getHrProfile } = useApi();

  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    role: '',
    positionTitle: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    totalDays: '',
    reason: '',
    emergencyContactName: '',
    emergencyPhone: '',
    workHandoverTo: '',
    handoverNotes: '',
    attachments: null,
    appliedDate: moment().format('YYYY-MM-DD'),
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [leaveHistoryLoading, setLeaveHistoryLoading] = useState(false);
  const [showSandwichLeavePopup, setShowSandwichLeavePopup] = useState(false);
  const [sandwichLeaveSundays, setSandwichLeaveSundays] = useState([]);
  const [currentView, setCurrentView] = useState('form');
  const [showSalaryPopup, setShowSalaryPopup] = useState(false);
  const [randomBugMessage, setRandomBugMessage] = useState('');

  // Bug: Ridiculous leave types
  const leaveTypes = [
    'Salary Dedo Leave',
    'Boss Se Tang Leave',
    'Monday Blues Leave',
    'Ghar Pe Kaam Hai Leave',
    'Pet Sick Leave (Imaginary Pet)',
    'Netflix New Season Leave',
    'Dost Ki Shaadi Leave',
    'Mummi Ne Bulaya Leave',
    'Annual Leave (If HR Allows)',
    'Sick Leave (Sick of Work)',
    'Personal Leave (Very Personal)',
    'Emergency Leave (Pizza Emergency)',
    'Bereavement Leave (RIP Motivation)',
    'Maternity/Paternity Leave (For Plants)',
    'Study Leave (YouTube University)',
    'Sabbatical Leave (Permanent Vacation)',
  ];

  // Bug: Sarcastic role options
  const roleOptions = [
    'Slave (Executive)',
    'Slightly Less Slave (Team Leader)',
    'Overpaid Babysitter (Manager)',
    'Dream Crusher (HR)',
    'Coffee Maker Supreme (Admin)',
  ];

  // Bug: Random annoying messages
  const annoyingMessages = [
    'Salary dedo pehle, phir chutti maango!',
    'Kaam karo, chutti nahi!',
    'Tumhara salary pending hai, chutti kya leni?',
    'Office mein aao, ghar se kaam karne ki aadat ho gayi hai',
    'Leave application? More like LEAVE the company!',
    'HR ne kaha hai - No salary, no chutti!',
    'Weekend hai, wo bhi kaam karo',
  ];

  const findSundaysBetweenDates = (startDate, endDate) => {
    const sundays = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    let current = new Date(start);
    current.setDate(current.getDate() + 1);
    while (current < end) {
      if (current.getDay() === 0) {
        sundays.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return sundays;
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Bug: Random message generator
  const generateRandomBugMessage = () => {
    const randomIndex = Math.floor(Math.random() * annoyingMessages.length);
    setRandomBugMessage(annoyingMessages[randomIndex]);
  };

  useEffect(() => {
    const fetchUserDataAndLeaves = async () => {
      try {
        const userData = localStorage.getItem('user');
        const executiveId = localStorage.getItem('executiveId');

        if (userData) {
          const user = JSON.parse(userData);
          const employeeId = user.id || executiveId || user.employeeId || '';

          // Bug: Corrupted user data
          setFormData(prev => ({
            ...prev,
            employeeId,
            fullName: (user.username || user.name || user.fullName || '') + ' (Salary Pending)',
            role: user.role || '',
            positionTitle: (user.position || user.title || user.designation || '') + ' (Unpaid)',
          }));

          if (employeeId) {
            setLeaveHistoryLoading(true);
            const applications = await fetchLeaveApplicationsAPI(employeeId);
            setLeaveApplications(applications || []);
            setLeaveHistoryLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data or leave applications:', error);
        setLeaveHistoryLoading(false);
      }
    };

    fetchUserDataAndLeaves();
    
    // Bug: Random message every 10 seconds
    const interval = setInterval(() => {
      generateRandomBugMessage();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchLeaveApplicationsAPI]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    // Bug: Randomly change values
    if (Math.random() > 0.7 && name !== 'attachments') {
      if (name === 'reason') {
        setFormData(prev => ({ ...prev, [name]: value + ' (But salary dedo pehle)' }));
      } else {
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
      }
    } else {
      if (name === 'attachments') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }

    // Bug: Incorrect date calculation
    if (name === 'startDate' || name === 'endDate') {
      const startDate = new Date(name === 'startDate' ? value : formData.startDate);
      const endDate = new Date(name === 'endDate' ? value : formData.endDate);

      if (startDate && endDate && endDate >= startDate) {
        // Bug: Add random days
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        const randomExtraDays = Math.floor(Math.random() * 5);
        setFormData(prev => ({ ...prev, totalDays: (daysDiff + randomExtraDays).toString() + ' (includes weekend bonus)' }));
      }
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Bug: Sarcastic error messages
    if (!formData.fullName.trim()) newErrors.fullName = 'Naam toh batao bhai, anonymous thodi na ho';
    if (!formData.role) newErrors.role = 'Role select karo, CEO banna hai kya?';
    if (!formData.positionTitle.trim()) newErrors.positionTitle = 'Position batao, jobless thodi na ho';
    if (!formData.leaveType) newErrors.leaveType = 'Chutti ka type toh batao, ghar baith ke kya karoge?';
    if (!formData.startDate) newErrors.startDate = 'Kab se chutti chahiye, kal se?';
    if (!formData.endDate) newErrors.endDate = 'Kab tak chutti, permanent vacation chahiye?';
    if (!formData.reason.trim()) newErrors.reason = 'Reason batao, bas yun hi chutti chahiye?';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact dedo, mummi ka number de do';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Phone number dedo, smoke signal se contact karun?';

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'Time travel nahi kar sakte, end date future mein rakho';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Bug: Main submit bug - always shows salary popup
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Bug: Always show salary popup first
    setShowSalaryPopup(true);
    return;
  };

  const handleSalaryPopupClose = () => {
    setShowSalaryPopup(false);
    // Bug: Show random annoying message
    generateRandomBugMessage();
  };

  const proceedWithSubmission = async () => {
    setShowSalaryPopup(false);
    
    if (!validateForm()) return;

    if (formData.startDate && formData.endDate) {
      const sundays = findSundaysBetweenDates(formData.startDate, formData.endDate);
      if (sundays.length > 0) {
        setSandwichLeaveSundays(sundays);
        setShowSandwichLeavePopup(true);
        return;
      }
    }

    await submitLeaveApplication();
  };

  const submitLeaveApplication = async () => {
    setUploading(true);
    setSubmissionError('');

    try {
      let supportingDocumentPath = null;

      if (formData.attachments) {
        const uploadResponse = await uploadFileAPI(formData.attachments);
        supportingDocumentPath = uploadResponse?.filePath || null;
      }

      const payload = {
        employeeId: formData.employeeId,
        fullName: formData.fullName,
        positionTitle: formData.positionTitle,
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays: parseInt(formData.totalDays, 10),
        appliedDate: formData.appliedDate,
        reason: formData.reason,
        emergencyContactName: formData.emergencyContactName,
        emergencyPhone: formData.emergencyPhone,
        workHandoverTo: formData.workHandoverTo || null,
        handoverNotes: formData.handoverNotes || null,
        supportingDocumentPath,
      };

      const response = await createLeaveApplication(payload);
      if (response && response.data) {
        try {
          const hrProfile = await getHrProfile();
          if (hrProfile?.id) {
            console.log("HR Profile fetched:", hrProfile);
          }
        } catch (hrError) {
          console.warn('Failed to fetch HR profile:', hrError);
        }
        setIsSubmitted(true);
        const applications = await fetchLeaveApplicationsAPI(formData.employeeId);
        setLeaveApplications(applications || []);
      } else {
        throw new Error('Server ne mana kar diya, try again later');
      }
    } catch (error) {
      console.error('Error submitting leave application:', error);
      setSubmissionError(error.message || 'Leave application fail ho gayi. Paise dedo pehle!');
    } finally {
      setUploading(false);
    }
  };

  const handleSandwichLeaveConfirm = () => {
    setShowSandwichLeavePopup(false);
    submitLeaveApplication();
  };

  const handleSandwichLeaveCancel = () => {
    setShowSandwichLeavePopup(false);
    setSandwichLeaveSundays([]);
  };

  const handleReset = () => {
    const userData = localStorage.getItem('user');
    const executiveId = localStorage.getItem('executiveId');

    let userInfo = {
      employeeId: '',
      fullName: '',
      role: '',
      positionTitle: '',
    };

    if (userData) {
      try {
        const user = JSON.parse(userData);
        userInfo = {
          employeeId: user.id || executiveId || user.employeeId || '',
          fullName: (user.username || user.name || user.fullName || '') + ' (Salary Pending)',
          role: user.role || '',
          positionTitle: (user.position || user.title || user.designation || '') + ' (Unpaid)',
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setFormData({
      ...userInfo,
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: '',
      reason: '',
      emergencyContactName: '',
      emergencyPhone: '',
      workHandoverTo: '',
      handoverNotes: '',
      attachments: null,
      appliedDate: moment().format('YYYY-MM-DD'),
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmissionError('');
    generateRandomBugMessage();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleViewToggle = () => {
    setCurrentView(currentView === 'form' ? 'history' : 'form');
    if (currentView === 'history') {
      setIsSubmitted(false);
    }
    generateRandomBugMessage();
  };

  // Bug: Salary Popup Component
  const SalaryPopup = () => (
    <div className="el-popup-overlay">
      <div className="el-popup-container">
        <div className="el-popup-header">
          <AlertCircle className="el-popup-icon" style={{ color: '#ef4444' }} />
          <h3 className="el-popup-title">SALARY DEDO PEHLE! 💰</h3>
          <button 
            onClick={handleSalaryPopupClose}
            className="el-popup-close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="el-popup-content">
          <p className="el-popup-message" style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
            🚨 SALARY NAHI DIYE TUMHE CHUTTI CHAHIYE? 🚨
          </p>
          
          <div className="el-sunday-list">
            <div className="el-sunday-item" style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444' }}>
              💸 Last 3 months salary pending hai
            </div>
            <div className="el-sunday-item" style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444' }}>
              🍕 Office mein free pizza bhi nahi milti
            </div>
            <div className="el-sunday-item" style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444' }}>
              ☕ Coffee machine bhi kharab hai
            </div>
            <div className="el-sunday-item" style={{ backgroundColor: '#fef2f2', border: '2px solid #ef4444' }}>
              🏢 AC bhi band kar diya hai cost cutting ke naam pe
            </div>
          </div>
          
          <div className="el-popup-warning" style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px' }}>
            <strong>HR Ka Message:</strong> Pehle apna pending salary maang lo, phir chutti ka form bharke dikhao. 
            Weekend mein bhi office aa sakte ho, overtime nahi milega lekin! 😈
          </div>
        </div>
        
        <div className="el-popup-actions">
          <button 
            onClick={handleSalaryPopupClose}
            className="el-popup-cancel-btn"
          >
            😭 Salary Ka Intezaar Karenge
          </button>
          <button 
            onClick={proceedWithSubmission}
            className="el-popup-confirm-btn"
            style={{ backgroundColor: '#ef4444' }}
          >
            🤡 Bina Salary Ke Bhi Chutti Chahiye
          </button>
        </div>
      </div>
    </div>
  );

  const SandwichLeavePopup = () => (
    <div className="el-popup-overlay">
      <div className="el-popup-container">
        <div className="el-popup-header">
          <AlertCircle className="el-popup-icon" style={{ color: '#f59e0b' }} />
          <h3 className="el-popup-title">Sandwich Leave Detected (Aur Paisa Katega!) 🥪</h3>
          <button 
            onClick={handleSandwichLeaveCancel}
            className="el-popup-close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="el-popup-content">
          <p className="el-popup-message">
            Tumhara leave sandwich ke jaisa hai - beech mein Sunday(s) hai, aur company paisa kaategi:
          </p>
          
          <div className="el-sunday-list">
            {sandwichLeaveSundays.map((sunday, index) => (
              <div key={index} className="el-sunday-item">
                📅 {formatDateForDisplay(sunday)} - (Ye din bhi salary se katega! 😈)
              </div>
            ))}
          </div>
          
          <div className="el-popup-warning">
            <strong>Company Policy:</strong> Sandwich leave matlab double paisa kaatenge! 
            Sunday ko ghar baithe ho aur chutti bhi li hai, toh salary mein se cut karenge. 
            Management ka naya rule hai! 💸
          </div>
        </div>
        
        <div className="el-popup-actions">
          <button 
            onClick={handleSandwichLeaveCancel}
            className="el-popup-cancel-btn"
          >
            😰 Dates Change Karenge
          </button>
          <button 
            onClick={handleSandwichLeaveConfirm}
            className="el-popup-confirm-btn"
            disabled={uploading}
          >
            {uploading ? 'Paisa Kaat Rahe Hain...' : '💀 Paisa Kaato, Chutti Dedo'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="el-container">
        <div className="el-success-card">
          <CheckCircle className="el-success-icon" />
          <h2 className="el-success-title">Leave Application Submit Ho Gayi (Shayad Approve Ho Jaye!) 🤞</h2>
          <p className="el-success-message">
            Tumhara leave application submit ho gaya hai aur pending approval mein hai.
            HR mood mein hai toh approve kar denge, nahi toh... 🤷‍♂️
            Confirmation email? WhatsApp pe message kar denge shayad!
          </p>
          <div className="el-success-details">
            <p><strong>Employee:</strong> {formData.fullName}</p>
            <p><strong>Employee ID:</strong> {formData.employeeId} (Salary Pending)</p>
            <p><strong>Role:</strong> {formData.role}</p>
            <p><strong>Leave Type:</strong> {formData.leaveType}</p>
            <p><strong>Duration:</strong> {formData.startDate} to {formData.endDate} ({formData.totalDays})</p>
          </div>
          <div className="el-success-actions">
            <button onClick={handleReset} className="el-new-application-btn">
              🔄 Aur Chutti Chahiye
            </button>
            <button 
              onClick={handleViewToggle} 
              className="el-toggle-btn"
              style={{ marginLeft: '10px' }}
            >
              <History size={18} />
              📜 Purani Chutti History Dekho
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="el-container">
      {showSalaryPopup && <SalaryPopup />}
      {showSandwichLeavePopup && <SandwichLeavePopup />}
      
      {randomBugMessage && (
        <div className="el-error-banner" style={{ 
          backgroundColor: '#fee2e2', 
          border: '2px solid #ef4444',
          animation: 'blink 1s infinite'
        }}>
          <AlertCircle size={20} style={{ color: '#ef4444' }} />
          <span style={{ fontWeight: 'bold' }}>{randomBugMessage}</span>
          <button 
            onClick={() => setRandomBugMessage('')}
            style={{ 
              marginLeft: '10px', 
              background: 'none', 
              border: 'none', 
              color: '#ef4444',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      <div className="el-header">
        <div className="el-header-content">
          <User className="el-header-icon" />
          <div>
            <h1 className="el-title">Employee Chutti Application (Salary Pending System) 💸</h1>
            <p className="el-subtitle">
              {currentView === 'form' 
                ? 'Pehle salary maango, phir chutti ka form bharo (Good Luck!)' 
                : 'Apni purani chutti applications dekho (Kitni reject hui hain!)'
              }
            </p>
          </div>
        </div>
        <div className="el-header-buttons">
          <button
            onClick={handleViewToggle}
            className="el-toggle-btn"
          >
            {currentView === 'form' ? (
              <>
                <History size={18} />
                📊 Rejection History
              </>
            ) : (
              <>
                <Plus size={18} />
                ➕ Nayi Chutti (Good Luck!)
              </>
            )}
          </button>
        </div>
      </div>

      {currentView === 'form' ? (
        <div className="el-form">
          {submissionError && (
            <div className="el-error-banner">
              <AlertCircle size={20} style={{ color: '#ef4444' }} />
              <span>{submissionError}</span>
            </div>
          )}

          <div className="el-section">
            <h3 className="el-section-title">
              <User size={20} className="el-section-icon" />
              Employee Information (Salary Defaulter Details) 💰
            </h3>
            <div className="el-grid">
              <div className="el-form-group">
                <label className="el-label">Employee ID (Salary Pending ID)</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="el-input el-input-readonly"
                  placeholder="Auto-populated from login (Salary still pending)"
                  readOnly
                />
                <span className="el-info-text" style={{ color: '#ef4444' }}>
                  ⚠️ Last 3 months salary pending hai, ID se pata chal jayega
                </span>
              </div>
              <div className="el-form-group">
                <label className="el-label">Full Name (Salary Victim) *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`el-input el-input-readonly ${errors.fullName ? 'el-input-error' : ''}`}
                  placeholder="Auto-populated (with salary pending status)"
                  readOnly
                />
                <span className="el-info-text" style={{ color: '#ef4444' }}>
                  🤡 Name ke saath salary status bhi show ho raha hai
                </span>
                {errors.fullName && <span className="el-error-text">{errors.fullName}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">Role (Job Title Ya Joke Title?) *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`el-select el-select-readonly ${errors.role ? 'el-input-error' : ''}`}
                  disabled
                >
                  <option value="">Select Your Slavery Level</option>
                  {roleOptions.map(roleOption => (
                    <option key={roleOption} value={roleOption}>{roleOption}</option>
                  ))}
                </select>
                <span className="el-info-text" style={{ color: '#f59e0b' }}>
                  📋 Role names updated by frustrated HR team
                </span>
                {errors.role && <span className="el-error-text">{errors.role}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">Position/Title (Unpaid Intern?) *</label>
                <input
                  type="text"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleInputChange}
                  className={`el-input ${errors.positionTitle ? 'el-input-error' : ''}`}
                  placeholder="Enter your fake designation here"
                />
                {errors.positionTitle && <span className="el-error-text">{errors.positionTitle}</span>}
              </div>
            </div>
          </div>

          <div className="el-section">
            <h3 className="el-section-title">
              <Calendar size={20} className="el-section-icon" />
              Leave Details (Chutti Ki Details) 🏖️
            </h3>
            <div className="el-grid">
              <div className="el-form-group">
                <label className="el-label">Leave Type (Bahana Type) *</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className={`el-select ${errors.leaveType ? 'el-input-error' : ''}`}
                >
                  <option value="">Select Your Excuse Type</option>
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.leaveType && <span className="el-error-text">{errors.leaveType}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">Start Date (Ghar Baitne Ka Din) *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`el-input ${errors.startDate ? 'el-input-error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.startDate && <span className="el-error-text">{errors.startDate}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">End Date (Wapas Aane Ka Din) *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`el-input ${errors.endDate ? 'el-input-error' : ''}`}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.endDate && <span className="el-error-text">{errors.endDate}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">Total Days (Random Calculator)</label>
                <input
                  type="text"
                  name="totalDays"
                  value={formData.totalDays}
                  readOnly
                  className="el-input el-input-readonly"
                  placeholder="AI se calculate ho raha hai (Galat hoga!)"
                />
                <span className="el-info-text" style={{ color: '#f59e0b' }}>
                  🤖 Calculation thoda off hai, bonus days mil jaayenge!
                </span>
              </div>
            </div>
          </div>

          <div className="el-section">
            <h3 className="el-section-title">
              <FileText size={20} className="el-section-icon" />
              Additional Information (Jhooth Ki Details) 📝
            </h3>
            <div className="el-form-group">
              <label className="el-label">Reason for Leave (Creative Writing Exercise) *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className={`el-textarea ${errors.reason ? 'el-input-error' : ''}`}
                placeholder="Please provide your best excuse story here... (HR will laugh at it anyway)"
                rows="4"
              />
              {errors.reason && <span className="el-error-text">{errors.reason}</span>}
            </div>

            <div className="el-grid">
              <div className="el-form-group">
                <label className="el-label">Emergency Contact Name (Blame Game Contact) *</label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className={`el-input ${errors.emergencyContactName ? 'el-input-error' : ''}`}
                  placeholder="Kaun blame lega tumhara? (Mummi ka naam de do)"
                />
                {errors.emergencyContactName && <span className="el-error-text">{errors.emergencyContactName}</span>}
              </div>
              <div className="el-form-group">
                <label className="el-label">Emergency Phone (Wrong Number Guaranteed) *</label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className={`el-input ${errors.emergencyPhone ? 'el-input-error' : ''}`}
                  placeholder="Number galat hoga, guarantee hai"
                />
                {errors.emergencyPhone && <span className="el-error-text">{errors.emergencyPhone}</span>}
              </div>
            </div>

            <div className="el-grid">
              <div className="el-form-group">
                <label className="el-label">Work Handover To (Scapegoat)</label>
                <input
                  type="text"
                  name="workHandoverTo"
                  value={formData.workHandoverTo}
                  onChange={handleInputChange}
                  className="el-input"
                  placeholder="Kisko blame karoge for incomplete work? (Junior ko daal do)"
                />
                <span className="el-info-text" style={{ color: '#f59e0b' }}>
                  💡 Pro tip: Junior ka naam daal do, unko experience mil jayega!
                </span>
              </div>
              <div className="el-form-group">
                <label className="el-label">Supporting Documents (Fake Certificate)</label>
                <input
                  type="file"
                  name="attachments"
                  onChange={handleInputChange}
                  className="el-file-input"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                <span className="el-info-text" style={{ color: '#ef4444' }}>
                  🚨 Medical certificate banwana pada? Google Images se download kiya?
                </span>
              </div>
            </div>

            <div className="el-form-group">
              <label className="el-label">Handover Notes (Comedy Script)</label>
              <textarea
                name="handoverNotes"
                value={formData.handoverNotes}
                onChange={handleInputChange}
                className="el-textarea"
                placeholder="Yahan jhooth likh sakte ho ki tumhara kaam important hai... (Sabko pata hai kuch khaas nahi karte)"
                rows="3"
              />
              <span className="el-info-text" style={{ color: '#6b7280' }}>
                📝 Handover notes: "Just Google it" is not a valid instruction
              </span>
            </div>
          </div>

          <div className="el-action-buttons">
            <button 
              type="button" 
              onClick={handleReset} 
              className="el-reset-btn" 
              disabled={uploading}
              style={{ 
                background: 'linear-gradient(45deg, #ef4444, #f59e0b)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              🔄 Reset (Sab Kuch Barbaad Kar Do)
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="el-submit-btn"
              disabled={uploading}
              style={{ 
                background: uploading ? '#6b7280' : 'linear-gradient(45deg, #ef4444, #dc2626)',
                animation: !uploading ? 'pulse 2s infinite' : 'none',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <Clock size={18} className="el-btn-icon" />
              {uploading ? '💸 Salary Check Kar Rahe Hain...' : '💰 SALARY DEDO PEHLE!'}
            </button>
          </div>
          
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#fee2e2',
            border: '2px dashed #ef4444',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', margin: '0' }}>
              ⚠️ DISCLAIMER: Is form ko submit karne se pehle apna salary status check kar lena. 
              Pending salary hai toh HR tumhe hasega aur form reject kar dega! 😂
            </p>
          </div>
        </div>
      ) : (
        <div className="el-section">
          <h3 className="el-section-title">
            <Calendar size={20} className="el-section-icon" />
            Your Leave Application History (Hall of Rejections) 📜
          </h3>
          {leaveHistoryLoading ? (
            <div className="el-loading" style={{ 
              textAlign: 'center', 
              color: '#f59e0b',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              🔍 Loading your rejection history... Please wait while we fetch your disappointments!
            </div>
          ) : leaveApplications.length === 0 ? (
            <div className="el-no-data">
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Calendar size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
                <h3 style={{ color: '#ef4444', marginBottom: '8px' }}>
                  🎉 Congratulations! No rejections yet!
                </h3>
                <p style={{ color: '#f59e0b', marginBottom: '20px', fontWeight: 'bold' }}>
                  Tumne abhi tak koi leave application nahi bhari, ya phir sab delete ho gayi! 
                  First time submit karne wale ho? All the best! 🤞
                </p>
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  border: '2px solid #f59e0b',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '20px'
                }}>
                  <p style={{ color: '#92400e', margin: '0', fontWeight: 'bold' }}>
                    💡 Pro Tips for First Application:
                  </p>
                  <ul style={{ color: '#92400e', textAlign: 'left', marginTop: '10px' }}>
                    <li>Salary pending hai toh mat bharo form 💰</li>
                    <li>Medical certificate Google se download mat karna 🏥</li>
                    <li>Emergency contact mein sahi number dena 📱</li>
                    <li>Reason mein "Bass yun hi" mat likhna ✍️</li>
                  </ul>
                </div>
                <button 
                  onClick={handleViewToggle}
                  className="el-submit-btn"
                  style={{ 
                    background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                    fontWeight: 'bold'
                  }}
                >
                  <Plus size={18} className="el-btn-icon" />
                  💸 Pehla Rejection Experience Karo!
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{ 
                backgroundColor: '#fee2e2',
                border: '2px solid #ef4444',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#ef4444', fontWeight: 'bold', margin: '0', fontSize: '16px' }}>
                  📊 Total Applications: {leaveApplications.length} | 
                  Approved: {leaveApplications.filter(app => app.status?.toLowerCase() === 'approved').length} | 
                  Rejected: {leaveApplications.filter(app => app.status?.toLowerCase() === 'rejected').length} | 
                  Pending: {leaveApplications.filter(app => app.status?.toLowerCase() === 'pending').length}
                  <br />
                  Success Rate: {leaveApplications.length > 0 ? 
                    Math.round((leaveApplications.filter(app => app.status?.toLowerCase() === 'approved').length / leaveApplications.length) * 100) 
                    : 0}% 
                  {leaveApplications.length > 0 && Math.round((leaveApplications.filter(app => app.status?.toLowerCase() === 'approved').length / leaveApplications.length) * 100) < 50 ? ' 😭' : ' 🎉'}
                </p>
              </div>
              
              <div className="el-table-container">
                <table className="el-table">
                  <thead>
                    <tr>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Leave Type (Bahana)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Start Date (Ghar Baitne Ka Din)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        End Date (Wapas Aane Ka Din)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Total Days (Calculation)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Status (Reality Check)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Applied Date (Hope Date)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        Reason (Creative Writing)
                      </th>
                      <th className="el-table-header" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                        HR Response (Brutal Truth)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveApplications.map((application, index) => (
                      <tr 
                        key={application.id} 
                        className="el-table-row"
                        style={{ 
                          backgroundColor: index % 2 === 0 ? '#fef2f2' : '#ffffff',
                          border: application.status?.toLowerCase() === 'rejected' ? '2px solid #ef4444' : 'none'
                        }}
                      >
                        <td className="el-table-cell" style={{ fontWeight: 'bold' }}>
                          {application.leaveType}
                          {application.leaveType.includes('Salary') && ' 💰'}
                          {application.leaveType.includes('Emergency') && ' 🚨'}
                        </td>
                        <td className="el-table-cell">{application.startDate} 📅</td>
                        <td className="el-table-cell">{application.endDate} 📅</td>
                        <td className="el-table-cell">
                          {application.totalDays} 
                          {application.totalDays > 10 ? ' 😱 (Zyada hai!)' : ' 👍'}
                        </td>
                        <td className="el-table-cell" style={{ 
                          color: getStatusColor(application.status),
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>
                          {application.status}
                          {application.status?.toLowerCase() === 'approved' && ' 🎉'}
                          {application.status?.toLowerCase() === 'rejected' && ' 😭'}
                          {application.status?.toLowerCase() === 'pending' && ' ⏳'}
                        </td>
                        <td className="el-table-cell">{application.appliedDate} ✨</td>
                        <td className="el-table-cell" style={{ 
                          maxWidth: '200px', 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {application.reason}
                          {application.reason.length > 50 && ' 📝 (Long Story)'}
                        </td>
                        <td className="el-table-cell" style={{ 
                          maxWidth: '200px',
                          fontWeight: 'bold',
                          color: application.hrComment ? '#ef4444' : '#6b7280'
                        }}>
                          {application.hrComment || 'HR ne jawab nahi diya 🤐'}
                          {application.hrComment?.includes('reject') && ' 💔'}
                          {application.hrComment?.includes('approve') && ' ❤️'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ 
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#fef3c7',
                border: '2px dashed #f59e0b',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#92400e', fontWeight: 'bold', margin: '0' }}>
                  💡 Analysis: {leaveApplications.filter(app => app.status?.toLowerCase() === 'rejected').length > 0 
                    ? `${leaveApplications.filter(app => app.status?.toLowerCase() === 'rejected').length} rejections! HR tumse naraz hai 😤` 
                    : 'Abhi tak koi rejection nahi, lucky ho! 🍀'
                  }
                  <br />
                  Suggestion: {leaveApplications.filter(app => app.status?.toLowerCase() === 'approved').length === 0 
                    ? 'Pehle salary maang lo, phir chutti! 💰' 
                    : 'Approved applications hai, continue karte raho! 🎯'
                  }
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.5; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .el-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .el-popup-container {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .el-table-row:hover {
          background-color: #fef2f2 !important;
          transform: scale(1.02);
          transition: all 0.2s ease-in-out;
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
        }
        
        .el-submit-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);
        }
        
        .el-reset-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
};

export default EmployeeLeave;