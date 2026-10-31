import { useEffect, useState } from 'react';
import { FileText, Sparkles, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import { resumeAPI } from '../services/api';
import '../styles/features/resume.css';

const starterContent = `Alex Morgan
alex.morgan@email.com | linkedin.com/in/alexmorgan

Professional Summary
Product-minded developer who builds accessible web experiences and enjoys turning complex problems into simple workflows.

Experience
Frontend Developer — Northstar Labs
2023–Present
- Built React interfaces used by 12,000 monthly users.
- Improved onboarding completion by 24% through iterative UX testing.

Skills
React, JavaScript, HTML, CSS, Git, REST APIs, UX research

Education
B.S. Computer Science — State University`;

export default function ResumeStudio() {
  const [resumes, setResumes] = useState([]);
  const [title, setTitle] = useState('My professional resume');
  const [content, setContent] = useState(starterContent);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const loadResumes = async () => {
    try {
      const response = await resumeAPI.list();
      setResumes(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load resumes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast.error('For now, upload a plain text resume export.');
      return;
    }
    setContent(await file.text());
    setTitle(file.name.replace(/\.[^/.]+$/, '') || title);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await resumeAPI.create({ title, content });
      setSelected(response.data);
      setResumes((current) => [response.data, ...current]);
      toast.success('Resume saved to your studio.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selected?._id) {
      toast.error('Save your resume before analyzing it.');
      return;
    }
    setAnalyzing(true);
    try {
      const response = await resumeAPI.analyze(selected._id);
      setSelected(response.data);
      setResumes((current) =>
        current.map((resume) =>
          resume._id === response.data._id ? response.data : resume
        )
      );
      toast.success('Resume analysis is ready.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not analyze resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  const openResume = async (id) => {
    try {
      const response = await resumeAPI.get(id);
      setSelected(response.data);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (error) {
      toast.error('Could not open that resume.');
    }
  };

  const analysis = selected?.analysis;

  return (
    <main className="resume-studio-page">
      <header className="resume-studio-header">
        <div>
          <div className="resume-eyebrow"><Sparkles /> AI RESUME STUDIO</div>
          <h1>Make your experience impossible to miss.</h1>
          <p>Draft an ATS-friendly resume, then use CareerAI to find the signal recruiters should see first.</p>
        </div>
        <label className="resume-upload-button">
          <Upload />
          Import .txt
          <input type="file" accept=".txt,text/plain" onChange={handleFile} />
        </label>
      </header>

      <div className="resume-studio-grid">
        <section className="resume-editor-panel">
          <div className="resume-panel-heading">
            <div>
              <span className="resume-panel-kicker">01 / BUILD</span>
              <h2>Your working draft</h2>
            </div>
            <span className="resume-word-count">{content.length.toLocaleString()} / 30,000</span>
          </div>
          <form onSubmit={handleSave}>
            <label className="resume-field-label" htmlFor="resume-title">Document name</label>
            <input id="resume-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <label className="resume-field-label" htmlFor="resume-content">Resume content</label>
            <textarea id="resume-content" value={content} onChange={(event) => setContent(event.target.value)} />
            <div className="resume-editor-actions">
              <Button type="submit" loading={saving}><FileText /> Save resume</Button>
              <Button type="button" variant="secondary" onClick={handleAnalyze} loading={analyzing}><Sparkles /> Analyze with AI</Button>
            </div>
          </form>
        </section>

        <aside className="resume-insight-panel">
          <div className="resume-panel-heading">
            <div>
              <span className="resume-panel-kicker">02 / SIGNAL</span>
              <h2>ATS intelligence</h2>
            </div>
            {analysis && <strong className="resume-score">{analysis.score}<small>/100</small></strong>}
          </div>
          {analysis ? (
            <div className="resume-analysis">
              <p className="resume-analysis-summary">{analysis.summary}</p>
              <AnalysisList title="What is working" items={analysis.strengths} tone="positive" />
              <AnalysisList title="Keywords to consider" items={analysis.missingKeywords} tone="warning" />
              <AnalysisList title="Next improvements" items={analysis.suggestions} tone="neutral" />
            </div>
          ) : (
            <div className="resume-empty-analysis">
              <div><Sparkles /></div>
              <h3>Your analysis will appear here</h3>
              <p>Save a draft and run the AI review for grounded, actionable feedback.</p>
            </div>
          )}
        </aside>
      </div>

      <section className="resume-library-panel">
        <div className="resume-panel-heading">
          <div>
            <span className="resume-panel-kicker">03 / LIBRARY</span>
            <h2>Saved documents</h2>
          </div>
          <span className="resume-library-meta">{loading ? 'Loading…' : `${resumes.length} document${resumes.length === 1 ? '' : 's'}`}</span>
        </div>
        {resumes.length ? (
          <div className="resume-library-grid">
            {resumes.map((resume) => (
              <button type="button" className={`resume-library-card ${selected?._id === resume._id ? 'is-selected' : ''}`} key={resume._id} onClick={() => openResume(resume._id)}>
                <FileText />
                <span>{resume.title}</span>
                <small>{resume.analysis?.score ? `ATS score ${resume.analysis.score}` : 'Not analyzed yet'}</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="resume-library-empty"><AlertCircle /> Save your first resume to start building your document library.</p>
        )}
      </section>
    </main>
  );
}

function AnalysisList({ title, items, tone }) {
  return (
    <div className={`resume-analysis-list is-${tone}`}>
      <h3>{title}</h3>
      <ul>{items.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul>
    </div>
  );
}
