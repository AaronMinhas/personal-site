import type { APIRoute } from 'astro';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string; width: number; height: number }>;
  };
  external_urls: {
    spotify: string;
  };
  duration_ms?: number;
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
  progress_ms: number;
}

interface SpotifyRecentTrack {
  track: SpotifyTrack;
  played_at: string;
}

class SpotifyAPI {
  private static accessToken: string | null = null;
  private static tokenExpiry: number | null = null;
  private static refreshToken: string | null = null;
  
  // Cache for API responses
  private static cache: { data: any; expiry: number } | null = null;
  private static readonly CACHE_DURATION = 3000; // 3 seconds cache
  
  private static async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('Missing Spotify credentials');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in * 1000);
    
    // Update refresh token if provided
    if (data.refresh_token) {
      this.refreshToken = data.refresh_token;
    }
  }

  private static async ensureValidToken(): Promise<void> {
    // If no token or expired, try to refresh
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry) {
      // Initialise tokens from environment variables
      if (!this.accessToken) {
        this.accessToken = import.meta.env.SPOTIFY_ACCESS_TOKEN;
        this.refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;
        this.tokenExpiry = import.meta.env.SPOTIFY_TOKEN_EXPIRY ? 
          parseInt(import.meta.env.SPOTIFY_TOKEN_EXPIRY) : 0;
      }
      
      await this.refreshAccessToken();
    }
  }

  private static async makeRequest<T>(endpoint: string): Promise<T | null> {
    await this.ensureValidToken();

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (response.status === 204) {
      return null; // No content
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return await response.json();
  }

  static async getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
    return this.makeRequest<SpotifyCurrentlyPlaying>('/me/player/currently-playing');
  }

  static async getRecentlyPlayed(limit: number = 1): Promise<{ items: SpotifyRecentTrack[] } | null> {
    return this.makeRequest<{ items: SpotifyRecentTrack[] }>(`/me/player/recently-played?limit=${limit}`);
  }

  static async getStatus(): Promise<{
    isPlaying: boolean;
    track: SpotifyTrack | null;
    lastPlayedAt?: string;
    message: string;
    progress_ms?: number;
    duration_ms?: number;
  }> {
    // Check cache first
    if (this.cache && Date.now() < this.cache.expiry) {
      return this.cache.data;
    }

    try {
      // Check current playing
      const currentlyPlaying = await this.getCurrentlyPlaying();
      
      if (currentlyPlaying && currentlyPlaying.is_playing && currentlyPlaying.item) {
        const result = {
          isPlaying: true,
          track: currentlyPlaying.item,
          progress_ms: currentlyPlaying.progress_ms || 0,
          duration_ms: currentlyPlaying.item.duration_ms || 180000, // fallback to 3 minutes
          message: `♫ Aaron is listening to: ${currentlyPlaying.item.name} by ${currentlyPlaying.item.artists.map(a => a.name).join(', ')}`
        };
        
        // Cache the result
        this.cache = {
          data: result,
          expiry: Date.now() + this.CACHE_DURATION
        };
        
        return result;
      }

      // Get recent tracks
      const recentlyPlayed = await this.getRecentlyPlayed(1);
      
      if (recentlyPlayed && recentlyPlayed.items.length > 0) {
        const lastTrack = recentlyPlayed.items[0];
        const playedAt = new Date(lastTrack.played_at);
        const now = new Date();
        const diffMs = now.getTime() - playedAt.getTime();
        
        let timeAgo: string;
        if (diffMs < 60000) {
          timeAgo = 'just now';
        } else if (diffMs < 3600000) {
          const minutes = Math.floor(diffMs / 60000);
          timeAgo = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffMs < 86400000) {
          const hours = Math.floor(diffMs / 3600000);
          timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(diffMs / 86400000);
          timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        const result = {
          isPlaying: false,
          track: lastTrack.track,
          lastPlayedAt: lastTrack.played_at,
          progress_ms: lastTrack.track.duration_ms || 180000, // Show full duration for completed tracks
          duration_ms: lastTrack.track.duration_ms || 180000,
          message: `♫ Aaron last played: ${lastTrack.track.name} by ${lastTrack.track.artists.map(a => a.name).join(', ')} (${timeAgo})`
        };
        
        // Cache the result (longer cache for non-playing status)
        this.cache = {
          data: result,
          expiry: Date.now() + (this.CACHE_DURATION * 3) // 9 seconds for non-playing
        };
        
        return result;
      }

      const result = {
        isPlaying: false,
        track: null,
        message: 'No recent Spotify activity found'
      };
      
      // Cache the result (longer cache for no activity)
      this.cache = {
        data: result,
        expiry: Date.now() + (this.CACHE_DURATION * 5) // 15 seconds for no activity
      };
      
      return result;

    } catch (error) {
      console.error('Spotify API error:', error);
      return {
        isPlaying: false,
        track: null,
        message: 'Unable to fetch Spotify data at the moment'
      };
    }
  }
}

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const status = await SpotifyAPI.getStatus();
    
    return new Response(JSON.stringify({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3, s-maxage=3, stale-while-revalidate=10',
        'CDN-Cache-Control': 'max-age=3',
        'Cloudflare-CDN-Cache-Control': 'max-age=3, stale-while-revalidate=10',
        'Vary': 'Accept'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch Spotify data',
      data: {
        isPlaying: false,
        track: null,
        message: 'Spotify data temporarily unavailable'
      }
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
