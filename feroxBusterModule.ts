import dotenv from 'dotenv';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import unzipper from 'unzipper';
import * as readline from 'readline';
// import { OpenAI } from 'openai';
import { platform, arch } from 'os';
import { generateHTML } from './generateRepot';

dotenv.config();

class FeroxbusterModule {
     OPENAI_API_KEY: string;
     OPENAI_API_ENDPOINT: string;

    constructor(apiKey: string, apiEndpoint: string) {
        this.OPENAI_API_KEY = apiKey;
        this.OPENAI_API_ENDPOINT = apiEndpoint;
    }

     async downloadFeroxbuster(): Promise<string> {
        const os = platform();
        const architecture = arch();
        let downloadUrl: string;
        let filename = 'feroxbuster';

        switch (os) {
            case 'win32':
                downloadUrl = 'https://github.com/epi052/feroxbuster/releases/latest/download/x86_64-windows-feroxbuster.exe.zip';
                filename = 'feroxbuster.exe';
                break;
            case 'darwin':
                if (architecture === 'arm64') {
                    downloadUrl = 'https://github.com/epi052/feroxbuster/releases/latest/download/aarch64-macos-feroxbuster.zip';
                } else {
                    downloadUrl = 'https://github.com/epi052/feroxbuster/releases/latest/download/x86_64-macos-feroxbuster.zip';
                }
                break;
            case 'linux':
                downloadUrl = 'https://github.com/epi052/feroxbuster/releases/latest/download/x86_64-linux-feroxbuster.zip';
                break;
            default:
                throw new Error(`Unsupported operating system: ${os}`);
        }

        const zipPath = path.join(process.cwd(), 'feroxbuster.zip');
        const response = await axios.get(downloadUrl, { responseType: 'stream' });

        const writer = fs.createWriteStream(zipPath);
        response.data.pipe(writer);

        await new Promise<void>((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return zipPath;
    }

     async unzipFeroxbuster(zipPath: string): Promise<string> {
        const extractPath = process.cwd();
        const osType = platform();
        const executablePath = path.join(extractPath, osType === 'win32' ? 'feroxbuster.exe' : 'feroxbuster');

        try {
            console.log(`Extracting Feroxbuster on ${osType}...`);

            if (osType === 'win32') {
                await fs.createReadStream(zipPath)
                    .pipe(unzipper.Extract({ path: extractPath }))
                    .promise();
            } else {
                execSync(`unzip -o ${zipPath} -d ${extractPath}`, { stdio: 'inherit' });
            }

            console.log('Checking extracted file type...');
            execSync(`file ${executablePath}`, { stdio: 'inherit' });

            if (osType !== 'win32') {
                console.log('Granting execute permissions...');
                execSync(`chmod +x ${executablePath}`);
            }

            fs.unlinkSync(zipPath);
            return executablePath;
        } catch (error) {
            console.error('Error extracting Feroxbuster:', error);
            throw error;
        }
    }

     async runFeroxbuster(url: string, wordlistPath: string, executablePath: string): Promise<void> {
        try {
            console.log('Running Feroxbuster scan...');
            execSync(`chmod +x ${executablePath}`);
            const command = `${executablePath} -u ${url} -w ${wordlistPath} --json -o feroxbuster_report.json --silent`;

            console.log(`Executing command: ${command}`);
            execSync(command, {
                stdio: 'inherit',
                encoding: 'utf8',
            });
        } catch (error) {
            console.error('Error running Feroxbuster:', error);
            throw error;
        }
    }
    private parseJsonFile(filePath: string) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const lines = fileContent.split('\n');
            const results = []
           
            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const parsed = JSON.parse(line.trim());
                        if (parsed) {
                            results.push(parsed);
                        }
                    } catch (parseError) {
                        console.warn(`Warning: Skipping invalid JSON line: ${line.substring(0, 50)}...`);
                    }
                }
            }
     
            const summary = {
                totalRequests: results.length,
                statusCodes: {} as Record<string, number>,
                findings: results.map(result => ({
                    url: result.url || result.target || '',
                    status: result.status_code || result.status || 0,
                    contentLength: result.content_length || result.length || 0,
                    contentType: result.content_type || result.type || '',
                })),
            };
     
            results.forEach(result => {
                const status = result.status_code || result.status || 0;
                summary.statusCodes[status] = (summary.statusCodes[status] || 0) + 1;
            });
     
            return summary;
        } catch (error) {
            console.error('Error reading or parsing JSON file:', error);
            return {
                totalRequests: 0,
                statusCodes: {},
                findings: [],
            };
        }
    }

    async analyzeWithOpenAI(scanData: any): Promise<string> {
        const systemPrompt = 'You are a security expert specializing in analyzing vulnerability scan reports and generating human-readable summaries. Focus on identifying the most relevant findings, categorizing them by severity, and highlighting critical security risks. The output should be in an HTML report format that is visually structured and easy to understand, with sections like Summary, Key Findings, Detailed Results, and Recommendations.';
        const userPrompt = `Please analyze the following Feroxbuster scan results and generate a meaningful HTML report. Include the following sections:

                            Scan Summary:

                            Total number of requests
                            Distribution of status codes (200, 403, 404, etc.)
                            Common content types found
                            Key Findings:

                            Notable URLs with status codes like 200 (successful requests) and 403 (forbidden)
                            Potential sensitive files or directories discovered (e.g., admin panels, backup files)
                            Duplicate or common patterns in the results
                            Detailed Results:

                            A table listing discovered URLs with their status codes, content length, and content type.
                            Recommendations:

                            Suggestions for improving security based on the findings.
                            Example Input: Feroxbuster scan results in JSON format.
                            Example Output: Clean, organized HTML report with meaningful insights and actionable recommendations.
            Total Requests: ${scanData.totalRequests}
            Status Code Distribution: ${JSON.stringify(scanData.statusCodes)}
            Notable Findings: ${scanData.findings.length > 0 ? JSON.stringify(scanData.findings.slice(0, 5)) : 'None'}`;

        const response = await axios.post(this.OPENAI_API_ENDPOINT, {
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
        }, {
            headers: {
                "Content-Type": "application/json",
                "api-key": this.OPENAI_API_KEY,
                "Region": 'eastus2',
            }
        });

        return response.data.choices[0].message.content.trim();
    }

    async scanAndGenerateReports(systemUrl: string, wordlistUrl: string): Promise<void> {
        const wordlistPath = 'common.txt';

        if (!fs.existsSync(wordlistPath)) {
            console.log('Downloading wordlist...');
            const response = await axios.get(wordlistUrl, { responseType: 'text' });
            fs.writeFileSync(wordlistPath, response.data);
            console.log('Wordlist downloaded.');
        }

        const zipPath = await this.downloadFeroxbuster();
        const executablePath = await this.unzipFeroxbuster(zipPath);
        await this.runFeroxbuster(systemUrl, wordlistPath, executablePath);

        const scanData = this.parseJsonFile('feroxbuster_report.json');
        if (scanData.totalRequests === 0) {
            console.error('No valid scan results found!');
            return;
        }

        console.log('Analyzing results...');
        const aiAnalysis = await this.analyzeWithOpenAI(scanData);

        const analysisReport = {
            scanSummary: scanData,
            aiAnalysis,
            generatedAt: new Date().toISOString(),
        };

        fs.writeFileSync('security_analysis.json', JSON.stringify(analysisReport, null, 2));
        console.log('Security analysis JSON report generated');

        const htmlReport = generateHTML(scanData, aiAnalysis);
        fs.writeFileSync('security_analysis.html', htmlReport);
        console.log('Security analysis HTML report generated');
    }
}

export default FeroxbusterModule;
