
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import * as faceapi from 'face-api.js';

interface CelebrityData {
  name: string;
  imageUrl: string;
  embedding: number[];
}

const CelebrityEmbeddingGenerator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CelebrityData[]>([]);
  const { toast } = useToast();

  const processCelebrityImages = async () => {
    setIsProcessing(true);
    const embeddings: CelebrityData[] = [];
    
    // This would be your list of celebrity images
    const celebrityImages = [
      { name: "Chris Hemsworth", url: "path/to/chris.jpg" },
      { name: "Emma Stone", url: "path/to/emma.jpg" },
      // Add more celebrities here
    ];

    try {
      for (const celeb of celebrityImages) {
        try {
          const img = await faceapi.fetchImage(celeb.url);
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (detection) {
            embeddings.push({
              name: celeb.name,
              imageUrl: celeb.url,
              embedding: Array.from(detection.descriptor)
            });
          }
        } catch (error) {
          console.error(`Error processing ${celeb.name}:`, error);
        }
      }

      setResults(embeddings);
      toast({
        title: "Processing Complete",
        description: `Generated embeddings for ${embeddings.length} celebrities`,
      });
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process celebrity images",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadEmbeddings = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'celebrity_embeddings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Celebrity Embedding Generator</h2>
      <p className="text-muted-foreground mb-6">
        This tool helps generate face embeddings for celebrity images. 
        Replace the image URLs in the code with your actual celebrity photos.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={processCelebrityImages}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Generate Embeddings"}
        </Button>
        
        {results.length > 0 && (
          <>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Generated {results.length} embeddings</p>
              <ul className="text-sm text-muted-foreground mt-2">
                {results.map((result, index) => (
                  <li key={index}>{result.name} ✓</li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={downloadEmbeddings}
              variant="outline"
              className="w-full"
            >
              Download Embeddings JSON
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CelebrityEmbeddingGenerator;
