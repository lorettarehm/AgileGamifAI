/**
 * Netlify Function: Generate Game Data
 * Securely handles LLM API calls for partial game completion
 */

const { HfInference } = require('@huggingface/inference');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // Get API key from environment (server-side only)
    const apiKey = process.env.HF_ACCESS_TOKEN;
    
    if (!apiKey) {
      console.error('LLM API: No API key configured');
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'LLM service is not configured. Please check server configuration.' 
        })
      };
    }

    // Parse request body
    const { partialGameData, systemPrompt } = JSON.parse(event.body);

    if (!partialGameData || !systemPrompt) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          error: 'Missing required parameters: partialGameData and systemPrompt' 
        })
      };
    }

    // Initialize HuggingFace client
    const hf = new HfInference(apiKey);
    
    // Configure LLM parameters
    const config = {
      defaultModel: 'deepseek-ai/deepseek-v2-lite-chat',
      maxTokens: 1000,
      temperature: 0.7
    };

    // Create prompt
    const prompt = `${systemPrompt}\n\nPartial game data: ${JSON.stringify(partialGameData, null, 2)}\n\nComplete the game data, maintaining any existing values and generating appropriate values for missing fields. Return only the JSON object.`;

    // Call HuggingFace API
    const response = await hf.textGeneration({
      model: config.defaultModel,
      inputs: prompt,
      parameters: {
        max_new_tokens: config.maxTokens,
        temperature: config.temperature,
        return_full_text: false
      }
    });

    if (!response.generated_text) {
      throw new Error('No response generated from LLM service');
    }

    // Parse and return the generated game data
    const gameData = JSON.parse(response.generated_text);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: gameData })
    };

  } catch (error) {
    console.error('LLM API Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to generate game data. Please try again.' 
      })
    };
  }
};