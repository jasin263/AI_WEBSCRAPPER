const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyArgVj66VkBUsJTBpuVQjNueHYv2QkjpSM";
const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(name) {
    console.log(`Testing ${name}...`);
    try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log(`✅ Success with ${name}:`, response.text().substring(0, 50));
        return true;
    } catch (error) {
        console.log(`❌ Failed ${name}:`, error.message.split('\n')[0]);
        return false;
    }
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-flash-001");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-1.5-pro-001");
    await testModel("gemini-1.0-pro");
    await testModel("gemini-1.0-pro-001");
    await testModel("gemini-pro");
}

run();
