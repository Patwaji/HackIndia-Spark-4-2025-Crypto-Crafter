import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Download, Share2, Clock, Zap } from 'lucide-react';
import { freeVideoGenerator, GeneratedVideo } from '@/lib/videoGeneration';

interface VideoGeneratorProps {
  recipe: any;
  onVideoGenerated?: (video: GeneratedVideo) => void;
}

export default function VideoGenerator({ recipe, onVideoGenerated }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVideo = async () => {
    console.log('Generating video for recipe:', recipe);
    setIsGenerating(true);
    setProgress(0);
    setCurrentStep('Starting...');
    setError(null);
    
    try {
      const video = await freeVideoGenerator.generateCookingVideo(
        recipe,
        {},
        (progress) => {
          setCurrentStep(progress.step);
          setProgress(progress.progress);
        }
      );
      
      setProgress(100);
      setCurrentStep('Video ready!');
      setGeneratedVideo(video);
      onVideoGenerated?.(video);
      
    } catch (err) {
      console.error('Video generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateVideo();
  }, []);

  const credits = freeVideoGenerator.getAvailableCredits();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5 text-primary" />
          AI Video Recipe Generator
          <Badge variant="secondary" className="ml-auto">
            <Zap className="h-3 w-3 mr-1" />
            FREE
          </Badge>
        </CardTitle>
        
        {/* Credits Display */}
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span>Credits: Runway({credits.runway}) • Pika({credits.pika}) • Luma({credits.luma})</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isGenerating && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Generating Your Video Recipe</h3>
              <p className="text-sm text-muted-foreground mb-4">{currentStep}</p>
              
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">What's happening:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ AI analyzing your recipe</li>
                <li>✓ Creating cinematic cooking scenes</li>
                <li>✓ Generating professional voiceover</li>
                <li>✓ Combining video and audio</li>
              </ul>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Estimated time: 30-60 seconds
            </div>
          </div>
        )}

        {generatedVideo && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-green-600 mb-2">
                🎉 Video Generated Successfully!
              </h3>
            </div>

            {/* Video Preview */}
            <div className="relative bg-black rounded-lg aspect-video">
              <video 
                controls 
                className="w-full h-full rounded-lg"
                poster={generatedVideo.thumbnail}
              >
                <source src={generatedVideo.url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
              
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {generatedVideo.duration}s
              </div>
            </div>

            {/* Video Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                onClick={generateVideo} 
                variant="outline"
                disabled={credits.runway === 0 && credits.pika === 0}
              >
                Generate Another
              </Button>
            </div>

            {/* Video Details */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Generated:</span>
                  <span className="ml-2">{generatedVideo.createdAt.toLocaleTimeString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="ml-2">4K Ultra HD</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="ml-2">Free AI Tools</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="ml-2 text-green-600">₹0 (Free)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4">
            <div className="text-red-600">
              <h3 className="font-semibold">Generation Failed</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            
            <Button 
              onClick={generateVideo} 
              variant="outline"
              disabled={credits.runway === 0 && credits.pika === 0}
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
