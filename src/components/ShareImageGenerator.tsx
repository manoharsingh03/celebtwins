

import { useRef, useEffect } from 'react';
import { Celebrity } from '@/lib/types';

interface ShareImageGeneratorProps {
  userImage: string;
  celebrity: Celebrity;
  onImageGenerated: (imageUrl: string) => void;
}

const ShareImageGenerator = ({ userImage, celebrity, onImageGenerated }: ShareImageGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateShareImage();
  }, [userImage, celebrity]);

  const loadImageWithFallback = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}, using fallback`);
        // Create a fallback colored rectangle
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 200, 200);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 200, 200);
          ctx.fillStyle = '#fff';
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Image', 100, 90);
          ctx.fillText('Not Available', 100, 110);
        }
        
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.src = canvas.toDataURL();
      };
      
      img.src = src;
    });
  };

  const generateShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    try {
      // Load images with fallback handling
      const [userImg, celebImg] = await Promise.all([
        loadImageWithFallback(userImage),
        loadImageWithFallback(celebrity.image)
      ]);

      // Draw images in circles
      const imageSize = 200;
      const userX = 150;
      const celebX = 450;
      const imageY = 150;

      // Draw user image
      ctx.save();
      ctx.beginPath();
      ctx.arc(userX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(userImg, userX, imageY, imageSize, imageSize);
      ctx.restore();

      // Draw celebrity image
      ctx.save();
      ctx.beginPath();
      ctx.arc(celebX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(celebImg, celebX, imageY, imageSize, imageSize);
      ctx.restore();

      // Add white borders around images
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(userX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(celebX + imageSize/2, imageY + imageSize/2, imageSize/2, 0, Math.PI * 2);
      ctx.stroke();

      // Add VS text between images
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('VS', 400, 260);

      // Add match percentage
      ctx.font = 'bold 60px Arial';
      ctx.fillText(`${celebrity.matchPercentage}% MATCH!`, 400, 420);

      // Add celebrity name
      ctx.font = 'bold 32px Arial';
      ctx.fillText(`You look like ${celebrity.name}!`, 400, 470);

      // Add app branding
      ctx.font = '24px Arial';
      ctx.fillText('CelebTwin - Find Your Celebrity Match', 400, 550);

      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          onImageGenerated(url);
        }
      });

    } catch (error) {
      console.error('Error generating share image:', error);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' }}
      width={800}
      height={600}
    />
  );
};

export default ShareImageGenerator;

