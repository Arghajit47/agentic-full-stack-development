import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { GeneralContactForm, GeneralContactFormData } from "../GeneralContactForm";

// Mock fetch
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
    vi.useRealTimers();
  });

  describe("Rendering", () => {
    it("should render the form with heading and subheading", () => {
      render(<GeneralContactForm />);

      expect(screen.getByTestId("general-contact-form")).toBeInTheDocument();
      expect(screen.getByTestId("general-contact-form-heading")).toHaveTextContent(
        "Send Us a Message"
      );
      expect(screen.getByTestId("general-contact-form-subheading")).toHaveTextContent(
        /Fill out the form below/
      );
    });

    it("should render all form fields with correct labels", () => {
      render(<GeneralContactForm />);

      expect(screen.getByLabelText("Inquiry Type")).toBeInTheDocument();
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("should render all fields with correct placeholders", () => {
      render(<GeneralContactForm />);

      expect(screen.getByPlaceholderText("Enter your full name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter phone number")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your message here...")).toBeInTheDocument();
    });

    it("should render inquiry type dropdown with all options", () => {
      render(<GeneralContactForm />);

      const select = screen.getByTestId("input-inquiryType") as HTMLSelectElement;
      const options = Array.from(select.options).map((opt) => opt.value);

      expect(options).toContain("");
      expect(options).toContain("general");
      expect(options).toContain("support");
      expect(options).toContain("partnership");
      expect(options).toContain("careers");
    });

    it("should render submit button", () => {
      render(<GeneralContactForm />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent("Send Message");
    });
  });

  describe("Form Input", () => {
    it("should update inquiry type on change", () => {
      render(<GeneralContactForm />);

      const select = screen.getByTestId("input-inquiryType") as HTMLSelectElement;
      fireEvent.change(select, { target: { value: "general" } });

      expect(select.value).toBe("general");
    });

    it("should update text input values on change", () => {
      render(<GeneralContactForm />);

      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
      const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(phoneInput.value).toBe("1234567890");
    });

    it("should update textarea value on change", () => {
      render(<GeneralContactForm />);

      const messageInput = screen.getByTestId("input-message") as HTMLTextAreaElement;
      fireEvent.change(messageInput, {
        target: { value: "This is a test message with more than ten characters." },
      });

      expect(messageInput.value).toBe("This is a test message with more than ten characters.");
    });
  });

  describe("Validation - On Blur", () => {
    it("should show inquiry type error on blur when empty", () => {
      render(<GeneralContactForm />);

      const select = screen.getByTestId("input-inquiryType");
      fireEvent.blur(select);

      expect(screen.getByTestId("error-inquiryType")).toHaveTextContent(
        "Please select an inquiry type"
      );
    });

    it("should show name error on blur when empty", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-name");
      fireEvent.blur(input);

      expect(screen.getByTestId("error-name")).toHaveTextContent("Name is required");
    });

    it("should show email error on blur when empty", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-email");
      fireEvent.blur(input);

      expect(screen.getByTestId("error-email")).toHaveTextContent("Email is required");
    });

    it("should show email error on blur when invalid", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-email");
      fireEvent.change(input, { target: { value: "invalid-email" } });
      fireEvent.blur(input);

      expect(screen.getByTestId("error-email")).toHaveTextContent(
        "Please enter a valid email address"
      );
    });

    it("should show phone error on blur when empty", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-phone");
      fireEvent.blur(input);

      expect(screen.getByTestId("error-phone")).toHaveTextContent("Phone number is required");
    });

    it("should show phone error on blur when too short", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-phone");
      fireEvent.change(input, { target: { value: "123" } });
      fireEvent.blur(input);

      expect(screen.getByTestId("error-phone")).toHaveTextContent(
        "Phone must be at least 10 digits and contain only valid characters"
      );
    });

    it("should show message error on blur when empty", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-message");
      fireEvent.blur(input);

      expect(screen.getByTestId("error-message")).toHaveTextContent("Message is required");
    });

    it("should show message error on blur when too short", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-message");
      fireEvent.change(input, { target: { value: "Short" } });
      fireEvent.blur(input);

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Message must be at least 10 characters"
      );
    });

    it("should clear error when valid value is entered after blur", () => {
      render(<GeneralContactForm />);

      const input = screen.getByTestId("input-email");

      // Trigger error
      fireEvent.blur(input);
      expect(screen.getByTestId("error-email")).toBeInTheDocument();

      // Enter valid email
      fireEvent.change(input, { target: { value: "valid@example.com" } });

      // Error should be cleared
      expect(screen.queryByTestId("error-email")).not.toBeInTheDocument();
    });
  });

  describe("Validation - On Submit", () => {
    it("should show all validation errors when submitting empty form", () => {
      render(<GeneralContactForm />);

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      expect(screen.getByTestId("error-inquiryType")).toBeInTheDocument();
      expect(screen.getByTestId("error-name")).toBeInTheDocument();
      expect(screen.getByTestId("error-email")).toBeInTheDocument();
      expect(screen.getByTestId("error-phone")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });

    it("should validate name length maximum", () => {
      render(<GeneralContactForm />);

      const nameInput = screen.getByTestId("input-name");
      const longName = "a".repeat(101);

      fireEvent.change(nameInput, { target: { value: longName } });
      fireEvent.blur(nameInput);

      expect(screen.getByTestId("error-name")).toHaveTextContent(
        "Name must be 100 characters or less"
      );
    });

    it("should validate email length maximum", () => {
      render(<GeneralContactForm />);

      const emailInput = screen.getByTestId("input-email");
      const longEmail = "a".repeat(250) + "@example.com";

      fireEvent.change(emailInput, { target: { value: longEmail } });
      fireEvent.blur(emailInput);

      expect(screen.getByTestId("error-email")).toHaveTextContent(
        "Email must be 255 characters or less"
      );
    });

    it("should validate phone length maximum", () => {
      render(<GeneralContactForm />);

      const phoneInput = screen.getByTestId("input-phone");
      const longPhone = "1".repeat(21);

      fireEvent.change(phoneInput, { target: { value: longPhone } });
      fireEvent.blur(phoneInput);

      expect(screen.getByTestId("error-phone")).toHaveTextContent(
        "Phone must be 20 characters or less"
      );
    });

    it("should validate message length maximum", () => {
      render(<GeneralContactForm />);

      const messageInput = screen.getByTestId("input-message");
      const longMessage = "a".repeat(1001);

      fireEvent.change(messageInput, { target: { value: longMessage } });
      fireEvent.blur(messageInput);

      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Message must be 1000 characters or less"
      );
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "general" } });
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "+1 (555) 123-4567" } });
      fireEvent.change(messageInput, {
        target: { value: "This is a valid test message with enough characters." },
      });
    };

    it("should call fetch with correct data on valid form submission", async () => {
      render(<GeneralContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/contact/general", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inquiryType: "general",
            name: "John Doe",
            email: "john@example.com",
            phone: "+1 (555) 123-4567",
            message: "This is a valid test message with enough characters.",
          }),
        });
      });
    });

    it("should display success message after successful submission", async () => {
      render(<GeneralContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("general-contact-form-success")).toBeInTheDocument();
        expect(screen.getByText("Thank You!")).toBeInTheDocument();
      });
    });

    it("should call onSubmit callback when provided", async () => {
      const onSubmitMock = vi.fn();
      render(<GeneralContactForm onSubmit={onSubmitMock} />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmitMock).toHaveBeenCalledWith({
          inquiryType: "general",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          message: "This is a valid test message with enough characters.",
        });
      });
    });

    it("should disable submit button during submission", async () => {
      render(<GeneralContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Sending...");
    });

    it("should reset form after 3 seconds on successful submission", async () => {
      render(<GeneralContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("general-contact-form-success")).toBeInTheDocument();
      });

      // Fast-forward 3 seconds
      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(screen.queryByTestId("general-contact-form-success")).not.toBeInTheDocument();
        expect(screen.getByTestId("general-contact-form")).toBeInTheDocument();
      });

      // Form should be reset
      const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
      expect(nameInput.value).toBe("");
    });
  });

  describe("Error Handling", () => {
    it("should display error message on API failure", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Internal server error" }),
      } as Response);

      render(<GeneralContactForm />);

      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "general" } });
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(messageInput, { target: { value: "Test message here" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toHaveTextContent("Internal server error");
      });
    });

    it("should handle rate limit error", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({
          error: "Rate limit exceeded",
          message: "Too many contact submissions. Please try again later.",
        }),
      } as Response);

      render(<GeneralContactForm />);

      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "support" } });
      fireEvent.change(nameInput, { target: { value: "Jane Smith" } });
      fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "9876543210" } });
      fireEvent.change(messageInput, { target: { value: "Need support help" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toHaveTextContent(
          "Too many contact submissions. Please try again later."
        );
      });
    });

    it("should keep form enabled after error", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      } as Response);

      render(<GeneralContactForm />);

      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "general" } });
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("submit-error")).toBeInTheDocument();
      });

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria-invalid attributes when fields have errors", () => {
      render(<GeneralContactForm />);

      const nameInput = screen.getByTestId("input-name");
      fireEvent.blur(nameInput);

      expect(nameInput).toHaveAttribute("aria-invalid", "true");
    });

    it("should have aria-describedby pointing to error message", () => {
      render(<GeneralContactForm />);

      const nameInput = screen.getByTestId("input-name");
      fireEvent.blur(nameInput);

      expect(nameInput).toHaveAttribute("aria-describedby", "error-name");
      expect(screen.getByTestId("error-name")).toHaveAttribute("id", "error-name");
    });

    it("should have proper role and aria-live for success message", async () => {
      render(<GeneralContactForm />);

      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "general" } });
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(messageInput, { target: { value: "This is a test message" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const successSection = screen.getByTestId("general-contact-form-success");
        expect(successSection).toHaveAttribute("role", "status");
        expect(successSection).toHaveAttribute("aria-live", "polite");
      });
    });

    it("should have proper role for error alert", async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" }),
      } as Response);

      render(<GeneralContactForm />);

      const inquiryTypeSelect = screen.getByTestId("input-inquiryType");
      const nameInput = screen.getByTestId("input-name");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");
      const messageInput = screen.getByTestId("input-message");

      fireEvent.change(inquiryTypeSelect, { target: { value: "general" } });
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorAlert = screen.getByTestId("submit-error");
        expect(errorAlert).toHaveAttribute("role", "alert");
      });
    });
  });
});
