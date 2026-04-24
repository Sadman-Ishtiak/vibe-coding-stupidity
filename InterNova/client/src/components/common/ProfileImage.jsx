import { getProfileImageUrl, createImageErrorHandler } from '@/utils/imageHelpers';

/**
 * ProfileImage Component
 * Reusable component for displaying user profile images with fallback handling
 * 
 * @param {Object} props
 * @param {string} props.src - Profile image URL from database
 * @param {string} props.alt - Alt text for image
 * @param {string} props.className - CSS classes
 * @param {string} props.fallback - Custom fallback image path
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 */
export default function ProfileImage({
  src,
  alt = 'Profile',
  className = '',
  fallback = '/assets/images/user/img-02.jpg',
  width,
  height,
  ...rest
}) {
  const imageUrl = getProfileImageUrl(src, fallback);

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={createImageErrorHandler(fallback)}
      width={width}
      height={height}
      {...rest}
    />
  );
}
