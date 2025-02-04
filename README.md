<p align="center">
  <img src="https://raw.githubusercontent.com/triconinfotech/nilgiri/main/files/nilgiri.PNG" alt="Nilgiri Logo" width="200"/>
</p>
<h1 align="center">Nilgiri Framework</h1>
<p align="center">
    <!-- NPM badges -->
    <a href="https://npmjs.com/package/create-nilgiriperformance">
        <img src="https://img.shields.io/npm/v/create-nilgiriperformance.svg" alt="npm version">
    </a>
    <a href="https://npmjs.com/package/create-nilgiriperformance">
        <img src="https://img.shields.io/npm/dm/create-nilgiriperformance.svg" alt="npm downloads">
    </a>
    <a href="https://github.com/bhuvaneshp2998/Performance-nilgiri/blob/main/LICENSE.txt">
        <img src="https://img.shields.io/npm/l/create-nilgiriperformance.svg" alt="license">
    </a>
</p>

## nilgiri-security : A Core Component of the Nilgiri Framework

The `nilgiri-security` module leverages the power of Feroxbuster for web security scanning and integrates AI-driven insights for advanced analysis. It simplifies security testing by scanning target URLs for common vulnerabilities and generating detailed reports in both JSON and HTML formats. With AI-generated insights, it highlights critical findings such as unauthorized access points and injection vulnerabilities, helping teams strengthen their application security. Perfect for teams aiming to automate, analyze, and enhance their security testing workflows with ease.  




<h1 align="center">How to Setup ?</h1>

Before we go to Setup Lets See what are the prerequisites 
### Prerequisites

1. **Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed.
2. **IDE**: This project is written in TypeScript, so you'll need to IDE Which Supports NodeJs, For Example : VScode , Intelli ,Etc.
4. **AI API Key and EndPoint**: This Project is AI-driven,Hence User are requested to get ready with AI API Auth Key and End Point .

## Setup : Install and Run

1.**Install Depencency**:

   ```bash
   npm install nilgiri-security --save -d
   ```
2.**Import the `scanAndGenerateReports` method from nilgiridemorepo**:

   ```bash
   const { scanAndGenerateReports } = require('nilgiridemorepo');
   ```

3.**Call `scanAndGenerateReports` with the required parameters:**:
   ```bash
    const systemUrl = 'https://example.com';  // The URL to scan
    const wordlistUrl = 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt';  
    const apiKey = 'sk-xxxxxx12345';  // Your AI service API key  
    const apiEndpoint = 'https://api.openai.com/v1/completions';  // Your AI service endpoint  

    scanAndGenerateReports(systemUrl, wordlistUrl, apiKey, apiEndpoint)
    .then(() => console.log('Scan completed! Reports generated in the current directory.'))
    .catch(err => console.error('Error:', err));

   ```

### Parameters

| Parameter       | Type   | Description                                                                 | Example                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| `systemUrl`     | string | The URL of the target system to be scanned.                                 | `'https://example.com'`                                                  |
| `wordlistUrl`   | string | The URL of the wordlist to be used for the scan. Helps identify common paths and files in the target system. | `'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt'` |
| `apiKey`        | string | The API key for authenticating with the AI service. This is required for generating AI-based insights in the security report. | `'sk-xxxxxx12345'`                                                      |
| `apiEndpoint`   | string | The endpoint URL of the AI service (e.g., OpenAI API). This is where the AI analysis requests are sent. | `'https://api.openai.com/v1/completions'`                               |



<h1 align="center">How to Run the Application ?</h1>

**Running the Application**

To run the scanAndGenerateReports method, you need to import and call the method in your script.

Example: `testFile.ts`

```bash
import { scanAndGenerateReports } from 'nilgiridemorepo';  

scanAndGenerateReports(
    'YourAIAPIKey', 
    'https://YourAIEndPoint', 
    'https://YourSystemUnderTestURL/', 
    'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt'
  )
    .then(() => console.log('Scan completed and reports generated!'))
    .catch(err => console.error('Error during scanning:', err));

``` 
**Run the File**

If you’re using Node.js, you can run the file by executing the following command in your terminal:
```bash
node <your-file-name>.js
```
#### If you are running your file in Type Script then follow this Step 

### Prerequisites
1. Ensure you have **Node.js** and **TypeScript** installed on your machine.
   - You can download Node.js from [here](https://nodejs.org/).
   - To install TypeScript globally, run the following command:
     ```bash
     npm install -g typescript
     ```

### Steps to Run

1. **Compile the TypeScript file**:
   In your terminal, navigate to the project folder and run the following command to compile the TypeScript file:
   ```bash
   tsc <your-file-name>.ts
   node <your-file-name>.js
   ```
<h1 align="center">How Report Looks like ?</h1>

* Please Add your Report Snippet in GIF format 

## Features

- Scans a target URL for potential security issues using the **Feroxbuster** tool.
- Downloads and unzips the **Feroxbuster** executable based on the system's OS (Windows, macOS, Linux).
- Supports customizable wordlist URLs to scan common paths and files.
- Generates two types of reports:
  - **JSON Report**: Contains detailed findings and scan summary.
  - **HTML Report**: A human-readable report with comprehensive security analysis.
- Integrates with AI to analyze the scan results and generate actionable insights for security improvements.
- Automates the process of scanning, analyzing, and reporting, reducing manual effort.


## Support 
* For any Support please feel free to drop your query at 
*   [nilgiri-security GitHub repository](https://github.com/bhuvaneshp2998/Performance-nilgiri/issues).

Thank you for choosing `nilgiri-security` as part of the Nilgiri framework for your Node.js utility needs!
<p align="center">
    Copyright (c) 2025 Tricon Infotech
</p>