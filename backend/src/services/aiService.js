const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async generateRFPStructure(description) {
    const prompt = `Convert this RFP description into structured JSON format:
"${description}"

Return only valid JSON with this structure:
{
  "items": [{"name": "string", "quantity": number, "specifications": "string"}],
  "budget": {"min": number, "max": number, "currency": "USD"},
  "timeline": {"deadline": "YYYY-MM-DD", "delivery_window": "string"},
  "terms": {"payment": "string", "warranty": "string", "support": "string"}
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async parseProposal(emailContent, rfpRequirements) {
    const prompt = `Parse this vendor email into structured proposal data:
Email: "${emailContent}"
RFP Requirements: ${JSON.stringify(rfpRequirements)}

Return only valid JSON:
{
  "pricing": {"total": number, "per_unit": number, "breakdown": []},
  "timeline": {"delivery_date": "YYYY-MM-DD", "lead_time": "string"},
  "terms": {"payment": "string", "warranty": "string", "support": "string"},
  "specifications": {},
  "notes": "string"
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async scoreProposal(proposal, rfpRequirements) {
    const prompt = `Score this proposal against RFP requirements (0-10 scale):
Proposal: ${JSON.stringify(proposal)}
Requirements: ${JSON.stringify(rfpRequirements)}

Return only valid JSON:
{
  "price_score": number,
  "timeline_score": number,
  "terms_score": number,
  "overall_score": number,
  "analysis": "brief explanation"
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async compareProposals(proposals, rfpRequirements) {
    const prompt = `Compare these proposals and recommend the best one:
Proposals: ${JSON.stringify(proposals)}
Requirements: ${JSON.stringify(rfpRequirements)}

Return only valid JSON:
{
  "summary": "comparison summary",
  "recommendation": {"vendor_id": number, "reason": "string"},
  "rankings": [{"vendor_id": number, "rank": number, "score": number}]
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1
    });

    return JSON.parse(completion.choices[0].message.content);
  }
}

module.exports = new AIService();