import React, { useState, useEffect } from 'react';
import './AccountInfo.css';
import Select from 'react-select';

function AccountInfo({ contractor }) {
  const [status, setStatus] = useState('Unverified');
  const [transport, setTransport] = useState('');
  const [acceptedTypes] = useState(['image/jpeg', 'image/png', 'application/pdf']);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [files, setFiles] = useState({
    id: null,
    tradeCertificate: null,
    photo: null,
    reference_files: null,
    vehicleProof: null,
    workSamples: [],
  });

  const [formData, setFormData] = useState({
    experience: '',
    workAddress: '',
    state: '',
    lga: '',
    area: '',
    bio: '',
    languages: [], 
  });
  
  const [errors, setErrors] = useState({});
  const [lgaOptions, setLgaOptions] = useState([]);
  const [areaSuggestions, setAreaSuggestions] = useState([]);

  const stateLgas = {
    Abuja: ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
    Lagos: ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  };

  const abujaAreas = ['Wuse', 'Asokoro', 'Maitama', 'Gwarinpa', 'Kuje', 'Airport Road', 'Utako', 'Garki'];
  const lagosAreas = ['Ikeja', 'Lekki', 'Victoria Island', 'Yaba', 'Surulere', 'Ikoyi', 'Ajah', 'Badagry'];

  const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Hausa', label: 'Hausa' },
    { value: 'Yoruba', label: 'Yoruba' },
    { value: 'Igbo', label: 'Igbo' },
    { value: 'French', label: 'French' },
    { value: 'Pidgin English', label: 'Pidgin English' },
  ];
  
  useEffect(() => {
    if (formData.state && stateLgas[formData.state]) {
      setLgaOptions(stateLgas[formData.state]);
      setFormData(prev => ({ ...prev, lga: '', area: '' }));
      setAreaSuggestions([]);
    } else {
      setLgaOptions([]);
      setFormData(prev => ({ ...prev, lga: '', area: '' }));
      setAreaSuggestions([]);
    }
  }, [formData.state]);

  useEffect(() => {
    if (!contractor) return;
  
    if (contractor.verified === true) {
      setStatus('Verified');
    } else if (contractor.applied === true) {
      setStatus('Pending');
    } else {
      setStatus('Unverified');
    }
  }, [contractor]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'area') {
      let suggestions = [];
      if (formData.state === 'Abuja') {
        suggestions = abujaAreas.filter(a => a.toLowerCase().startsWith(value.toLowerCase()));
      } else if (formData.state === 'Lagos') {
        suggestions = lagosAreas.filter(a => a.toLowerCase().startsWith(value.toLowerCase()));
      }
      setAreaSuggestions(suggestions);
    }
  };

  const handleFileChange = (e, field) => {
    if (field === 'workSamples') {
      const selectedFiles = Array.from(e.target.files).map(file => {
        file.preview = URL.createObjectURL(file);
        return file;
      });
      if (selectedFiles.some(file => !['image/jpeg', 'image/png'].includes(file.type))) {
        setErrors(prev => ({ ...prev, workSamples: 'Only JPG or PNG images are allowed for past work.' }));
        return;
      }
      if (selectedFiles.length > 5) {
        setErrors(prev => ({ ...prev, workSamples: 'You can upload a maximum of 5 images for past work.' }));
        return;
      }
      setFiles(prev => ({ ...prev, workSamples: selectedFiles }));
      setErrors(prev => ({ ...prev, workSamples: null }));
    } else {
      const file = e.target.files[0];
      if (file && !acceptedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [field]: `Invalid file type for ${field}.` }));
        return;
      }
      setFiles(prev => ({ ...prev, [field]: file }));
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.experience.trim()) newErrors.experience = 'Years of experience is required.';
    if (!formData.workAddress.trim()) newErrors.workAddress = 'Work address is required.';
    if (!formData.state.trim()) newErrors.state = 'State of residence is required.';
    if (!formData.lga.trim()) newErrors.lga = 'LGA is required.';
    if (!formData.area.trim()) newErrors.area = 'Area is required.';
    if (!formData.bio.trim()) newErrors.bio = 'Short bio is required.';
    else if (formData.bio.trim().split(/\s+/).length > 15) newErrors.bio = 'Bio must be 15 words or fewer.';
    if (!termsAccepted) newErrors.terms = 'You must accept the declaration.';
    if (!formData.languages.length) newErrors.languages = 'Please select at least one language.';
    if (!files.id) newErrors.id = 'Government-issued ID is required.';
    else if (!acceptedTypes.includes(files.id.type)) newErrors.id = 'ID must be a valid image or PDF.';
    if (!files.photo) newErrors.photo = 'A personal photo is required.';
    else if (!acceptedTypes.includes(files.photo.type)) newErrors.photo = 'Photo must be a valid image.';
    if (!files.workSamples.length) newErrors.workSamples = 'At least one image of past work is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('Pending'); 
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('transport', transport);
    data.append('applied', true); 
    data.append('languages', JSON.stringify(formData.languages));
    
  
    if (contractor && contractor.user_id) {
      data.append('user_id', contractor.user_id);
    } else {
      alert('User ID is missing. Cannot submit form.');
      return;
    }
    
    Object.entries(files).forEach(([key, value]) => {
      if (key === 'workSamples') {
        value.forEach((file, idx) => data.append(`workSample_${idx}`, file));
      } else if (value) {
        data.append(key, value);
      }
    });

    try {
      const response = await fetch('http://localhost:5050/contractors/submit-kyc', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Submission failed');
      alert('Your profile has been submitted for verification.');
    } catch (err) {
      alert('There was an error submitting your profile. Please try again.');
      console.error(err);
      setStatus('Unverified');
    }
  };

  return (
    <div className="kyc-container">
      <p>
        Upload your documents for verification. The more supporting documents you provide, the better your chances of verification.
        Include a valid government ID, trade certificate, clear photo, reference_files (if any), proof of transport, and past work samples.
        Ensure all info is correct.
      </p>

      <div className="status">
        <strong>Status:</strong>
        <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
      </div>

      <form onSubmit={handleSubmit} className="kyc-form">
        <input type="text" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleInputChange} />
        {errors.experience && <span className="error">{errors.experience}</span>}

        <input type="text" name="workAddress" placeholder="Work Address" value={formData.workAddress} onChange={handleInputChange} />
        {errors.workAddress && <span className="error">{errors.workAddress}</span>}

        <select name="state" value={formData.state} onChange={handleInputChange}>
          <option value="">Select State of Residence</option>
          <option value="Abuja">Abuja</option>
          <option value="Lagos">Lagos</option>
        </select>
        {errors.state && <span className="error">{errors.state}</span>}

        <select name="lga" value={formData.lga} onChange={handleInputChange} disabled={!lgaOptions.length}>
          <option value="">Select LGA</option>
          {lgaOptions.map(lga => (
            <option key={lga} value={lga}>{lga}</option>
          ))}
        </select>
        {errors.lga && <span className="error">{errors.lga}</span>}

        <div className="area-input-container">
          <input
            type="text"
            name="area"
            placeholder="Type Area (e.g., Wuse, Asokoro)"
            value={formData.area}
            onChange={handleInputChange}
            autoComplete="off"
          />
          {areaSuggestions.length > 0 && (
            <ul className="area-suggestions">
              {areaSuggestions.map((area, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, area }));
                    setAreaSuggestions([]);
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.area && <span className="error">{errors.area}</span>}

      <div className="form-group">
        <label htmlFor="languages">Languages Spoken (select all that apply)</label>
        <Select
          inputId="languages"
          isMulti
          name="languages"
          options={languageOptions}
          value={languageOptions.filter(o => formData.languages.includes(o.value))}
          onChange={(selectedOptions) => {
            const langs = selectedOptions.map(o => o.value);
            setFormData(prev => ({ ...prev, languages: langs }));
          }}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select languages..."
        />
        {errors.languages && <span className="error">{errors.languages}</span>}
      </div>

        <label htmlFor="bio">Short Bio <small>(max 15 words)</small></label>
        <textarea
          id="bio"
          name="bio"
          placeholder="e.g., Experienced mechanic with 10+ years of service in Abuja."
          value={formData.bio}
          onChange={handleInputChange}
          rows={3}
        />
        {errors.bio && <span className="error">{errors.bio}</span>}

        <select value={transport} onChange={e => setTransport(e.target.value)}>
          <option value="">Select Mode of Transport</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="truck">Truck</option>
          <option value="none">None</option>
        </select>

        <label>
          Upload Government-issued ID
          <input type="file" onChange={(e) => handleFileChange(e, 'id')} />
          {errors.id && <span className="error">{errors.id}</span>}
        </label>

        <label>
          Upload Trade Certificate
          <input type="file" onChange={(e) => handleFileChange(e, 'tradeCertificate')} />
        </label>

        <label>
          Upload Personal Photo
          <input type="file" onChange={(e) => handleFileChange(e, 'photo')} />
          {errors.photo && <span className="error">{errors.photo}</span>}
        </label>

        <label>
          Upload References (Optional)
          <input type="file" onChange={(e) => handleFileChange(e, 'reference_files')} />
        </label>

        <label>
          Upload Vehicle Proof (Optional)
          <input type="file" onChange={(e) => handleFileChange(e, 'vehicleProof')} />
        </label>

        <label>
          Upload Work Samples (up to 5 images)
          <input type="file" multiple onChange={(e) => handleFileChange(e, 'workSamples')} />
          {errors.workSamples && <span className="error">{errors.workSamples}</span>}
        </label>

        <label className="kyc-checkbox-container">
        <input 
          className="kyc-checkbox" 
          type="checkbox" 
          checked={termsAccepted} 
          onChange={(e) => setTermsAccepted(e.target.checked)} 
        />
        I hereby declare that all information provided is accurate to the best of my knowledge.
      </label>
      {errors.terms && <span className="error">{errors.terms}</span>}

        <button type="submit">Submit for validation</button>
      </form>
    </div>
  );
}

export default AccountInfo;
