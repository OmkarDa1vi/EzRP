MERN Stack Inventory & Management System
This is a full-stack MERN (MongoDB, Express, React, Node.js) application with a comprehensive admin panel for managing products, inventory, sales, customers, and more. It features a secure, permission-based access control system using JSON Web Tokens (JWT).

Project Structure
mern-auth-project/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    ├── .gitignore
    ├── package.json

Prerequisites
Before you begin, ensure you have the following installed:

Node.js and npm: Download Node.js (npm is included)

Git: Download Git

MongoDB Atlas Account: You need a cloud database. Create a free account here.

Backend Setup Instructions
Navigate to the Backend Directory:
Open your terminal and cd into the backend folder.

cd mern-auth-project/backend

Install Dependencies:
Run the following command to install all the necessary server-side libraries.

npm install

Create Environment File:
Create a new file named .env in the backend directory. Copy the content from an example .env file or create it from scratch.

Configure Environment Variables:
Open your .env file and fill in the required values:

MONGO_URI: Get this from your MongoDB Atlas account. Go to your cluster -> Connect -> Drivers, and copy the connection string. Remember to replace <password> with your actual database user password.

JWT_SECRET: Create a long, random, and secret string for signing your tokens.

Start the Backend Server:

npm run dev

The server will start on http://localhost:5001. It will also automatically seed the database with the necessary permissions and default roles ("admin" and "user") on its first run.

Frontend Setup Instructions
Navigate to the Frontend Directory:
Open a new, separate terminal window and cd into the frontend folder.

cd mern-auth-project/frontend

Install Dependencies:
Run the following command to install all the necessary client-side libraries.

npm install

Start the Frontend Application:

npm start

Your browser should automatically open to http://localhost:3000, where you can see the application running.

How to Use the Application
Create an Admin Account:

Navigate to the Sign-Up page.

Fill in your details and select the "Admin" role.

Complete the sign-up process.

Log In:

Log in with your new admin credentials. You will be redirected to the Admin Dashboard.

Populate with Demo Data:

The application is a blank slate. To see the dashboard and other features come to life, you need to add some data.

Use the admin interface to manually add data.

Recommended Order:

Manage Categories

Manage Suppliers

Manage Customers

Manage Products (you can now select categories)

Manage Purchase Orders / Sales Orders (you can now select products, suppliers, and customers)
