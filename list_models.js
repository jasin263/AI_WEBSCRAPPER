const apiKey = process.env.GEMINI_API_KEY || "AIzaSyArgVj66VkBUsJTBpuVQjNueHYv2QkjpSM";

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log(`Fetching models from ${url}...`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Models found:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("❌ No models list returned. Error:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("❌ Valid Request Failed:", e.message);
    }
}

listModels();
