'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { Container } from '@/components/atoms/container';
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />,
});

interface VideoProps {
  src: string;
  thumbnail?: string;
  className?: string;
}

export function Video({ src, thumbnail, className = '' }: VideoProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Container>
        <div
          className={`relative aspect-[16/9] rounded-xl shadow-xl overflow-hidden cursor-pointer group  ${className}`}
          onClick={() => setShowModal(true)}
        >
          <div className="relative w-full h-full bg-primary">
            {thumbnail ? (
              <>
                <Image
                  src={thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  fill
                  quality={100}
                  priority
                  sizes="100vw"
                  unoptimized
                />
                {/* Dark overlay that fades on hover */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              </>
            ) : (
              <div className="w-full h-full bg-primary" />
            )}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-blue-600/90 p-4 transform transition-all duration-300 group-hover:scale-125 group-hover:bg-blue-600">
              <Play className="md:w-8 md:h-8 w-6 h-6 text-white" />
            </div>
          </div>

          {/* Optional: Add video duration or title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-white text-sm font-medium">Click to play video</div>
          </div>
        </div>
      </Container>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 transition-colors duration-200"
            aria-label="Close video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="w-full max-w-6xl mx-4 aspect-video">
            <ReactPlayer
              url={src}
              width="100%"
              height="100%"
              controls={true}
              playing={true}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 1,
                    origin: typeof window !== 'undefined' ? window.location.origin : '',
                  },
                },
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
