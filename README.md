# AC_Repairing_Services

========================================
        FULL STACK PROJECT README
========================================

Project Type:
-------------
Full Stack Web Application


Technology Stack:
-----------------
Node.js Version  : 22.18.0

Frontend:
---------
Framework       : Next.js (Latest)
UI Library      : Bootstrap
Styling         : SCSS / CSS
Rendering       : App Router (Recommended)

Backend:
--------
Runtime         : Node.js
Framework       : Express.js
API Type        : REST APIs


========================================
        PROJECT STRUCTURE
========================================

project-root/
│
├── frontend/
|   |__ src/                  # Next.js frontend
│   |    ├── app/
│   |    ├── public/
│   |    ├── styles/
│   ├── package.json
│   └── next.config.js
│
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── server.js
│   ├── package.json
│   └── .env
│
└── README.txt


========================================
        REQUIREMENTS
========================================

1. Node.js v22.18.0 (via nvm recommended)
2. npm (comes with Node.js)
3. Git (optional)


========================================
        NODE VERSION SETUP
========================================

Check installed versions:
-------------------------
nvm ls

Use required version:
---------------------
nvm use 22.18.0

Verify:
-------
node -v
(should show v22.18.0)


========================================
        FRONTEND SETUP (Next.js)
========================================

1. Go to frontend folder:
-------------------------
cd frontend

2. Install dependencies:
-------------------------
npm install

3. Run development server:
-------------------------
npm run dev

4. Open browser:
----------------
http://localhost:3000


========================================
        BACKEND SETUP (Express)
========================================

1. Go to backend folder:
------------------------
cd backend

2. Install dependencies:
------------------------
npm install

3. Create .env file:
--------------------
PORT=5000

4. Start backend server:
------------------------
npm run dev
or
node src/server.js

5. Backend will run on:
-----------------------
http://localhost:5000


========================================
        API CONNECTION
========================================

Frontend connects to backend using REST APIs.

Example:
--------
Frontend  → http://localhost:3000  
Backend   → http://localhost:5000/api


========================================
        SCRIPTS
========================================

Frontend:
---------
npm run dev     → Start development
npm run build   → Build for production
npm run start   → Start production build

Backend:
--------
npm run dev     → Start with nodemon
npm start       → Start production server


========================================
        NOTES
========================================

- Bootstrap is used for UI components
- SCSS/CSS is used for styling (No Tailwind)
- Node.js v22.18.0 is recommended for best stability
- Restart terminal after switching Node version with nvm


========================================
        AUTHOR
========================================

Developed by: Dhruvil Patel
Role        : Full Stack Developer


========================================
        END OF FILE
========================================
