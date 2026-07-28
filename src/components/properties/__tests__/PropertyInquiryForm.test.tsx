import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { PropertyInquiryForm } from "../PropertyInquiryForm";

describe("PropertyInquiryForm", () => {
  const mockProps = {
    propertySlug: "test-property-slug",
    propertyTitle: "Beautiful Test Property",
    onSubmit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
  });

  it("should render the form", () => {
    render(<PropertyInquiryForm {...mockProps} />);
    expect(screen.getByTestId("property-inquiry-form")).toBeInTheDocument();
  });

  it("should display the heading and subheading", () => {
    render(<PropertyInquiryForm {...mockProps} />);
    expect(screen.getByTestId("inquiry-form-heading")).toHaveTextContent(
      "Interested in This Property?"
    );
    expect(screen.getByTestId("inquiry-form-subheading")).toHaveTextContent(
      "Fill out the form below and our team will contact you shortly."
    );
  });

  it("should render all form fields", () => {
    render(<PropertyInquiryForm {...mockProps} />);
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-email")).toBeInTheDocument();
    expect(screen.getByTestId("input-phone")).toBeInTheDocument();
    expect(screen.getByTestId("input-message")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<PropertyInquiryForm {...mockProps} />);
    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Submit Inquiry");
  });

  it("should update form fields on input", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;
    const messageInput = screen.getByTestId("input-message") as HTMLTextAreaElement;

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(phoneInput, "1234567890");
    await user.type(messageInput, "I am interested in this property");

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(phoneInput.value).toBe("1234567890");
    expect(messageInput.value).toBe("I am interested in this property");
  });

  it("should show validation errors on blur with empty fields", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name");
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId("error-name")).toHaveTextContent("Name is required");
    });
  });

  it("should validate email format", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const emailInput = screen.getByTestId("input-email");
    await user.type(emailInput, "invalid-email");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId("error-email")).toHaveTextContent(
        "Please enter a valid email address"
      );
    });
  });

  it("should validate phone number format", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const phoneInput = screen.getByTestId("input-phone");
    await user.type(phoneInput, "123");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId("error-phone")).toHaveTextContent(
        "Please enter a valid phone number"
      );
    });
  });

  it("should validate minimum message length", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const messageInput = screen.getByTestId("input-message");
    await user.type(messageInput, "Short");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(
        "Message must be at least 10 characters"
      );
    });
  });

  it("should clear errors when user fixes the input", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name");
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByTestId("error-name")).toBeInTheDocument();
    });

    await user.type(nameInput, "John Doe");

    await waitFor(() => {
      expect(screen.queryByTestId("error-name")).not.toBeInTheDocument();
    });
  });

  it("should prevent submission with invalid data", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId("error-name")).toBeInTheDocument();
      expect(screen.getByTestId("error-email")).toBeInTheDocument();
      expect(screen.getByTestId("error-phone")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    await user.type(screen.getByTestId("input-name"), "John Doe");
    await user.type(screen.getByTestId("input-email"), "john@example.com");
    await user.type(screen.getByTestId("input-phone"), "1234567890");
    await user.type(
      screen.getByTestId("input-message"),
      "I am interested in this property"
    );

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        message: "I am interested in this property",
        propertySlug: "test-property-slug",
      });
    });
  });

  it("should show success message after submission", async () => {
    const user = userEvent.setup();
    render(<PropertyInquiryForm {...mockProps} />);

    await user.type(screen.getByTestId("input-name"), "John Doe");
    await user.type(screen.getByTestId("input-email"), "john@example.com");
    await user.type(screen.getByTestId("input-phone"), "1234567890");
    await user.type(
      screen.getByTestId("input-message"),
      "I am interested in this property"
    );

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByTestId("inquiry-form-success")).toBeInTheDocument();
      expect(screen.getByTestId("inquiry-form-success")).toHaveTextContent("Thank You!");
      expect(screen.getByTestId("inquiry-form-success")).toHaveTextContent(
        mockProps.propertyTitle
      );
    });
  });

  it("should disable submit button while submitting", async () => {
    const slowOnSubmit = vi.fn(
      () => new Promise<void>((resolve) => setTimeout(resolve, 100))
    );

    render(<PropertyInquiryForm {...mockProps} onSubmit={slowOnSubmit} />);

    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;
    const messageInput = screen.getByTestId("input-message") as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(messageInput, { target: { value: "I am interested in this property" } });

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Sending...");
    });
  });

  it("should handle submission errors", async () => {
    const errorMessage = "Network error occurred";
    const failingOnSubmit = vi.fn().mockRejectedValue(new Error(errorMessage));

    render(<PropertyInquiryForm {...mockProps} onSubmit={failingOnSubmit} />);

    const nameInput = screen.getByTestId("input-name") as HTMLInputElement;
    const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
    const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;
    const messageInput = screen.getByTestId("input-message") as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    fireEvent.change(messageInput, { target: { value: "I am interested in this property" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(errorMessage);
    });
  });

  it("should accept valid phone formats", async () => {
    render(<PropertyInquiryForm {...mockProps} />);

    const phoneInput = screen.getByTestId("input-phone");

    // Test various valid phone formats
    const validPhones = [
      "1234567890",
      "+1 234 567 8900",
      "(123) 456-7890",
      "123-456-7890",
    ];

    for (const phone of validPhones) {
      fireEvent.change(phoneInput, { target: { value: phone } });
      fireEvent.blur(phoneInput);

      await waitFor(() => {
        expect(screen.queryByTestId("error-phone")).not.toBeInTheDocument();
      });
    }
  });

  it("should apply custom className when provided", () => {
    const customClass = "custom-test-class";
    render(<PropertyInquiryForm {...mockProps} className={customClass} />);
    const container = screen.getByTestId("property-inquiry-form");
    expect(container).toHaveClass(customClass);
  });

  it("should validate name minimum length", async () => {
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name");
    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByTestId("error-name")).toHaveTextContent(
        "Name must be at least 2 characters"
      );
    });
  });

  it("should have proper ARIA attributes", () => {
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name");
    const emailInput = screen.getByTestId("input-email");
    const phoneInput = screen.getByTestId("input-phone");
    const messageInput = screen.getByTestId("input-message");

    expect(nameInput).toHaveAttribute("aria-invalid", "false");
    expect(emailInput).toHaveAttribute("aria-invalid", "false");
    expect(phoneInput).toHaveAttribute("aria-invalid", "false");
    expect(messageInput).toHaveAttribute("aria-invalid", "false");
  });

  it("should update ARIA attributes when errors are present", async () => {
    render(<PropertyInquiryForm {...mockProps} />);

    const nameInput = screen.getByTestId("input-name");
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(nameInput).toHaveAttribute("aria-invalid", "true");
      expect(nameInput).toHaveAttribute("aria-describedby", "error-name");
    });
  });
});
