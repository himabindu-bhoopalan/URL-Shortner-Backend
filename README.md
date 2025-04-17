# 🔗 URL Shortener Service 
A simple and efficient Node.js-based URL Shortener backend using MongoDB, Express, and CORS. This service generates short, unique URLs and handles redirection, tracking, and management of shortened links.

🚀 **Live Demo:** [View on Netlify](https://himabindu-urlshortner.netlify.app/)
---

## 📚 Overview

This project allows users to:
- Generate a **shortened URL** for a long link.
- Retrieve all shortened links.
- Redirect to the original URL using the short code.
- Track the **click count** on each short link.
- Delete links from the database.

---

## 🛠️ Technologies Used

- **Node.js** – Backend runtime 🌐  
- **Express.js** – Web framework 🧩  
- **MongoDB** – NoSQL database for storage 🗄️  
- **Body-Parser** – Middleware to parse request bodies 📦  
- **CORS** – Cross-Origin Resource Sharing configuration 🔐  
- **dotenv** – For managing environment variables 🌱

---

## ✨ Features

- 🔗 **URL Shortening**: Converts long URLs into short, shareable links.  
- 📥 **Duplicate Check**: Prevents shortening the same URL multiple times.  
- 📈 **Click Tracking**: Monitors how many times a short link is accessed.  
- 🧹 **Link Management**: Delete unused or old links easily.  
- 🚀 **Redirection**: Automatically redirects to the original URL using the short code.

---

## 📦 Installation

### 1. Clone the Repository:

```bash
git clone https://github.com/yourusername/url-shortener-backend.git
cd url-shortener-backend
```

### 2. Install Dependencies:

```bash
npm install
```

### 3. Configure Environment Variables:

Create a `.env` file and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
PORT=8080
```

### 4. Start the Server:

```bash
node index.js
```

---

## 📝 API Endpoints

### `POST /shorturl`  
Shortens a new URL.  
**Request Body:**

```json
{
  "url": "https://example.com"
}
```

**Response:**

```json
{
  "status": 200,
  "message": "Link added"
}
```

---

### `GET /home`  
Fetches all stored URLs.

**Response:**

```json
[
  {
    "_id": "609c2b1f...",
    "long": "https://example.com",
    "short": "abc12",
    "clicks": 3
  }
]
```

---

### `GET /:shorturlid`  
Redirects to the original URL using the short code and increments click count.

---

### `DELETE /delete/:id`  
Deletes a short URL entry by ID.

**Response:**

```json
{
  "status": 200,
  "message": "deleted"
}
```

---

## 📂 Project Structure

```
.
├── index.js         # Main server file
├── package.json     # Node.js project metadata
├── .env             # Environment variables
```

---

## 🔍 Future Improvements

- 🔒 Auth system for users
- 🧪 Unit tests and error handling

---

## 🤝 Contributing

Got suggestions or want to enhance this? Fork it, make changes, and submit a pull request. Contributions are always welcome! 💡

---

## 📄 License

This project is licensed under the **MIT License** – feel free to use and modify it!
