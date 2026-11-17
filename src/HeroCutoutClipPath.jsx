export default function HeroCutoutClipPath({ id, pathRef }) {
  return <svg className="hero-cutout-definitions" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={id} clipPathUnits="userSpaceOnUse">
        <path ref={pathRef} />
      </clipPath>
    </defs>
  </svg>
}
