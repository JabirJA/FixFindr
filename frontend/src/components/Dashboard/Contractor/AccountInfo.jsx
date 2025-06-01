import React, { useState, useEffect } from 'react';
import './AccountInfo.css';

function AccountInfo() {
  const [status, setStatus] = useState('Unverified');
  const [transport, setTransport] = useState('');
  const [acceptedTypes] = useState(['image/jpeg', 'image/png', 'application/pdf']);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [files, setFiles] = useState({
    id: null,
    tradeCertificate: null,
    photo: null,
    references: null,
    vehicleProof: null,
    workSamples: [], // multiple images of past work
  });

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    experience: '',
    nin: '',
    bvn: '',
    address: '',
    state: '',
    lga: '',
  });

  const [errors, setErrors] = useState({});

  // Cleanup object URLs for work samples to avoid memory leaks
  useEffect(() => {
    // Revoke URLs when component unmounts or workSamples change
    return () => {
      files.workSamples.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files.workSamples]);

  // Handle file changes (single files and multiple work samples)
  const handleFileChange = (e, field) => {
    if (field === 'workSamples') {
      const selectedFiles = Array.from(e.target.files).map(file => {
        // Create preview URL for each file
        file.preview = URL.createObjectURL(file);
        return file;
      });

      // Validate file types
      const invalidFiles = selectedFiles.filter(
        (file) => !['image/jpeg', 'image/png'].includes(file.type)
      );

      if (invalidFiles.length > 0) {
        setErrors(prev => ({
          ...prev,
          workSamples: 'Only JPG or PNG images are allowed for past work.',
        }));
        return;
      }

      if (selectedFiles.length > 5) {
        setErrors(prev => ({
          ...prev,
          workSamples: 'You can upload a maximum of 5 images for past work.',
        }));
        return;
      }

      setFiles(prev => ({
        ...prev,
        workSamples: selectedFiles,
      }));

      setErrors(prev => ({ ...prev, workSamples: null }));
    } else {
      const file = e.target.files[0];
      setFiles(prev => ({
        ...prev,
        [field]: file,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Basic input validations
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    }

    if (!formData.experience.trim()) {
      newErrors.experience = 'Experience is required.';
    }

    if (!formData.nin.trim()) {
      newErrors.nin = 'NIN is required.';
    } else if (!/^\d{11}$/.test(formData.nin)) {
      newErrors.nin = 'NIN must be exactly 11 digits.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Residential address is required.';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State of residence is required.';
    }

    if (!formData.lga.trim()) {
      newErrors.lga = 'LGA is required.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the declaration.';
    }

    // File validations
    if (!files.id) {
      newErrors.id = 'Government-issued ID is required.';
    } else if (!acceptedTypes.includes(files.id.type)) {
      newErrors.id = 'ID must be a valid image or PDF file.';
    }

    if (!files.photo) {
      newErrors.photo = 'A personal photo is required.';
    } else if (!acceptedTypes.includes(files.photo.type)) {
      newErrors.photo = 'Photo must be a valid image file.';
    }

    // Validate work samples (at least one)
    if (!files.workSamples.length) {
      newErrors.workSamples = 'At least one image of past work is required.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('Pending');
    alert('Your profile has been submitted for verification.');
  };

  return (
    <div className="kyc-container">
      <p>
        Upload your documents for verification. Include a valid government ID, trade certificate,
        a clear photo, references (if any), and proof of transport. Ensure all info is correct.
      </p>

      <div className="status">
        <strong>Status:</strong>
        <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
      </div>

      <form onSubmit={handleSubmit} className="kyc-form">
        {/* File Uploads */}
        <label>
          Government ID (Required):
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFileChange(e, 'id')}
          />
          {errors.id && <span className="error">{errors.id}</span>}
        </label>

        <label>
          Trade Certificate (Optional):
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFileChange(e, 'tradeCertificate')}
          />
        </label>

        <label>
          Personal Photo (Required):
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => handleFileChange(e, 'photo')}
          />
          {errors.photo && <span className="error">{errors.photo}</span>}
        </label>

        <label>
          Proof of Transport (e.g., Plate or Side View):
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFileChange(e, 'vehicleProof')}
          />
        </label>

        <label>
          References (Optional):
          <input
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={(e) => handleFileChange(e, 'references')}
          />
        </label>

        {/* Multiple images of past work */}
        <label>
          Upload Images of Past Work (up to 5 images):
          <input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={(e) => handleFileChange(e, 'workSamples')}
          />
          {errors.workSamples && <span className="error">{errors.workSamples}</span>}

          <div className="preview-grid">
            {files.workSamples.length > 0 &&
              files.workSamples.map((file, idx) => (
                <img
                  key={idx}
                  src={file.preview}
                  alt={`Work Sample ${idx + 1}`}
                  className="preview-thumbnail"
                />
              ))}
          </div>
        </label>

        {/* Transport Ownership */}
        <label>
          Do you own a means of transport?
          <select value={transport} onChange={(e) => setTransport(e.target.value)}>
            <option value="">-- Select Option --</option>
            <option value="Car">Yes – Car</option>
            <option value="Motorcycle">Yes – Motorcycle</option>
            <option value="Tricycle">Yes – Tricycle (Keke)</option>
            <option value="No">No</option>
          </select>
        </label>

        <h3>Personal & Contact Information</h3>

        <label>
          Phone Number (WhatsApp): *
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </label>

        <label>
          Email Address: *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </label>

        <label>
          Years of Experience: *
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            min="0"
          />
          {errors.experience && <span className="error">{errors.experience}</span>}
        </label>

        <label>
          NIN (National ID Number): *
          <input
            type="text"
            name="nin"
            value={formData.nin}
            onChange={handleInputChange}
            maxLength="11"
          />
          {errors.nin && <span className="error">{errors.nin}</span>}
        </label>

        <label>
          BVN (Bank Verification Number): (Optional)
          <input
            type="text"
            name="bvn"
            value={formData.bvn}
            onChange={handleInputChange}
            maxLength="11"
          />
        </label>

        <label>
          Residential Address: *
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </label>

        <label>
          State of Residence: *
          <select name="state" value={formData.state} onChange={handleInputChange}>
            <option value="">-- Select State --</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja">Abuja</option>
            <option value="Kano">Kano</option>
            {/* Add more states as needed */}
          </select>
          {errors.state && <span className="error">{errors.state}</span>}
        </label>

        <label>
          Local Government Area (LGA): *
          <input
            type="text"
            name="lga"
            value={formData.lga}
            onChange={handleInputChange}
          />
          {errors.lga && <span className="error">{errors.lga}</span>}
        </label>

        <label className="checkbox-field ">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          />
          I hereby declare that the information provided is true and accurate to the best of my knowledge.
        </label>
        {errors.terms && <span className="error">{errors.terms}</span>}

        <div className='submit-buttonu'>
        <button type="submit" disabled={!termsAccepted} style={{
          backgroundColor: 'var(--accent)',
          color: 'white',
          padding: '0.6rem 1.2rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          Submit & Update Profile
        </button>
        </div>
      </form>
    </div>
  );
}

export default AccountInfo;
