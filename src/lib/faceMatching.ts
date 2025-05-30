
import * as faceapi from 'face-api.js';
import { Celebrity } from './types';

// Celebrity dataset with pre-computed embeddings (in a real app, this would be much larger)
const CELEBRITY_DATASET: Celebrity[] = [
  {
    id: '1',
    name: 'Chris Hemsworth',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0
  },
  {
    id: '2',
    name: 'Emma Stone',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0
  },
  {
    id: '3',
    name: 'Ryan Gosling',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
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
    name: 'Robert Downey Jr.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    matchPercentage: 0
  }
];

let modelsLoaded = false;
let celebrityDescriptors: Float32Array[] = [];

export const loadFaceApiModels = async () => {
  if (modelsLoaded) return;
  
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    modelsLoaded = true;
    console.log('Face-api.js models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api.js models:', error);
    throw new Error('Failed to load face recognition models');
  }
};

export const precomputeCelebrityDescriptors = async () => {
  if (celebrityDescriptors.length > 0) return;
  
  console.log('Precomputing celebrity face descriptors...');
  
  for (const celebrity of CELEBRITY_DATASET) {
    try {
      const img = await faceapi.fetchImage(celebrity.image);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detection) {
        celebrityDescriptors.push(detection.descriptor);
      } else {
        console.warn(`No face detected for ${celebrity.name}`);
        // Add a dummy descriptor to maintain array alignment
        celebrityDescriptors.push(new Float32Array(128));
      }
    } catch (error) {
      console.error(`Error processing ${celebrity.name}:`, error);
      // Add a dummy descriptor to maintain array alignment
      celebrityDescriptors.push(new Float32Array(128));
    }
  }
  
  console.log('Celebrity descriptors computed');
};

export const findCelebrityMatch = async (imageUrl: string): Promise<Celebrity[]> => {
  if (!modelsLoaded) {
    throw new Error('Face recognition models not loaded');
  }
  
  if (celebrityDescriptors.length === 0) {
    throw new Error('Celebrity descriptors not computed');
  }
  
  try {
    const img = await faceapi.fetchImage(imageUrl);
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detection) {
      throw new Error('No face detected in the uploaded image');
    }
    
    const userDescriptor = detection.descriptor;
    const matches: Array<{ celebrity: Celebrity; distance: number }> = [];
    
    // Compare with each celebrity
    CELEBRITY_DATASET.forEach((celebrity, index) => {
      if (celebrityDescriptors[index]) {
        const distance = faceapi.euclideanDistance(userDescriptor, celebrityDescriptors[index]);
        matches.push({ celebrity, distance });
      }
    });
    
    // Sort by similarity (lower distance = higher similarity)
    matches.sort((a, b) => a.distance - b.distance);
    
    // Convert distance to percentage (this is a simplified conversion)
    const results = matches.slice(0, 5).map(match => ({
      ...match.celebrity,
      matchPercentage: Math.max(0, Math.min(100, Math.round((1 - match.distance) * 100)))
    }));
    
    return results;
  } catch (error) {
    console.error('Error in face matching:', error);
    throw error;
  }
};

export const generateShareableContent = (celebrity: Celebrity, userImage: string) => {
  const funDescriptions = [
    `🎭 You're practically twins with ${celebrity.name}!`,
    `✨ ${celebrity.matchPercentage}% celebrity DNA detected!`,
    `🌟 Hollywood called - they want you and ${celebrity.name} for a buddy movie!`,
    `🎬 Plot twist: You might actually BE ${celebrity.name}!`,
    `🔥 ${celebrity.name} who? You're the real star here!`
  ];
  
  const randomDescription = funDescriptions[Math.floor(Math.random() * funDescriptions.length)];
  
  return {
    title: `I'm ${celebrity.matchPercentage}% like ${celebrity.name}!`,
    description: randomDescription,
    hashtags: '#CelebTwin #FaceMatch #LookAlike #Celebrity',
    shareUrl: window.location.origin
  };
};
