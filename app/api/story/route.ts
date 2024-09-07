import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
	const { content } = await request.json();

	if (!content) {
		return NextResponse.json(
			{
				message: "Please provide Content First",
			},
			{
				status: 400,
			}
		);
	}

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 3 * 1000 * 60,
  });

  const systemContent = `You are a great story teller. You will receive story idea from user and you will generate short story. The story should strictly contain maximum 4 paragraphs. The paragraphs should be simple string without containing any special characters. Add {end} at the end of each paragraph. Exclude any prompts that are not allowed by your safety systems. Remove '\n' if any.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: content },
      ]
    });

    const story = response?.choices[0]?.message?.content; 
    const imagesArr = [];
    const Paragraphs = (story as string)?.split("{end}");
    let i = 0;
    for await(const paragraph of Paragraphs) {
      if(paragraph) {
        const image = await client.images.generate({
          model: "dall-e-3",
          prompt: `Generate Image for this paragraph: ${paragraph}`,
        });
        imagesArr.push({
          orderNumber: ++i,
          paragraph: paragraph,
          imageUrl: image?.data[0]?.url,
        });
      }
    }
    
    return NextResponse.json({ 
      storyData: story?.replaceAll("{end}", ""),
      images: imagesArr, 
    }, { status: 200 });
  } catch(e: any) {
    return NextResponse.json({
      message: e?.message,
    }, { status: 400 });
  }
};
