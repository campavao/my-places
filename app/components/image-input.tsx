import React from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import Loading from "./loading";

function ImageInput({
  id,
  imageName,
  onChange,
  showReupload,
  className,
  imageClassName,
}: {
  id: string;
  className?: string;
  imageClassName?: string;
  imageName?: string;
  onChange: (name: string) => void;
  showReupload?: boolean;
}) {
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadImage = e.target.files?.[0];
    if (uploadImage) {
      setLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `images/${uploadImage.name}`);

      await uploadBytes(storageRef, uploadImage);
      console.log("Image uploaded successfully!");
      onChange(uploadImage.name);
    }
  };

  React.useEffect(() => {
    if (imageName) {
      setLoading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `images/${imageName}`); // Replace with your image path.

      getDownloadURL(storageRef)
        .then((url) => {
          setImageSrc(url);
        })
        .catch((error) => {
          console.error("Error retrieving image:", error);
        });
    }
  }, [imageName]);

  return (
    <div
      className={`${className} w-full h-full position-relative min-h-[200px] flex flex-col gap-2`}
    >
      {imageSrc ? (
        <>
          <Image
            className={`${imageClassName} w-full max-h-48 rounded-lg object-cover object-center`}
            src={imageSrc}
            layout='fill'
            alt=''
            onLoadingComplete={() => setLoading(false)}
          />
          {showReupload && (
            <div>
              <label
                className='absolute top-4 right-4 cursor-pointer'
                htmlFor={`${id}-image-upload`}
              >
                Upload
              </label>
              <input
                className='hidden'
                id={`${id}-image-upload`}
                type='file'
                accept='image/*'
                onChange={handleImageChange}
              />
            </div>
          )}
        </>
      ) : loading ? (
        <Loading />
      ) : (
        <>
          <label
            className='flex items-center self-center min-h-[200px] text-black cursor-pointer'
            htmlFor={`${id}-image-upload`}
          >
            Upload
          </label>
          <input
            className='hidden'
            id={`${id}-image-upload`}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
        </>
      )}
    </div>
  );
}

export default ImageInput;
