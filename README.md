# EasyBima Documentation

## Project Overview
EasyBima is a React-based web application built with TypeScript, providing a modern and user-friendly interface for CIC Group insurance-related operations.

## Technical Stack
- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript
- **Routing**: React Router DOM 6.22.0
- **Database ORM**: Prisma
- **Date Handling**: React Datepicker
- **Data Visualization**: Chart.js
- **Testing**: Jest and React Testing Library

## Project Structure
```
easybima/
├── src/
│   ├── components/     # Reusable UI components
│   ├── services/      # API and business logic services
│   ├── utils/         # Utility functions and helpers
│   | assets/        # Static assets (images, fonts, etc.)
│   ├── styles/        # CSS and styling files
│   ├── data/          # Static data and configurations
│   └── generated/     # Auto-generated files
├── prisma/            # Database schema and migrations
├── public/           # Public assets and index.html
└── node_modules/     # Project dependencies
```

## Core Features

### 1. Authentication System
- User login functionality
- Password recovery system
- Secure session management

### 2. Main Pages
- Cover Page: Welcome screen for users
- Login Page: User authentication interface
- Forgot Password Page: Password recovery workflow

### 3. Data Visualization
- Integration with Chart.js for data representation
- Dynamic chart generation and updates

### 4. Image Optimization
The project includes built-in image optimization features:
- JPEG and PNG compression
- Image enhancement capabilities
- Automated image processing scripts

## Development

### Getting Started
1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

### Build Process
To create a production build:
```bash
npm run build
```

## Security Features
- BCrypt integration for password hashing
- JWT (JSON Web Tokens) for secure authentication
- Type-safe database operations with Prisma

## Browser Support
### Production
- Browsers with >0.2% market share
- Modern browsers


### Development
- Latest versions of:
  - Chrome
  - Firefox
  -edge

## Additional Tools
- Image optimization utilities
- TypeScript configuration
- ESLint setup for code quality
- Automated testing infrastructure

## License
This project is licensed under the ISC License.

---

*Note: This documentation is a living document and will be updated as the project evolves.* 
