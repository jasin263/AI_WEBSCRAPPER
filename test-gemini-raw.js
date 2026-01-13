const apiKey = "AIzaSyArgVj66VkBUsJTBpuVQjNueHYv2QkjpSM";

async function testDirect(modelName) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    console.log(`Fetching ${modelName}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello" }]
                }]
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.log(`❌ Failed ${modelName}: ${response.status} - ${err.substring(0, 100)}`);
        } else {
            const data = await response.json();
            console.log(`✅ Success ${modelName}`);
        }
    } catch (e) {
        console.log(`❌ Error ${modelName}: ${e.message}`);
    }
}

async function run() {
    await testDirect('gemini-1.5-flash');
    await testDirect('gemini-pro');
    await testDirect('gemini-1.0-pro');
}

run();
