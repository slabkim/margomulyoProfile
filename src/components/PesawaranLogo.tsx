import Image from 'next/image';

type PesawaranLogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function PesawaranLogo({ className, priority = false, sizes }: PesawaranLogoProps) {
  return (
    <Image
      className={className}
      src="/Lambang_Kabupaten_Pesawaran.png"
      alt="Lambang Kabupaten Pesawaran"
      width={724}
      height={1110}
      sizes={sizes}
      priority={priority}
    />
  );
}
