# Bootcamp Brokers

Bootcamp Brokers is a web app that helps users manage their portfolios, watchlists, and stay up-to-date with financial news, with the added bonus of a support bot for easy assistance.

[![My Skills](https://skillicons.dev/icons?i=react,py,flask,js,html,css,)](https://skillicons.dev)

Contents
===
- [Feature List](#feature-list)
- [User Stories](#user-stories)

## Feature List
- **Users:**
  - Users can sign up, log in, and log out.
  - Users can log in as a demo user.
  - Users cannot utilize certain features of the application if not logged in.
  - Logged in users are automatically directed to their dashboard upon logging in.
- **Portfolio:**
  - Users can add stocks to their portfolio.
  - The portfolio displays the current/total account value(s)
  - Displays cash & brokerage holdings
  - Users can add or remove shares of stock currently held.
  - Users can remove stocks from their current holdings.
- **Watchlist:**
  - Logged in users can create, read, update, and delete their own watchlists.
  - Users can add and delete stocks from their watchlists.
  - Users can change the order of watchlists displayed.
- **Stocks:**
  - Fetch stock data using an external API

## User Stories

### Sign up
- As an unregistered and unauthorized user, I want the ability to sign up for the website by utilizing a sign-up form.
  - When I am on the `sign-up` page:
  - I would like to be prompted to enter my first-name, last-name, username, email, and password in a well-formatted sign-up form.
