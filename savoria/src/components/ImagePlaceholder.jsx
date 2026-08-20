/**
 * ImagePlaceholder
 * ──────────────────────────────────────────────────────────────
 * A styled placeholder for photos not yet provided.
 *
 * HOW TO REPLACE WITH YOUR OWN IMAGE:
 *   Replace <ImagePlaceholder label="..." /> with:
 *   <img src="/images/your-photo.jpg" alt="Description" className="w-full h-full object-cover" />
 *
 * Props:
 *   label  — descriptive text shown inside the placeholder
 *   className — additional CSS classes for sizing/layout
 *   style  — additional inline styles
 */
export default function ImagePlaceholder({ label = 'Photo', className = '', style = {} }) {
  return (
    <div className={`img-placeholder ${className}`} style={style}>
      <div className="img-placeholder__inner">
        {/* Camera / Photo icon */}
        <div className="img-placeholder__icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(201,168,76,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </div>
        <span className="img-placeholder__label">{label}</span>
      </div>
    </div>
  );
}
