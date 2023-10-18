# movie_api

## Description 

The Movie API is a Node.js and Express.js backend server application that provides a RESTful API for accessing movie data and managing user accounts.  
The web application provides users with access to information about different movies, directors, and genres. Users are able to sign up, update their personal information, and create a list of their favorite movies. 

## Key Features

+ Return a list of ALL movies to the user
+ Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
+ Return data about a genre (description) by name/title (e.g., “Thriller”)
+ Return data about a director (bio, birth year, death year) by name
+ Allow new users to register
+ Allow users to update their user info (username, password, email, date of birth)
+ Allow users to add a movie to their list of favorites 
+ Allow existing users to deregister
+ Allow users to remove a movie from their list of favorites

## Installation
To get started, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies using **npm install**.
   
## Usage
To use the API:

1. Set up a MongoDB database and configure the connection string in config.js.
2. Start the server using npm start.
3. Access the API endpoints using a REST client or a web browser.
   
## Technologies Used  
+ Node.js
+ Express.js
+ MongoDB
