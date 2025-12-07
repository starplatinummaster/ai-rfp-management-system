const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  async generateRFPTitle(description) {
    const prompt = `Create a short, concise title (max 50 characters) for this RFP. Return ONLY the title text, no JSON.

RFP Description: "${description}"

Return only the title text.`;

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You generate short, concise titles. Return only plain text, no JSON.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 50
    });

    return completion.choices[0].message.content.trim().replace(/["']/g, '');
  }

  async generateRFPStructure(description) {
    const prompt = `You are a JSON generator. Convert this RFP description into structured JSON format. Return ONLY valid JSON, no explanations or text.

RFP Description: "${description}"

Return this exact JSON structure:
{
  "items": [{"name": "string", "quantity": number, "specifications": "string"}],
  "budget": {"max": number, "currency": "INR"},
  "timeline": {"deadline": "YYYY-MM-DD"},
  "terms": {"payment": "string", "warranty": "string"}
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a JSON generator. Return only valid JSON, no explanations.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content.trim();
    // Extract JSON if wrapped in markdown code blocks
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  }

  async parseProposal(emailContent, rfpRequirements) {
    const prompt = `Parse this vendor email into structured JSON. Return ONLY valid JSON.

Email: "${emailContent}"

Return this JSON structure:
{
  "pricing": {"total": number, "per_unit": number},
  "timeline": {"delivery_date": "YYYY-MM-DD"},
  "terms": {"payment": "string", "warranty": "string"},
  "specifications": {},
  "notes": "string"
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a JSON generator. Return only valid JSON, no explanations.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  }

  async scoreProposal(proposal, rfpRequirements) {
    const prompt = `Score this proposal (0-10 scale). Return ONLY valid JSON.

Proposal: ${JSON.stringify(proposal)}

Return this JSON:
{
  "price_score": number,
  "timeline_score": number,
  "overall_score": number,
  "analysis": "brief explanation"
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a JSON generator. Return only valid JSON, no explanations.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  }

  async compareProposals(proposals, rfpRequirements) {
    // Clean proposal data for serialization
    const cleanProposals = proposals.map(p => {
      const safeParseJSON = (data) => {
        if (!data) return {};
        if (typeof data === 'object') return data;
        try {
          return JSON.parse(data);
        } catch (e) {
          return {};
        }
      };

      return {
        id: p.id,
        vendor_id: p.vendor_id,
        vendor_name: p.vendor_name || 'Unknown Vendor',
        pricing: safeParseJSON(p.pricing),
        timeline: safeParseJSON(p.timeline),
        terms: safeParseJSON(p.terms),
        specifications: safeParseJSON(p.specifications)
      };
    });

    let proposalsJSON;
    try {
      proposalsJSON = JSON.stringify(cleanProposals);
    } catch (error) {
      throw new Error(`Failed to serialize proposals: ${error.message}`);
    }

    const prompt = `Compare proposals and recommend best one. Return ONLY valid JSON.

Proposals: ${proposalsJSON}

Return this JSON:
{
  "summary": "comparison summary",
  "recommendation": {"vendor_id": number, "reason": "string"},
  "rankings": [{"vendor_id": number, "rank": number, "score": number}]
}`;

    const completion = await this.groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a JSON generator. Return only valid JSON, no explanations.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content.trim();
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    return JSON.parse(jsonString);
  }
}

module.exports = new AIService();