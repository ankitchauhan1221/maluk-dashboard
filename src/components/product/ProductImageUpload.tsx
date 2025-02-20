import React, { useState, ChangeEvent } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  images: { thumbnails: File[], gallery: File[] };
  onImagesChange: (images: { thumbnails: File[], gallery: File[] }) => void;
  maxImages: number;
  className?: string;
}

const ProductImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange, maxImages, className }) => {
  const [thumbnails, setThumbnails] = useState<File[]>(images.thumbnails || []);
  const [gallery, setGallery] = useState<File[]>(images.gallery || []);

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 2); // Only take up to 2 files
      setThumbnails(filesArray);
      onImagesChange({ thumbnails: filesArray, gallery });
    }
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newGallery = [...gallery, ...filesArray].slice(0, maxImages);
      setGallery(newGallery);
      onImagesChange({ thumbnails, gallery: newGallery });
    }
  };

  const handleRemoveThumbnail = (index: number) => {
    const newThumbnails = thumbnails.filter((_, i) => i !== index);
    setThumbnails(newThumbnails);
    onImagesChange({ thumbnails: newThumbnails, gallery });
  };

  const handleRemoveGallery = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);
    onImagesChange({ thumbnails, gallery: newGallery });
  };

  return (
    <div className={className}>
      {/* Thumbnail upload */}
      <div>
        <Label htmlFor="thumbnail">Thumbnail Images (Front and Back)</Label>
        <Input
          id="thumbnail"
          type="file"
          multiple
          accept="image/*"
          onChange={handleThumbnailUpload}
        />
        <div className="mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {thumbnails.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Thumbnail ${index + 1}`}
                className="block w-full h-auto object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-75 hover:opacity-100"
                onClick={() => handleRemoveThumbnail(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery upload */}
      <div>
        <Label htmlFor="gallery" className="block mb-2 text-sm font-medium text-gray-900">Gallery Images</Label>
        <Input
          id="gallery"
          type="file"
          multiple
          accept="image/*"
          onChange={handleGalleryUpload}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Gallery ${index + 1}`}
                className="block w-full h-auto object-cover rounded-lg"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-75 hover:opacity-100"
                onClick={() => handleRemoveGallery(index)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageUpload;
