import FeroxbusterModule from './feroxBusterModule';

export async function scanAndGenerateReports(apiKey: string, apiEndpoint: string, systemUrl: string, wordlistUrl: string) {
    const module = new FeroxbusterModule(apiKey, apiEndpoint);
    return module.scanAndGenerateReports(systemUrl, wordlistUrl);
}

export { FeroxbusterModule };  // Named export for the class
export default FeroxbusterModule;  // Default export
