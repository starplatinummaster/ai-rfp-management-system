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
    const today = new Date().toISOString().split('T')[0];
    const quantity = rfpRequirements?.items?.[0]?.quantity || 1;
    
    const prompt = `Parse this vendor email into structured JSON. Return ONLY valid JSON.

Today's Date: ${today}
Required Quantity: ${quantity} units

Email: "${emailContent}"

INTELLIGENT PARSING RULES:
1. Dates: "tomorrow" = ${today} + 1 day, "next week" = ${today} + 7 days, "21 days" = ${today} + 21 days
2. Pricing: If only per_unit given, calculate total = per_unit × ${quantity}
3. Pricing: If only total given, calculate per_unit = total ÷ ${quantity}
4. If no concrete data, leave fields empty/null

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
    const budget = rfpRequirements?.budget?.max || 0;
    const deadline = rfpRequirements?.timeline?.deadline || '';
    
    const prompt = `Score this proposal. Return ONLY valid JSON.

RFP Budget: ${budget}
RFP Deadline: ${deadline}

Proposal:
- Price: ${proposal.pricing?.total || 0}
- Delivery: ${proposal.timeline?.delivery_date || 'missing'}
- Payment: ${proposal.terms?.payment || 'missing'}
- Warranty: ${proposal.terms?.warranty || 'missing'}

SCORING:
1. price_score: Give 9 if price < budget, 6 if price > budget, 0 if missing
2. timeline_score: Give 9 if delivery before deadline, 6 if after, 0 if missing
3. terms_score: Give 8 if has payment AND warranty, 0 if missing
4. overall_score: Average of above 3 scores

Return JSON:
{
  "price_score": number,
  "timeline_score": number,
  "terms_score": number,
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
    const budget = rfpRequirements?.budget?.max || 0;
    
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

      const pricing = safeParseJSON(p.structured_proposal)?.pricing || {};
      const timeline = safeParseJSON(p.structured_proposal)?.timeline || {};
      const terms = safeParseJSON(p.structured_proposal)?.terms || {};
      const scores = safeParseJSON(p.ai_scores) || {};

      return {
        id: p.id,
        vendor_id: p.vendor_id,
        vendor_name: p.vendor_name || 'Unknown Vendor',
        pricing: pricing,
        timeline: timeline,
        terms: terms,
        ai_scores: scores
      };
    });

    let proposalsJSON;
    try {
      proposalsJSON = JSON.stringify(cleanProposals, null, 2);
    } catch (error) {
      throw new Error(`Failed to serialize proposals: ${error.message}`);
    }

    const prompt = `You are a procurement expert. Compare these proposals and recommend the BEST one based on AI scores, pricing, timeline, and terms. Return ONLY valid JSON.

RFP Budget: ${budget}
Proposals with AI Scores:
${proposalsJSON}

Analyze:
1. Which has best overall_score?
2. Which has best price (lowest cost)?
3. Which has fastest delivery?
4. Which has best payment terms?

Recommend the vendor with the BEST combination. Be specific about WHY they're best. Use the EXACT vendor_name from the proposals data.

Return this JSON:
{
  "summary": "Brief comparison highlighting key differences in price, timeline, and terms",
  "recommendation": {
    "vendor_id": number,
    "vendor_name": "exact vendor name from proposals",
    "reason": "Specific reason: e.g., 'Best value with ₹X savings (Y% under budget), fastest delivery (Z days), and favorable payment terms'"
  },
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