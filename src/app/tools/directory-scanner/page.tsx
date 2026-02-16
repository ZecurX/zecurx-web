import { Metadata } from 'next';
import DirectoryScannerClient from './DirectoryScannerClient';

export const metadata: Metadata = {
    title: 'Directory Scanner | ZecurX',
    description: 'Scan websites for hidden directories and files. Discover exposed admin panels, backup files, and sensitive endpoints.',
    keywords: ['directory scanner', 'directory brute force', 'hidden files', 'cybersecurity', 'ZecurX'],
};

export default function DirectoryScannerPage() {
    return <DirectoryScannerClient />;
}
