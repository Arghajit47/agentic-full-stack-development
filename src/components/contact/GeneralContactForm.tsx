"use client";

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { INQUIRY_TYPES, type InquiryType } from "@/app/api/contact/general/route";

export interface GeneralContactFormData {
  inquiryType: InquiryType | "";
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface GeneralContactFormProps {
  onSubmit?: (data: Omit<GeneralContactFormData, "inquiryType"> & { inquiryType: InquiryType }) => void | Promise<void>;
}

interface FormErrors {
  inquiryType?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const initialFormData: GeneralContactFormData = {
  inquiryType: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function GeneralContactForm({ onSubmit }: GeneralContactFormProps) {
  const [formData, setFormData] = useState<GeneralContactFormData>(initialFormData);
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
    // Must be at least 10 characters and contain only valid phone characters
    if (phone.length < 10) return false;
    const phoneRegex = /^[0-9+\-() ]+$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.inquiryType) {
      newErrors.inquiryType = "Please select an inquiry type";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be 100 characters or less";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 255) {
      newErrors.email = "Email must be 255 characters or less";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Phone must be at least 10 digits and contain only valid characters";
    } else if (formData.phone.length > 20) {
      newErrors.phone = "Phone must be 20 characters or less";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Message must be 1000 characters or less";
    }

    return newErrors;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    if (Object.keys(formErrors).length === 0 && formData.inquiryType) {
      setIsSubmitting(true);

      try {
        // Submit to API endpoint
        const response = await fetch("/api/contact/general", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inquiryType: formData.inquiryType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(result.message || "Too many submissions. Please try again later.");
          }
          throw new Error(result.error || "Submission failed");
        }

        // Call onSubmit prop if provided
        if (onSubmit) {
          await onSubmit({
            inquiryType: formData.inquiryType as InquiryType,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          });
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
      <section
        data-testid="general-contact-form-success"
        role="status"
        aria-live="polite"
        className="w-full bg-[#141414] px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-[48px]">
            Thank You!
          </h2>
          <p className="mt-4 text-lg text-[#999999]">
            Your inquiry has been submitted successfully. We&apos;ll get back to you soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      data-testid="general-contact-form"
      className="w-full bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2
            data-testid="general-contact-form-heading"
            className="text-3xl font-semibold text-white sm:text-4xl lg:text-[48px]"
          >
            Send Us a Message
          </h2>
          <p
            data-testid="general-contact-form-subheading"
            className="mt-4 text-base text-[#999999] sm:text-lg lg:text-[18px]"
          >
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div
              role="alert"
              data-testid="submit-error"
              className="mb-6 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-red-400"
            >
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            {/* Inquiry Type */}
            <div>
              <label
                htmlFor="inquiryType"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Inquiry Type
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                data-testid="input-inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
                onBlur={() => handleBlur("inquiryType")}
                aria-invalid={touched.inquiryType && !!errors.inquiryType}
                aria-describedby={
                  touched.inquiryType && errors.inquiryType ? "error-inquiryType" : undefined
                }
                className={`w-full appearance-none cursor-pointer rounded-lg border ${
                  touched.inquiryType && errors.inquiryType
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-[18px] text-white outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              >
                <option value="" className="text-[#666666]">
                  Select Inquiry Type
                </option>
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {touched.inquiryType && errors.inquiryType && (
                <p
                  id="error-inquiryType"
                  data-testid="error-inquiryType"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.inquiryType}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-[20px] font-medium text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                data-testid="input-name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur("name")}
                placeholder="Enter your full name"
                aria-invalid={touched.name && !!errors.name}
                aria-describedby={touched.name && errors.name ? "error-name" : undefined}
                className={`w-full rounded-lg border ${
                  touched.name && errors.name ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-[18px] text-white placeholder-[#666666] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.name && errors.name && (
                <p id="error-name" data-testid="error-name" className="mt-1 text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email and Phone (side by side on larger screens) */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-[20px] font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  data-testid="input-email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  aria-invalid={touched.email && !!errors.email}
                  aria-describedby={touched.email && errors.email ? "error-email" : undefined}
                  className={`w-full rounded-lg border ${
                    touched.email && errors.email ? "border-red-500" : "border-zinc-700"
                  } bg-zinc-900 px-4 py-3 text-[18px] text-white placeholder-[#666666] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
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
                <label htmlFor="phone" className="mb-2 block text-[20px] font-medium text-white">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  data-testid="input-phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("phone")}
                  placeholder="Enter phone number"
                  aria-invalid={touched.phone && !!errors.phone}
                  aria-describedby={touched.phone && errors.phone ? "error-phone" : undefined}
                  className={`w-full rounded-lg border ${
                    touched.phone && errors.phone ? "border-red-500" : "border-zinc-700"
                  } bg-zinc-900 px-4 py-3 text-[18px] text-white placeholder-[#666666] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
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
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="mb-2 block text-[20px] font-medium text-white">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                data-testid="input-message"
                value={formData.message}
                onChange={handleInputChange}
                onBlur={() => handleBlur("message")}
                placeholder="Enter your message here..."
                rows={5}
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={touched.message && errors.message ? "error-message" : undefined}
                className={`w-full resize-none rounded-lg border ${
                  touched.message && errors.message ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-[18px] text-white placeholder-[#666666] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
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
            className="mt-6 w-full rounded-lg bg-violet-600 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
