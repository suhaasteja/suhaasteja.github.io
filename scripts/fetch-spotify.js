require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const path = require('path');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

async function fetchSpotifyData() {
    try {
        const data = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(data.body['access_token']);

        const topTracks = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'short_term' });
        
        const tracks = topTracks.body.items.map(track => ({
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            albumArtUrl: track.album.images[0].url,
            externalUrl: track.external_urls.spotify
        }));

        const outputPath = path.join(__dirname, '../src/data/spotify.json');
        // Ensure directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(tracks, null, 2));
        console.log('Spotify data saved!');
    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        // Fallback or empty array to prevent build failure
        const outputPath = path.join(__dirname, '../src/data/spotify.json');
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
        }
    }
}

fetchSpotifyData();
