const buildFallbackProfile = (description) => {
  const lower = description.toLowerCase();
  const catalog = [
    { id: 1, label: 'Graphic Design', description: 'Designs flyers, social posts, and brand visuals.', keywords: ['design', 'flyer', 'brand', 'poster', 'graphics', 'logo'] },
    { id: 2, label: 'Content Creation', description: 'Creates creative short-form content for digital channels.', keywords: ['content', 'write', 'copy', 'video', 'caption', 'story', 'social'] },
    { id: 3, label: 'Community Management', description: 'Keeps online communities active, responsive, and organized.', keywords: ['community', 'page', 'church', 'social', 'engagement', 'moderation', 'admin'] },
    { id: 4, label: 'Video Editing', description: 'Cuts and packages engaging clips for social media.', keywords: ['video', 'edit', 'reel', 'clip', 'yt', 'promo'] },
  ];

  const matched = catalog.filter((skill) => skill.keywords.some((word) => lower.includes(word)) || lower.length > 25);
  const skills = matched.length ? matched : catalog.slice(0, 3);

  return {
    skills: skills.map((skill) => ({
      label: skill.label,
      description: skill.description,
    })),
    services: [
      { name: `${skills[0]?.label ?? 'Creative'} Starter`, details: 'A compact starter package for small client work.', price: '₦25,000 - ₦45,000' },
      { name: `${skills[1]?.label ?? 'Content'} Growth`, details: 'A mid-size package for recurring content and visibility support.', price: '₦45,000 - ₦80,000' },
      { name: `${skills[2]?.label ?? 'Support'} Essential`, details: 'Ongoing support for a client who needs a simple monthly plan.', price: '₦60,000 - ₦120,000' },
    ],
    profile: {
      bio: 'I help businesses and community groups look more polished online with clear visual content, simple content systems, and dependable digital support.',
    },
  };
};

const normalizeSkills = (skills = []) =>
  skills.slice(0, 4).map((skill, index) => ({
    id: index + 1,
    label: String(skill.label || skill.name || 'Skill'),
    description: String(skill.description || 'Useful skill for a growing client-ready profile.'),
  }));

const normalizeServices = (services = []) =>
  services.slice(0, 3).map((service, index) => ({
    id: index + 1,
    name: String(service.name || `Service ${index + 1}`),
    details: String(service.details || service.description || 'Suggested starter package for new clients.'),
    price: String(service.price || '₦25,000 - ₦45,000'),
  }));

const parseJsonFromText = (content) => {
  if (!content) return null;
  const cleaned = String(content).replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try {
        return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
};

const buildPrompt = (description) => `
You are helping a young creative in Nigeria turn informal digital skills into a clear, client-ready profile.
Return valid JSON only with this exact shape:
{
  "skills": [{ "label": "string", "description": "string" }],
  "services": [{ "name": "string", "details": "string", "price": "string" }],
  "profile": { "bio": "string" }
}
Constraints:
- Detect 2-4 relevant skills from the person's description.
- Create 2-3 service packages with suggested starting prices in naira like "₦25,000 - ₦45,000".
- The bio should be 1-2 sentences, warm and client-ready, not AI-generic.
- If the description is vague, do not invent too much; keep it realistic.

User description:
${description}
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const description = String(req.body?.description || '').trim();

  if (!description) {
    return res.status(400).json({
      message: 'Please tell me a little more about what you do.',
      followUpQuestion: 'Can you tell me who you help and what kind of work you do for them?',
    });
  }

  const words = description.split(/\s+/).filter(Boolean);
  if (words.length < 4 || description.length < 15) {
    return res.status(400).json({
      message: 'I need a bit more detail to build a stronger profile.',
      followUpQuestion: 'Can you tell me who you help and what kind of work you do for them?',
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';

  if (!apiKey) {
    const fallback = buildFallbackProfile(description);
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: 'The AI service is not configured yet, so I used the built-in fallback suggestions instead.',
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://example.com',
        'X-Title': 'Stand MVP',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are a helpful business assistant for creative freelancers in emerging markets.' },
          { role: 'user', content: buildPrompt(description) },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      const fallback = buildFallbackProfile(description);
      return res.status(200).json({
        ...fallback,
        source: 'fallback',
        message: 'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.',
      });
    }

    const payload = await response.json();
    const text = payload?.choices?.[0]?.message?.content || '';
    const parsed = parseJsonFromText(text);

    if (!parsed || !Array.isArray(parsed.skills) || !Array.isArray(parsed.services) || !parsed.profile) {
      throw new Error('Malformed AI response');
    }

    return res.status(200).json({
      skills: normalizeSkills(parsed.skills),
      services: normalizeServices(parsed.services),
      profile: {
        bio: String(parsed.profile.bio || 'I help small businesses and community groups turn their ideas into clear digital work that feels more professional and easier to trust.'),
      },
      source: 'llm',
      message: 'AI-generated suggestions are ready.',
    });
  } catch (error) {
    console.error('LLM request failed:', error);
    const fallback = buildFallbackProfile(description);
    return res.status(200).json({
      ...fallback,
      source: 'fallback',
      message: 'The AI service is temporarily unavailable, so I used the built-in fallback suggestions instead.',
    });
  }
}
