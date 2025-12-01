import React, { useEffect, useState } from 'react';
import { Pet, GalleryItem } from '../types';
import { StorageService } from '../services/storageService';

interface GalleryViewProps {
  pets: Pet[];
  notify: (msg: string, type: 'success' | 'error') => void;
}

const GalleryView: React.FC<GalleryViewProps> = ({ pets, notify }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    const data = await StorageService.getGallery();
    setItems(data);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (pets.length === 0) {
      notify("Bitte erst ein Haustier anlegen!", "error");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const newItem: GalleryItem = {
        id: Date.now().toString(),
        petId: pets[0].id, // Default to first pet for demo simplicity, or add a selector
        url: reader.result as string,
        date: new Date().toISOString(),
        note: ''
      };
      await StorageService.saveGalleryItem(newItem);
      await loadGallery();
      setUploading(false);
      notify("Foto hochgeladen!", "success");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Galerie</h2>
        <label className={`bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg cursor-pointer text-sm font-bold flex items-center gap-2 ${uploading ? 'opacity-50' : ''}`}>
          <i className="fas fa-camera"></i>
          <span>{uploading ? '...' : 'Upload'}</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="p-2 grid grid-cols-3 gap-1">
        {items.map(item => (
          <div 
            key={item.id} 
            onClick={() => setSelectedImage(item)}
            className="aspect-square relative group cursor-pointer overflow-hidden bg-gray-200"
          >
            <img src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-white text-xs">{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
           <i className="fas fa-images text-4xl mb-4"></i>
           <p>Noch keine Fotos.</p>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-center" onClick={() => setSelectedImage(null)}>
           <img src={selectedImage.url} alt="" className="w-full max-h-[80vh] object-contain" />
           <div className="absolute bottom-10 left-0 right-0 text-center text-white p-4">
             <p className="font-bold">{new Date(selectedImage.date).toLocaleDateString('de-DE')}</p>
             {selectedImage.note && <p className="text-gray-300 mt-1">{selectedImage.note}</p>}
           </div>
           <button className="absolute top-4 right-4 text-white p-2" onClick={() => setSelectedImage(null)}>
             <i className="fas fa-times text-2xl"></i>
           </button>
        </div>
      )}
    </div>
  );
};

export default GalleryView;