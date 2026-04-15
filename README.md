# VGen Todo Assessment

## Scenario

A certain visionary entrepreneur with an extraordinary fondness for the letter “X” has set his sights on a new industry in need of disruption: todo lists. The new venture, called TodoX, was announced to great fanfare. However, the lead developer unexpectedly left the project following a mishap with a self-driving office chair, leaving you to finish it. A basic user authentication system has been implemented, as well as a feature for creating new todo items, but there are still a couple requirements left unfulfilled.

## Setup Instructions

Install MongoDB: [https://www.mongodb.com/docs/manual/administration/install-community/](https://www.mongodb.com/docs/manual/administration/install-community/)

Install Node.js: [https://nodejs.org/en/download](https://nodejs.org/en/download)

Clone the following repositories:
[https://github.com/brynnonpicard/assessment-todo-backend](https://github.com/brynnonpicard/assessment-todo-backend)
[https://github.com/brynnonpicard/assessment-todo-frontend](https://github.com/brynnonpicard/assessment-todo-frontend)

## Running the repositories

To run the backend, use the following commands:

`npm i`

`npm start`

It should then be available at [localhost:4000](http://localhost:4000).

To run the frontend, use the following commands:

`npm i`

`npm run dev`

It should then be available at [localhost:3000](http://localhost:3000). You should first create an account at [localhost:3000/signup](http://localhost:3000/signup), after which you’ll be able to view the dashboard page at the root path, as well as the todo creation page at [localhost:3000/create](http://localhost:3000/create).

## Submitting your work

Push your changes to your personal GitHub account and reply via email with the links to your code.

## Requirements

1. List all of a registered user’s todos
   - Create a new frontend page at the path /todos, which only signed in users can access
   - Fetch the user’s todos from the database
   - Using the existing Tabs component, create 2 tabs: the first tab for incomplete todos, and the second for all todos
   - Display the todos in a list view within the tabs
   - Todos should be sorted by creation date
   - Only the user who created a todo should be able to see it
2. Mark a given todo as “done” or “not done”
   - In the list of todos from requirement #1, users should be able to toggle the completion status of a specific todo item
   - The completion status should also be persisted in the database
3. Edit todo name
   - It’s up to you how you’d like to implement this, for example, you could open an edit modal, or embed an input field inline in the list view, or redirect to another page to perform the edit

Don’t be too concerned about the styling of the frontend parts, the focus should be on functionality and code quality. Only the requirements listed are strictly required, but you’re welcome to make any additional improvements as you see fit. Comments in your code that explain how things work, or choices you made, are encouraged.
