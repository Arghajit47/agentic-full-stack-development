"use client";

interface SubmissionSuccessModalProps {
  onClose: () => void;
}

export function SubmissionSuccessModal({ onClose }: SubmissionSuccessModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-success-title"
      data-testid="submission-success-modal"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#141414] px-6"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        data-testid="modal-close-button"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-white opacity-60 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/40 sm:right-8 sm:top-8"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex flex-col items-center text-center" style={{ gap: "clamp(1.5rem, 4vw, 3rem)" }}>
        <div className="flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20V0Z" fill="#7C3AED" />
            <path d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0v40Z" fill="#A78BFA" />
          </svg>
          <span className="text-xl font-semibold tracking-wide text-white sm:text-2xl">Estatein</span>
        </div>

        <h2
          id="submission-success-title"
          className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl xl:text-[40px]"
        >
          Thank you for your submission!
        </h2>

        <p className="max-w-xl text-base text-white/80 sm:text-lg">
          Our team at Estatein will review your information and get back to you shortly.
        </p>

        <p className="text-base text-white/70 sm:text-lg">Have a great day!</p>
      </div>
    </div>
  );
}
