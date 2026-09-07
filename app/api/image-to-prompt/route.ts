import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key missing. Please configure GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Updated to latest flash model recommended by Google SDK
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const systemPrompt = `
      You are an expert AI image prompt engineer. 
      Analyze this image thoroughly and generate a detailed image generation prompt suitable for Midjourney v6, DALL-E 3, and Stable Diffusion.
      Focus on:
      1. Main Subject & Action
      2. Art Style, Medium, and Aesthetics (e.g., photorealistic, 3D render, anime, oil painting)
      3. Lighting, Atmosphere, and Color Palette
      4. Camera Details (e.g., 85mm lens, depth of field, macro, wide shot)
      5. Background Details
      
      Return ONLY the plain text prompt without any introductory text, markdown bold titles, or conversational filler.
    `;

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([systemPrompt, imagePart]);
    const responseText = result.response.text();

    return NextResponse.json({ prompt: responseText.trim() });
  } catch (error: any) {
    console.error('Image to prompt error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze image' },
      { status: 500 }
    );
  }
}