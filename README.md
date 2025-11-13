# Keyan Python IDE

A powerful, web-based Python IDE simulator built with React and TypeScript. It features a modern, themeable interface, a multi-file code editor, a realistic execution console, and a suite of intelligent tools powered by the Google Gemini API. This project serves as a demonstration of how to build a complex, feature-rich web application.

## ✨ Features

### Core IDE Functionality
*   **💻 Multi-File Editor**: Work with multiple Python files in a clean, tabbed interface.
*   **🎨 Syntax Highlighting**: A custom, regex-based syntax highlighter for Python makes code easy to read.
*   **▶️ Execution Console**: Simulate running your Python scripts and view their output, including print statements and errors.
*   **📦 PIP Package Manager**: A user-friendly modal to simulate installing and uninstalling Python packages.
*   **🖼️ Floating Preview Window**: A draggable and resizable window to simulate the output of web frameworks like Flask or Django.
*   **📂 File Management**:
    *   **Upload/Download**: Easily move files between your local machine and the IDE.
    *   **Rename Files**: Double-click on a file tab to rename it on the fly.
    *   **Add/Close Files**: A fluid and intuitive tab management experience.
*   **💾 Persistent Sessions**: Your files, code, and active tab are automatically saved to your browser's local storage.
*   **🌗 Light/Dark Mode**: Switch between themes for your comfort.

### 🧠 Gemini AI Integration
*   **Explain Code**: Get a detailed, easy-to-understand explanation of your code, broken down into logical parts.
*   **Add Docstrings**: Automatically generate professional, Google-style docstrings for your functions and classes to improve code documentation.
*   **Refactor Code**: Let Gemini analyze and rewrite your code for improved readability, efficiency, and adherence to best practices.
*   **Format Code (Coming Soon)**: Automatically format your code to follow PEP 8 standards.

## 🛠️ Technology Stack
*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)

## 🚀 Deployment to Vercel

To deploy this application, we recommend using [Vercel](https://vercel.com/), a platform for frontend developers that provides seamless deployments from your Git repository.

### Step 1: Push Your Code to a Git Repository

If you haven't already, push your project code to a GitHub, GitLab, or Bitbucket repository.

### Step 2: Import Project on Vercel

1.  Sign up for a free Vercel account and log in.
2.  From your Vercel dashboard, click **Add New...** -> **Project**.
3.  Import the Git repository you created in the previous step.
4.  Vercel will typically auto-detect that this is a React project and configure the build settings for you. You can leave these as the defaults.

### Step 3: Configure Environment Variable

The AI features in this IDE require a Google Gemini API key. You must provide this key to your Vercel project.

1.  In the "Configure Project" screen, expand the **Environment Variables** section.
2.  Add a new variable:
    *   **Name**: `API_KEY`
    *   **Value**: Paste your Google Gemini API key here.
3.  Click **Add** to save the variable.

**Important**: This key is stored securely on Vercel and is necessary for the "Explain Code" and other AI-powered features to function.

### Step 4: Deploy

Click the **Deploy** button. Vercel will build and deploy your IDE. Once finished, you'll be given a public URL where you can access your live application.

## 💻 How to Use the IDE

### Menu Bar
The top menu bar provides access to all major functions:
*   **PIP**: Opens the package manager to simulate installing/uninstalling libraries.
*   **Upload/Download**: Import a `.py` file from your computer or download the code from the active tab.
*   **AI Tools (Explain, Docstrings, Refactor)**: Use these buttons to send the code from the active editor to the Gemini API for analysis or generation.
*   **Theme Toggle**: Switch between light and dark modes.
*   **Toggle Preview**: Show or hide the floating preview window.
*   **Run**: Executes the code in the active editor and displays the output in the console.

### Editor and File Tabs
*   **Writing Code**: The main area is your editor with Python syntax highlighting.
*   **Managing Files**:
    *   Click the `+` button in the tab bar to create a new file.
    *   Click on a tab to switch to that file.
    *   Double-click a file's name in its tab to rename it. Press `Enter` to save or `Esc` to cancel.
    *   Click the `x` icon on a tab to close the file.

### Console
The console panel shows the results of your actions:
*   `>`: Indicates a command you initiated, like running a file or installing a package.
*   Green Text: Represents the standard output from your script (e.g., from a `print()` statement).
*   Red Text: Shows error messages, such as syntax errors or missing modules.
*   **AI:**: Displays responses from the Gemini-powered features.