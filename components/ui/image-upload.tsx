import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';
import { CloudinaryUploadWidgetResults } from 'next-cloudinary';

interface ImageUploadProps {
  disabled: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  multiple?: boolean; 
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  multiple = false, // Default to false if not provided
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

 
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
   
    if (result.info && typeof result.info === 'object') {
      const newImageUrl = (result.info as { secure_url: string }).secure_url;
      console.log("Yüklenen yeni görsel URL\'si (onSuccess):", newImageUrl);
      onChange(newImageUrl);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                className="cursor-pointer"
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              src={url}
              alt="Image"
              layout="fill"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <CldUploadWidget
    
        onSuccess={handleUploadSuccess}
        uploadPreset="djwe7pync"
        options={{ multiple }}

      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            variant="secondary"
            onClick={() => open()}
            className="cursor-pointer"
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload an Image
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;