import { getFollowUp } from '../server/follow-up.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const description = String(req.body?.description || '').trim().slice(0, 2000);
  const answers = Array.isArray(req.body?.answers)
    ? req.body.answers.slice(0, 3).map((answer) => ({
      question: String(answer?.question || '').slice(0, 300),
      answer: String(answer?.answer || '').trim().slice(0, 1000),
    }))
    : [];

  const result = await getFollowUp(description, answers);
  return res.status(200).json(result);
}
