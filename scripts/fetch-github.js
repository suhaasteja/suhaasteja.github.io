require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchGitHubData() {
    const token = process.env.GH_TOKEN;
    const reposPath = path.join(__dirname, '../src/data/github-repos.json');
    const codingPath = path.join(__dirname, '../src/data/coding.json'); // Fallback for coding stats if needed

    if (!token) {
        console.warn('⚠️ GH_TOKEN is missing. Skipping GitHub data fetch.');

        // Ensure dummy data exists so build doesn't fail
        if (!fs.existsSync(reposPath)) {
            fs.mkdirSync(path.dirname(reposPath), { recursive: true });
            fs.writeFileSync(reposPath, JSON.stringify([], null, 2));
            console.log('Created dummy github-repos.json');
        }

        // If coding.json is also missing (and wakatime skipped), create it too
        if (!fs.existsSync(codingPath)) {
            fs.mkdirSync(path.dirname(codingPath), { recursive: true });
            fs.writeFileSync(codingPath, JSON.stringify({ languages: [], source: "GitHub (Mock)" }, null, 2));
        }
        return;
    }

    try {
        const query = `
        {
            viewer {
                login
                repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
                    nodes {
                        name
                        description
                        url
                        stargazerCount
                        forkCount
                        primaryLanguage {
                            name
                        }
                        languages(first: 10) {
                            edges {
                                size
                                node {
                                    name
                                    color
                                }
                            }
                        }
                    }
                }
            }
        }
        `;

        const response = await axios.post('https://api.github.com/graphql', { query }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const nodes = response.data.data.viewer.repositories.nodes;

        // Process Repos (Top 6 by stars/recent)
        // We fetched 10 recent, let's just take top 6 from there or sort by stars if we want
        // The query sorts by UPDATED_AT, which is good for "active" projects.
        const repos = nodes.slice(0, 6).map(repo => ({
            name: repo.name,
            description: repo.description,
            html_url: repo.url,
            stargazers_count: repo.stargazerCount,
            forks_count: repo.forkCount,
            language: repo.primaryLanguage ? repo.primaryLanguage.name : 'N/A'
        }));

        // Calculate Language Stats
        const languageMap = {};
        let totalSize = 0;

        nodes.forEach(repo => {
            if (repo.languages && repo.languages.edges) {
                repo.languages.edges.forEach(edge => {
                    const name = edge.node.name;
                    const size = edge.size;
                    if (!languageMap[name]) {
                        languageMap[name] = { size: 0, color: edge.node.color };
                    }
                    languageMap[name].size += size;
                    totalSize += size;
                });
            }
        });

        const languages = Object.entries(languageMap)
            .map(([name, data]) => ({
                name,
                percent: totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : 0,
                color: data.color
            }))
            .sort((a, b) => b.percent - a.percent)
            .slice(0, 5); // Top 5 languages

        // Save Repos
        fs.mkdirSync(path.dirname(reposPath), { recursive: true });
        fs.writeFileSync(reposPath, JSON.stringify(repos, null, 2));
        console.log('GitHub repos saved!');

        // Save Coding Stats (replacing WakaTime structure but keeping compatible fields if needed)
        // TechStats expects: { languages: [{name, percent}], human_readable_total }
        // We don't have time tracked, so we'll omit human_readable_total or put something else.
        const codingStats = {
            languages: languages,
            source: "GitHub"
        };

        fs.writeFileSync(codingPath, JSON.stringify(codingStats, null, 2));
        console.log('GitHub language stats saved!');

        // Save Last Updated
        const lastUpdatedPath = path.join(__dirname, '../src/data/last-updated.json');
        fs.writeFileSync(lastUpdatedPath, JSON.stringify({ timestamp: new Date().toISOString() }, null, 2));

    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // Fallback is handled by dummy data existence or previous run
    }
}

fetchGitHubData();
