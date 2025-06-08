

import * as faceapi from 'face-api.js';
import { Celebrity } from './types';

// Using reliable image URLs that support CORS
const CELEBRITY_DATASET: Celebrity[] = [
  { 
    id: '1', 
    name: 'Shawn Mendes', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0 
  },
  { 
    id: '2', 
    name: 'Emma Watson', 
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b1-a5?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0 
  },
  { 
    id: '3', 
    name: 'Chris Hemsworth', 
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0 
  },
  { 
    id: '4', 
    name: 'Scarlett Johansson', 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0 
  },
  { 
    id: '5', 
    name: 'Robert Downey Jr', 
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0 
  },
];

// Store celebrity embeddings with caching
let CELEBRITY_EMBEDDINGS: Array<{ id: string; name: string; embedding: number[] }> = [];
let modelsLoaded = false;
let embeddingsLoaded = false;

// Cache for processed images
const imageCache = new Map<string, HTMLImageElement>();

export const loadFaceApiModels = async () => {
  if (modelsLoaded) return;
  
  try {
    console.log('🔄 Loading face-api.js models...');
    
    const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath)
    ]);
    
    modelsLoaded = true;
    console.log('✅ Face-api.js models loaded successfully');
  } catch (error) {
    console.error('❌ Error loading face-api.js models:', error);
    throw new Error('Failed to load face recognition models. Please check your internet connection.');
  }
};

const createOptimizedImage = async (url: string): Promise<HTMLImageElement> => {
  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      console.log(`✅ Successfully loaded image: ${url}`);
      imageCache.set(url, img);
      resolve(img);
    };
    
    img.onerror = (error) => {
      console.error(`❌ Failed to load image: ${url}`, error);
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
};

export const precomputeCelebrityDescriptors = async () => {
  if (embeddingsLoaded && CELEBRITY_EMBEDDINGS.length > 0) {
    console.log('✅ Using cached celebrity embeddings');
    return;
  }
  
  console.log('🧮 Computing celebrity embeddings...');
  CELEBRITY_EMBEDDINGS = [];
  
  try {
    for (const celebrity of CELEBRITY_DATASET) {
      try {
        console.log(`Processing ${celebrity.name}...`);
        
        const img = await createOptimizedImage(celebrity.image);
        
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 320,
            scoreThreshold: 0.5
          }))
          .withFaceLandmarks()
          .withFaceDescriptor();
        
        if (detection && detection.descriptor) {
          console.log(`✅ Successfully processed ${celebrity.name}`);
          CELEBRITY_EMBEDDINGS.push({
            id: celebrity.id,
            name: celebrity.name,
            embedding: Array.from(detection.descriptor)
          });
        } else {
          console.warn(`⚠️ No face detected for ${celebrity.name}`);
          // Don't add celebrities without proper face detection
        }
      } catch (error) {
        console.error(`❌ Error processing ${celebrity.name}:`, error);
        // Skip celebrities that fail to process
      }
    }
    
    embeddingsLoaded = true;
    console.log(`🎉 Successfully generated ${CELEBRITY_EMBEDDINGS.length} celebrity embeddings`);
    
    if (CELEBRITY_EMBEDDINGS.length === 0) {
      throw new Error('No celebrity faces could be processed. Please check the image URLs.');
    }
  } catch (error) {
    console.error('❌ Error in precomputing celebrity descriptors:', error);
    throw error;
  }
};

export const findCelebrityMatch = async (imageUrl: string): Promise<Celebrity[]> => {
  if (!modelsLoaded) {
    throw new Error('Face recognition models not loaded. Please wait and try again.');
  }
  
  if (!embeddingsLoaded || CELEBRITY_EMBEDDINGS.length === 0) {
    throw new Error('Celebrity embeddings not loaded. Please wait for initialization to complete.');
  }
  
  try {
    console.log('🔍 Analyzing uploaded image...');
    
    const img = await createOptimizedImage(imageUrl);
    
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ 
        inputSize: 320,
        scoreThreshold: 0.5
      }))
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      throw new Error('No face detected in the uploaded image. Please try with a clearer, front-facing photo.');
    }
    
    console.log('✅ Face detected, computing matches...');
    
    const userDescriptor = detection.descriptor;
    const matches: Array<{ celebrity: Celebrity; distance: number }> = [];
    
    // Only use celebrities that have real embeddings
    for (const celebrityData of CELEBRITY_EMBEDDINGS) {
      const celebrity = CELEBRITY_DATASET.find(c => c.id === celebrityData.id);
      if (celebrity && celebrityData.embedding.length > 0) {
        const celebrityDescriptor = new Float32Array(celebrityData.embedding);
        const distance = faceapi.euclideanDistance(userDescriptor, celebrityDescriptor);
        matches.push({ celebrity, distance });
      }
    }
    
    if (matches.length === 0) {
      throw new Error('No valid celebrity matches found. Please try again.');
    }
    
    // Sort by similarity (lower distance = more similar)
    matches.sort((a, b) => a.distance - b.distance);
    
    console.log('🎯 Top matches:', matches.slice(0, 3).map(m => `${m.celebrity.name}: ${m.distance.toFixed(3)}`));
    
    // Return top 3 matches with realistic percentages
    const finalResults = matches.slice(0, Math.min(3, matches.length)).map((match, index) => {
      // Convert distance to percentage (lower distance = higher percentage)
      const basePercentage = Math.max(60, 95 - (match.distance * 15) - (index * 5));
      const matchPercentage = Math.round(Math.min(98, Math.max(55, basePercentage)));
      
      return {
        ...match.celebrity,
        matchPercentage
      };
    });
    
    console.log('🏆 Final results:', finalResults.map(r => `${r.name}: ${r.matchPercentage}%`));
    
    return finalResults;
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
  ];
  
  const randomDescription = funDescriptions[Math.floor(Math.random() * funDescriptions.length)];
  
  return {
    title: `I'm ${celebrity.matchPercentage}% like ${celebrity.name}!`,
    description: randomDescription,
    hashtags: '#CelebTwin #FaceMatch #LookAlike #Celebrity #AI',
    shareUrl: window.location.origin
  };
};

export const hasRealEmbeddings = () => {
  return embeddingsLoaded && CELEBRITY_EMBEDDINGS.length > 0;
};

export { CELEBRITY_DATASET };

