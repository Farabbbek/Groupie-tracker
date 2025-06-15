# 🎸 Groupie Tracker

**Groupie Tracker** is a web application written in Go (Golang) that allows users to explore information about music bands, their members, formation dates, concert locations, and more.

---

## 🚀 Features

- 📜 List of music bands with detailed descriptions  
- 👥 Information about band members  
- 📍 Display of concert geolocations  
- 📅 Filtering by creation years, albums, and members  
- 🔍 Search by band name  
- ❌ Custom error pages for 404 and 500  

---

## 🛠️ Technologies

- Language: **Go (Golang)**
- Built using Go’s standard `net/http` package
- Frontend: HTML + CSS + JavaScript
- Custom error handling for better user experience

---

## 📂 Project Structure

groupie-tracker/
├── handlers/
│ ├── errors.go # Custom error rendering (404, 500)
│ ├── routers.go # All routes defined here
│ ├── http.go  # HTTP request handling
│ ├── kyzet.go 
|
|
├── data_models/
│ ├── api.go 
│ ├── structs.go 
│
├── static/
│ |
│ ├── styles/ # CSS files
│ └── js/ # JavaScript files
│
├── templates/
│ ├── details.html # Layout template
│ ├── index.html # Main page template
│ |
│ └── errors/
│ ├── error404.html # Custom 404 error page
│ └── error400.html
| └── error500.html # Custom 500 error page
│── main.go # Entry point of the application
├── go.mod # Go module definition
└── README.md # Project documentation
---

## 🧪 Getting Started

### 1. Clone the repository

git clone https://github.com/your-username/groupie-tracker.git
cd groupie-tracker

### 2. Run the project

go run main.go

### Server will start on:

http://localhost:8080


## Deployment:

