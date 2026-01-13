const apiKey = process.env.GEMINI_API_KEY || "AIzaSyArgVj66VkBUsJTBpuVQjNueHYv2QkjpSM";

async function testEndpoint(version, model) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
    console.log(`Testing ${version} / ${model}...`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });

        if (response.ok) {
            console.log(`✅ Success: ${version}/${model}`);
            const data = await response.json();
            console.log(data.candidates[0].content.parts[0].text.substring(0, 50));
            return true;
        } else {
            const txt = await response.text();
            console.log(`❌ Failed: ${version}/${model} - ${response.status}`);
            console.log(txt.substring(0, 200)); // Print first 200 chars of error
            return false;
        }
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
        return false;
    }
}

async function run() {
    await testEndpoint('v1beta', 'gemini-1.5-flash');
    await testEndpoint('v1beta', 'gemini-pro');
    await testEndpoint('v1', 'gemini-pro');
    await testEndpoint('v1', 'gemini-1.0-pro');
}

run();
