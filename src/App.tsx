import { FormEvent, useEffect, useState } from 'react';

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
  const [input, setInput] = useState(samplePrompt);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultOpportunities);
  const [bio, setBio] = useState(defaultBio);
  const [friendlyMessage, setFriendlyMessage] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } catch {
      // ignore invalid saved state
    }
  }, []);

  useEffect(() => {
    const state: SavedState = { input, skills, services, opportunities, bio, friendlyMessage };
    localStorage.setItem('stand-profile', JSON.stringify(state));
  }, [input, skills, services, opportunities, bio, friendlyMessage]);

  const applyGeneratedProfile = (payload: Partial<SavedState> & { bio?: string; friendlyMessage?: string; followUpQuestion?: string | null }) => {
    setSkills(payload.skills?.length ? payload.skills : defaultSkills);
    setServices(payload.services?.length ? payload.services : defaultServices);
    setOpportunities(payload.opportunities?.length ? payload.opportunities : defaultOpportunities);
    setBio(payload.bio || defaultBio);
    setFriendlyMessage(payload.friendlyMessage || '');
    setFollowUpQuestion(payload.followUpQuestion || null);
  };

  const generateFromPrompt = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (trimmed.length < 15 || trimmed.split(/\s+/).length < 4) {
      setFriendlyMessage('I need a bit more detail to build a stronger profile.');
      setFollowUpQuestion('Can you tell me who you help and what kind of work you do for them?');
      return;
    }

    setIsLoading(true);
    setFriendlyMessage('');
    setFollowUpQuestion(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        const fallback = buildFallbackData(trimmed);
        applyGeneratedProfile({
          ...fallback,
          friendlyMessage: data.message || 'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.',
          followUpQuestion: data.followUpQuestion || null,
        });
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
      const fallback = buildFallbackData(trimmed);
      applyGeneratedProfile({
        ...fallback,
        friendlyMessage: 'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    void generateFromPrompt(trimmed);
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <p className="eyebrow">Stand</p>
        <h1>What do you do that people already ask you for help with?</h1>

        <form onSubmit={handleSubmit} className="prompt-form">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={5}
            placeholder="I design flyers and run social media for a church and small businesses..."
          />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Working...' : 'Show me my skills'}</button>
          {followUpQuestion && (
            <div className="inline-note">
              <strong>Quick follow-up:</strong> {followUpQuestion}
            </div>
          )}
          {friendlyMessage && <p className="status-message">{friendlyMessage}</p>}
        </form>

        <div className="section-block">
          <h2>Suggested skills</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <article key={skill.id} className="skill-card">
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
              <article key={service.id} className="service-card">
                <div className="service-topline">
                  <span>{service.name}</span>
                  <strong>{service.price}</strong>
                </div>
                <p>{service.details}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="profile-card">
          <div>
            <p className="mini-label">Value profile</p>
            <h2>A creative freelancer ready to get hired</h2>
          </div>
          <p>{bio}</p>
          <ul>
            {skills.map((skill) => (
              <li key={skill.id}>{skill.label}</li>
            ))}
          </ul>
        </div>

        <div className="section-block">
          <h2>Opportunities for you</h2>
          <div className="opportunities-list">
            {opportunities.map((opportunity) => (
              <a key={opportunity.id} href={opportunity.link} className="opportunity-card">
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
