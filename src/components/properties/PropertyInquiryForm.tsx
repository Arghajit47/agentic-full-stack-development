"use client";

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";

export interface PropertyInquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface PropertyInquiryFormProps {
  propertySlug: string;
  propertyTitle: string;
  onSubmit?: (data: PropertyInquiryFormData & { propertySlug: string }) => void | Promise<void>;
  className?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const initialFormData: PropertyInquiryFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function PropertyInquiryForm({
  propertySlug,
  propertyTitle,
  onSubmit,
  className = "",
}: PropertyInquiryFormProps) {
  const [formData, setFormData] = useState<PropertyInquiryFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Allow common phone formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, "");
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    return newErrors;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if touched
    if (touched[name] && errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const fieldErrors = validateForm();

    // Always sync the blurred field's error state
    setErrors((prev) => {
      const next = { ...prev };
      const fieldError = fieldErrors[fieldName as keyof FormErrors];
      if (fieldError) {
        next[fieldName as keyof FormErrors] = fieldError;
      } else {
        delete next[fieldName as keyof FormErrors];
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);
    setSubmitError(null);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Log submission event without PII
        console.log("Property inquiry submission initiated");

        // Call onSubmit prop if provided
        if (onSubmit) {
          await onSubmit({ ...formData, propertySlug });
        }

        setIsSubmitted(true);

        // Reset form after 3 seconds
        resetTimerRef.current = setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          setTouched({});
          setIsSubmitted(false);
          setIsSubmitting(false);
        }, 3000);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Submission failed");
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div
        data-testid="inquiry-form-success"
        role="status"
        aria-live="polite"
        className={`w-full bg-[#1A1A1A] rounded-lg border border-zinc-800 p-8 text-center ${className}`}
      >
        <h3 className="text-2xl font-semibold text-white mb-4">
          Thank You!
        </h3>
        <p className="text-lg text-[#999999]">
          Your inquiry about <span className="text-white font-medium">{propertyTitle}</span> has been submitted successfully. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="property-inquiry-form"
      className={`w-full bg-[#1A1A1A] rounded-lg border border-zinc-800 p-6 ${className}`}
    >
      {/* Heading */}
      <h3
        data-testid="inquiry-form-heading"
        className="text-2xl font-semibold text-white mb-2"
      >
        Interested in This Property?
      </h3>
      <p
        data-testid="inquiry-form-subheading"
        className="text-base text-[#999999] mb-6"
      >
        Fill out the form below and our team will contact you shortly.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div
            role="alert"
            className="mb-4 rounded-lg bg-red-900/20 border border-red-500 px-4 py-3 text-red-400 text-sm"
          >
            {submitError}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="inquiry-name"
              className="mb-2 block text-base font-medium text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="inquiry-name"
              name="name"
              data-testid="input-name"
              value={formData.name}
              onChange={handleInputChange}
              onBlur={() => handleBlur("name")}
              placeholder="Enter your full name"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? "error-name" : undefined}
              className={`w-full rounded-lg border ${
                touched.name && errors.name ? "border-red-500" : "border-zinc-700"
              } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-base outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
            />
            {touched.name && errors.name && (
              <p
                id="error-name"
                data-testid="error-name"
                className="mt-1 text-sm text-red-500"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="inquiry-email"
              className="mb-2 block text-base font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="inquiry-email"
              name="email"
              data-testid="input-email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur("email")}
              placeholder="your.email@example.com"
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "error-email" : undefined}
              className={`w-full rounded-lg border ${
                touched.email && errors.email ? "border-red-500" : "border-zinc-700"
              } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-base outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
            />
            {touched.email && errors.email && (
              <p
                id="error-email"
                data-testid="error-email"
                className="mt-1 text-sm text-red-500"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="inquiry-phone"
              className="mb-2 block text-base font-medium text-white"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="inquiry-phone"
              name="phone"
              data-testid="input-phone"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={() => handleBlur("phone")}
              placeholder="+1 (123) 456-7890"
              aria-invalid={!!(touched.phone && errors.phone)}
              aria-describedby={touched.phone && errors.phone ? "error-phone" : undefined}
              className={`w-full rounded-lg border ${
                touched.phone && errors.phone ? "border-red-500" : "border-zinc-700"
              } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-base outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
            />
            {touched.phone && errors.phone && (
              <p
                id="error-phone"
                data-testid="error-phone"
                className="mt-1 text-sm text-red-500"
              >
                {errors.phone}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="inquiry-message"
              className="mb-2 block text-base font-medium text-white"
            >
              Message
            </label>
            <textarea
              id="inquiry-message"
              name="message"
              data-testid="input-message"
              value={formData.message}
              onChange={handleInputChange}
              onBlur={() => handleBlur("message")}
              placeholder="Tell us about your interest in this property..."
              rows={4}
              aria-invalid={!!(touched.message && errors.message)}
              aria-describedby={touched.message && errors.message ? "error-message" : undefined}
              className={`w-full rounded-lg border ${
                touched.message && errors.message ? "border-red-500" : "border-zinc-700"
              } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-base outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 resize-none`}
            />
            {touched.message && errors.message && (
              <p
                id="error-message"
                data-testid="error-message"
                className="mt-1 text-sm text-red-500"
              >
                {errors.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          data-testid="submit-button"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-violet-600 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
        >
          {isSubmitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
