import { generateVideoScript, VideoScript, Meal } from './gemini';

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
  private async generateWithLuma(prompt: string, quality: string = 'high'): Promise<string> {
    // Luma Dream Machine API integration
    console.log('Luma generation:', prompt);
    // Simulate video generation time
    await new Promise(resolve => setTimeout(resolve, 20000));
    // Return a real sample video URL
    return `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`;
  }
  private runwayCredits: number = 125; // Monthly free credits
  private pikaCredits: number = 30;    // Daily free credits
  private lumaCredits: number = 20;    // Free tier

  async generateCookingVideo(
    recipe: Meal, 
    config?: Partial<VideoGenerationConfig>,
    onProgress?: (progress: { step: string; progress: number }) => void
  ): Promise<GeneratedVideo> {
    try {
      // Step 1: Generate video script using Gemini (new format)
      onProgress?.({ step: 'Generating video script...', progress: 10 });
      console.log('Generating video script with Gemini...');
      const scenesArr: VideoScript = await generateVideoScript(recipe); // Array of scenes

      // Step 2: Choose provider (allow override)
      const provider = config?.provider || this.chooseBestProvider();
      const quality = config?.quality || 'high';

      // Step 3: Generate video scenes (use scene_visual and duration)
      onProgress?.({ step: 'Generating video scenes...', progress: 30 });
      console.log(`Generating video with ${provider}...`);
      const videoScenePrompts = scenesArr.map((scene) => scene.scene_visual);
      const videoUrls = await this.generateScenes(videoScenePrompts, provider, quality, (progress) => {
        onProgress?.({ 
          step: `Generating scene ${progress.current} of ${progress.total}...`, 
          progress: 30 + Math.round((progress.current / progress.total) * 30)
        });
      });

      // Step 4: Generate voiceover (concatenate narrations)
      onProgress?.({ step: 'Generating voiceover...', progress: 60 });
      console.log('Generating voiceover...');
      const narration = scenesArr.map((scene) => scene.narration).join(' ');
      const voiceover = await this.generateVoiceover(narration);

      // Step 5: Combine everything
      onProgress?.({ step: 'Combining video and audio...', progress: 80 });
      console.log('Combining video and audio...');
      const finalVideo = await this.combineVideoAndAudio(videoUrls, voiceover);

      onProgress?.({ step: 'Finalizing... ', progress: 95 });

      // Calculate total duration
      const totalDuration = scenesArr.reduce((sum, scene) => sum + (scene.duration_in_seconds || 0), 0);

      return {
        id: this.generateVideoId(),
        url: finalVideo.url,
        thumbnail: finalVideo.thumbnail,
        duration: totalDuration,
        status: 'completed',
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      if (error instanceof Error) {
        throw new Error(`Video generation failed: ${error.message}`);
      }
      throw new Error('An unknown error occurred during video generation');
    }
  }

  private chooseBestProvider(): 'runway' | 'pika' | 'luma' {
    const runwayApiKey = import.meta.env.VITE_RUNWAY_API_KEY;

    // Smart provider selection based on available credits and API key
    if (runwayApiKey && this.runwayCredits > 10) return 'runway';
    if (this.pikaCredits > 5) return 'pika';
    if (this.lumaCredits > 3) return 'luma';
    
    // Fallback to pika (mocked) if no other provider is available
    return 'pika';
  }

  private async generateScenes(
    scenes: string[], 
    provider: string, 
    quality: string = 'high',
    onProgress?: (progress: { current: number; total: number }) => void
  ): Promise<string[]> {
    const videoUrls: string[] = [];
    for (let i = 0; i < scenes.length; i++) {
      onProgress?.({ current: i + 1, total: scenes.length });
      const scene = scenes[i];
      console.log(`Generating scene ${i + 1}/${scenes.length}: ${scene}`);
      try {
        let videoUrl;
        switch (provider) {
          case 'runway':
            videoUrl = await this.generateWithRunway(scene, quality);
            this.runwayCredits -= 5;
            break;
          case 'pika':
            videoUrl = await this.generateWithPika(scene, quality);
            this.pikaCredits -= 1;
            break;
          case 'luma':
            videoUrl = await this.generateWithLuma(scene, quality);
            this.lumaCredits -= 1;
            break;
          case 'futureai':
            videoUrl = await this.generateWithFutureAI(scene, quality);
            break;
          default:
            throw new Error('Unknown provider');
        }
        videoUrls.push(videoUrl);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(`Failed to generate scene with ${provider}, trying fallback...`);
        throw error; // Re-throw to be caught by the main try-catch block
      }
    }
    return videoUrls;
  }

  private async generateWithRunway(prompt: string, quality: string = 'high'): Promise<string> {
    // Runway ML API integration (bypassed due to CORS)
    console.log('Runway generation (mocked):', prompt);
    // Simulate video generation time
    await new Promise(resolve => setTimeout(resolve, 20000));
    // Return a real sample video URL
    return `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`;
  }

  private async generateWithPika(prompt: string, quality: string = 'high'): Promise<string> {
    // Pika Labs API integration (when available)
    // For now, return placeholder
    console.log('Pika generation:', prompt);
    // Simulate video generation time
    await new Promise(resolve => setTimeout(resolve, 15000));
    // Return a real sample video URL
    return `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`;
  }
  // Placeholder for future providers
  private async generateWithFutureAI(prompt: string, quality: string = 'high'): Promise<string> {
    console.log('FutureAI generation:', prompt);
    await new Promise(resolve => setTimeout(resolve, 10000));
    return `https://placeholder-video.com/futureai-${Date.now()}.mp4`;
  }

  private async generateVoiceover(narration: string): Promise<string> {
    console.warn('ElevenLabs call bypassed, using browser TTS.');
    return await this.generateBrowserVoiceover(narration);
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
    if (provider === 'runway') {
      const apiKey = import.meta.env.VITE_RUNWAY_API_KEY;
      if (!apiKey) throw new Error('Runway API key not configured for polling');

      const response = await fetch(`https://main-api.runwayml.com/v1/tasks/${taskId}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });

      if (!response.ok) {
        console.error(`Failed to check Runway task status for ${taskId}`);
        return { completed: false, failed: true };
      }

      const data = await response.json();
      if (data.status === 'SUCCEEDED') {
        return { completed: true, failed: false, videoUrl: data.outputs.video };
      }
      if (data.status === 'FAILED') {
        return { completed: false, failed: true };
      }
      // Otherwise, it's still processing
      return { completed: false, failed: false };
    }

    // Fallback for other mocked providers
    console.log(`Simulating status check for ${provider} task ${taskId}`);
    return { completed: true, failed: false, videoUrl: `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4` };
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
