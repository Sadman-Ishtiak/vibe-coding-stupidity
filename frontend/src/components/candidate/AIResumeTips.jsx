import React, { useState } from 'react';
import { aiService } from '../../services/aiService';
import './Candidates.css'; // Reusing candidate styles

const AIResumeTips = () => {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await aiService.analyzeResume(resumeText);
      setAnalysis(data.analysis);
    } catch (err) {
      setError('Failed to analyze resume. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card-form-wrapper" style={{ maxWidth: '1000px' }}>
        <div className="form-header">
          <h2>AI Resume Coach</h2>
          <p>Get personalized career advice and resume improvements powered by Gemini AI</p>
        </div>

        <div className="ai-layout">
          <div className="ai-input-section">
            <form onSubmit={handleAnalyze}>
              <div className="form-group">
                <label>Paste your Resume / CV Text (Optional if Profile is filled)</label>
                <textarea 
                  rows="10"
                  placeholder="Paste the text content of your resume here for deeper analysis..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="ai-textarea"
                />
              </div>
              <button type="submit" className="btn-primary w-100" disabled={loading}>
                {loading ? 'Analyzing with AI...' : '✨ Analyze My Profile'}
              </button>
            </form>
            {error && <div className="alert error mt-3">{error}</div>}
          </div>

          <div className="ai-results-section">
            {!analysis && !loading && (
              <div className="empty-state-ai">
                <div className="ai-icon">🤖</div>
                <h3>Ready to optimize?</h3>
                <p>Paste your resume text and let our AI analyze it against thousands of active job listings.</p>
              </div>
            )}

            {loading && (
              <div className="loading-state-ai">
                <div className="spinner"></div>
                <p>Analyzing market trends and your skills...</p>
              </div>
            )}

            {analysis && (
              <div className="analysis-results">
                <div className="result-card summary">
                  <h3>Professional Summary</h3>
                  <p>{analysis.summary}</p>
                </div>

                <div className="result-grid">
                  <div className="result-card strengths">
                    <h3>✅ Strengths</h3>
                    <ul>
                      {analysis.strengths?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="result-card weaknesses">
                    <h3>⚠️ Areas to Improve</h3>
                    <ul>
                      {analysis.weaknesses?.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="result-card gaps">
                  <h3>🔧 Missing Skills (High Demand)</h3>
                  <div className="tags-row">
                    {analysis.missingSkills?.map((skill, i) => (
                      <span key={i} className="tag-pill red">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="result-card action">
                  <h3>🚀 Recommended Action Plan</h3>
                  <ol>
                    {analysis.actionPlan?.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>

                <div className="result-card roles">
                  <h3>🎯 Recommended Roles</h3>
                  <div className="tags-row">
                    {analysis.recommendedRoles?.map((role, i) => (
                      <span key={i} className="tag-pill blue">{role}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResumeTips;