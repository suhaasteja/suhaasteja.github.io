import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchWakaTimeData() {
    const outputPath = path.join(__dirname, '../src/data/coding.json');
    const apiKey = process.env.WAKATIME_API_KEY;

    if (!apiKey) {
        console.warn('⚠️ WAKATIME_API_KEY is missing. Skipping WakaTime data fetch.');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            // Create dummy data compatible with TechStats
            fs.writeFileSync(outputPath, JSON.stringify({ languages: [], total_seconds: 0, human_readable_total: '0 hrs', source: "Mock" }, null, 2));
            console.log('Created dummy coding.json');
        }
        return;
    }

    try {
        // WakaTime API requires base64 encoded API key
        const encodedKey = Buffer.from(apiKey).toString('base64');

        const response = await axios.get('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
            headers: {
                Authorization: `Basic ${encodedKey}`
            }
        });

        const data = response.data.data;
        const stats = {
            languages: data.languages.slice(0, 3).map(l => ({ name: l.name, percent: l.percent })),
            total_seconds: data.total_seconds,
            human_readable_total: data.human_readable_total
        };

        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));
        console.log('WakaTime data saved!');
    } catch (error) {
        console.error('Error fetching WakaTime data:', error);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify({ languages: [], total_seconds: 0, human_readable_total: '0 hrs' }, null, 2));
        }
    }
}

fetchWakaTimeData();
