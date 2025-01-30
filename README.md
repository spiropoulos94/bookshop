# ScyllaDB Bookshop

## Overview
The **ScyllaDB Bookshop** is a web application that utilizes the Google Books API to fetch a list of books and allows users to add/remove books from their shopping cart, modify quantities, and calculate the total price. The frontend is built using React.js, while the backend is implemented in Go to serve the application and log user requests.

## Installation & Setup
### Running the Application

To start the application using **Docker**, simply:

Inside the ```/backend``` folder rename the 
```sh
env.example
```

into 
```sh
.env
```


and then run

```sh
docker-compose up --build
```

### Running in Development Mode
If you want to spin up the frontend and backend separately in development mode:
#### Frontend
```sh
cd frontend
npm run dev
```
#### Backend
```sh
cd backend
docker-compose -f docker-compose.dev.yml up --build
```

## Features
### Main Page
- Displays a list of books fetched from the Google Books API.
- Each book includes a thumbnail image, title, page count, and listed price.
- Users can click **"Add to Cart"** to add a book to their shopping cart.
- If the book is already in the cart, clicking "Add to Cart" again does nothing.

### Shopping Cart
- A **"My Cart"** button displays the number of items in the cart.
- Clicking **"My Cart"** shifts the book list left and displays the cart contents.
- Each cart item includes:
  - A **remove** button (**X**) to delete the book from the cart.
  - An **input field** to update the quantity.
  - If the quantity is invalid (not between 1 and 100), an error message appears.
- A total price box calculates the sum of all cart items (only displayed when items are in the cart).

### Backend (Go Server)
- The app is served from a **Go** server.
- All user traffic is routed through the server and logged.
- Books responses are filtered by **"maturityRating": "NOT_MATURE"**.
- If an ISBN is provided, the **Open Library API** is used to fetch the revision number (if greater than 1).

### Bonus Features
- **Persistence**: Shopping cart data persists between page refreshes.
- **Filtering**: Users can filter books by title.
- **Testing**: Includes basic unit and functional tests.
- **Dockerization**: Supports Docker for easy deployment.

---



## API Usage
- **Google Books API** is used to fetch book data.
- **Open Library API** is used to fetch book revision numbers when ISBN is available.

---

## Tech Stack
- **Frontend**: React.js
- **Backend**: Go (Golang)
- **Docker**: Used for deployment

