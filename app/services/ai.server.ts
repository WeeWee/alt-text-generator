import { HfInference } from "@huggingface/inference";
const hf = new HfInference(process.env.HUGGING_FACE_KEY);
export const generateDescription = async (url: string) => {
	try {
		const response = await fetch(url);
		const data = await response.blob();
		const result = await hf.imageToText({
			model: "nlpconnect/vit-gpt2-image-captioning",
			data,
		});
		return result.generated_text;
	} catch (error) {
		console.error(error);
		return null;
	}
};
