
import * as faceapi from 'face-api.js';
import { Celebrity } from './types';

// This will be replaced with real celebrity data once embeddings are generated
let CELEBRITY_DATASET: Celebrity[] = [
  // Placeholder data - will be replaced with real celebrity embeddings
  { id: '1', name: 'Chris Hemsworth', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '2', name: 'Emma Stone', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '3', name: 'Ryan Gosling', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '4', name: 'Scarlett Johansson', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '5', name: 'Robert Downey Jr.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
];

// This will store the real celebrity embeddings
let CELEBRITY_EMBEDDINGS: Array<{ id: string; name: string; embedding: number[] }> = [];

let modelsLoaded = false;

export const loadFaceApiModels = async () => {
  if (modelsLoaded) return;
  
  try {
    // Try to load from local models first, fallback to CDN
    const modelPath = '/models';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
    ]);
    
    modelsLoaded = true;
    console.log('✅ Face-api.js models loaded successfully from:', modelPath);
  } catch (error) {
    console.warn('⚠️ Local models not found, trying CDN...');
    try {
      // Fallback to CDN
      const cdnPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(cdnPath),
        faceapi.nets.faceLandmark68Net.loadFromUri(cdnPath),
        faceapi.nets.faceRecognitionNet.loadFromUri(cdnPath)
      ]);
      
      modelsLoaded = true;
      console.log('✅ Face-api.js models loaded from CDN');
    } catch (cdnError) {
      console.error('❌ Error loading face-api.js models:', cdnError);
      throw new Error('Failed to load face recognition models. Please check your internet connection.');
    }
  }
};

// Function to load real celebrity embeddings (call this after generating embeddings)
export const loadCelebrityEmbeddings = (embeddings: Array<{ id: string; name: string; embedding: number[] }>, celebrities: Celebrity[]) => {
  CELEBRITY_EMBEDDINGS = embeddings;
  CELEBRITY_DATASET = celebrities;
  console.log(`🎉 Loaded ${embeddings.length} real celebrity embeddings`);
};

export const precomputeCelebrityDescriptors = async () => {
  // If we have real embeddings, we don't need to precompute
  if (CELEBRITY_EMBEDDINGS.length > 0) {
    console.log('✅ Using preloaded real celebrity embeddings');
    return;
  }
  
  // Fallback: compute embeddings for placeholder images
  console.log('🧮 Computing embeddings for placeholder images...');
  
  const computedEmbeddings: Array<{ id: string; name: string; embedding: number[] }> = [];
  
  for (let i = 0; i < Math.min(CELEBRITY_DATASET.length, 10); i++) {
    const celebrity = CELEBRITY_DATASET[i];
    try {
      const img = await faceapi.fetchImage(celebrity.image);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detection) {
        computedEmbeddings.push({
          id: celebrity.id,
          name: celebrity.name,
          embedding: Array.from(detection.descriptor)
        });
        console.log(`✅ Processed ${celebrity.name} (${i + 1}/${CELEBRITY_DATASET.length})`);
      } else {
        console.warn(`⚠️ No face detected for ${celebrity.name}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${celebrity.name}:`, error);
    }
  }
  
  CELEBRITY_EMBEDDINGS = computedEmbeddings;
  console.log(`🎉 Computed ${computedEmbeddings.length} placeholder embeddings`);
};

export const findCelebrityMatch = async (imageUrl: string): Promise<Celebrity[]> => {
  if (!modelsLoaded) {
    throw new Error('Face recognition models not loaded. Please wait and try again.');
  }
  
  if (CELEBRITY_EMBEDDINGS.length === 0) {
    throw new Error('Celebrity embeddings not loaded. Please generate embeddings first.');
  }
  
  try {
    console.log('🔍 Analyzing uploaded image...');
    
    const img = await faceapi.fetchImage(imageUrl);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      throw new Error('No face detected in the uploaded image. Please try with a clearer, front-facing photo.');
    }
    
    console.log('✅ Face detected, computing matches...');
    
    const userDescriptor = detection.descriptor;
    const matches: Array<{ celebrity: Celebrity; distance: number }> = [];
    
    // Compare with each celebrity embedding
    CELEBRITY_EMBEDDINGS.forEach((celebrityData) => {
      const celebrity = CELEBRITY_DATASET.find(c => c.id === celebrityData.id);
      if (celebrity && celebrityData.embedding.length > 0) {
        const celebrityDescriptor = new Float32Array(celebrityData.embedding);
        const distance = faceapi.euclideanDistance(userDescriptor, celebrityDescriptor);
        matches.push({ celebrity, distance });
      }
    });
    
    // Sort by similarity (lower distance = higher similarity)
    matches.sort((a, b) => a.distance - b.distance);
    
    console.log('🎯 Top matches computed:', matches.slice(0, 5).map(m => `${m.celebrity.name}: ${m.distance.toFixed(3)}`));
    
    // Convert distance to percentage with improved algorithm
    const results = matches.slice(0, 5).map((match, index) => {
      // Improved percentage calculation
      const normalizedDistance = Math.max(0, Math.min(1, (match.distance - 0.2) / 0.8));
      let matchPercentage = Math.max(40, Math.min(98, Math.round((1 - normalizedDistance) * 100)));
      
      // Ensure the best match gets a high score
      if (index === 0 && matchPercentage < 70) {
        matchPercentage = Math.max(70, matchPercentage);
      }
      
      return {
        ...match.celebrity,
        matchPercentage
      };
    });
    
    console.log('🏆 Final results:', results.map(r => `${r.name}: ${r.matchPercentage}%`));
    
    return results;
  } catch (error) {
    console.error('❌ Error in face matching:', error);
    throw error;
  }
};

export const generateShareableContent = (celebrity: Celebrity, userImage: string) => {
  const funDescriptions = [
    `🎭 You're practically twins with ${celebrity.name}!`,
    `✨ ${celebrity.matchPercentage}% celebrity DNA detected!`,
    `🌟 Hollywood called - they want you and ${celebrity.name} for a buddy movie!`,
    `🎬 Plot twist: You might actually BE ${celebrity.name}!`,
    `🔥 ${celebrity.name} who? You're the real star here!`,
    `🎪 Breaking: ${celebrity.name} has a secret twin living among us!`,
    `🚀 Scientists confirm: You share ${celebrity.matchPercentage}% of your awesome with ${celebrity.name}!`,
    `🎨 If ${celebrity.name} had a doppelgänger, it would be you!`,
    `📸 Paparazzi confused: Is it ${celebrity.name} or their incredible lookalike?`,
    `🎵 🎶 Who wore it better? You or ${celebrity.name}? 🎶 🎵`
  ];
  
  const randomDescription = funDescriptions[Math.floor(Math.random() * funDescriptions.length)];
  
  return {
    title: `I'm ${celebrity.matchPercentage}% like ${celebrity.name}!`,
    description: randomDescription,
    hashtags: '#CelebTwin #FaceMatch #LookAlike #Celebrity #AI',
    shareUrl: window.location.origin
  };
};

// Utility function to check if real embeddings are loaded
export const hasRealEmbeddings = () => {
  return CELEBRITY_EMBEDDINGS.length > 0;
};
