# VM Control Component - Complete Setup Guide

## ✅ What's Been Implemented

### Frontend (Vue 3 + PrimeVue)

- **PlexVmControl.vue** - Main component with:
  - Large animated status circle (green = online, red = offline, gray = loading)
  - Toggle button with loading state
  - Error message display
  - Responsive design with modern gradient UI
  
- **Three-Layer API Architecture**:
  1. **HTTP Client** (`src/api/httpClient.js`) - Axios wrapper with interceptors & error handling
  2. **Service Layer** (`src/api/vmService.js`) - VM API methods (getStatus, toggleVM)
  3. **Composable** (`src/composables/useVMControl.js`) - Reactive state & smart polling

- **Smart Polling**:
  - Normal polling: Every 10 seconds
  - Fast polling: Every 1 second for 30 seconds after toggle
  - Automatic downshift back to normal after 30 seconds
  - Proper cleanup on component unmount

### Backend (Node.js/Express)

- **Secure Proxy Server** (`backend-proxy/server.js`):
  - Proxies requests to Azure Function
  - Stores API key securely in `.env` (never exposed to frontend)
  - CORS configured for frontend access
  - Standardized error handling
  - Health check endpoint

---

## 🚀 Quick Start

### Step 1: Frontend Setup

The frontend is already configured. Just ensure `.env.local` exists:

```bash
# .env.local (already created)
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 2: Backend Proxy Setup

```bash
# Navigate to backend proxy directory
cd backend-proxy

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your Azure Function credentials
# AZURE_FUNCTION_URL=https://tb-plex-fn.azurewebsites.net/api
# AZURE_FUNCTION_API_KEY=your_api_key_here
```

### Step 3: Running Both Servers

**Terminal 1 - Start Backend Proxy:**

```bash
cd backend-proxy
npm start
# Server will run on http://localhost:3001
```

**Terminal 2 - Start Frontend Dev Server:**

```bash
# From project root
npm run serve
# Frontend will run on http://localhost:8080
```

---

## 📋 Project Structure

```text
tboersma-dev-site/
├── src/
│   ├── api/
│   │   ├── httpClient.js          # Axios wrapper with interceptors
│   │   └── vmService.js           # VM API service layer
│   ├── composables/
│   │   └── useVMControl.js        # Smart polling composable
│   ├── components/
│   │   ├── PlexVmControl.vue      # Main UI component
│   │   └── HelloWorld.vue         # (not used)
│   ├── App.vue                    # Uses PlexVmControl
│   └── main.js                    # PrimeVue configuration
├── backend-proxy/                 # Secure backend server
│   ├── server.js                  # Express proxy
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── .env.local                     # Frontend config
└── ... (other Vue CLI files)
```

---

## 🔒 Security Architecture

```text
Browser (Frontend)              Backend Proxy              Azure Function
   ↓                                ↓                            ↓
PlexVmControl.vue    →    server.js (Express)    →    /api/vm/manual
                           ├─ CORS Protection
                           ├─ Request Validation
                           └─ API Key Storage (env)
```

**Key Security Features:**

- ✅ API key stored only on backend (`.env` file, not in repo)
- ✅ CORS restricted to frontend domain
- ✅ Request validation before Azure Function calls
- ✅ Sensitive error info not exposed to frontend
- ✅ Clean separation of concerns

---

## 🧪 Testing the Component

### Manual Testing

1. **Start both servers** (see Step 3 above)
2. **Open browser** to `http://localhost:8080`
3. You should see:
   - A large colored circle (status indicator)
   - "Online" or "Offline" text
   - "Turn On" or "Turn Off" button
   - "Updated X seconds ago"

4. **Test Polling:**
   - Watch the "Updated" time change every 10 seconds
   - Open browser DevTools Network tab to see API calls

5. **Test Toggle:**
   - Click the button
   - Watch for immediate state change (optimistic update)
   - Observe fast polling (every 1 second) for 30 seconds
   - After 30 seconds, polling returns to normal (10 seconds)

6. **Test Errors:**
   - Stop backend proxy
   - Try clicking button
   - Should see error message: "Failed to toggle VM"
   - Resume proxy to recover

---

## 📡 API Endpoints (Backend Proxy)

### GET `/api/vm/status`

Fetch current VM status.

**Response:**

```json
{
  "success": true,
  "data": { "isOnline": true },
  "timestamp": "2024-06-09T10:30:00.000Z"
}
```

### POST `/api/vm/toggle`

Toggle VM state.

**Request:**

```json
{ "state": true }
```

**Response:**

```json
{
  "success": true,
  "data": { "isOnline": true },
  "timestamp": "2024-06-09T10:30:05.000Z"
}
```

### GET `/health`

Health check.

---

## 🐛 Troubleshooting

### "Failed to fetch VM status" Error

**Check:**

1. Backend proxy is running: `curl http://localhost:3001/health`
2. Azure Function URL is correct in `backend-proxy/.env`
3. API key is valid in `.env`
4. Azure Function is accessible from your network

### CORS Errors

**Check:**

1. Frontend URL matches `FRONTEND_URL` in `backend-proxy/.env`
2. Backend proxy is running before frontend
3. Browser DevTools Console for CORS error details

### Component Not Showing

**Check:**

1. Frontend dev server is running: `npm run serve`
2. No JavaScript errors in browser console
3. PlexVmControl.vue is imported in App.vue

---

## 📈 Performance Notes

- **Polling**: 10s normal, 1s for 30s after toggle (configurable in composable)
- **Request Timeout**: 10 seconds (configurable in httpClient)
- **Bundle Size**: ~200KB (mostly PrimeIcons SVG)

---

## 🔧 Customization

### Change Polling Intervals

Edit `src/composables/useVMControl.js`:

```javascript
const NORMAL_POLL_INTERVAL = 10000 // 10 seconds
const FAST_POLL_INTERVAL = 1000 // 1 second
const FAST_POLLING_DURATION = 30000 // 30 seconds
```

### Change Colors

Edit `src/components/PlexVmControl.vue`:

```javascript
const statusColor = computed(() => {
  if (isOnline.value === null) return '#888888' // gray
  if (isOnline.value) return '#22c55e' // green
  return '#ef4444' // red
})
```

### Add Authentication

Backend proxy can add auth headers:

```javascript
// In backend-proxy/server.js - request interceptor
app.use((req, res, next) => {
  // Verify JWT token, API key, etc.
  next()
})
```

---

## 📚 Technologies Used

- **Frontend**: Vue 3, Composition API, PrimeIcons
- **State Management**: Vue 3 Composables
- **HTTP Client**: Axios
- **Backend**: Node.js, Express
- **UI Framework**: Custom CSS + PrimeVue icons
- **Build Tool**: Vue CLI

---

## 🎯 Next Steps

1. **Deploy Backend Proxy**: Host on Azure App Service or similar
2. **Add Authentication**: Implement JWT or API key auth between frontend and proxy
3. **Add Logging**: Implement proper logging/monitoring
4. **Multi-VM Support**: Extend to support multiple VMs with VM ID prop
5. **Persistent Settings**: Save polling preferences to localStorage

---

## 📞 Support

For issues or questions:

1. Check browser DevTools Console for errors
2. Check backend proxy console logs
3. Verify Azure Function is accessible and responding correctly
4. Ensure `.env` files are correctly configured

---

Generated: June 9, 2026
