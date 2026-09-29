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
};

const samplePrompt = 'I design flyers and run social media for a church and small businesses.';

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

function App() {
  const [input, setInput] = useState(samplePrompt);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultOpportunities);

  useEffect(() => {
    const saved = localStorage.getItem('stand-profile');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedState>;
      if (parsed.input) setInput(parsed.input);
      if (parsed.skills?.length) setSkills(parsed.skills);
      if (parsed.services?.length) setServices(parsed.services);
      if (parsed.opportunities?.length) setOpportunities(parsed.opportunities);
    } catch {
      // ignore invalid saved state
    }
  }, []);

  useEffect(() => {
    const state: SavedState = { input, skills, services, opportunities };
    localStorage.setItem('stand-profile', JSON.stringify(state));
  }, [input, skills, services, opportunities]);

  const generateFromPrompt = (text: string) => {
    const lower = text.toLowerCase();
    const catalog = [
      { id: 1, label: 'Graphic Design', description: 'Designs flyers, social posts, and brand visuals.', keywords: ['design', 'flyer', 'brand', 'poster', 'graphics', 'logo'] },
      { id: 2, label: 'Content Creation', description: 'Creates creative short-form content for digital channels.', keywords: ['content', 'write', 'copy', 'video', 'caption', 'story', 'social'] },
      { id: 3, label: 'Community Management', description: 'Keeps online communities active, responsive, and organized.', keywords: ['community', 'page', 'church', 'social', 'engagement', 'moderation', 'admin'] },
      { id: 4, label: 'Video Editing', description: 'Cuts and packages engaging clips for social media.', keywords: ['video', 'edit', 'reel', 'clip', 'yt', 'promo'] },
    ];

    const matched = catalog.filter((skill) =>
      skill.keywords.some((word) => lower.includes(word)) || lower.length > 25
    );

    const skillList = matched.length ? matched : defaultSkills;
    setSkills(skillList.map((skill) => ({ id: skill.id, label: skill.label, description: skill.description })));

    const serviceList: Service[] = [
      { id: 1, name: `${skillList[0]?.label ?? 'Creative'} Starter`, details: 'A small package for recurring social or visual work', price: '₦25,000 - ₦45,000' },
      { id: 2, name: `${skillList[1]?.label ?? 'Content'} Growth`, details: 'Content plan, writing, and useful updates for a client page', price: '₦45,000 - ₦80,000' },
      { id: 3, name: `${skillList[2]?.label ?? 'Support'} Essential`, details: 'A simple monthly support package for ongoing work', price: '₦60,000 - ₦120,000' },
    ];
    setServices(serviceList);

    setOpportunities([
      { id: 1, title: 'Small business content support', reason: 'Perfect if you help churches, brands, or local businesses tell their story.', link: '#', },
      { id: 2, title: 'Creative digital grants', reason: 'Useful if your work is tied to brand design, media, or online visibility.', link: '#', },
      { id: 3, title: 'Freelance client referrals', reason: 'Matches people who already do repeat work for friends, groups, or local businesses.', link: '#', },
    ]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    generateFromPrompt(trimmed);
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
          <button type="submit">Show me my skills</button>
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
          <p>
            I help small businesses and community groups look more polished online through clear visual content,
            social media support, and simple content systems.
          </p>
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
