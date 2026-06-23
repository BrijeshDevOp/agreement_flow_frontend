# AgreementFlow — Frontend Setup

## Requirements
- Node.js 18+ — [Download](https://nodejs.org/)
- npm (comes with Node.js)

---

## Getting Started — Download & Navigate

### Download the Project

1. Go to the GitHub repository page
2. Click **Code → Download ZIP**
3. Extract the ZIP to any folder on your computer

### Open a Terminal in the Frontend Folder

After extracting, open your terminal and navigate to the `agreement-frontend` folder:

```bash
# Windows example
cd C:\path\agreement_flow_frontend-main\

# macOS / Linux example
cd ~/path/agreement_flow_frontend-main/
```

> All commands below must be run from inside the **`agreement_flow_frontend-main`** folder.

---

## 1. Install Dependencies

```bash
npm install
```

This installs all packages including React, Vite, MUI, Axios, Syncfusion, and React Router.

---

## 2. Connect to the Backend

The frontend talks to the Django backend at `http://127.0.0.1:8000/`.

Make sure the **backend server is running** before starting the frontend:

```bash
# In the backend folder (separate terminal):
python manage.py runserver
```

If your backend runs on a different port or URL, update this file:

```
src/api/axiosConfig.jsx
```

Change the `baseURL` on line 5:

```js
baseURL: 'http://127.0.0.1:8000/api/',
```

---

## 3. Start the Development Server

```bash
npm run dev
```

The app opens at:

```
http://localhost:5173/
```

---

## 4. Login

Use the credentials of any user created in the backend admin panel.

| Role | Can Do |
|---|---|
| `JUNIOR` | Create and edit agreements |
| `SENIOR` | Review and forward |
| `MANAGER` | Review and forward |
| `FOUNDER` | Review and forward to Client |
| `CLIENT` | Accept or request changes |

> The backend must have users created for each role before the workflow can be tested end-to-end.

---

## Syncfusion License (Document Editor)

This project uses the **Syncfusion Document Editor** component. It works without a license key in development/localhost but may show a watermark.

To register a free community license, add this to `src/main.jsx` before `ReactDOM.createRoot`:

```js
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense('your-license-key-here');
```

Get a free key at: https://www.syncfusion.com/products/communitylicense
