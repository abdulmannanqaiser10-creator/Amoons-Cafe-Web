function HeroImage({
  src = '/images/tiramisu.png',
  alt = 'Amoons signature tiramisu on a ceramic plate',
  label = 'THE AMOONS SIGNATURE · TIRAMISU',
  objectPosition = '50% 46%',
}) {
  return (
    <div className="relative w-[250px] sm:w-[300px] md:w-[340px] lg:w-[360px] xl:w-[380px] shrink-0">
      <div className="relative aspect-square w-full">
        <div
          className="pointer-events-none absolute inset-0 translate-x-[8px] translate-y-[8px] rounded-full border-[3px] border-[var(--color-soft-pink)]"
          aria-hidden="true"
        />

        <div className="absolute inset-[2px] overflow-hidden rounded-full border-[8px] sm:border-[9px] border-[var(--color-white)] bg-[#edd2c7] shadow-[0_10px_28px_rgba(75,16,37,0.10)]">
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            style={{ objectPosition }}
          />
        </div>

        <div className="absolute bottom-[2px] right-[-2px] z-10 whitespace-nowrap rounded-full bg-[var(--color-white)] px-[14px] py-[8px] sm:right-0 sm:px-[16px] sm:py-[9px] shadow-[0_5px_16px_rgba(75,16,37,0.08)] font-sans text-[7.5px] sm:text-[8px] font-light tracking-[0.16em] text-[var(--color-primary)]">
          {label}
        </div>
      </div>
    </div>
  );
}

export default HeroImage;
