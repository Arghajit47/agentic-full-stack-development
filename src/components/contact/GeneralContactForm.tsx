"use client";

import { useState, useCallback, FormEvent, ChangeEvent } from "react";
import { INQUIRY_TYPES, HEAR_ABOUT_TYPES, type InquiryType, type HearAboutType } from "@/types/contact";
import { SubmissionSuccessModal } from "@/components/ui/SubmissionSuccessModal";

export interface GeneralContactFormData {
  inquiryType: InquiryType;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface GeneralContactFormProps {
  onSubmit?: (data: GeneralContactFormData) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: InquiryType | "";
  hearAbout: HearAboutType | "";
  message: string;
  termsAccepted: boolean;
}

type FieldName = keyof FormState;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  inquiryType?: string;
  hearAbout?: string;
  message?: string;
  termsAccepted?: string;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  inquiryType: "",
  hearAbout: "",
  message: "",
  termsAccepted: false,
};

function validateField(name: FieldName, value: string | boolean): string | undefined {
  switch (name) {
    case "firstName":
      if (!value || (typeof value === "string" && value.trim() === "")) return "First name is required";
      if (typeof value === "string" && value.trim().length > 50) return "First name must be 50 characters or less";
      break;
    case "lastName":
      if (!value || (typeof value === "string" && value.trim() === "")) return "Last name is required";
      if (typeof value === "string" && value.trim().length > 50) return "Last name must be 50 characters or less";
      break;
    case "email":
      if (!value || (typeof value === "string" && value.trim() === "")) return "Email is required";
      if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
        return "Please enter a valid email address";
      }
      if (typeof value === "string" && value.trim().length > 255) return "Email must be 255 characters or less";
      break;
    case "phone":
      if (!value || (typeof value === "string" && value.trim() === "")) return "Phone number is required";
      if (typeof value === "string" && value.trim().length > 20) return "Phone must be 20 characters or less";
      if (typeof value === "string" && value.replace(/[\s\-\(\)\+]/g, "").length < 10) {
        return "Phone must be at least 10 digits and contain only valid characters";
      }
      break;
    case "inquiryType":
      if (!value) return "Please select an inquiry type";
      break;
    case "hearAbout":
      if (!value) return "Please select how you heard about us";
      break;
    case "message":
      if (!value || (typeof value === "string" && value.trim() === "")) return "Message is required";
      if (typeof value === "string" && value.trim().length < 10) return "Message must be at least 10 characters";
      if (typeof value === "string" && value.trim().length > 1000) return "Message must be 1000 characters or less";
      break;
    case "termsAccepted":
      if (value !== true) return "You must agree to the Terms of Use and Privacy Policy";
      break;
  }
  return undefined;
}

function inputClasses(error?: string) {
  return [
    "w-full rounded-xl border bg-zinc-900 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition",
    "focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
    error ? "border-red-500" : "border-zinc-800 hover:border-zinc-700",
  ].join(" ");
}

export function GeneralContactForm({ onSubmit }: GeneralContactFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = useCallback((next: FormState): FormErrors => {
    const nextErrors: FormErrors = {};
    (Object.keys(next) as FieldName[]).forEach((key) => {
      const err = validateField(key, next[key]);
      if (err) nextErrors[key] = err;
    });
    return nextErrors;
  }, []);

  const updateField = useCallback(
    (name: FieldName, value: string | boolean) => {
      setForm((prev) => {
        const next = { ...prev, [name]: value };
        const nextErrors = validate(next);
        setErrors((prevErr) => ({
          ...prevErr,
          [name]: nextErrors[name],
        }));
        return next;
      });
    },
    [validate]
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      updateField(name as FieldName, checked);
    } else {
      updateField(name as FieldName, value);
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name as FieldName] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      inquiryType: true,
      hearAbout: true,
      message: true,
      termsAccepted: true,
    } as Record<FieldName, boolean>);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    setSubmitError(null);

    const payload = {
      inquiryType: form.inquiryType as InquiryType,
      name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    try {
      onSubmit?.(payload);
      const res = await fetch("/api/contact/general", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message ?? data?.error ?? "Submission failed. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    }
  };

  const handleModalClose = () => {
    setForm(initialState);
    setTouched({});
    setErrors({});
    setStatus("idle");
  };

  return (
    <>
      {status === "success" && (
        <SubmissionSuccessModal onClose={handleModalClose} />
      )}
    <section
      data-testid="general-contact-form"
      className="bg-[#141414] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          data-testid="general-contact-form-heading"
          className="font-sans text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          Let&apos;s Connect
        </h2>
        <p
          data-testid="general-contact-form-subheading"
          className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-400 sm:text-lg lg:text-xl"
        >
          We&apos;re excited to connect with you and learn more about your real estate goals. Use
          the form below to get in touch with Estatein. Whether you&apos;re a prospective client,
          partner, or simply curious about our services, we&apos;re here to answer your questions
          and provide the assistance you need.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 sm:mt-12" noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {/* First Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="firstName" className="text-sm font-medium text-white">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter First Name"
                data-testid="input-firstName"
                className={inputClasses(touched.firstName ? errors.firstName : undefined)}
              />
              {touched.firstName && errors.firstName && (
                <span data-testid="error-firstName" className="text-xs text-red-500">{errors.firstName}</span>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="lastName" className="text-sm font-medium text-white">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Last Name"
                data-testid="input-lastName"
                className={inputClasses(touched.lastName ? errors.lastName : undefined)}
              />
              {touched.lastName && errors.lastName && (
                <span data-testid="error-lastName" className="text-xs text-red-500">{errors.lastName}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your Email"
                data-testid="input-email"
                className={inputClasses(touched.email ? errors.email : undefined)}
              />
              {touched.email && errors.email && (
                <span data-testid="error-email" className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-medium text-white">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Phone Number"
                data-testid="input-phone"
                className={inputClasses(touched.phone ? errors.phone : undefined)}
              />
              {touched.phone && errors.phone && (
                <span data-testid="error-phone" className="text-xs text-red-500">{errors.phone}</span>
              )}
            </div>

            {/* Inquiry Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="inquiryType" className="text-sm font-medium text-white">Inquiry Type</label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={form.inquiryType}
                onChange={handleChange}
                onBlur={handleBlur}
                data-testid="input-inquiryType"
                className={inputClasses(touched.inquiryType ? errors.inquiryType : undefined)}
              >
                <option value="" disabled>Select Inquiry Type</option>
                {INQUIRY_TYPES.map((type) => (
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
              {touched.inquiryType && errors.inquiryType && (
                <span data-testid="error-inquiryType" className="text-xs text-red-500">{errors.inquiryType}</span>
              )}
            </div>

            {/* How did you hear about us */}
            <div className="flex flex-col gap-2">
              <label htmlFor="hearAbout" className="text-sm font-medium text-white">How Did You Hear About Us?</label>
              <select
                id="hearAbout"
                name="hearAbout"
                value={form.hearAbout}
                onChange={handleChange}
                onBlur={handleBlur}
                data-testid="input-hearAbout"
                className={inputClasses(touched.hearAbout ? errors.hearAbout : undefined)}
              >
                <option value="" disabled>Select</option>
                {HEAR_ABOUT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {touched.hearAbout && errors.hearAbout && (
                <span data-testid="error-hearAbout" className="text-xs text-red-500">{errors.hearAbout}</span>
              )}
            </div>

            {/* Message - full width on larger screens */}
            <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
              <label htmlFor="message" className="text-sm font-medium text-white">Message</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your Message here.."
                rows={5}
                data-testid="input-message"
                className={inputClasses(touched.message ? errors.message : undefined)}
              />
              {touched.message && errors.message && (
                <span data-testid="error-message" className="text-xs text-red-500">{errors.message}</span>
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="mt-6 flex items-start gap-3">
            <input
              id="termsAccepted"
              name="termsAccepted"
              type="checkbox"
              checked={form.termsAccepted}
              onChange={handleChange}
              onBlur={handleBlur}
              data-testid="input-termsAccepted"
              className="mt-0.5 h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-violet-600 accent-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="termsAccepted" className="text-sm leading-relaxed text-zinc-400">
              I agree to the{" "}
              <a href="/terms" className="text-violet-400 hover:underline">Terms of Use</a>{" "}
              and{" "}
              <a href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</a>
            </label>
          </div>
          {touched.termsAccepted && errors.termsAccepted && (
            <span data-testid="error-termsAccepted" className="mt-1 block text-xs text-red-500">
              {errors.termsAccepted}
            </span>
          )}

          {submitError && (
            <div data-testid="submit-error" className="mt-4 text-sm text-red-500">{submitError}</div>
          )}

          <button
            type="submit"
            data-testid="submit-button"
            disabled={status === "submitting"}
            className="mt-8 w-full rounded-xl bg-violet-600 px-6 py-4 text-base font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-zinc-700 sm:text-lg"
          >
            {status === "submitting" ? "Sending..." : "Send Your Message"}
          </button>
        </form>
      </div>
    </section>
    </>
  );
}
