import React, { useState } from 'react';
import './AiContentGenerator.css';

const PRESET_PROMPTS = [
  { id: 'blog', label: '📝 Blog Intro', text: 'Write an engaging introduction for a blog about' },
  { id: 'email', label: '✉️ Cold Email', text: 'Draft a professional cold outreach email to a hiring manager for' },
  { id: 'social', label: '📱 Social Post', text: 'Create a catchy, high-engagement LinkedIn post about' },
];

export default function AiContentGenerator() {
  const [selectedPrompt, setSelectedPrompt] = useState(PRESET_PROMPTS[0].text);
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(''); 

    try {
      const fullPrompt = `${selectedPrompt} ${topic}`;
      
      // Replace with your actual backend or API integration endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      setResult(data.text || 'No text generated.');
    } catch (error) {
      console.error('Generation failed:', error);
      setResult('Error: Failed to fetch AI content. Make sure your API route is connected.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="ai-generator-card">
      <h2 className="ai-generator-title">AI Content Generator</h2>
      
      {/* Multiple Prompts Presets */}
      <div className="prompt-presets-container">
        {PRESET_PROMPTS.map((p) => (
          <button 
            key={p.id} 
            type="button"
            className={`preset-btn ${selectedPrompt === p.text ? 'active' : ''}`}
            onClick={() => setSelectedPrompt(p.text)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs & Form Submit */}
      <form onSubmit={handleGenerate} className="ai-generator-form">
        <div className="input-preview-group">
          <span className="prompt-prefix-text">{selectedPrompt}</span>
          <input 
            type="text" 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)} 
            placeholder="enter your topic details..."
            disabled={isLoading}
            className="topic-input"
          />
        </div>
        
        <button type="submit" disabled={isLoading || !topic.trim()} className="generate-submit-btn">
          {isLoading ? 'Generating Assets...' : 'Generate Content'}
        </button>
      </form>

      {/* Loading State Skeleton Box */}
      {isLoading && (
        <div className="loading-skeleton">
          <div className="skeleton-line wide"></div>
          <div className="skeleton-line medium"></div>
          <div className="skeleton-line short"></div>
        </div>
      )}
      
      {/* Generated Content Result Field & Copy Option */}
      {result && !isLoading && (
        <div className="result-display-wrapper">
          <div className="result-text-area">
            <p>{result}</p>
          </div>
          <button onClick={handleCopy} className="copy-action-btn">
            {copied ? '✅ Copied!' : '📋 Copy Results'}
          </button>
        </div>
      )}
    </div>
  );
}   