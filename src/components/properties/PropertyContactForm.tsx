"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
    if (fieldErrors[fieldName as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: fieldErrors[fieldName as keyof FormErrors],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm();
    setErrors(formErrors);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (Object.keys(formErrors).length === 0) {
      // Mock submit - log to console
      console.log("Form submitted:", formData);

      // Call onSubmit prop if provided
      if (onSubmit) {
        await onSubmit(formData);
      }

      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData(initialFormData);
        setErrors({});
        setTouched({});
        setIsSubmitted(false);
      }, 3000);
    }
  };

  if (isSubmitted) {
    return (
      <section
        data-testid="contact-form-success"
        className="w-full bg-[#141414] px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl lg:text-[48px]">
            Thank You!
          </h2>
          <p className="mt-4 text-lg text-[#999999]">
            Your inquiry has been submitted successfully. We'll get back to you soon.
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
            Let's Make it Happen
          </h2>
          <p
            data-testid="contact-form-subheading"
            className="mt-4 text-base text-[#999999] sm:text-lg lg:text-[18px]"
          >
            Ready to take the first step toward your dream property? Fill out the form
            below, and our real estate wizards will work their magic to find your perfect
            match. Don't wait; let's embark on this exciting journey together.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
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
                className={`w-full rounded-lg border ${
                  touched.firstName && errors.firstName
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.firstName && errors.firstName && (
                <p
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
                className={`w-full rounded-lg border ${
                  touched.lastName && errors.lastName
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.lastName && errors.lastName && (
                <p
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
                className={`w-full rounded-lg border ${
                  touched.email && errors.email ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.email && errors.email && (
                <p data-testid="error-email" className="mt-1 text-sm text-red-500">
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
                className={`w-full rounded-lg border ${
                  touched.phone && errors.phone ? "border-red-500" : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50`}
              />
              {touched.phone && errors.phone && (
                <p data-testid="error-phone" className="mt-1 text-sm text-red-500">
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
                <p data-testid="error-bedrooms" className="mt-1 text-sm text-red-500">
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
                <p data-testid="error-budget" className="mt-1 text-sm text-red-500">
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
                className={`w-full rounded-lg border ${
                  touched.message && errors.message
                    ? "border-red-500"
                    : "border-zinc-700"
                } bg-zinc-900 px-4 py-3 text-white placeholder-[#666666] text-[18px] outline-none transition-colors focus:border-violet-600 focus:ring-2 focus:ring-violet-600/50 resize-none`}
              />
              {touched.message && errors.message && (
                <p data-testid="error-message" className="mt-1 text-sm text-red-500">
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
            disabled={!formData.agreeToTerms}
            className="mt-6 w-full rounded-lg bg-violet-600 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-[#141414]"
          >
            Send Your Message
          </button>
        </form>
      </div>
    </section>
  );
}
