"use client";

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";

export interface PropertyInquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  agreeToTerms: boolean;
}

export interface PropertyInquiryFormProps {
  propertySlug: string;
  propertyTitle: string;
  propertyLocation?: string;
  onSubmit?: (data: PropertyInquiryFormData & { propertySlug: string }) => void | Promise<void>;
  className?: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  agreeToTerms?: string;
}

const initialFormData: PropertyInquiryFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  agreeToTerms: false,
};

export function PropertyInquiryForm({
  propertySlug,
  propertyTitle,
  propertyLocation,
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
    const phoneRegex = /^[\d\s()+-]+$/;
    const digitsOnly = phone.replace(/\D/g, "");
    return phoneRegex.test(phone) && digitsOnly.length >= 10;
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Use";
    }

    return newErrors;
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));

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

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmitting(true);

      try {
        console.log("Property inquiry submission initiated");

        if (onSubmit) {
          await onSubmit({ ...formData, propertySlug });
        }

        setIsSubmitted(true);

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

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-lg border ${
      touched[field] && errors[field] ? "border-red-500" : "border-zinc-700"
    } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-base outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`;

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
        Inquire About {propertyTitle}
      </h3>
      <p
        data-testid="inquiry-form-subheading"
        className="text-base text-[#999999] mb-6"
      >
        Interested in this property? Fill out the form below and our team will get back to you shortly.
      </p>

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
          {/* First Name + Last Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="inquiry-first-name"
                className="mb-2 block text-base font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="inquiry-first-name"
                name="firstName"
                data-testid="input-first-name"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter your first name"
                aria-invalid={!!(touched.firstName && errors.firstName)}
                aria-describedby={touched.firstName && errors.firstName ? "error-first-name" : undefined}
                className={inputClass("firstName")}
              />
              {touched.firstName && errors.firstName && (
                <p
                  id="error-first-name"
                  data-testid="error-first-name"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="inquiry-last-name"
                className="mb-2 block text-base font-medium text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="inquiry-last-name"
                name="lastName"
                data-testid="input-last-name"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("lastName")}
                placeholder="Enter your last name"
                aria-invalid={!!(touched.lastName && errors.lastName)}
                aria-describedby={touched.lastName && errors.lastName ? "error-last-name" : undefined}
                className={inputClass("lastName")}
              />
              {touched.lastName && errors.lastName && (
                <p
                  id="error-last-name"
                  data-testid="error-last-name"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Selected Property (readonly) */}
          <div>
            <label
              htmlFor="inquiry-selected-property"
              className="mb-2 block text-base font-medium text-white"
            >
              Selected Property
            </label>
            <input
              type="text"
              id="inquiry-selected-property"
              name="selectedProperty"
              data-testid="input-selected-property"
              value={propertyLocation ? `${propertyTitle}, ${propertyLocation}` : propertyTitle}
              readOnly
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400 text-base outline-none cursor-not-allowed"
            />
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
              className={inputClass("email")}
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
              className={inputClass("phone")}
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
              className={`${inputClass("message")} resize-none`}
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

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                data-testid="input-agree-terms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                onBlur={() => handleBlur("agreeToTerms")}
                className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-700 bg-zinc-900 accent-violet-600"
              />
              <span className="text-sm text-[#999999]">
                I agree to the{" "}
                <span className="text-white underline">Terms of Use</span>
              </span>
            </label>
            {touched.agreeToTerms && errors.agreeToTerms && (
              <p
                id="error-agree-terms"
                data-testid="error-agree-terms"
                className="mt-1 text-sm text-red-500"
              >
                {errors.agreeToTerms}
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
          {isSubmitting ? "Sending..." : "Send Your Message"}
        </button>
      </form>
    </div>
  );
}
