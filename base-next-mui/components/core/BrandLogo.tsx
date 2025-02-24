
interface BrandLogoProps {
  size?: number;
  color?: string;
}

function BrandLogo({ size = 32, color = '#007FFF' }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 32 32'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect width='32' height='32' rx='6' fill={color} />
      <path d='M7 7H25V25H7V7Z' fill='white' fillOpacity='0.3' />
      <path d='M10 10H22V22H10V10Z' fill='white' fillOpacity='0.5' />
      <path d='M13 13H19V19H13V13Z' fill='white' />
      <path d='M15 21H17V25H15V21Z' fill='white' />
      <path d='M21 15H25V17H21V15Z' fill='white' />
    </svg>
  );
}

export default BrandLogo;
