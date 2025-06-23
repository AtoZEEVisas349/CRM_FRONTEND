import React, { useState } from 'react';
import { Calendar, FileText, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const EmployeeLeave = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    position: '',
    leaveType: '',
    startDate: '',
    endDate: '',
    totalDays: '',
    reason: '',
    emergencyContact: '',
    emergencyPhone: '',
    handoverTo: '',
    handoverNotes: '',
    attachments: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const leaveTypes = [
    'Annual Leave',
    'Sick Leave',
    'Personal Leave',
    'Emergency Leave',
    'Bereavement Leave',
    'Maternity/Paternity Leave',
    'Study Leave',
    'Sabbatical Leave'
  ];

  const departments = [
    'Executive Management',
    'Human Resources',
    'Finance',
    'Operations',
    'Marketing',
    'Technology',
    'Legal',
    'Strategy'
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachments') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Calculate total days when dates change
    if (name === 'startDate' || name === 'endDate') {
      const startDate = new Date(name === 'startDate' ? value : formData.startDate);
      const endDate = new Date(name === 'endDate' ? value : formData.endDate);
      
      if (startDate && endDate && endDate >= startDate) {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        setFormData(prev => ({ ...prev, totalDays: daysDiff.toString() }));
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      // Here you would typically send the data to your backend
      console.log('Leave application submitted:', formData);
    }
  };

  const handleReset = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      position: '',
      leaveType: '',
      startDate: '',
      endDate: '',
      totalDays: '',
      reason: '',
      emergencyContact: '',
      emergencyPhone: '',
      handoverTo: '',
      handoverNotes: '',
      attachments: null
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <CheckCircle style={styles.successIcon} />
          <h2 style={styles.successTitle}>Leave Application Submitted Successfully</h2>
          <p style={styles.successMessage}>
            Your leave application has been submitted and is pending approval. 
            You will receive a confirmation email shortly with your application reference number.
          </p>
          <div style={styles.successDetails}>
            <p><strong>Employee:</strong> {formData.employeeName}</p>
            <p><strong>Leave Type:</strong> {formData.leaveType}</p>
            <p><strong>Duration:</strong> {formData.startDate} to {formData.endDate} ({formData.totalDays} days)</p>
          </div>
          <button onClick={handleReset} style={styles.newApplicationBtn}>
            Submit New Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <User style={styles.headerIcon} />
          <div>
            <h1 style={styles.title}>Executive Leave Application</h1>
            <p style={styles.subtitle}>Submit your leave request for approval</p>
          </div>
        </div>
      </div>

      <div style={styles.form}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <User size={20} style={styles.sectionIcon} />
            Employee Information
          </h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter employee ID"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleInputChange}
                style={errors.employeeName ? { ...styles.input, ...styles.inputError } : styles.input}
                placeholder="Enter full name"
              />
              {errors.employeeName && <span style={styles.errorText}>{errors.employeeName}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                style={errors.department ? { ...styles.select, ...styles.inputError } : styles.select}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span style={styles.errorText}>{errors.department}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Position/Title *</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                style={errors.position ? { ...styles.input, ...styles.inputError } : styles.input}
                placeholder="Enter position/title"
              />
              {errors.position && <span style={styles.errorText}>{errors.position}</span>}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <Calendar size={20} style={styles.sectionIcon} />
            Leave Details
          </h3>
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Leave Type *</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleInputChange}
                style={errors.leaveType ? { ...styles.select, ...styles.inputError } : styles.select}
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.leaveType && <span style={styles.errorText}>{errors.leaveType}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                style={errors.startDate ? { ...styles.input, ...styles.inputError } : styles.input}
              />
              {errors.startDate && <span style={styles.errorText}>{errors.startDate}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                style={errors.endDate ? { ...styles.input, ...styles.inputError } : styles.input}
              />
              {errors.endDate && <span style={styles.errorText}>{errors.endDate}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Total Days</label>
              <input
                type="text"
                name="totalDays"
                value={formData.totalDays}
                readOnly
                style={{...styles.input, backgroundColor: '#f8f9fa'}}
                placeholder="Auto-calculated"
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>
            <FileText size={20} style={styles.sectionIcon} />
            Additional Information
          </h3>
          <div style={styles.formGroup}>
            <label style={styles.label}>Reason for Leave *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              style={errors.reason ? { ...styles.textarea, ...styles.inputError } : styles.textarea}
              placeholder="Please provide detailed reason for leave"
              rows="4"
            />
            {errors.reason && <span style={styles.errorText}>{errors.reason}</span>}
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Emergency Contact Name *</label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                style={errors.emergencyContact ? { ...styles.input, ...styles.inputError } : styles.input}
                placeholder="Contact person during leave"
              />
              {errors.emergencyContact && <span style={styles.errorText}>{errors.emergencyContact}</span>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Emergency Phone *</label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                style={errors.emergencyPhone ? { ...styles.input, ...styles.inputError } : styles.input}
                placeholder="Phone number"
              />
              {errors.emergencyPhone && <span style={styles.errorText}>{errors.emergencyPhone}</span>}
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Work Handover To</label>
              <input
                type="text"
                name="handoverTo"
                value={formData.handoverTo}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Name of person handling responsibilities"
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Supporting Documents</label>
              <input
                type="file"
                name="attachments"
                onChange={handleInputChange}
                style={styles.fileInput}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Handover Notes</label>
            <textarea
              name="handoverNotes"
              value={formData.handoverNotes}
              onChange={handleInputChange}
              style={styles.textarea}
              placeholder="Important notes for work handover and coverage"
              rows="3"
            />
          </div>
        </div>

        <div style={styles.actionButtons}>
          <button type="button" onClick={handleReset} style={styles.resetBtn}>
            Reset Form
          </button>
          <button type="button" onClick={handleSubmit} style={styles.submitBtn}>
            <Clock size={18} style={styles.btnIcon} />
            Submit Leave Application
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '32px',
    color: 'white',
    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  headerIcon: {
    size: 48,
    opacity: 0.9
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: '18px',
    margin: 0,
    opacity: 0.9,
    fontWeight: '400'
  },
  form: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0'
  },
  section: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e2e8f0'
  },
  sectionIcon: {
    color: '#667eea'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    letterSpacing: '0.025em'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    outline: 'none'
  },
  select: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    outline: 'none',
    cursor: 'pointer'
  },
  textarea: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  fileInput: {
    padding: '8px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer'
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '500'
  },
  actionButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    paddingTop: '32px',
    borderTop: '1px solid #e2e8f0'
  },
  resetBtn: {
    padding: '12px 24px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    padding: '12px 32px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
  },
  btnIcon: {
    size: 18
  },
  successCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e2e8f0'
  },
  successIcon: {
    size: 64,
    color: '#10b981',
    marginBottom: '24px'
  },
  successTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px'
  },
  successMessage: {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '32px',
    lineHeight: '1.6'
  },
  successDetails: {
    backgroundColor: '#f0f9ff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '32px',
    textAlign: 'left'
  },
  newApplicationBtn: {
    padding: '12px 32px',
    border: 'none',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default EmployeeLeave;