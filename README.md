# 🚀 Kinesis HR

> Experience the next evolution in talent acquisition. Our AI-powered platform delivers unparalleled candidate analysis, sophisticated evaluation metrics, and data-driven insights empowering you to make exceptional hiring decisions with confidence and precision.

## 🎯 Product Overview

Kinesis HR is a cutting-edge recruitment platform that combines AI technology with intuitive design to streamline the entire hiring process. Our platform helps HR professionals and recruiters make data-driven decisions while providing a seamless experience for both employers and candidates.

### Target Users

- HR Managers and Recruiters
- Talent Acquisition Specialists
- Small to Medium-sized Businesses
- Recruitment Agencies
- Corporate HR Departments

### Core Features

#### 1. Advanced Applicant Tracking

- Comprehensive candidate progress monitoring
- Centralized recruitment dashboard

#### 2. AI-Powered Interviews

- Intelligent interview engine with adaptive questioning
- Real-time interview analytics
- 24/7 automated screening

#### 3. Seamless Application Process

- Modern, user-friendly interface
- Streamlined candidate experience
- Essential information capture
- Progress tracking for applicants

#### 4. AI Assistant Support

- 24/7 recruitment assistance
- Automated query handling
- Interview scheduling
- Status updates

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.2** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript 5.8** - Type safety
- **TailwindCSS 4** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icon system
- **Next Auth** - Authentication
- **Next Themes** - Dark mode support
- **Embla Carousel** - Image carousels
- **React Player** - Media playback
- **Recharts** - Data visualization
- **React Markdown** - Content rendering
- **@dnd-kit** (core, sortable, modifiers, utilities) - Drag and drop
- **CMDK** - Command menu
- **clsx** & **class-variance-authority** - Utility libraries
- **vaul** - Drawer component
- **sonner** - Toast notifications

### Backend

- **Next.js API Routes** - Serverless endpoints
- **Prisma 6.11** - Type-safe ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **Nodemailer** - Email services
- **Cloudinary** - Media management
- **LiveKit** (livekit-client, server-sdk, components-react) - Real-time audio/video
- **Axios** - HTTP client
- **date-fns** & **moment** - Date utilities
- **uuid** - Unique IDs
- **RabbitMQ** - Message broker for asynchronous communication/microservices
- **Python** - Programming language for certain backend services
- **FastAPI** - Modern, fast Python web framework for building APIs
- **Gemini** - AI/LLM service.
- **LlamaIndex** - Framework for integrating data with Large Language Models (LLMs)

### Development Tools

- **TypeScript 5.8** - Type checking
- **ESLint 9** - Code linting
- **Prettier 3.5.3** - Code formatting
- **Turbopack** - Fast builds
- **ts-node** - TypeScript execution
- **tw-animate-css** - Tailwind animation utilities

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js 15 App Router]
        B[React 19 Components]
        C[TailwindCSS + Radix UI]
        D[Framer Motion]
        E[React Hook Form + Zod]
    end

    subgraph "Authentication Layer"
        F[NextAuth.js]
        G[Google OAuth]
    end

    subgraph "API Layer"
        H[Next.js API Routes]
        I[TypeScript Endpoints]
        J[Prisma Client]
    end

    subgraph "AI/ML Services"
        K[Gemini AI/LLM]
        L[LlamaIndex]
        M[FastAPI Python Services]
        N[AI Interview Engine]
    end

    subgraph "Real-time Services"
        O[LiveKit Audio/Video]
        P[WebRTC Communication]
        Q[Interview Streaming]
    end

    subgraph "Message Queue"
        R[RabbitMQ]
        S[Async Processing]
    end

    subgraph "External Services"
        T[Cloudinary CDN]
        U[Nodemailer SMTP]
        V[File Storage]
    end

    subgraph "Database Layer"
        W[PostgreSQL]
        X[Prisma ORM]
    end

    %% Client connections
    A --> H
    B --> A
    C --> B
    D --> B
    E --> B
    A --> F

    %% Auth flow
    F --> G
    F --> H

    %% API connections
    H --> J
    H --> K
    H --> T
    H --> U
    H --> R

    %% AI services
    K --> L
    L --> M
    M --> N
    N --> H

    %% Real-time
    O --> P
    P --> Q
    Q --> H

    %% Message processing
    R --> S
    S --> M

    %% Database
    J --> X
    X --> W

    %% File handling
    T --> V
    V --> W
```

### Architecture Components

#### 🎨 Client Layer

- **Next.js 15**: Modern React framework with App Router for optimal performance
- **React 19**: Latest React features with concurrent rendering
- **TailwindCSS + Radix UI**: Utility-first styling with accessible components
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form + Zod**: Type-safe form handling and validation

#### 🔐 Authentication Layer

- **NextAuth.js**: Secure authentication with session management
- **Google OAuth**: Social login integration
- **JWT Tokens**: Stateless authentication for API endpoints

#### 🛠️ API Layer

- **Next.js API Routes**: Serverless API endpoints
- **TypeScript**: Full type safety across the application
- **Prisma Client**: Type-safe database operations

#### 🤖 AI/ML Services

- **Gemini AI**: Advanced language model for interview processing
- **LlamaIndex**: Framework for integrating data with LLMs
- **FastAPI**: High-performance Python API for AI services
- **AI Interview Engine**: Custom logic for automated interviews

#### 📡 Real-time Services

- **LiveKit**: Professional-grade audio/video infrastructure
- **WebRTC**: Peer-to-peer communication
- **Interview Streaming**: Real-time interview sessions

#### 📬 Message Queue

- **RabbitMQ**: Reliable message broker for async operations
- **Background Processing**: Heavy tasks handled asynchronously

#### 🌐 External Services

- **Cloudinary**: Media management and CDN
- **Nodemailer**: SMTP email service
- **File Storage**: Document and media storage

#### 🗄️ Database Layer

- **PostgreSQL**: Robust relational database
- **Prisma ORM**: Modern database toolkit with migrations

### 🔄 Data Flow Examples

#### Candidate Application Flow

1. **Candidate** submits application via React form
2. **Next.js API** validates data using Zod schemas
3. **Prisma** stores candidate data in PostgreSQL
4. **Cloudinary** handles CV/document uploads

#### AI Interview Flow

1. **Recruiter** initiates interview via dashboard
2. **LiveKit** creates real-time audio/video session
3. **AI Engine** generates dynamic questions
4. **LlamaIndex** processes candidate responses
5. **Gemini** evaluates answers in real-time
6. **WebRTC** streams interview data
7. **RabbitMQ** queues AI analysis tasks
8. **FastAPI + Gemini** processes candidate profile
9. **Results** stored back to database via Prisma

#### Real-time Communication

1. **User actions** trigger WebSocket events
2. **LiveKit** manages peer-to-peer connections
3. **RabbitMQ** handles background processing
4. **AI services** process data asynchronously
5. **UI updates** reflect real-time changes

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (recommended: 22.14+)
- PostgreSQL database
- Cloudinary account

### Installation

1. Clone the repository

```bash
git clone https://github.com/powered-by-kinesis/kinesis-hr.git
cd kinesis-hr
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Required environment variables:

```
DATABASE_URL=

NEXT_PUBLIC_BASE_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NODE_ENV=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_URL=

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

NEXT_PUBLIC_AGENT_ID=

# LLM API_URL
API_URL=  #
```

4. Initialize the database

```bash
npx prisma generate
npx prisma migrate dev
```

5. (Optional) Seed the database

```bash
npx ts-node prisma/seed.ts
```

6. Start the development server

```bash
npm run dev
```

### Useful NPM Scripts

- `npm run dev` — Start development server with Turbopack
- `npm run build` — Generate Prisma client and build Next.js app
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run lint:fix` — Fix lint errors
- `npm run typecheck` — TypeScript type checking
- `npm run format` — Format code with Prettier
- `npm run format:check` — Check code formatting
- `npm run validate` — Run lint, typecheck, and format:check

## 📝 Development Guidelines

### Code Style

- Follow TypeScript best practices
- Use functional components
- Implement proper error handling
- Write comprehensive comments
- Follow atomic design principles

## 🔒 Security

- Secure authentication with NextAuth.js
- HTTPS enforcement
- Input validation
- File upload restrictions

## 📈 Future Roadmap

- Enhanced AI interview capabilities
- Advanced analytics dashboard
- Multi-language support
- Integration with ATS systems
- Automated reference checking
- Video interview features

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Built with ❤️ by the Kinesis HR Team_
