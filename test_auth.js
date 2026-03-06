const API = 'http://localhost:5005';

async function testAuth() {
    const testUser = {
        email: `test_${Date.now()}@example.com`,
        phone: `99999${Math.floor(Math.random() * 90000) + 10000}`,
        password: 'password123'
    };

    console.log("--- Testing Registration ---");
    try {
        const regRes = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log("Registration Response:", regData);

        if (!regData.success) {
            console.error("Registration failed!");
            return;
        }

        console.log("\n--- Testing Login with Email ---");
        const loginEmailRes = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: testUser.email, password: testUser.password })
        });
        const loginEmailData = await loginEmailRes.json();
        console.log("Login (Email) Response:", loginEmailData);

        console.log("\n--- Testing Login with Phone ---");
        const loginPhoneRes = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier: testUser.phone, password: testUser.password })
        });
        const loginPhoneData = await loginPhoneRes.json();
        console.log("Login (Phone) Response:", loginPhoneData);

        if (loginEmailData.success && loginPhoneData.success) {
            console.log("\n✅ ALL AUTH TESTS PASSED!");
        } else {
            console.error("\n❌ SOME AUTH TESTS FAILED!");
        }

    } catch (e) {
        console.error("Test execution error:", e);
    }
}

testAuth();
