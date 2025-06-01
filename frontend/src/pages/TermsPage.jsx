import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TermsPage = () => {
  const { role } = useParams();
  const [termsContent, setTermsContent] = useState('');
  const fileName = role === 'contractor' ? 'contractor-terms.txt' : 'user-terms.txt';

  useEffect(() => {
    fetch(`/terms/${fileName}`)
      .then(res => res.text())
      .then(text => setTermsContent(text))
      .catch(() => setTermsContent('Unable to load terms at this time.'));
  }, [fileName]);

  return (
    <main className="container terms-page">
      <h2>{role === 'contractor' ? 'Contractor Terms' : 'User Terms'}</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{termsContent}</pre>
    </main>
  );
};

export default TermsPage;
