const parseJson = (content) => {
  if (!content) return null;
  const cleaned = String(content).replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace < 0 || lastBrace <= firstBrace) return null;
    try {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }
};

export async function getFollowUp(description, answers) {
  if (answers.length >= 3) {
    return { question: null, source: 'llm' };
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      question: null,
      source: 'fallback',
      message: 'I could not reach the question helper, so I will use the built-in suggestions from what you wrote.',
    };
  }

  const conversation = answers.length
    ? answers.map((item, index) => `${index + 1}. Asked: ${item.question}\n   Answer: ${item.answer}`).join('\n')
    : 'No follow-up answers yet.';
  const prompt = `You are helping a creative in Nigeria describe their work. Ask one short, warm follow-up question at a time, in plain language. Examples: "Who do you usually help?" or "What do you make for them?" Do not repeat a question already answered.\n\nOriginal description: ${description || '(not provided)'}\nEarlier questions and answers:\n${conversation}\n\nThere are ${answers.length} answers so far. Return valid JSON only: {"question":"one concise question"} or {"question":null} if two answers already provide enough detail. If fewer than two answers exist, you must ask another question. Ask no more than three questions total.`;

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
        model: process.env.OPENROUTER_MODEL || 'openrouter/free',
        messages: [
          { role: 'system', content: 'Ask supportive, specific follow-up questions. Do not make assumptions about the user.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      return {
        question: null,
        source: 'fallback',
        message: 'I could not reach the question helper, so I will use the built-in suggestions from what you wrote.',
      };
    }

    const payload = await response.json();
    const parsed = parseJson(payload?.choices?.[0]?.message?.content);
    if (!parsed || (parsed.question !== null && typeof parsed.question !== 'string')) {
      return {
        question: null,
        source: 'fallback',
        message: 'I could not prepare a follow-up question, so I will use the built-in suggestions from what you wrote.',
      };
    }

    const question = parsed.question?.trim();
    if (question && answers.some((item) => item.question.trim().toLowerCase() === question.toLowerCase())) {
      return {
        question: null,
        source: 'fallback',
        message: 'I could not prepare a new question, so I will use the built-in suggestions from what you wrote.',
      };
    }
    if (answers.length < 2 && !question) {
      return {
        question: null,
        source: 'fallback',
        message: 'I could not prepare a follow-up question, so I will use the built-in suggestions from what you wrote.',
      };
    }

    return { question: question || null, source: 'llm' };
  } catch (error) {
    console.error('Follow-up question request failed:', error);
    return {
      question: null,
      source: 'fallback',
      message: 'I could not reach the question helper, so I will use the built-in suggestions from what you wrote.',
    };
  }
}
