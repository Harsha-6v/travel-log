[Full-Stack Travel Log Application](https://travel-log-client-kappa.vercel.app)
=================================

This is a full-stack MERN (MongoDB, Express, React, Node.js) application that allows users to create, view, edit, and delete log entries of places they have traveled to. Entries are displayed as markers on an interactive Mapbox map.

Features
--------

*   **Interactive Map**: Displays all travel entries as markers on a beautiful Mapbox map.
    
*   **Create, Read, Update, Delete (CRUD)**: Full functionality to manage travel log entries.
    
    *   **Create**: Double-click anywhere on the map to add a new entry.
        
    *   **Read**: Click on any marker to view its details in a styled popup.
        
    *   **Update**: Edit the details of an existing entry.
        
    *   **Delete**: Remove an entry after confirming with an API key.
        
*   **Live Search & Fly-To**: Search for existing log entries by title and see the results in a dropdown. Click a result to fly to that marker on the map.

*   **Secure API**: The back-end API is protected with a secret key required for creating, updating, or deleting entries.
    
*   **Modern UI**: Features a clean, dark-themed UI for popups and forms, and a responsive design.
    

Tech Stack
----------

#### Backend:

*   **Node.js**: JavaScript runtime environment.
    
*   **Express**: Web framework for Node.js.
    
*   **MongoDB**: NoSQL database for storing log entries.
    
*   **Mongoose**: Object Data Modeling (ODM) library for MongoDB.
    
*   **Dependencies**: cors, dotenv, helmet, morgan.
    

#### Frontend:

*   **React**: JavaScript library for building user interfaces.
    
*   **React Map GL**: React wrapper for Mapbox GL JS.
    
*   **React Hook Form**: For efficient form state management.
    
*   **CSS**: Custom styling for a consistent and modern look.
    
## Acknowledgements

This project was originally based on the "Full Stack Travel Log" by Coding Garden with CJ. It has since been significantly updated and revamped with new features, a modernized tech stack, and a new user interface.
