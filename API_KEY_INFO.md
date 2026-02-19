# 🔑 Ball Don't Lie Lab API Key Information

## What is an API Key?

An **API key** is a unique identifier that authenticates your requests to the Ball Don't Lie Lab API. Think of it as a password that allows your application to access the betting models, predictions, and analytics services.

---

## 🎯 Current API Key

**Your API Key**: `eb22453f-3efd-4b06-884d-996ebca1a436`

This key is currently configured in your dashboard and can be used for testing the UI.

---

## 📊 API Key Details

### Key Type
- **Tier**: Free Tier (UI Access Only)
- **Access Level**: Limited to web dashboard
- **Restrictions**: No programmatic API access

### What You Can Do
✅ Access the web dashboard  
✅ View the UI features  
✅ Explore model templates  
✅ Test the interface  
✅ See demo data  

### What You Cannot Do
❌ Make programmatic API calls  
❌ Generate real predictions via API  
❌ Run backtests via API  
❌ Create models via API  
❌ Access historical data via API  

---

## 🔓 How to Get Full API Access

To unlock **full programmatic access**, you need to upgrade to a paid subscription:

### Option 1: LAB PRO ($99.99/month)
**Includes**:
- ✅ Full API access (100 requests/min)
- ✅ Unlimited betting models
- ✅ 6-year backtest history (2020-present)
- ✅ Live prediction generation
- ✅ Advanced factor analysis
- ✅ Performance tracking

**Best For**: Serious bettors, developers, researchers

### Option 2: ALL-ACCESS ($299.99/month)
**Includes**:
- ✅ Everything in LAB PRO
- ✅ BALLDONTLIE Sports API (real-time game data)
- ✅ Live scores and stats
- ✅ Player data
- ✅ Team statistics
- ✅ Premium support

**Best For**: Professional sports betting operations, apps with live data needs

---

## 🚀 How to Upgrade

1. **Visit**: https://lab-app.balldontlie.io/settings/billing
2. **Login**: Use your account credentials
3. **Choose Plan**: LAB PRO or ALL-ACCESS
4. **Payment**: Enter payment information
5. **Get New Key**: Generate your PRO/ALL-ACCESS API key
6. **Update Dashboard**: Enter new key in Settings page

---

## 🔧 How to Use Your API Key

### In the Dashboard (Current)
1. Visit: https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai
2. Enter API key when prompted: `eb22453f-3efd-4b06-884d-996ebca1a436`
3. Dashboard loads with your key stored in browser

### In Backend Code (Requires Paid Plan)
```bash
# Set as environment variable
export BDL_API_KEY="your-pro-api-key-here"

# Or in Python
import os
api_key = os.environ.get('BDL_API_KEY')
```

### In API Requests (Requires Paid Plan)
```bash
# Using curl
curl -X GET "https://api.balldontlie.io/lab/v1/factors?sport=nba" \
  -H "Authorization: your-pro-api-key-here"

# Using Python
import requests

headers = {
    'Authorization': 'your-pro-api-key-here',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.balldontlie.io/lab/v1/factors',
    params={'sport': 'nba'},
    headers=headers
)
```

---

## 🔒 API Key Security

### Best Practices
✅ **Never commit** API keys to Git repositories  
✅ **Use environment variables** for production  
✅ **Rotate keys** if compromised  
✅ **Limit scope** to necessary permissions  
✅ **Monitor usage** for unauthorized access  

### How to Keep Your Key Safe
1. **Environment Variables**: Store in `.env` file (add to `.gitignore`)
   ```bash
   # .env file
   BDL_API_KEY=your-api-key-here
   ```

2. **Secrets Management**: Use tools like:
   - AWS Secrets Manager
   - Azure Key Vault
   - HashiCorp Vault
   - GitHub Secrets (for CI/CD)

3. **Never Expose**: Don't log, print, or display in public

---

## 📊 API Key Rate Limits

### Free Tier (Current Key)
- **Requests**: UI only, no API calls
- **Models**: 1 model limit
- **Backtest**: 1-week history
- **Support**: Community (Discord)

### LAB PRO Tier
- **Requests**: 100 requests/minute
- **Models**: Unlimited
- **Backtest**: 6-year history (2020-present)
- **Support**: Email support

### ALL-ACCESS Tier
- **Requests**: 100 requests/minute (Lab API) + 60 req/min (Sports API)
- **Models**: Unlimited
- **Backtest**: Full history
- **Support**: Priority email + Discord

---

## 🔍 How to Check Your API Key Status

### Method 1: Dashboard Settings
1. Go to: https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai/settings
2. View your API key (partially masked)
3. See subscription tier

### Method 2: BDL Lab Portal
1. Visit: https://lab-app.balldontlie.io
2. Login to your account
3. Go to: Settings → API Keys
4. View key details and tier

### Method 3: API Call (Requires Paid Plan)
```bash
# Test API access
curl -X GET "https://api.balldontlie.io/lab/v1/factors?sport=nba" \
  -H "Authorization: your-api-key" \
  -w "\nHTTP Status: %{http_code}\n"

# Response codes:
# 200 - Success (valid PRO/ALL-ACCESS key)
# 401 - Unauthorized (invalid or free-tier key)
# 429 - Rate limit exceeded
```

---

## ❓ Frequently Asked Questions

### Q: Can I use the free key for API calls?
**A**: No, the free tier key (`eb22453f-3efd-4b06-884d-996ebca1a436`) only works for the web dashboard UI. Programmatic API access requires LAB PRO or ALL-ACCESS.

### Q: How do I get a new API key?
**A**: 
1. Login to https://lab-app.balldontlie.io
2. Go to Settings → API Keys
3. Click "Generate New Key"
4. Copy and save the new key (shown only once)

### Q: Can I have multiple API keys?
**A**: Yes, you can generate multiple keys for different applications or environments (dev, staging, production).

### Q: What happens if my key is compromised?
**A**: Immediately revoke the compromised key in your account settings and generate a new one.

### Q: Do API keys expire?
**A**: No, keys don't expire automatically, but they become inactive if your subscription lapses.

### Q: Can I share my API key?
**A**: No, API keys are personal and should not be shared. Each user/application should have its own key.

---

## 🎓 API Key Management Guide

### For Development
```bash
# Use environment variables
export BDL_API_KEY="dev-key-here"

# Or create .env file
echo "BDL_API_KEY=dev-key-here" > .env

# Load in Python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('BDL_API_KEY')
```

### For Production
```bash
# Use secrets management
# AWS Systems Manager Parameter Store
aws ssm put-parameter \
  --name "/app/bdl-api-key" \
  --value "prod-key-here" \
  --type "SecureString"

# Retrieve in application
import boto3
ssm = boto3.client('ssm')
response = ssm.get_parameter(Name='/app/bdl-api-key', WithDecryption=True)
api_key = response['Parameter']['Value']
```

### For CI/CD
```yaml
# GitHub Actions example
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        env:
          BDL_API_KEY: ${{ secrets.BDL_API_KEY }}
        run: pytest tests/
```

---

## 📞 Support & Resources

### Get Help
- **Email**: hello@balldontlie.io
- **Discord**: https://discord.gg/cQJhfTPn8j
- **Docs**: https://lab.balldontlie.io/docs/

### Useful Links
- **Dashboard**: https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai
- **Account Portal**: https://lab-app.balldontlie.io
- **Billing**: https://lab-app.balldontlie.io/settings/billing
- **API Docs**: https://lab.balldontlie.io/docs/
- **OpenAPI Spec**: https://lab.balldontlie.io/openapi.yaml

---

## 📈 Upgrade Benefits Comparison

| Feature | Free Tier | LAB PRO | ALL-ACCESS |
|---------|-----------|---------|------------|
| **Price** | $0 | $99.99/mo | $299.99/mo |
| **Dashboard Access** | ✅ | ✅ | ✅ |
| **API Access** | ❌ | ✅ | ✅ |
| **Models** | 1 | Unlimited | Unlimited |
| **Backtest History** | 1 week | 6 years | 6 years |
| **Rate Limit** | N/A | 100 req/min | 100 req/min |
| **Sports API** | ❌ | ❌ | ✅ |
| **Live Data** | ❌ | ❌ | ✅ |
| **Support** | Discord | Email | Priority |

---

## ✅ Summary

- **Current Key**: `eb22453f-3efd-4b06-884d-996ebca1a436` (Free Tier)
- **Access Level**: UI only, no programmatic API
- **To Unlock API**: Upgrade to LAB PRO ($99.99/mo) or ALL-ACCESS ($299.99/mo)
- **Upgrade URL**: https://lab-app.balldontlie.io/settings/billing
- **Security**: Keep keys secret, use environment variables, never commit to Git

**Need full API access? Upgrade today to unlock programmatic betting models and predictions!** 🚀

---

**Last Updated**: 2026-02-17  
**Documentation Version**: 1.0.0
