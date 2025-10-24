# Judicial AI Suite - Court Management System

A modern, AI-powered court management system designed for judges, clerks, and administrators to streamline judicial processes.

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd decree-scribe-suite

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Component-based UI framework
- **shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Lucide Icons** - Beautiful icons

## Features

- **Role-based Authentication** - Separate interfaces for judges and court clerks
- **Real-time Transcription** - Live court session transcription with AI
- **Document Management** - Upload, view, and manage case documents
- **Legal Research Assistant** - AI-powered legal precedent search
- **Court Record Management** - Comprehensive case history and transcripts
- **Responsive Design** - Works on desktop and mobile devices

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components for different routes
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and storage
└── assets/             # Static assets (images, icons)
```

## Deployment

The application can be deployed to any static hosting provider or cloud platform that supports React SPA deployment.

### Common deployment options:

1. **Vercel** - `npm run build` then deploy the `dist` folder
2. **Netlify** - `npm run build` then deploy the `dist` folder
3. **GitHub Pages** - Configure with GitHub Actions for automated deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/new-feature`)
6. Create a Pull Request

## License

This project is licensed under the MIT License.
