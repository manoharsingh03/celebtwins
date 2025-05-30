
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import * as faceapi from 'face-api.js';
import { loadFaceApiModels } from '@/lib/faceMatching';

interface CelebrityData {
  id: string;
  name: string;
  imageUrl: string;
  embedding: number[];
}

const CelebrityEmbeddingGenerator = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [results, setResults] = useState<CelebrityData[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentCeleb, setCurrentCeleb] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initializeModels = async () => {
    try {
      await loadFaceApiModels();
      setModelsLoaded(true);
      toast({
        title: "Models Loaded",
        description: "Face recognition models are ready. You can now process celebrity images.",
      });
    } catch (error) {
      toast({
        title: "Model Loading Failed",
        description: "Failed to load face recognition models. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const processCelebrityImages = async (files: FileList) => {
    if (!modelsLoaded) {
      toast({
        title: "Models Not Ready",
        description: "Please initialize the models first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const embeddings: CelebrityData[] = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
      
      setCurrentCeleb(fileName);
      setProgress((i / total) * 100);

      try {
        // Create image element from file
        const imageUrl = URL.createObjectURL(file);
        const img = await faceapi.fetchImage(imageUrl);
        
        // Detect face and get descriptor
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          embeddings.push({
            id: (i + 1).toString(),
            name: fileName,
            imageUrl: imageUrl,
            embedding: Array.from(detection.descriptor)
          });
          console.log(`✅ Processed ${fileName} (${i + 1}/${total})`);
        } else {
          console.warn(`⚠️ No face detected for ${fileName}`);
        }

        // Clean up the object URL
        URL.revokeObjectURL(imageUrl);
      } catch (error) {
        console.error(`❌ Error processing ${fileName}:`, error);
      }
    }

    setResults(embeddings);
    setProgress(100);
    setCurrentCeleb('');
    setIsProcessing(false);

    toast({
      title: "Processing Complete",
      description: `Generated embeddings for ${embeddings.length} out of ${total} celebrities`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processCelebrityImages(files);
    }
  };

  const downloadEmbeddings = () => {
    // Create a simplified dataset for the main app
    const dataset = results.map(result => ({
      id: result.id,
      name: result.name,
      image: `data:image/jpeg;base64,placeholder`, // You'll need to convert images to base64 or use URLs
      matchPercentage: 0 // This will be calculated during matching
    }));

    // Download the embeddings data
    const dataStr = JSON.stringify({
      celebrities: dataset,
      embeddings: results.map(r => ({
        id: r.id,
        name: r.name,
        embedding: r.embedding
      }))
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'celebrity_embeddings.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const embeddingsCode = `
// Celebrity embeddings data - paste this into your faceMatching.ts file
const CELEBRITY_EMBEDDINGS = ${JSON.stringify(results.map(r => ({
  id: r.id,
  name: r.name,
  embedding: r.embedding
})), null, 2)};

export { CELEBRITY_EMBEDDINGS };
`;

    navigator.clipboard.writeText(embeddingsCode).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "Celebrity embeddings code copied. Paste it into your faceMatching.ts file.",
      });
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Celebrity Embedding Generator</h1>
        <p className="text-muted-foreground mb-6">
          This tool processes your celebrity images and generates face embeddings for matching.
          Upload your folder of 100 celebrity photos to get started.
        </p>
      </div>

      <div className="space-y-6">
        {!modelsLoaded && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Step 1: Initialize Face Recognition Models</h3>
            <Button onClick={initializeModels} className="w-full">
              Load Face Recognition Models
            </Button>
          </div>
        )}

        {modelsLoaded && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Step 2: Upload Celebrity Photos</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="celebrity-upload">Select all celebrity photos (100 images)</Label>
                <Input
                  id="celebrity-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  accept="image/*"
                  disabled={isProcessing}
                  className="mt-2"
                />
              </div>
              
              <p className="text-sm text-muted-foreground">
                💡 Tip: Select all 100 celebrity photos at once. Make sure file names match celebrity names.
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Processing Celebrity Images...</h3>
            <div className="space-y-3">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Processing: {currentCeleb} ({Math.round(progress)}%)
              </p>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Results ({results.length} celebrities processed)</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 max-h-60 overflow-y-auto">
              {results.slice(0, 20).map((result, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border">
                    <img
                      src={result.imageUrl}
                      alt={result.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs truncate">{result.name}</p>
                </div>
              ))}
              {results.length > 20 && (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  +{results.length - 20} more...
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button onClick={downloadEmbeddings} className="w-full">
                Download Embeddings JSON
              </Button>
              
              <Button onClick={copyToClipboard} variant="outline" className="w-full">
                Copy Embeddings Code to Clipboard
              </Button>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ Next Steps:
                  <br />1. Copy the embeddings code to clipboard
                  <br />2. Paste it into your faceMatching.ts file
                  <br />3. Your app will now use real celebrity data for matching!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CelebrityEmbeddingGenerator;
