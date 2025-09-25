import { generateVideoScript } from './gemini';

export interface VideoGenerationConfig {
  provider: 'runway' | 'pika' | 'luma' | 'local';
  quality: 'low' | 'medium' | 'high';
  duration: number; // seconds
}

export interface GeneratedVideo {
  id: string;
  url: string;
  thumbnail: string;
  duration: number;
  status: 'generating' | 'completed' | 'failed';
  createdAt: Date;
}

export interface VideoScene {
  prompt: string;
  duration: number;
  order: number;
}

// Free video generation using multiple providers
export class FreeVideoGenerator {
  private runwayCredits: number = 125; // Monthly free credits
  private pikaCredits: number = 30;    // Daily free credits
  private lumaCredits: number = 20;    // Free tier

  async generateCookingVideo(recipe: any): Promise<GeneratedVideo> {
    try {
      // Step 1: Generate video script using Gemini (already implemented)
      console.log('Generating video script with Gemini...');
      const script = await generateVideoScript(recipe);
      
      // Step 2: Choose best free provider based on available credits
      const provider = this.chooseBestProvider();
      
      // Step 3: Generate video scenes
      console.log(`Generating video with ${provider}...`);
      const videoScenes = await this.generateScenes(script.scenes, provider);
      
      // Step 4: Generate voiceover (FREE)
      console.log('Generating voiceover...');
      const voiceover = await this.generateVoiceover(script.narration);
      
      // Step 5: Combine everything
      console.log('Combining video and audio...');
      const finalVideo = await this.combineVideoAndAudio(videoScenes, voiceover);
      
      return {
        id: this.generateVideoId(),
        url: finalVideo.url,
        thumbnail: finalVideo.thumbnail,
        duration: parseInt(script.duration),
        status: 'completed',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error('Failed to generate cooking video');
    }
  }

  private chooseBestProvider(): 'runway' | 'pika' | 'luma' {
    // Smart provider selection based on available credits
    if (this.runwayCredits > 10) return 'runway';
    if (this.pikaCredits > 5) return 'pika';
    if (this.lumaCredits > 3) return 'luma';
    
    // Fallback to runway (reset monthly)
    return 'runway';
  }

  private async generateScenes(scenes: string[], provider: string): Promise<string[]> {
    const videoUrls: string[] = [];
    
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      console.log(`Generating scene ${i + 1}/${scenes.length}: ${scene}`);
      
      try {
        let videoUrl;
        switch (provider) {
          case 'runway':
            videoUrl = await this.generateWithRunway(scene);
            this.runwayCredits -= 5; // Estimated cost
            break;
          case 'pika':
            videoUrl = await this.generateWithPika(scene);
            this.pikaCredits -= 1;
            break;
          case 'luma':
            videoUrl = await this.generateWithLuma(scene);
            this.lumaCredits -= 1;
            break;
          default:
            throw new Error('Unknown provider');
        }
        
        videoUrls.push(videoUrl);
        
        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(`Failed to generate scene with ${provider}, trying fallback...`);
        // Could implement fallback to another provider here
        throw error;
      }
    }
    
    return videoUrls;
  }

  private async generateWithRunway(prompt: string): Promise<string> {
    // Runway ML API integration
    const apiKey = import.meta.env.VITE_RUNWAY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Runway API key not configured');
    }

    const response = await fetch('https://api.runwayml.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `${prompt}, professional cooking video, 4K quality, cinematic lighting, Indian kitchen`,
        duration: 4, // 4-second clips
        aspect_ratio: '16:9',
        quality: 'high'
      })
    });

    if (!response.ok) {
      throw new Error('Runway generation failed');
    }

    const result = await response.json();
    
    // Poll for completion
    return await this.pollForCompletion(result.id, 'runway');
  }

  private async generateWithPika(prompt: string): Promise<string> {
    // Pika Labs API integration (when available)
    // For now, return placeholder
    console.log('Pika generation:', prompt);
    
    // Simulate video generation time
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    // Return placeholder video URL
    return `https://placeholder-video.com/cooking-${Date.now()}.mp4`;
  }

  private async generateWithLuma(prompt: string): Promise<string> {
    // Luma Dream Machine API integration
    console.log('Luma generation:', prompt);
    
    // Simulate video generation time
    await new Promise(resolve => setTimeout(resolve, 20000));
    
    // Return placeholder video URL
    return `https://placeholder-video.com/luma-${Date.now()}.mp4`;
  }

  private async generateVoiceover(narration: string): Promise<string> {
    try {
      // Use ElevenLabs free tier
      const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
      
      if (!apiKey) {
        // Fallback to browser speech synthesis (FREE)
        return await this.generateBrowserVoiceover(narration);
      }

      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: narration,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error('ElevenLabs generation failed');
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.warn('ElevenLabs failed, using browser TTS:', error);
      return await this.generateBrowserVoiceover(narration);
    }
  }

  private async generateBrowserVoiceover(text: string): Promise<string> {
    // Browser-based text-to-speech (completely FREE)
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use Indian English voice if available
      const voices = speechSynthesis.getVoices();
      const indianVoice = voices.find(voice => 
        voice.lang.includes('en-IN') || voice.name.includes('Indian')
      );
      
      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      speechSynthesis.speak(utterance);
      
      utterance.onend = () => {
        // Return placeholder audio URL (in real implementation, record the speech)
        resolve(`data:audio/mp3;base64,placeholder`);
      };
    });
  }

  private async combineVideoAndAudio(videoUrls: string[], audioUrl: string): Promise<{url: string, thumbnail: string}> {
    // In a real implementation, this would use FFmpeg to combine videos
    // For now, return the first video as placeholder
    
    console.log('Combining videos:', videoUrls);
    console.log('Adding audio:', audioUrl);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    return {
      url: videoUrls[0] || 'https://placeholder-video.com/final-recipe.mp4',
      thumbnail: 'https://placeholder-image.com/thumbnail.jpg'
    };
  }

  private async pollForCompletion(taskId: string, provider: string): Promise<string> {
    // Poll the API until video is ready
    for (let i = 0; i < 30; i++) { // Max 5 minutes
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      // Check status (implementation depends on provider)
      const status = await this.checkTaskStatus(taskId, provider);
      
      if (status.completed) {
        return status.videoUrl;
      }
      
      if (status.failed) {
        throw new Error('Video generation failed');
      }
    }
    
    throw new Error('Video generation timeout');
  }

  private async checkTaskStatus(taskId: string, provider: string): Promise<{completed: boolean, failed: boolean, videoUrl?: string}> {
    // Implementation depends on the provider's API
    // For now, simulate completion after 30 seconds
    return {
      completed: true,
      failed: false,
      videoUrl: `https://generated-video.com/${taskId}.mp4`
    };
  }

  private generateVideoId(): string {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public method to check remaining credits
  getAvailableCredits() {
    return {
      runway: this.runwayCredits,
      pika: this.pikaCredits,
      luma: this.lumaCredits
    };
  }
}

// Export singleton instance
export const freeVideoGenerator = new FreeVideoGenerator();
