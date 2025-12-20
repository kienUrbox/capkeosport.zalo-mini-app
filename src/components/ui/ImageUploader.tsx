import { useState } from 'react'
import { ICONS } from '../../constants/design'

type ImageUploaderProps = {
  maxImages?: number
  images?: string[]
  onImagesChange?: (images: string[]) => void
}

const ImageUploader = ({ maxImages = 5, images: initialImages = [], onImagesChange }: ImageUploaderProps) => {
  const [images, setImages] = useState<string[]>(initialImages)

  const handleAddImage = () => {
    if (images.length < maxImages) {
      // TODO: Implement actual image upload
      const newImage = `https://via.placeholder.com/200?text=Image+${images.length + 1}`
      const newImages = [...images, newImage]
      setImages(newImages)
      onImagesChange?.(newImages)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-[#E0E0E0]">Ảnh minh chứng</h2>
        <p className="text-sm text-[#888888]">Tối đa {maxImages} ảnh</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Add Button */}
        {images.length < maxImages && (
          <div
            className="relative flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#333] bg-[#1E1E1E] cursor-pointer"
            onClick={handleAddImage}
          >
            <span className={`material-symbols-outlined text-3xl text-[#006AF6]`}>{ICONS.add_photo_alternate}</span>
            <p className="text-xs text-[#888888]">Thêm ảnh</p>
          </div>
        )}

        {/* Image Previews */}
        {images.map((image, index) => (
          <div key={index} className="relative h-24 w-24 shrink-0">
            <img className="h-full w-full rounded-lg object-cover" alt={`Upload ${index + 1}`} src={image} />
            <button
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white"
              onClick={() => handleRemoveImage(index)}
            >
              <span className={`material-symbols-outlined text-sm`}>{ICONS.close}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageUploader

