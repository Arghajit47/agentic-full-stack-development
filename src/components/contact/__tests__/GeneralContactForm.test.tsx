import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { GeneralContactForm, type GeneralContactFormData } from "../GeneralContactForm";

global.fetch = vi.fn();

describe("GeneralContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        success: true,
        message: "General inquiry submitted successfully",
        submissionId: "test-id-123",
      }),
    } as Response);
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders the form with heading and subheading", () => {
      render(<GeneralContactForm />);
      expect(screen.getByTestId("general-contact-form")).toBeInTheDocument();
      expect(screen.getByTestId("general-contact-form-heading")).toHaveTextContent("Let's Connect");
      expect(screen.getByTestId("general-contact-form-subheading")).toHaveTextContent(/We're excited to connect/);
    });

    it("renders all form fields with correct labels", () => {
      render(<GeneralContactForm />);
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Inquiry Type")).toBeInTheDocument();
      expect(screen.getByLabelText("How Did You Hear About Us?")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("renders placeholders", () => {
      render(<GeneralContactForm />);
      expect(screen.getByPlaceholderText("Enter First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Last Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Phone Number")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your Message here..")).toBeInTheDocument();
    });

    it("renders inquiry type options", () => {
      render(<GeneralContactForm />);
      const select = screen.getByTestId("input-inquiryType") as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);
      expect(options).toContain("");
      expect(options).toContain("general");
      expect(options).toContain("support");
      expect(options).toContain("partnership");
      expect(options).toContain("careers");
    });

    it("renders hear about options", () => {
      render(<GeneralContactForm />);
      const select = screen.getByTestId("input-hearAbout") as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);
      expect(options).toContain("");
      expect(options).toContain("Social Media");
      expect(options).toContain("Search Engine");
      expect(options).toContain("Friend/Family");
      expect(options).toContain("Advertisement");
      expect(options).toContain("Other");
    });

    it("renders terms checkbox and full-width submit button", () => {
      render(<GeneralContactForm />);
      expect(screen.getByLabelText(/I agree to the/)).toBeInTheDocument();
      const button = screen.getByTestId("submit-button");
      expect(button).toHaveTextContent("Send Your Message");
      expect(button).toHaveClass("w-full");
    });
  });

  describe("Validation - On Blur", () => {
    it("shows first name error when empty", () => {
      render(<GeneralContactForm />);
      fireEvent.blur(screen.getByTestId("input-firstName"));
      expect(screen.getByTestId("error-firstName")).toHaveTextContent("First name is required");
    });

    it("shows last name error when empty", () => {
      render(<GeneralContactForm />);
      fireEvent.blur(screen.getByTestId("input-lastName"));
      expect(screen.getByTestId("error-lastName")).toHaveTextContent("Last name is required");
    });

    it("shows email error when invalid", () => {
      render(<GeneralContactForm />);
      const input = screen.getByTestId("input-email");
      fireEvent.change(input, { target: { value: "bad" } });
      fireEvent.blur(input);
      expect(screen.getByTestId("error-email")).toHaveTextContent("Please enter a valid email address");
    });

    it("shows phone error when too short", () => {
      render(<GeneralContactForm />);
      const input = screen.getByTestId("input-phone");
      fireEvent.change(input, { target: { value: "123" } });
      fireEvent.blur(input);
      expect(screen.getByTestId("error-phone")).toHaveTextContent("Phone must be at least 10 digits");
    });

    it("shows inquiry type error when empty", () => {
      render(<GeneralContactForm />);
      fireEvent.blur(screen.getByTestId("input-inquiryType"));
      expect(screen.getByTestId("error-inquiryType")).toHaveTextContent("Please select an inquiry type");
    });

    it("shows hear about error when empty", () => {
      render(<GeneralContactForm />);
      fireEvent.blur(screen.getByTestId("input-hearAbout"));
      expect(screen.getByTestId("error-hearAbout")).toHaveTextContent("Please select how you heard about us");
    });

    it("shows message error when too short", () => {
      render(<GeneralContactForm />);
      const input = screen.getByTestId("input-message");
      fireEvent.change(input, { target: { value: "Hi" } });
      fireEvent.blur(input);
      expect(screen.getByTestId("error-message")).toHaveTextContent("Message must be at least 10 characters");
    });

    it("shows terms error when unchecked on submit", () => {
      render(<GeneralContactForm />);
      fireEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByTestId("error-termsAccepted")).toHaveTextContent(
        "You must agree to the Terms of Use and Privacy Policy"
      );
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByTestId("input-firstName"), { target: { value: "Jane" } });
      fireEvent.change(screen.getByTestId("input-lastName"), { target: { value: "Doe" } });
      fireEvent.change(screen.getByTestId("input-email"), { target: { value: "jane@example.com" } });
      fireEvent.change(screen.getByTestId("input-phone"), { target: { value: "+1 (555) 123-4567" } });
      fireEvent.change(screen.getByTestId("input-inquiryType"), { target: { value: "general" } });
      fireEvent.change(screen.getByTestId("input-hearAbout"), { target: { value: "Social Media" } });
      fireEvent.change(screen.getByTestId("input-message"), {
        target: { value: "This is a valid test message with enough characters." },
      });
      fireEvent.click(screen.getByTestId("input-termsAccepted"));
    };

    it("calls fetch with combined first+last name payload", async () => {
      render(<GeneralContactForm />);
      fillValidForm();
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/contact/general", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inquiryType: "general",
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "+1 (555) 123-4567",
            message: "This is a valid test message with enough characters.",
          }),
        });
      });
    });

    it("calls onSubmit callback", async () => {
      const onSubmitMock = vi.fn();
      render(<GeneralContactForm onSubmit={onSubmitMock} />);
      fillValidForm();
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith({
          inquiryType: "general",
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "+1 (555) 123-4567",
          message: "This is a valid test message with enough characters.",
        } as GeneralContactFormData);
      });
    });

    it("displays success message and resets form", async () => {
      render(<GeneralContactForm />);
      fillValidForm();
      fireEvent.click(screen.getByTestId("submit-button"));

      await waitFor(() => {
        expect(screen.getByTestId("general-contact-form-success")).toBeInTheDocument();
      });

      vi.advanceTimersByTime(3000);
      await waitFor(() => {
        expect(screen.queryByTestId("general-contact-form-success")).not.toBeInTheDocument();
        expect(screen.getByTestId("general-contact-form")).toBeInTheDocument();
      });
    });

    it("disables submit button while submitting", async () => {
      render(<GeneralContactForm />);
      fillValidForm();
      fireEvent.click(screen.getByTestId("submit-button"));
      expect(screen.getByTestId("submit-button")).toBeDisabled();
      expect(screen.getByTestId("submit-button")).toHaveTextContent("Sending...");
    });
  });

  describe("Error Handling", () => {
    it("displays API error message", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      } as Response);

      render(<GeneralContactForm />);
      fireEvent.change(screen.getByTestId("input-firstName"), { target: { value: "Jane" } });
      fireEvent.change(screen.getByTestId("input-lastName"), { target: { value: "Doe" } });
      fireEvent.change(screen.getByTestId("input-email"), { target: { value: "jane@example.com" } });
      fireEvent.change(screen.getByTestId("input-phone"), { target: { value: "1234567890" } });
      fireEvent.change(screen.getByTestId("input-inquiryType"), { target: { value: "general" } });
      fireEvent.change(screen.getByTestId("input-hearAbout"), { target: { value: "Other" } });
      fireEvent.change(screen.getByTestId("input-message"), { target: { value: "Test message here for validation." } });
      fireEvent.click(screen.getByTestId("input-termsAccepted"));

      fireEvent.click(screen.getByTestId("submit-button"));
      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toHaveTextContent("Internal server error");
      });
    });
  });
});
