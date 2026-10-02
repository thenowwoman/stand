import { FormEvent, useEffect, useRef, useState } from 'react';

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionResultsLike = {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultsLike;
};
type SpeechRecognitionErrorLike = { error: string };
type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type Skill = {
  id: number;
  label: string;
  description: string;
};

type Service = {
  id: number;
  name: string;
  details: string;
  price: string;
};

type Opportunity = {
  id: number;
  title: string;
  reason: string;
  link: string;
};

type SavedState = {
  input: string;
  skills: Skill[];
  services: Service[];
  opportunities: Opportunity[];
  bio: string;
  friendlyMessage: string;
  followUpAnswers?: FollowUpAnswer[];
  currentFollowUpQuestion?: string | null;
  interactionActive?: boolean;
};

type ThemeChoice = 'system' | 'light' | 'dark';

type FollowUpAnswer = {
  question: string;
  answer: string;
};

const samplePrompt = 'I design flyers and run social media for a church and small businesses.';

const defaultBio = 'I help small businesses and community groups look more polished online through clear visual content, social media support, and simple content systems.';

const defaultSkills: Skill[] = [
  { id: 1, label: 'Graphic Design', description: 'Designs flyers, social posts, and brand visuals.' },
  { id: 2, label: 'Social Media Management', description: 'Runs pages, planning content, and keeps engagement up.' },
  { id: 3, label: 'Content Creation', description: 'Creates simple, engaging copy and visual content.' },
];

const defaultServices: Service[] = [
  { id: 1, name: 'Brand Visuals', details: '3 social posts or a mini flyer set', price: '₦25,000 - ₦45,000' },
  { id: 2, name: 'Social Media Support', details: 'Content plan + caption writing + post scheduling', price: '₦45,000 - ₦80,000' },
  { id: 3, name: 'Content Sprint', details: 'One-week bundle of campaign content and updates', price: '₦60,000 - ₦120,000' },
];

const defaultOpportunities: Opportunity[] = [
  { id: 1, title: 'Creative grants for small business owners', reason: 'Good fit if you create branded visuals and content for local businesses.', link: '#', },
  { id: 2, title: 'Short digital skills training', reason: 'Useful for building structure around your current freelance or side-hustle work.', link: '#', },
  { id: 3, title: 'Micro-agency clients', reason: 'Matches people who already help churches, schools, and local brands with content.', link: '#', },
];

const buildFallbackData = (text: string) => {
  const lower = text.toLowerCase();
  const catalog = [
    { id: 1, label: 'Graphic Design', description: 'Designs flyers, social posts, and brand visuals.', keywords: ['design', 'flyer', 'brand', 'poster', 'graphics', 'logo'] },
    { id: 2, label: 'Content Creation', description: 'Creates creative short-form content for digital channels.', keywords: ['content', 'write', 'copy', 'video', 'caption', 'story', 'social'] },
    { id: 3, label: 'Community Management', description: 'Keeps online communities active, responsive, and organized.', keywords: ['community', 'page', 'church', 'social', 'engagement', 'moderation', 'admin'] },
    { id: 4, label: 'Video Editing', description: 'Cuts and packages engaging clips for social media.', keywords: ['video', 'edit', 'reel', 'clip', 'yt', 'promo'] },
  ];

  const matched = catalog.filter((skill) => skill.keywords.some((word) => lower.includes(word)) || lower.length > 25);
  const skillList = matched.length ? matched : defaultSkills;

  const services: Service[] = [
    { id: 1, name: `${skillList[0]?.label ?? 'Creative'} Starter`, details: 'A compact starter package for small client work.', price: '₦25,000 - ₦45,000' },
    { id: 2, name: `${skillList[1]?.label ?? 'Content'} Growth`, details: 'A mid-size package for recurring content and visibility support.', price: '₦45,000 - ₦80,000' },
    { id: 3, name: `${skillList[2]?.label ?? 'Support'} Essential`, details: 'Ongoing support for a client who needs a simple monthly plan.', price: '₦60,000 - ₦120,000' },
  ];

  return {
    skills: skillList.map((skill) => ({ id: skill.id, label: skill.label, description: skill.description })),
    services,
    opportunities: [
      { id: 1, title: 'Small business content support', reason: 'Perfect if you help churches, brands, or local businesses tell their story.', link: '#', },
      { id: 2, title: 'Creative digital grants', reason: 'Useful if your work is tied to brand design, media, or online visibility.', link: '#', },
      { id: 3, title: 'Freelance client referrals', reason: 'Matches people who already do repeat work for friends, groups, or local businesses.', link: '#', },
    ],
    bio: defaultBio,
  };
};

function App() {
  const [themeChoice, setThemeChoice] = useState<ThemeChoice>(() => {
    const savedTheme = localStorage.getItem('stand-theme');
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'system';
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [input, setInput] = useState(samplePrompt);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultOpportunities);
  const [bio, setBio] = useState(defaultBio);
  const [friendlyMessage, setFriendlyMessage] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resultVersion, setResultVersion] = useState(0);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswer[]>([]);
  const [currentFollowUpQuestion, setCurrentFollowUpQuestion] = useState<string | null>(null);
  const [interactionActive, setInteractionActive] = useState(false);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  const supportsVoiceInput = Boolean(SpeechRecognition);
  const supportsReadAloud = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const effectiveTheme = themeChoice === 'system'
    ? (systemPrefersDark ? 'dark' : 'light')
    : themeChoice;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemPreference = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    mediaQuery.addEventListener('change', updateSystemPreference);
    return () => mediaQuery.removeEventListener('change', updateSystemPreference);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    if (themeChoice === 'system') {
      localStorage.removeItem('stand-theme');
    } else {
      localStorage.setItem('stand-theme', themeChoice);
    }
  }, [effectiveTheme, themeChoice]);

  useEffect(() => {
    const saved = localStorage.getItem('stand-profile');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedState>;
      if (parsed.input) setInput(parsed.input);
      if (parsed.skills?.length) setSkills(parsed.skills);
      if (parsed.services?.length) setServices(parsed.services);
      if (parsed.opportunities?.length) setOpportunities(parsed.opportunities);
      if (parsed.bio) setBio(parsed.bio);
      if (parsed.friendlyMessage) setFriendlyMessage(parsed.friendlyMessage);
      if (Array.isArray(parsed.followUpAnswers)) setFollowUpAnswers(parsed.followUpAnswers);
      if (parsed.currentFollowUpQuestion) setCurrentFollowUpQuestion(parsed.currentFollowUpQuestion);
      if (parsed.interactionActive) setInteractionActive(true);
    } catch {
      // ignore invalid saved state
    }
  }, []);

  useEffect(() => {
    const state: SavedState = {
      input,
      skills,
      services,
      opportunities,
      bio,
      friendlyMessage,
      followUpAnswers,
      currentFollowUpQuestion,
      interactionActive,
    };
    localStorage.setItem('stand-profile', JSON.stringify(state));
  }, [input, skills, services, opportunities, bio, friendlyMessage, followUpAnswers, currentFollowUpQuestion, interactionActive]);

  useEffect(() => () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    if (recognition) {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.abort();
    }
    if ('speechSynthesis' in window) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current = null;
      }
      window.speechSynthesis.cancel();
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!SpeechRecognition) {
      setFriendlyMessage('Voice typing is not available in this browser. You can still type your description.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-NG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex]?.[0]?.transcript.trim();
      if (transcript) {
        setInput((current) => `${current.trimEnd()}${current.trim() ? ' ' : ''}${transcript}`);
        setFriendlyMessage('Voice typing added your words. Review them before continuing.');
      }
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;
      setFriendlyMessage(event.error === 'not-allowed'
        ? 'Microphone access was not allowed. You can still type your description.'
        : 'Voice typing paused. You can try again or type your description.');
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      setFriendlyMessage('');
      setIsListening(true);
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setFriendlyMessage('Voice typing could not start. You can still type your description.');
    }
  };

  const toggleReadAloud = () => {
    if (!supportsReadAloud) {
      setFriendlyMessage('Read-aloud is not available in this browser. Your profile is still ready to read.');
      return;
    }

    if (isSpeaking) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current = null;
      }
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(bio);
    utterance.lang = 'en-NG';
    utterance.rate = 0.92;
    utterance.pitch = 1.04;
    utterance.onend = () => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      if (utteranceRef.current !== utterance) return;
      utteranceRef.current = null;
      setIsSpeaking(false);
      setFriendlyMessage('Read-aloud stopped. Your profile text is still available above.');
    };
    setFriendlyMessage('');
    setIsSpeaking(true);
    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const applyGeneratedProfile = (payload: Partial<SavedState> & { bio?: string; friendlyMessage?: string; followUpQuestion?: string | null }) => {
    setSkills(payload.skills?.length ? payload.skills : defaultSkills);
    setServices(payload.services?.length ? payload.services : defaultServices);
    setOpportunities(payload.opportunities?.length ? payload.opportunities : defaultOpportunities);
    setBio(payload.bio || defaultBio);
    setFriendlyMessage(payload.friendlyMessage || '');
    setFollowUpQuestion(payload.followUpQuestion || null);
    setResultVersion((version) => version + 1);
  };

  const combinedDescription = (text: string, answers: FollowUpAnswer[]) => {
    const details = answers
      .filter((item) => item.answer.trim())
      .map((item) => `Question: ${item.question}\nAnswer: ${item.answer.trim()}`)
      .join('\n\n');
    return details ? `${text.trim()}\n\nMore about my work:\n${details}`.trim() : text.trim();
  };

  const applyFallbackProfile = (text: string, message: string) => {
    const fallback = buildFallbackData(text);
    applyGeneratedProfile({ ...fallback, friendlyMessage: message });
    setInteractionActive(false);
    setCurrentFollowUpQuestion(null);
    setFollowUpAnswers([]);
    setFollowUpAnswer('');
  };

  const generateProfile = async (text: string) => {
    setIsLoading(true);
    setFriendlyMessage('');
    setFollowUpQuestion(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        applyFallbackProfile(
          text,
          data.message || 'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.'
        );
        return;
      }

      const payload = {
        skills: Array.isArray(data.skills) ? data.skills.map((skill: { label?: string; description?: string }, index: number) => ({
          id: index + 1,
          label: skill.label || 'Skill',
          description: skill.description || 'Useful to include in your client-facing profile.',
        })) : defaultSkills,
        services: Array.isArray(data.services) ? data.services.map((service: { name?: string; details?: string; price?: string }, index: number) => ({
          id: index + 1,
          name: service.name || `Service ${index + 1}`,
          details: service.details || 'Suggested starter package.',
          price: service.price || '₦25,000 - ₦45,000',
        })) : defaultServices,
        opportunities: defaultOpportunities,
        bio: data.profile?.bio || defaultBio,
        friendlyMessage: data.message || 'AI-generated suggestions are ready.',
      };

      applyGeneratedProfile(payload);
    } catch {
      applyFallbackProfile(
        text,
        'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const requestFollowUp = async (text: string, answers: FollowUpAnswer[]) => {
    setIsLoading(true);
    setFriendlyMessage('');

    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: text, answers }),
      });
      const data = await response.json();

      if (!response.ok || data.source === 'fallback') {
        applyFallbackProfile(
          combinedDescription(text, answers),
          data.message || 'I could not reach the question helper, so I used the built-in suggestions from what you wrote.'
        );
        return;
      }

      if (typeof data.question === 'string' && data.question.trim()) {
        setFollowUpAnswers(answers);
        setCurrentFollowUpQuestion(data.question.trim());
        setFollowUpAnswer('');
        setInteractionActive(true);
        return;
      }

      setFollowUpAnswers(answers);
      setCurrentFollowUpQuestion(null);
      setInteractionActive(false);
      setFollowUpAnswer('');
    } catch {
      applyFallbackProfile(
        combinedDescription(text, answers),
        'I could not reach the question helper, so I used the built-in suggestions from what you wrote.'
      );
      return;
    } finally {
      setIsLoading(false);
    }

    await generateProfile(combinedDescription(text, answers));
  };

  const isShortOrVague = (text: string) => {
    const normalized = text.toLowerCase().trim();
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    const vaguePhrases = ['not sure', 'anything really', 'i do a bit of everything', 'i help people', 'i do stuff'];
    return wordCount < 8 || normalized.length < 45 || vaguePhrases.some((phrase) => normalized.includes(phrase));
  };

  const startQuestionFlow = (text: string) => {
    setFollowUpAnswers([]);
    setFollowUpAnswer('');
    setInteractionActive(false);
    setCurrentFollowUpQuestion(null);
    void requestFollowUp(text, []);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (interactionActive && currentFollowUpQuestion) {
      const answer = followUpAnswer.trim();
      if (!answer) {
        setFriendlyMessage('Add a quick answer so I can ask the next helpful question.');
        return;
      }

      const answers = [...followUpAnswers, { question: currentFollowUpQuestion, answer }];
      setFollowUpAnswers(answers);
      setCurrentFollowUpQuestion(null);
      setFollowUpAnswer('');
      setInteractionActive(false);
      void requestFollowUp(input, answers);
      return;
    }

    const trimmed = input.trim();
    if (!trimmed) return;
    if (isShortOrVague(trimmed)) {
      startQuestionFlow(trimmed);
      return;
    }
    void generateProfile(trimmed);
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <div className="panel-header">
          <p className="eyebrow">Stand</p>
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${effectiveTheme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => setThemeChoice(effectiveTheme === 'dark' ? 'light' : 'dark')}
          >
            <span aria-hidden="true">{effectiveTheme === 'dark' ? '☀' : '☾'}</span>
            <span>{effectiveTheme === 'dark' ? 'Light' : 'Dark'} theme</span>
          </button>
        </div>
        <section className="welcome-opening" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="code-whisper"><span aria-hidden="true">&lt;</span>stand.exe<span aria-hidden="true"> /&gt;</span> <span className="code-prompt">// your next step</span></p>
            <h1 id="welcome-title">Your skills already have <span>value.</span></h1>
            <p className="welcome-subtitle">Let’s give the work you already do a voice, a shape, and a fair starting point.</p>
          </div>
          <div className="journey-map" aria-label="Your work becomes skills, then services">
            <div className="journey-step"><code>01</code><span>Your work</span></div>
            <span className="journey-arrow" aria-hidden="true">→</span>
            <div className="journey-step"><code>02</code><span>Your skills</span></div>
            <span className="journey-arrow" aria-hidden="true">→</span>
            <div className="journey-step"><code>03</code><span>Your offer</span></div>
          </div>
        </section>
        <h2 className="prompt-heading">What do you do that people already ask you for help with?</h2>

        <form onSubmit={handleSubmit} className="prompt-form">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={interactionActive || isLoading}
            rows={5}
            placeholder="I design flyers and run social media for a church and small businesses..."
          />
          {!interactionActive && (
            <button
              type="button"
              className="voice-button"
              disabled={isLoading || !supportsVoiceInput}
              aria-pressed={isListening}
              onClick={toggleVoiceInput}
            >
              <span aria-hidden="true">{isListening ? '■' : '◉'}</span>
              {isListening ? 'Stop voice typing' : supportsVoiceInput ? 'Speak your description' : 'Voice typing unavailable'}
            </button>
          )}
          {!interactionActive && !supportsVoiceInput && (
            <p className="voice-note">This browser does not support voice typing. You can still type your description.</p>
          )}
          {interactionActive && currentFollowUpQuestion && (
            <div className="follow-up-panel" aria-live="polite">
              <p className="follow-up-progress">A little more about your work · question {followUpAnswers.length + 1}</p>
              <label htmlFor="follow-up-answer">{currentFollowUpQuestion}</label>
              <input
                id="follow-up-answer"
                value={followUpAnswer}
                onChange={(event) => setFollowUpAnswer(event.target.value)}
                disabled={isLoading}
                autoComplete="off"
                placeholder="Write a short answer..."
              />
            </div>
          )}
          <div className="prompt-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Working...' : interactionActive ? 'Continue' : 'Show me my skills'}
            </button>
            {!interactionActive && (
              <button
                type="button"
                className="question-start-button"
                disabled={isLoading}
                onClick={() => startQuestionFlow(input.trim())}
              >
                Not sure what to write? Ask me questions
              </button>
            )}
          </div>
          {followUpQuestion && (
            <div className="inline-note">
              <strong>Quick follow-up:</strong> {followUpQuestion}
            </div>
          )}
          {friendlyMessage && <p className="status-message">{friendlyMessage}</p>}
        </form>

        {isLoading && (
          <div className="loading-state" role="status" aria-live="polite">
            <span className="loading-orbit" aria-hidden="true" />
            <div>
              <strong>Shaping your profile</strong>
              <p>Taking a moment to turn your work into clear services.</p>
            </div>
          </div>
        )}

        <div className="section-block">
          <h2>Suggested skills</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <article key={`${resultVersion}-${skill.id}`} className="skill-card result-card">
                <h3>{skill.label}</h3>
                <p>{skill.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-block">
          <h2>Service packages</h2>
          <div className="services-grid">
            {services.map((service) => (
              <article key={`${resultVersion}-${service.id}`} className="service-card result-card">
                <div className="service-topline">
                  <span>{service.name}</span>
                  <strong>{service.price}</strong>
                </div>
                <p>{service.details}</p>
                <p className="price-note">Suggested starting price · adjust to fit the work</p>
              </article>
            ))}
          </div>
        </div>

        <section key={resultVersion} className="profile-card result-card" aria-labelledby="value-profile-title">
          <div>
            <p className="mini-label">Value profile</p>
            <h2 id="value-profile-title">A clear offer, built from what you already do</h2>
          </div>
          <p>{bio}</p>
          <button
            type="button"
            className="voice-button read-aloud-button"
            disabled={!supportsReadAloud}
            aria-pressed={isSpeaking}
            onClick={toggleReadAloud}
          >
            <span aria-hidden="true">{isSpeaking ? '■' : '♫'}</span>
            {isSpeaking ? 'Stop reading' : supportsReadAloud ? 'Read my profile aloud' : 'Read-aloud unavailable'}
          </button>
          {!supportsReadAloud && <p className="voice-note">Read-aloud is not supported in this browser; your profile text is still available above.</p>}
          <div className="profile-skills" aria-label="Your skills">
            {skills.map((skill) => (
              <span key={`${resultVersion}-${skill.id}`}>{skill.label}</span>
            ))}
          </div>
          <p className="profile-note">Use this as a starting point. Make sure the wording and prices feel right for your experience.</p>
        </section>

        <div className="section-block">
          <h2>Opportunities for you</h2>
          <div className="opportunities-list">
            {opportunities.map((opportunity) => (
              <a key={`${resultVersion}-${opportunity.id}`} href={opportunity.link} className="opportunity-card result-card">
                <strong>{opportunity.title}</strong>
                <span>{opportunity.reason}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
