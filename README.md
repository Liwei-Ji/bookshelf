# Digital Bookshelf & PDF Reader

This is a lightweight, responsive digital bookshelf application built with React. It allows users to browse PDF books stored on a server and read them instantly through an integrated reader component.



## Key Features

* **Dynamic Book Loading**: Automatically fetches the book list and metadata from `public/pdfs/books.json`.
* **Responsive Grid Layout**: Powered by Tailwind CSS, providing a fluid layout optimized for everything from mobile devices to ultra-wide screens.
* **Dark Mode Support**: Includes a theme toggle that persists user preferences in `localStorage`.
* **Full-screen Reading Experience**: Clicking a book opens a full-screen overlay via the `BookReader` component.
* **Deployment Flexibility**: Utilizes Vite's `BASE_URL` configuration to ensure assets are fetched correctly regardless of the deployment subpath.

## Technical Stack

* **Framework**: React (TypeScript).
* **Styling**: Tailwind CSS.
* **Icons**: Lucide React.
* **State Management**: React Hooks (`useState`, `useEffect`).
* **Environment**: Vite (for `BASE_URL` handling).

## Project Structure & Book Configuration

To add books to your shelf, please follow these steps:

### 1. Place PDF Files
Place your PDF files into the `public/pdfs/` directory.

### 2. Update the Book List
Edit the `public/pdfs/books.json` file. The structure should follow this format:


```json
[
  {
    "id": "1",
    "title": "Example Book Title",
    "author": "Author Name",
    "coverUrl": "URL to cover image",
    "url": "pdf-filename.pdf"
  }
]
```


Note: The application automatically applies encodeURI to the url property to ensure filenames with special characters load correctly.

## Getting Started

### 1. Clone the Repository
```json
  git clone [your-repo-url]
```
### 2. Install Dependencies
```json
  npm install
```
### 3. Run Development Server
```json
  npm run dev
```


## UI Overview
* **Header:** Contains the library icon and the dark mode toggle button.

* **Main Content:**
  * Displays a "No books available" prompt if the book list is empty.
  * Displays a grid of BookCard components when books are available.

* **Reader Overlay:** A full-screen reader interface that appears when a book is selected.
