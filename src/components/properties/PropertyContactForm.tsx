"use client";

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";

export interface PropertyContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredLocation: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  budget: string;
  message: string;
  agreeToTerms: boolean;
}

export interface PropertyContactFormProps {
  onSubmit?: (data: PropertyContactFormData) => void | Promise<void>;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredLocation?: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  budget?: string;
  message?: string;
}

const initialFormData: PropertyContactFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  preferredLocation: "",
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  budget: "",
  message: "",
  agreeToTerms: false,
};

export function PropertyContactForm({ onSubmit }: PropertyContactFormProps) {
  const [formData, setFormData] = useState<PropertyContactFormData>(initialFormData);
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

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.preferredLocation) {
      newErrors.preferredLocation = "Preferred location is required";
    }

    if (!formData.propertyType) {
      newErrors.propertyType = "Property type is required";
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = "Number of bedrooms is required";
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = "Number of bathrooms is required";
    }

    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
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

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }));
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
        console.log("Form submission initiated");

        // Call onSubmit prop if provided
        if (onSubmit) {
          await onSubmit(formData);
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
        data-testid="contact-form-success"
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
      data-testid="property-contact-form"
      className="w-full bg-[#141414] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h2
            data-testid="contact-form-heading"
            className="text-3xl font-semibold text-white sm:text-4xl lg:text-[48px]"
          >
            Let&apos;s Make it Happen
          </h2>
          <p
            data-testid="contact-form-subheading"
            className="mt-4 text-base text-[#999999] sm:text-lg lg:text-[18px]"
          >
            Ready to take the first step toward your dream property? Fill out the form
            below, and our real estate wizards will work their magic to find your perfect
            match. Don&apos;t wait; let&apos;s embark on this exciting journey together.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div 
              role="alert"
              className="mb-6 rounded-lg bg-red-900/20 border border-red-500 px-4 py-3 text-red-400"
            >
              {submitError}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                data-testid="input-firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("firstName")}
                placeholder="Enter First Name"
                aria-invalid={touched.firstName && !!errors.firstName}
                aria-describedby={touched.firstName && errors.firstName ? "error-firstName" : undefined}
                className={`w-full rounded-lg border ${
                  touched.firstName && errors.firstName
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.firstName && errors.firstName && (
                <p
                  id="error-firstName"
                  data-testid="error-firstName"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                data-testid="input-lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={() => handleBlur("lastName")}
                placeholder="Enter Last Name"
                aria-invalid={touched.lastName && !!errors.lastName}
                aria-describedby={touched.lastName && errors.lastName ? "error-lastName" : undefined}
                className={`w-full rounded-lg border ${
                  touched.lastName && errors.lastName
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.lastName && errors.lastName && (
                <p
                  id="error-lastName"
                  data-testid="error-lastName"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[20px] font-medium text-white"
              >
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
                placeholder="Enter your Email"
                aria-invalid={touched.email && !!errors.email}
                aria-describedby={touched.email && errors.email ? "error-email" : undefined}
                className={`w-full rounded-lg border ${
                  touched.email && errors.email ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
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
                htmlFor="phone"
                className="mb-2 block text-[20px] font-medium text-white"
              >
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
                placeholder="Enter Phone Number"
                aria-invalid={touched.phone && !!errors.phone}
                aria-describedby={touched.phone && errors.phone ? "error-phone" : undefined}
                className={`w-full rounded-lg border ${
                  touched.phone && errors.phone ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
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

            {/* Preferred Location */}
            <div>
              <label
                htmlFor="preferredLocation"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Preferred Location
              </label>
              <select
                id="preferredLocation"
                name="preferredLocation"
                data-testid="input-preferredLocation"
                value={formData.preferredLocation}
                onChange={handleInputChange}
                onBlur={() => handleBlur("preferredLocation")}
                aria-invalid={touched.preferredLocation && !!errors.preferredLocation}
                aria-describedby={touched.preferredLocation && errors.preferredLocation ? "error-preferredLocation" : undefined}
                className={`property-select w-full rounded-lg border ${
                  touched.preferredLocation && errors.preferredLocation
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 appearance-none cursor-pointer`}
              >
                <option value="" className="text-[#666666]">
                  Select Location
                </option>
                <option value="Downtown">Downtown</option>
                <option value="Suburb">Suburb</option>
                <option value="Waterfront">Waterfront</option>
                <option value="Countryside">Countryside</option>
              </select>
              {touched.preferredLocation && errors.preferredLocation && (
                <p
                  id="error-preferredLocation"
                  data-testid="error-preferredLocation"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.preferredLocation}
                </p>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label
                htmlFor="propertyType"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                data-testid="input-propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                onBlur={() => handleBlur("propertyType")}
                aria-invalid={touched.propertyType && !!errors.propertyType}
                aria-describedby={touched.propertyType && errors.propertyType ? "error-propertyType" : undefined}
                className={`property-select w-full rounded-lg border ${
                  touched.propertyType && errors.propertyType
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 appearance-none cursor-pointer`}
              >
                <option value="" className="text-[#666666]">
                  Select Property Type
                </option>
                <option value="Villa">Villa</option>
                <option value="Mansion">Mansion</option>
                <option value="Cottage">Cottage</option>
                <option value="Estate">Estate</option>
                <option value="House">House</option>
              </select>
              {touched.propertyType && errors.propertyType && (
                <p
                  id="error-propertyType"
                  data-testid="error-propertyType"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.propertyType}
                </p>
              )}
            </div>

            {/* No. of Bedrooms */}
            <div>
              <label
                htmlFor="bedrooms"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                No. of Bedrooms
              </label>
              <select
                id="bedrooms"
                name="bedrooms"
                data-testid="input-bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                onBlur={() => handleBlur("bedrooms")}
                aria-invalid={touched.bedrooms && !!errors.bedrooms}
                aria-describedby={touched.bedrooms && errors.bedrooms ? "error-bedrooms" : undefined}
                className={`property-select w-full rounded-lg border ${
                  touched.bedrooms && errors.bedrooms
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 appearance-none cursor-pointer`}
              >
                <option value="" className="text-[#666666]">
                  Select no. of Bedrooms
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
              {touched.bedrooms && errors.bedrooms && (
                <p 
                  id="error-bedrooms"
                  data-testid="error-bedrooms" 
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.bedrooms}
                </p>
              )}
            </div>

            {/* No. of Bathrooms */}
            <div>
              <label
                htmlFor="bathrooms"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                No. of Bathrooms
              </label>
              <select
                id="bathrooms"
                name="bathrooms"
                data-testid="input-bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                onBlur={() => handleBlur("bathrooms")}
                aria-invalid={touched.bathrooms && !!errors.bathrooms}
                aria-describedby={touched.bathrooms && errors.bathrooms ? "error-bathrooms" : undefined}
                className={`property-select w-full rounded-lg border ${
                  touched.bathrooms && errors.bathrooms
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 appearance-none cursor-pointer`}
              >
                <option value="" className="text-[#666666]">
                  Select no. of Bathrooms
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5+">5+</option>
              </select>
              {touched.bathrooms && errors.bathrooms && (
                <p
                  id="error-bathrooms"
                  data-testid="error-bathrooms"
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.bathrooms}
                </p>
              )}
            </div>

            {/* Budget */}
            <div className="sm:col-span-2">
              <label
                htmlFor="budget"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Budget
              </label>
              <select
                id="budget"
                name="budget"
                data-testid="input-budget"
                value={formData.budget}
                onChange={handleInputChange}
                onBlur={() => handleBlur("budget")}
                aria-invalid={touched.budget && !!errors.budget}
                aria-describedby={touched.budget && errors.budget ? "error-budget" : undefined}
                className={`property-select w-full rounded-lg border ${
                  touched.budget && errors.budget ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 appearance-none cursor-pointer`}
              >
                <option value="" className="text-[#666666]">
                  Select Budget
                </option>
                <option value="Under $500k">Under $500k</option>
                <option value="$500k - $1M">$500k - $1M</option>
                <option value="$1M - $2M">$1M - $2M</option>
                <option value="$2M - $5M">$2M - $5M</option>
                <option value="Over $5M">Over $5M</option>
              </select>
              {touched.budget && errors.budget && (
                <p 
                  id="error-budget"
                  data-testid="error-budget" 
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.budget}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="mb-2 block text-[20px] font-medium text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                data-testid="input-message"
                value={formData.message}
                onChange={handleInputChange}
                onBlur={() => handleBlur("message")}
                placeholder="Enter your Message here.."
                rows={5}
                aria-invalid={touched.message && !!errors.message}
                aria-describedby={touched.message && errors.message ? "error-message" : undefined}
                className={`w-full rounded-lg border ${
                  touched.message && errors.message
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 resize-none`}
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

          {/* Terms Checkbox */}
          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                data-testid="input-agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                className="mt-1 h-5 w-5 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-violet-600 focus:ring-2 focus:ring-violet-600/50 focus:ring-offset-0"
              />
              <span className="text-[18px] text-[#999999]">
                I agree with Terms of Use and Privacy Policy
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            data-testid="submit-button"
            disabled={!formData.agreeToTerms || isSubmitting}
            className="mt-6 w-full rounded-lg bg-violet-600 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-[#141414]"
          >
            {isSubmitting ? "Sending..." : "Send Your Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
