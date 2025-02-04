import FeroxbusterModule from './feroxBusterModule';
/**
 * Runs a security scan on the provided URL using Feroxbuster, analyzes the results with AI, 
 * and generates both JSON and HTML reports.
 *
 * @param {string} systemUrl - The URL of the target system to be scanned.
 *        Example: 'https://example.com'
 * 
 * @param {string} wordlistUrl - The URL of the wordlist to be used for the scan. 
 *        This wordlist helps identify common paths and files in the target system.
 *        Example: 'https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt'
 * 
 * @param {string} apiKey - The API key for authenticating with the AI service.
 *        This is required for generating AI-based insights in the security report.
 *        Example: 'sk-xxxxxx12345'
 * 
 * @param {string} apiEndpoint - The endpoint URL of the AI service (e.g., OpenAI API).
 *        This is where the AI analysis requests are sent.
 *        Example: 'https://api.openai.com/v1/completions'
 * 
 * @returns {Promise<void>} - This method does not return a value but generates two output files:
 *        1. `security_analysis.json`: Contains the scan summary and AI-generated insights.
 *        2. `security_analysis.html`: A human-readable report with detailed findings.
 * 
 * @throws Will throw an error if the scan fails, the wordlist cannot be downloaded, 
 *         or the AI analysis encounters an issue.
 * 
 * @example
 * const wordlistUrl = 'https://raw.githubusercontent.com/.../common.txt';
 * const apiKey = 'sk-xxxxxx12345';
 * const apiEndpoint = 'https://api.openai.com/v1/completions';
 * const systemUrl = 'https://example.com';
 * await module.scanAndGenerateReports('https://example.com', wordlistUrl, apiKey, apiEndpoint);
 */

export async function scanAndGenerateReports(apiKey: string, apiEndpoint: string, systemUrl: string, wordlistUrl: string) {
    const module = new FeroxbusterModule(apiKey, apiEndpoint);
    return module.scanAndGenerateReports(systemUrl, wordlistUrl);
}

export { FeroxbusterModule };  // Named export for the class
export default FeroxbusterModule;  // Default export
