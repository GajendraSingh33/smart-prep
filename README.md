### 📘 Smart Prep – AI-Powered Exam Preparation Tool

Smart Prep is an AI-driven web application that helps students prepare effectively for exams. By analyzing syllabus documents and previous year question papers, it generates sample question papers with answers that can be downloaded as PDFs.

Built with Next.js and integrated with AI models, Smart Prep provides a personalized and efficient learning experience.

### 🚀 Features

📂 Upload syllabus & previous year question papers

🤖 AI-generated sample question papers with answers

📄 Export/download generated papers as PDF

🎨 Modern UI with TailwindCSS

⚡ Built on Next.js 14+ for performance & scalability

🔍 OCR & document parsing (PDF, Word, Excel) support

📊 Smart question categorization & randomization

### 🛠️ Tech Stack

Framework: Next.js
 (React 18+)

Styling: TailwindCSS

AI Models: OpenAI
 API integration

PDF Generation: pdf-lib, jspdf, html2canvas

File Parsing: pdf-parse, mammoth, xlsx, tesseract.js

Backend Tools: Node.js, Multer (file upload), Sharp (image processing)

TypeScript: For type safety

### ⚙️ Installation

Clone the repo

git clone https://github.com/GajendraSingh33/smart-prep.git
cd smart-prep


Install dependencies

npm install


Set up environment variables
Create a .env.local file in the root and add:

OPENAI_API_KEY=your_api_key_here


Run development server

npm run dev


Open http://localhost:3000
 in your browser 🚀

### 📂 Project Structure
smart-prep/
│
├── app/               # Next.js App Router pages
├── components/        # Reusable UI components
├── lib/               # Utility functions
├── utils/             # Helpers & processing scripts
├── public/            # Static assets
├── styles/            # TailwindCSS & global styles
├── tsconfig.json      # TypeScript config
└── package.json       # Project dependencies

### 📖 Usage

Upload your syllabus and previous question papers

Generate custom question papers with answers

Download as PDF for offline use

Practice smarter, not harder 🎯

### 📦 Deployment

The recommended way to deploy is via Vercel
:

vercel


Alternatively, you can deploy on platforms like Netlify, AWS, or Docker.

### 🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch: git checkout -b feature-name

Commit changes: git commit -m 'Add new feature'

Push to branch: git push origin feature-name

Open a Pull Request


### 🌟 Acknowledgements

Next.js

OpenAI

TailwindCSS

All contributors and supporters 🙌
