# Security Recommendations for Cap Kéo Sport Backend

## 🚨 Critical Security Issues Found

### 1. **API Endpoint Exposure**
- **Issue**: Authentication endpoint is exposed in client code
- **Risk**: Direct API attacks, credential stuffing
- **Fix**: ✅ Fixed with environment variables

### 2. **Missing Rate Limiting**
- **Issue**: No protection against brute force attacks
- **Risk**: Account enumeration, credential stuffing
- **Fix**: Implement rate limiting middleware

### 3. **Missing Input Validation**
- **Issue**: Client can send any phone number format
- **Risk**: Invalid data, potential injection attacks
- **Fix**: Server-side validation required

## 🔒 Required Backend Security Implementation

### 1. Rate Limiting Middleware
```typescript
// Using express-rate-limit
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/auth/login', authLimiter);
```

### 2. Input Validation
```typescript
import Joi from 'joi';

const loginSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^(0|\+84)[3-9][0-9]{8}$/)
    .required(),
  zaloId: Joi.string().optional(),
  timestamp: Joi.number().required(),
  signature: Joi.string().optional()
});
```

### 3. CORS Configuration
```typescript
app.use(cors({
  origin: [
    'https://miniapp.zalo.me',
    'https://h5.zalo.me'
  ],
  credentials: true
}));
```

### 4. Security Headers
```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

### 5. Request Validation Middleware
```typescript
const validateAuthRequest = (req, res, next) => {
  // Check timestamp (prevent replay attacks)
  const now = Date.now();
  const requestTime = req.body.timestamp;

  if (!requestTime || Math.abs(now - requestTime) > 300000) { // 5 minutes
    return res.status(400).json({ error: 'Invalid timestamp' });
  }

  // Validate signature (if implemented)
  if (req.body.signature) {
    const expectedSignature = generateSignature(req.body.phoneNumber, requestTime);
    if (req.body.signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  next();
};
```

## 🛡️ Security Headers to Add

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## 📊 Monitoring & Logging

### 1. Authentication Event Logging
```typescript
const logAuthEvent = (event, data) => {
  console.log({
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    data: {
      ...data,
      phoneNumber: data.phoneNumber ? maskPhone(data.phoneNumber) : undefined
    }
  });
};
```

### 2. Failed Login Tracking
```typescript
// Track failed login attempts per phone number
const failedLoginAttempts = new Map();

const trackFailedLogin = (phoneNumber) => {
  const attempts = failedLoginAttempts.get(phoneNumber) || 0;
  failedLoginAttempts.set(phoneNumber, attempts + 1);

  if (attempts >= 5) {
    // Temporarily block the phone number
    blockPhoneNumber(phoneNumber, 24 * 60 * 60 * 1000); // 24 hours
  }
};
```

## 🔐 Advanced Security Features

### 1. JWT Token Security
```typescript
// Use RS256 instead of HS256 for better security
const token = jwt.sign(
  payload,
  privateKey,
  {
    algorithm: 'RS256',
    expiresIn: '1h',
    issuer: 'capkeosport',
    audience: 'capkeosport-users'
  }
);
```

### 2. Refresh Token Implementation
```typescript
// Store refresh tokens in database with expiration
const storeRefreshToken = async (userId, refreshToken) => {
  await db.refreshTokens.create({
    userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    isRevoked: false
  });
};
```

### 3. Phone Number Verification
```typescript
// Implement SMS OTP verification
const sendOTP = async (phoneNumber) => {
  const otp = generateOTP(6);
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Store hashed OTP with expiration
  await db.otpVerification.create({
    phoneNumber,
    otp: hashedOTP,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  });

  // Send SMS via service provider
  await smsService.send(phoneNumber, `Your OTP: ${otp}`);
};
```

## 🚀 Deployment Security

### 1. Environment Variables
```bash
NODE_ENV=production
JWT_PRIVATE_KEY=your_private_key_here
JWT_PUBLIC_KEY=your_public_key_here
DATABASE_URL=secure_database_connection
SMS_API_KEY=secure_sms_api_key
REDIS_URL=redis_connection_string
```

### 2. Infrastructure Security
- Use WAF (Web Application Firewall)
- Implement IP whitelisting for admin endpoints
- Use CDN for DDoS protection
- Regular security scanning with tools like OWASP ZAP

## 📋 Security Checklist

- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] Security headers added
- [ ] JWT tokens properly secured
- [ ] Refresh token mechanism
- [ ] Failed login tracking
- [ ] SMS OTP verification
- [ ] Audit logging enabled
- [ ] Environment variables secured
- [ ] Database connections encrypted
- [ ] API documentation security notes

## 🔄 Next Steps

1. **Immediate** (Week 1):
   - Implement rate limiting
   - Add input validation
   - Configure CORS and security headers

2. **Short-term** (Week 2-3):
   - Add SMS OTP verification
   - Implement refresh tokens
   - Set up audit logging

3. **Long-term** (Month 2):
   - Advanced monitoring
   - Security scanning pipeline
   - Penetration testing

---

**Note**: This is a minimum security baseline. Depending on your specific requirements and compliance needs (GDPR, etc.), additional security measures may be required.