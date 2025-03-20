# Meteorite Explorer - System Analysis Document

## 1. Project Overview
The **Meteorite Explorer** is a full-stack web application designed to **search, visualize, and analyze meteorite landings** worldwide. It provides an **interactive UI** for users to explore meteorites through a **searchable and filterable table**, a **map visualization**, and **data analytics dashboards**.

---

## 2. Features

### Frontend Features (React + TypeScript)
- **Meteorite List Page**
    - Displays meteorites in a **paginated and sortable table**
    - Supports **searching and filtering** by name, class, year, fall type, and mass range
    - Clicking on a meteorite **redirects to the details page**

- **Meteorite Details Page**
    - Displays meteorite **name, classification, mass, year, fall type, and coordinates**
    - Shows the **landing location on an interactive map** (Leaflet.js)
    - Breadcrumb navigation to go back to the list

- **Meteorite Data Visualization (Dashboard Page)**
    - **Mass Distribution Chart** – Visualizes small vs. large meteorites
    - **Classifications Chart** – Displays meteorite type breakdown
    - **Meteorite Trends Over Time** – Shows the distribution of meteorites over different years
    - Button to return to the list

- **Navigation & User Experience**
    - **Breadcrumbs** for better navigation across pages
    - **Button to switch between pages** (List, Details, Dashboard)

---

### Backend Features (Spring Boot + PostgreSQL)
- **REST API with Spring Boot**
    - Exposes endpoints for fetching meteorite data
    - Implements **pagination and sorting**
    - Supports **searching and filtering**

- **Database (PostgreSQL)**
    - Stores meteorite data with efficient indexing
    - **Flyway database migration** for version control

- **API Endpoints**

| HTTP Method | Endpoint | Description |
|-------------|------------|-------------|
| `GET` | `/api/meteorites` | Get all meteorites (paginated) |
| `GET` | `/api/meteorites/{id}` | Get details of a specific meteorite |
| `GET` | `/api/meteorites/search` | Search meteorites by name, class, year, fall type, and mass range |

- **CORS Configuration**
    - Configured to allow frontend access from different origins
    - **Spring Boot CORS setup** applied globally

- **Dockerized Backend**
    - Runs inside a **Docker container**
    - Uses a **Dockerized PostgreSQL database**

---

## 3. Architecture

### High-Level Architecture
The application follows a **three-tier architecture**:

- **Frontend (React, TypeScript, Material UI)**
    - Handles UI and user interactions
    - Fetches data from the backend via **Axios API calls**
    - Displays data using **tables, charts, and maps**

- **Backend (Spring Boot, PostgreSQL, Flyway, JPA)**
    - Exposes **RESTful APIs**
    - Handles business logic (searching, filtering, and pagination)
    - Connects to the database using **Spring Data JPA**

- **Database (PostgreSQL)**
    - Stores meteorite records
    - Uses indexing for optimized queries

---

## 4. Technology Stack

### Frontend (React + TypeScript)
- **React.js** – UI framework
- **TypeScript** – Strongly typed JavaScript
- **Material-UI** – UI components
- **React Query** – API data fetching and caching
- **Axios** – HTTP requests
- **Leaflet.js** – Map visualization
- **Recharts** – Data visualization
- **React Router** – Navigation

### Backend (Spring Boot + Java)
- **Spring Boot 3** – API framework
- **Spring Data JPA** – ORM for database interaction
- **PostgreSQL** – Relational database
- **Flyway** – Database migrations
- **HikariCP** – Connection pooling
- **Docker** – Containerization

### Infrastructure
- **Docker Compose** – Multi-container setup
- **Nginx** – Serves frontend as a static site in Docker

---

## 5. System Design

### Frontend Design
- Uses a **single-page application (SPA)** pattern
- Implements **React Query** for efficient API caching
- Follows **component-based architecture** for UI reusability

### Backend Design
- Implements **RESTful API architecture**
- Uses **DTOs (Data Transfer Objects)** for structured API responses
- Applies **Spring Boot service-repository pattern**

### Database Design (PostgreSQL)
- **Tables**: `meteorites`
- **Indexes**: Indexed search columns for performance optimization

---

## 6. Deployment & Setup

### Running the Application Locally
1. **Clone the repository**
   ```sh
   git clone https://github.com/brsbckr/meteorite-explorer.git
   cd meteorite-explorer
   ```
2. **Run the backend**
   ```sh
    ./mvnw spring-boot:run
   ```  
3. **Run the frontend**
   ```sh
        cd frontend
        npm install
        npm start
   ```  

# 7. Dockerized Deployment

## Dockerfile (Frontend)

```Dockerfile
FROM node:18 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Docker Compose Configuration

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: meteorite_postgres
    restart: always
    environment:
      POSTGRES_DB: meteorite_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    networks:
      - meteorite_network

  backend:
    build: .
    container_name: meteorite_backend
    restart: always
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/meteorite_db
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate
    ports:
      - "8080:8080"
    networks:
      - meteorite_network
    command: ["/bin/sh", "-c", "sleep 10 && java -jar app.jar"]

  frontend:
    build:
      context: ./frontend
    container_name: meteorite_frontend
    restart: always
    depends_on:
      - backend
    ports:
      - "3000:80"
    networks:
      - meteorite_network

networks:
  meteorite_network:
    driver: bridge
```

## Running the Application with Docker

To build and run all containers, use the following command:

```sh
  docker-compose up --build
```

## Accessing the Application

Once the containers are running, you can access the application through the following URLs:

- **Frontend (React UI):** [http://localhost:3000](http://localhost:3000)
- **Backend API (Spring Boot):** [http://localhost:8080](http://localhost:8080)
- **PostgreSQL Database:** Accessible internally within the Docker network at `postgres:5432`.

## Running the Application with Docker

To build and run all containers, use the following command:

```sh
  docker-compose up --build
```

To stop and remove the containers:

```sh
  docker-compose down
```

## 8. Future Enhancements

### Features for Future Versions

- **User Authentication:** Implement a **JWT-based authentication system** for user login and access control.
- **Advanced Data Analytics:** Enhance the meteorite statistics with **machine learning predictions** and deeper insights.
- **Real-Time Meteorite Data Updates:** Utilize **WebSockets** to provide real-time updates for newly recorded meteorite impacts.
- **Kubernetes Deployment:** Scale the application by deploying it in **Kubernetes** for cloud-based deployment.
- **Integration with External Meteorite Databases:** Connect to **NASA meteorite datasets** and other scientific sources for enhanced accuracy.
- **Geospatial Queries:** Implement geospatial database queries to allow searching meteorites **within a specific radius**.
- **Historical Trends Dashboard:** Add more **charts and trends** to analyze meteorite activity over centuries.
- **Mobile-Friendly UI:** Improve **responsiveness** and **UX** for seamless experience on mobile devices.

## 9. Conclusion

The **Meteorite Explorer** is a **full-stack application** designed for **interactive meteorite data exploration**. With **React, Spring Boot, PostgreSQL, and Docker**, it offers a **scalable, user-friendly, and high-performance** experience.

### Key Takeaways:

- **Modular and Maintainable Architecture**
- **Interactive UI with React and Material-UI**
- **Scalable Backend with Spring Boot and PostgreSQL**
- **Data Visualizations with Leaflet.js and Recharts**
- **Containerized Deployment using Docker and Docker Compose**

The architecture ensures **modularity, maintainability, and performance**, making it **future-proof** and **extensible** for additional features.
