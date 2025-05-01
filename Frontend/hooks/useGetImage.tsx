import { useEffect, useState } from "react";

interface UseGetImageResult {
  images: File[];
  loading: boolean;
  error: string | null;
}

export function useGetImage(urls: string | string[]): UseGetImageResult {
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getImage = async (url: string): Promise<File | undefined> => {
    if (!url) {
      return undefined;
    }
    try {
      const response = await fetch(url, {
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      return new File([blob], url.substring(url.lastIndexOf("/") + 1));
    } catch (err) {
      console.error("Image fetch error:", err);
      return undefined;
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        const promises = urlArray.map((url) => getImage(url));
        const results = await Promise.all(promises);
        const validFiles = results.filter((file): file is File => file !== undefined);
        setImages(validFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch images");
      } finally {
        setLoading(false);
      }
    };

    if (urls && (Array.isArray(urls) ? urls.length > 0 : urls.length > 0)) {
      fetchImages();
    } else {
      setImages([]);
    }

    return () => {
      setImages([]);
      setLoading(false);
      setError(null);
    };
  }, [urls]);

  return { images, loading, error };
}

