# watchlistrr

The <b>watchlistrr</b> is a single page web application that allows users to create, share and subscribe watchlists. 
<br><sub>The watchlistrr app uses the <b>TMDB API</b> (on <a href="https://github.com/erdinctekay/watchlistrr-fake-backend" target="_blank">backend</a>) to retrieve information about movies and TV shows.</sub>

You can try the working app on <a href="https://watchlistrr.netlify.app/" target="_blank"><b>watchlistrr.netlify.app</b></a>

## Features

- Fully responsive UI with dark/light theme
- Auth based roles and capabilites
- Live text search / sorting
- User based private watchlists
- Item based interaction (like-watch-star-follow)
- User watchlist page (get specific user's watchlists)

## Feature Roadmap

### Short Term

- Toast notifications after certain actions
- Share handler (web share api)
- Account page and auth related actions (pw change, name change, forgot pw etc.)
- Library page (that user can easily list own liked, watched movies, followed, starred watchlists)
- Adding multiple movies / bulk add feature
- Include persons to movie adding search results (tmdb stars, directors etc.)

### Long Term

- Watchlist co-ownership
- In-group shareable private watchlists

## Technologies Used

The watchlistrr app is built with using the following technologies:

- Vite
- Vue 3 - <i>Composition API / <script setup></i>
- Pinia
- Vue Router
- Firebase Authentication
- Bootstrap 5

## Contributing

If you'd like to contribute to the watchlistrr app, you can do so by following these steps:

1. Fork the watchlistrr app repository.
2. Make your changes and commit them to a new branch. <br><sub><i>(check <a href="#setup-and-installation">'Setup and Installation'</a> below)</i></sub>
3. Create a pull request on the watchlistrr app repository.

## Setup and Installation

To run the watchlistrr app on your local machine, you will need to follow these steps:

1. Clone the watchlistrr app repository from GitHub.
2. Install the required dependencies using the `npm install` command.
3. Set up a Firebase project and enable Firebase Authentication.
4. Make sure <a href="https://github.com/erdinctekay/watchlistrr-fake-backend" target="_blank">backend</a> is running
5. Create a `.env` file in the root directory of your project. Copy `.envExample` file to your env file and fill the blanks.
6. Start the development server using the `npm run dev` command.

## License

The watchlistrr app is licensed under the MIT License. See the `LICENSE` file for more information.
