
import * as faceapi from 'face-api.js';
import { Celebrity } from './types';

// Expanded celebrity dataset with diverse representation
const CELEBRITY_DATASET: Celebrity[] = [
  // Hollywood A-listers
  { id: '1', name: 'Chris Hemsworth', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '2', name: 'Emma Stone', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '3', name: 'Ryan Gosling', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '4', name: 'Scarlett Johansson', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '5', name: 'Robert Downey Jr.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // More diverse celebrities
  { id: '6', name: 'Zendaya', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '7', name: 'Michael B. Jordan', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '8', name: 'Gal Gadot', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '9', name: 'Ryan Reynolds', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '10', name: 'Jennifer Lawrence', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Action stars
  { id: '11', name: 'Dwayne Johnson', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '12', name: 'Chris Evans', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '13', name: 'Tom Holland', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '14', name: 'Chris Pratt', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '15', name: 'Tom Cruise', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Leading ladies
  { id: '16', name: 'Margot Robbie', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '17', name: 'Anne Hathaway', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '18', name: 'Emma Watson', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '19', name: 'Blake Lively', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '20', name: 'Angelina Jolie', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // International stars
  { id: '21', name: 'Shah Rukh Khan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '22', name: 'Priyanka Chopra', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '23', name: 'Jackie Chan', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '24', name: 'Lupita Nyongo', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '25', name: 'Idris Elba', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Music industry crossovers
  { id: '26', name: 'Taylor Swift', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '27', name: 'Justin Timberlake', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '28', name: 'Lady Gaga', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '29', name: 'Will Smith', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '30', name: 'Beyoncé', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Comedy legends
  { id: '31', name: 'Kevin Hart', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '32', name: 'Amy Schumer', image: 'https://images.unsplash.com/photo-1494790108755-2616b68bb33b?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '33', name: 'Seth Rogen', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '34', name: 'Tina Fey', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '35', name: 'Steve Carell', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // TV stars
  { id: '36', name: 'Kit Harington', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '37', name: 'Emilia Clarke', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '38', name: 'Pedro Pascal', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '39', name: 'Millie Bobby Brown', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '40', name: 'Bryan Cranston', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Rising stars & younger generation
  { id: '41', name: 'Timothée Chalamet', image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '42', name: 'Anya Taylor-Joy', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '43', name: 'Florence Pugh', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '44', name: 'Jacob Elordi', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '45', name: 'Sydney Sweeney', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  
  // Legends
  { id: '46', name: 'Morgan Freeman', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '47', name: 'Meryl Streep', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '48', name: 'Leonardo DiCaprio', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '49', name: 'Jennifer Aniston', image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
  { id: '50', name: 'Brad Pitt', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', matchPercentage: 0 },
];

let modelsLoaded = false;
let celebrityDescriptors: Float32Array[] = [];

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

export const precomputeCelebrityDescriptors = async () => {
  if (celebrityDescriptors.length > 0) return;
  
  console.log('🧮 Precomputing celebrity face descriptors...');
  
  for (let i = 0; i < CELEBRITY_DATASET.length; i++) {
    const celebrity = CELEBRITY_DATASET[i];
    try {
      const img = await faceapi.fetchImage(celebrity.image);
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();
      
      if (detection) {
        celebrityDescriptors.push(detection.descriptor);
        console.log(`✅ Processed ${celebrity.name} (${i + 1}/${CELEBRITY_DATASET.length})`);
      } else {
        console.warn(`⚠️ No face detected for ${celebrity.name}`);
        // Add a dummy descriptor to maintain array alignment
        celebrityDescriptors.push(new Float32Array(128));
      }
    } catch (error) {
      console.error(`❌ Error processing ${celebrity.name}:`, error);
      // Add a dummy descriptor to maintain array alignment
      celebrityDescriptors.push(new Float32Array(128));
    }
  }
  
  console.log(`🎉 Celebrity descriptors computed for ${celebrityDescriptors.length} celebrities`);
};

export const findCelebrityMatch = async (imageUrl: string): Promise<Celebrity[]> => {
  if (!modelsLoaded) {
    throw new Error('Face recognition models not loaded. Please wait and try again.');
  }
  
  if (celebrityDescriptors.length === 0) {
    throw new Error('Celebrity descriptors not computed. Please wait and try again.');
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
    
    // Compare with each celebrity
    CELEBRITY_DATASET.forEach((celebrity, index) => {
      if (celebrityDescriptors[index] && celebrityDescriptors[index].length > 0) {
        const distance = faceapi.euclideanDistance(userDescriptor, celebrityDescriptors[index]);
        matches.push({ celebrity, distance });
      }
    });
    
    // Sort by similarity (lower distance = higher similarity)
    matches.sort((a, b) => a.distance - b.distance);
    
    console.log('🎯 Top matches computed:', matches.slice(0, 5).map(m => `${m.celebrity.name}: ${m.distance.toFixed(3)}`));
    
    // Convert distance to percentage with improved algorithm
    const results = matches.slice(0, 5).map(match => {
      // Face-api.js typically returns distances between 0.3-1.2 for faces
      // We'll map this to a percentage where lower distance = higher match
      const normalizedDistance = Math.max(0, Math.min(1, (match.distance - 0.3) / 0.7));
      const matchPercentage = Math.max(45, Math.min(99, Math.round((1 - normalizedDistance) * 100)));
      
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
