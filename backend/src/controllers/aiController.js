import { GoogleGenerativeAI } from '@google/generative-ai';
import Internship from '../models/Internship.js';
import User from '../models/User.js';

// Helper to get market stats
const getMarketStats = async () => {
  // Aggregate common skills and categories from active internships
  const stats = await Internship.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        allRequirements: { $push: '$requirements' },
        categories: { $push: '$category' },
        avgStipend: { $avg: '$stipend' }
      }
    }
  ]);

  if (!stats.length) return { topSkills: [], categories: [] };

  // Flatten and count skills (requirements)
  const skillCounts = {};
  stats[0].allRequirements.flat().forEach(req => {
    // Simple normalization
    const skill = req.toLowerCase().trim();
    skillCounts[skill] = (skillCounts[skill] || 0) + 1;
  });

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([skill]) => skill);

  // Count categories
  const catCounts = {};
  stats[0].categories.forEach(cat => {
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });
  
  const topCategories = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([cat]) => cat);

  return { topSkills, topCategories, avgStipend: stats[0].avgStipend };
};

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const userId = req.userId;

    // 1. Fetch User Profile
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Fetch Market Stats (Real-time aggregation)
    const marketStats = await getMarketStats();

    // Ensure arrays exist
    const topSkills = marketStats.topSkills || [];
    const topCategories = marketStats.topCategories || [];

    // 3. Construct the prompt
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        // Fallback for development if no key is present
        return res.json({
            analysis: {
                summary: "AI analysis requires a valid API Key. Here is a mock response based on local data.",
                suggestions: [
                    "Update your profile with more skills.",
                    `Consider applying for roles in ${topCategories.length ? topCategories.join(', ') : 'Tech, Marketing'}.`,
                    `Top skills in demand are: ${topSkills.length ? topSkills.join(', ') : 'React, Communication'}.`
                ],
                skillGaps: ["React", "Node.js", "Communication"],
                recommendedRoles: ["Software Engineer Intern", "Frontend Developer"]
            }
        });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert Career Coach and HR Specialist.
      
      **Candidate Profile:**
      Name: ${user.firstName} ${user.lastName}
      Skills: ${user.skills ? user.skills.join(', ') : 'Not listed'}
      Education: ${user.education ? JSON.stringify(user.education) : 'Not listed'}
      Bio: ${user.bio || 'Not listed'}
      Resume Content (if provided): "${resumeText || 'No additional text provided'}"

      **Current Job Market Data (Internal Platform Stats):**
      Most Demand Skills: ${topSkills.length ? topSkills.join(', ') : 'General Industry Standards'}
      Top Categories: ${topCategories.length ? topCategories.join(', ') : 'General Industry Standards'}

      **Task:**
      Analyze the candidate's profile against the current market data.
      Provide a JSON response with the following structure (do NOT use markdown formatting, just pure JSON):
      {
        "summary": "Brief professional summary of the candidate's standing.",
        "strengths": ["List of strong points"],
        "weaknesses": ["List of areas to improve"],
        "recommendedRoles": ["Specific job titles to apply for"],
        "missingSkills": ["Specific skills from the market data they lack"],
        "actionPlan": ["3-5 concrete steps to improve their resume and chances"]
      }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up markdown code blocks if present
      const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const analysis = JSON.parse(jsonStr);
      return res.json({ analysis });

    } catch (apiError) {
      console.error('Gemini API Failed, falling back to mock:', apiError.message);
      // Fallback mock response
      return res.json({
        analysis: {
          summary: "AI Service is temporarily unavailable (Model ID/Key Issue). Here is a simulated analysis based on your profile.",
          strengths: ["Clear Communication", "Defined Career Goal", "Basic Technical Skills"],
          weaknesses: ["Lack of quantified achievements", "Resume formatting could be cleaner"],
          recommendedRoles: ["Software Engineer Intern", "Junior Developer"],
          missingSkills: topSkills.length ? topSkills.slice(0, 3) : ["Advanced React", "Cloud Computing"],
          actionPlan: [
            "Add a project section highlighting your best work.",
            "Quantify your impact in previous roles (e.g., 'Improved efficiency by 20%').",
            "Learn the top demanded skills listed above."
          ]
        }
      });
    }

  } catch (error) {
    console.error('AI Analysis Error:', error);
    res.status(500).json({ error: 'Failed to analyze resume. ' + error.message });
  }
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback if no key
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.json({ reply: "I'm a simulated career assistant. I can help you with interview prep, resume tips, and finding internships. (AI Key missing)" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      res.json({ reply: text });
    } catch (apiError) {
      console.error('Gemini Chat Failed:', apiError.message);
      res.json({ reply: "I'm having trouble connecting to my brain right now. But I think you're asking a great question! Try checking our FAQ section." });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
