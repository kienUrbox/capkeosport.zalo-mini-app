# 🔐 Zalo OAuth Server-to-Server Verification

## **Cách Backend Verify Zalo Data**

### **❌ Common Misconception:**
Backend KHÔNG thể gọi trực tiếp Zalo SDK:
```javascript
// ❌ KHÔNG HOẠT ĐỘNG trên backend
zmp.getPhoneNumber() // ❌ Chỉ chạy trong Mini App
zmp.getUserInfo()     // ❌ Chỉ chạy trong browser
```

---

## **✅ Method 1: Zalo OAuth 2.0 Server-to-Server**

### **Step 1: Client gets Zalo Authorization Code**
```typescript
// Client (Mini App) - Lấy authorization code
async function getZaloAuthorizationCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    zmp.requestAccessToken({
      scope: 'phone_number user_info',
      success: (res) => {
        resolve(res.code); // Authorization code, không phải token!
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
```

### **Step 2: Client sends code to backend**
```typescript
// Client gửi authorization code
const response = await fetch('/auth/zalo-oauth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'zalo_authorization_code_here',
    deviceId: 'device_fingerprint',
    timestamp: Date.now()
  })
});
```

### **Step 3: Backend exchanges code for user info**
```typescript
// Backend - Exchange authorization code
export async function exchangeZaloCode(req: Request, res: Response) {
  const { code, deviceId, timestamp } = req.body;

  try {
    // Call Zalo API directly from backend
    const zaloResponse = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': process.env.ZALO_APP_SECRET
      },
      body: new URLSearchParams({
        code: code,
        app_id: process.env.ZALO_APP_ID,
        grant_type: 'authorization_code'
      })
    });

    const zaloData = await zaloResponse.json();

    if (!zaloData.access_token) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Zalo authorization code'
      });
    }

    // Verify expiration (authorization codes expire in 5 minutes)
    const codeAge = Date.now() - timestamp;
    if (codeAge > 300000) {
      return res.status(401).json({
        success: false,
        error: 'Authorization code expired'
      });
    }

    // Get user info using access token
    const userInfo = await getZaloUserInfo(zaloData.access_token);

    // Verify phone number
    const phoneNumber = await getZaloPhoneNumber(zaloData.access_token);

    return res.status(200).json({
      success: true,
      user: {
        zaloId: userInfo.id,
        name: userInfo.name,
        phone: phoneNumber,
        avatar: userInfo.picture?.data?.url,
        verified: true, // Zalo verified!
        source: 'zalo_oauth'
      }
    });

  } catch (error) {
    console.error('Zalo OAuth error:', error);
    return res.status(500).json({
      success: false,
      error: 'Zalo verification failed'
    });
  }
}

// Backend functions to get user data
async function getZaloUserInfo(accessToken: string) {
  const response = await fetch(`https://graph.zalo.me/v2.0/me?fields=id,name,picture&access_token=${accessToken}`);
  return await response.json();
}

async function getZaloPhoneNumber(accessToken: string) {
  const response = await fetch(`https://graph.zalo.me/v2.0/me/phone?access_token=${accessToken}`);
  const data = await response.json();
  return data.data?.phone;
}
```

---

## **✅ Method 2: Zalo Webhook Verification**

### **Step 1: Client triggers Zalo verification**
```typescript
// Client gửi request trigger
const response = await fetch('/auth/zalo-webhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '0912345678',
    sessionId: generateSessionId(),
    timestamp: Date.now()
  })
});
```

### **Step 2: Backend sends OTP via Zalo API**
```typescript
// Backend gửi OTP qua Zalo
export async function sendZaloOTP(req: Request, res: Response) {
  const { phoneNumber, sessionId, timestamp } = req.body;

  try {
    // Send OTP via Zalo's Official API
    const otpResponse = await fetch('https://business.openapi.zalo.me/qr/phone-verify/send-code', {
      method: 'POST',
      headers: {
        'access_token': process.env.ZALO_BUSINESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: phoneNumber,
        app_id: process.env.ZALO_APP_ID,
        code_type: 'OTP'
      })
    });

    const otpData = await otpResponse.json();

    // Store session for verification
    await VerificationSession.create({
      sessionId,
      phoneNumber,
      zaloRequestId: otpData.request_id,
      expiresAt: new Date(Date.now() + 300000), // 5 minutes
      attempts: 0
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent via Zalo',
      sessionId
    });

  } catch (error) {
    console.error('Zalo OTP error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send OTP'
    });
  }
}
```

### **Step 3: Backend verifies OTP**
```typescript
export async function verifyZaloOTP(req: Request, res: Response) {
  const { sessionId, otpCode } = req.body;

  try {
    const session = await VerificationSession.findOne({ sessionId });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session'
      });
    }

    // Verify OTP with Zalo
    const verifyResponse = await fetch('https://business.openapi.zalo.me/qr/phone-verify/verify-code', {
      method: 'POST',
      headers: {
        'access_token': process.env.ZALO_BUSINESS_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        request_id: session.zaloRequestId,
        code: otpCode
      })
    });

    const verifyData = await verifyResponse.json();

    if (verifyData.error) {
      await VerificationSession.updateOne(
        { sessionId },
        { $inc: { attempts: 1 } }
      );

      return res.status(401).json({
        success: false,
        error: 'Invalid OTP code',
        attemptsRemaining: 3 - session.attempts
      });
    }

    // OTP verified! Create user account
    const user = await User.findOneAndUpdate(
      { phone: session.phoneNumber },
      {
        phone: session.phoneNumber,
        verified: true,
        verifiedAt: new Date(),
        verificationMethod: 'zalo_otp'
      },
      { upsert: true, new: true }
    );

    // Generate tokens
    const tokens = await generateTokens(user);

    return res.status(200).json({
      success: true,
      user,
      ...tokens
    });

  } catch (error) {
    console.error('Zalo OTP verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'OTP verification failed'
    });
  }
}
```

---

## **✅ Method 3: Zalo Mini App Deep Link (Most Secure)**

### **Step 1: Client generates verification request**
```typescript
// Client tạo verification request
const verificationRequest = {
  phoneNumber: '0912345678',
  requestId: generateRequestId(),
  timestamp: Date.now(),
  returnUrl: 'https://your-mini-app.zalo.me/auth/callback'
};

// Gửi đến backend
const response = await fetch('/auth/zalo-deep-link', {
  method: 'POST',
  body: JSON.stringify(verificationRequest)
});

const { deepLinkUrl, requestId } = await response.json();
```

### **Step 2: Backend creates Zalo deep link**
```typescript
export async function createZaloDeepLink(req: Request, res: Response) {
  const { phoneNumber, requestId, timestamp, returnUrl } = req.body;

  try {
    // Create Zalo deep link for verification
    const deepLink = `https://zalo.me/s?redirect=${encodeURIComponent(returnUrl)}&phone=${phoneNumber}&request=${requestId}`;

    // Store request for callback verification
    await VerificationRequest.create({
      requestId,
      phoneNumber,
      returnUrl,
      createdAt: new Date(),
      status: 'pending'
    });

    return res.status(200).json({
      success: true,
      deepLink,
      requestId
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to create verification link'
    });
  }
}
```

### **Step 3: User verifies in Zalo app**
```typescript
// Zalo app callback với verification data
export async function handleZaloCallback(req: Request, res: Response) {
  const { requestId, userId, phone, signature, timestamp } = req.query;

  try {
    // Verify callback signature
    const expectedSignature = generateHMAC(
      process.env.ZALO_WEBHOOK_SECRET,
      `${requestId}:${userId}:${phone}:${timestamp}`
    );

    if (signature !== expectedSignature) {
      return res.status(401).json({
        success: false,
        error: 'Invalid callback signature'
      });
    }

    // Find original request
    const request = await VerificationRequest.findOne({ requestId });
    if (!request || request.status !== 'pending') {
      return res.status(401).json({
        success: false,
        error: 'Invalid verification request'
      });
    }

    // Update request status
    await VerificationRequest.updateOne(
      { requestId },
      {
        status: 'verified',
        verifiedAt: new Date(),
        zaloUserId: userId,
        zaloPhone: phone
      }
    );

    // Create or update user
    const user = await User.findOneAndUpdate(
      { phone },
      {
        phone,
        zaloId: userId,
        verified: true,
        verifiedAt: new Date(),
        verificationMethod: 'zalo_deep_link'
      },
      { upsert: true, new: true }
    );

    // Generate tokens
    const tokens = await generateTokens(user);

    return res.status(200).json({
      success: true,
      user,
      ...tokens
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Callback verification failed'
    });
  }
}
```

---

## **🏆 Recommended Implementation:**

### **For Production Use:**
1. **Zalo OAuth 2.0** - Most secure and reliable
2. **Device Fingerprinting** - Additional layer
3. **Rate Limiting** - Prevent abuse
4. **Challenge-Response** - For suspicious attempts

### **Environment Configuration:**
```bash
# .env - Backend only!
ZALO_APP_ID=your_zalo_app_id
ZALO_APP_SECRET=your_zalo_app_secret
ZALO_BUSINESS_TOKEN=your_business_api_token
ZALO_WEBHOOK_SECRET=your_webhook_secret

# OAuth endpoints
ZALO_OAUTH_URL=https://oauth.zaloapp.com/v4/access_token
ZALO_GRAPH_URL=https://graph.zalo.me/v2.0/me
ZALO_BUSINESS_URL=https://business.openapi.zalo.me
```

### **Security Flow Summary:**
```
1. Client → Get Zalo authorization code
2. Client → Send code to backend
3. Backend → Exchange code for access token (Zalo API)
4. Backend → Get user info using access token (Zalo API)
5. Backend → Verify phone number and user ID
6. Backend → Generate JWT tokens
7. Client → Store tokens for authenticated requests
```

**Key Point:** Backend verification requires Zalo's official server-to-server APIs, not the Mini App SDK!