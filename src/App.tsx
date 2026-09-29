import { FormEvent, useEffect, useState } from 'react';

type Skill = {
  id: number;
  label: string;
  description: string;
};

const defaultSkills: Skill[] = [
  { id: 1, label: 'Graphic Design', description: 'Designs flyers, social posts, and brand visuals.' },
  { id: 2, label: 'Social Media Management', description: 'Runs pages, planning content, and keeps engagement up.' },
  { id: 3, label: 'Content Creation', description: 'Creates simple, engaging copy and visual content.' },
];

const samplePrompt = 'I design flyers and run social media for a church and small businesses.';

function App() {
  const [input, setInput] = useState(samplePrompt);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);

  useEffect(() => {
    const saved = localStorage.getItem('stand-profile');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { input?: string; skills?: Skill[] };
      if (parsed.input) setInput(parsed.input);
      if (parsed.skills?.length) setSkills(parsed.skills);
    } catch {
      // invalid saved data; ignore and keep defaults
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stand-profile', JSON.stringify({ input, skills }));
  }, [input, skills]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const generatedSkills = [
      { id: 1, label: 'Graphic Design', description: 'Creates flyers, promos, and consistent brand visuals.' },
      { id: 2, label: 'Content Creation', description: 'Writes and packages content for social media and online audiences.' },
      { id: 3, label: 'Community Management', description: 'Keeps online communities active, responsive, and organized.' },
    ].filter((skill) => {
      const skillText = `${skill.label} ${skill.description}`.toLowerCase();
      return trimmed.toLowerCase().includes(skillText.split(' ')[0].toLowerCase()) || trimmed.length > 20;
    });

    setSkills(generatedSkills.length ? generatedSkills : defaultSkills);
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

        <div className="skills-grid">
          {skills.map((skill) => (
            <article key={skill.id} className="skill-card">
              <h2>{skill.label}</h2>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
