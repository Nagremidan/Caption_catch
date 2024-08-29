import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const ShareButton = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const captureAndPreview = async () => {
    try {
      const element = document.body;
      const canvas = await html2canvas(element, {
        scale: 2, // Increase scale for better quality
        useCORS: true,
        logging: false,
      });
      
      const image = canvas.toDataURL('image/jpeg', 1.0);
      setPreviewImage(image);
    } catch (error) {
      console.error('Error capturing:', error);
    }
  };

  const shareImage = async () => {
    try {
      if (!previewImage) return;

      // Create a blob from the image data
      const blob = await (await fetch(previewImage)).blob();
      
      // Create a File object
      const file = new File([blob], 'report.jpg', { type: 'image/jpeg' });
      
      // Share via Web Share API if supported
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'Cbe Cargo Report',
          text: 'Check out this Cbe Cargo report!',
        });
      } else {
        // Fallback to opening WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent('Check out this Cbe Cargo report!')}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <>
      <Button onClick={captureAndPreview} className="share-button">
        <Share className="mr-2 h-4 w-4" /> Share
      </Button>
      {previewImage && (
        <div className="preview-modal">
          <div className="preview-content">
            <button className="close-button" onClick={closePreview}>
              <X />
            </button>
            <img src={previewImage} alt="Preview" className="preview-image" />
            <Button onClick={shareImage} className="share-button">
              Share on WhatsApp
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;