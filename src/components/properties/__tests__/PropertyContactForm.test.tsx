import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { PropertyContactForm, PropertyContactFormData } from "../PropertyContactForm";

describe("PropertyContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render the form with heading and subheading", () => {
      render(<PropertyContactForm />);

      expect(screen.getByTestId("property-contact-form")).toBeInTheDocument();
      expect(screen.getByTestId("contact-form-heading")).toHaveTextContent(
        "Let's Make it Happen"
      );
      expect(screen.getByTestId("contact-form-subheading")).toHaveTextContent(
        /Ready to take the first step/
      );
    });

    it("should render all 10 form fields with correct labels", () => {
      render(<PropertyContactForm />);

      // Text inputs
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();

      // Select inputs
      expect(screen.getByLabelText("Preferred Location")).toBeInTheDocument();
      expect(screen.getByLabelText("Property Type")).toBeInTheDocument();
      expect(screen.getByLabelText("No. of Bedrooms")).toBeInTheDocument();
      expect(screen.getByLabelText("No. of Bathrooms")).toBeInTheDocument();
      expect(screen.getByLabelText("Budget")).toBeInTheDocument();

      // Textarea
      expect(screen.getByLabelText("Message")).toBeInTheDocument();
    });

    it("should render all fields with correct placeholders", () => {
      render(<PropertyContactForm />);

      expect(screen.getByPlaceholderText("Enter First Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Last Name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter Phone Number")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter your Message here..")).toBeInTheDocument();
    });

    it("should render Terms checkbox and submit button", () => {
      render(<PropertyContactForm />);

      expect(screen.getByTestId("input-agreeToTerms")).toBeInTheDocument();
      expect(
        screen.getByText(/I agree with Terms of Use and Privacy Policy/)
      ).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toBeInTheDocument();
      expect(screen.getByTestId("submit-button")).toHaveTextContent("Send Your Message");
    });

    it("should have submit button disabled when terms are not checked", () => {
      render(<PropertyContactForm />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toBeDisabled();
    });

    it("should enable submit button when terms are checked", () => {
      render(<PropertyContactForm />);

      const checkbox = screen.getByTestId("input-agreeToTerms");
      const submitButton = screen.getByTestId("submit-button");

      fireEvent.click(checkbox);
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("Form Input", () => {
    it("should update text input values on change", () => {
      render(<PropertyContactForm />);

      const firstNameInput = screen.getByTestId("input-firstName") as HTMLInputElement;
      const lastNameInput = screen.getByTestId("input-lastName") as HTMLInputElement;
      const emailInput = screen.getByTestId("input-email") as HTMLInputElement;
      const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;

      fireEvent.change(firstNameInput, { target: { value: "John" } });
      fireEvent.change(lastNameInput, { target: { value: "Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });

      expect(firstNameInput.value).toBe("John");
      expect(lastNameInput.value).toBe("Doe");
      expect(emailInput.value).toBe("john@example.com");
      expect(phoneInput.value).toBe("1234567890");
    });

    it("should update select values on change", () => {
      render(<PropertyContactForm />);

      const locationSelect = screen.getByTestId(
        "input-preferredLocation"
      ) as HTMLSelectElement;
      const propertyTypeSelect = screen.getByTestId(
        "input-propertyType"
      ) as HTMLSelectElement;
      const bedroomsSelect = screen.getByTestId("input-bedrooms") as HTMLSelectElement;
      const bathroomsSelect = screen.getByTestId("input-bathrooms") as HTMLSelectElement;
      const budgetSelect = screen.getByTestId("input-budget") as HTMLSelectElement;

      fireEvent.change(locationSelect, { target: { value: "Downtown" } });
      fireEvent.change(propertyTypeSelect, { target: { value: "Villa" } });
      fireEvent.change(bedroomsSelect, { target: { value: "3" } });
      fireEvent.change(bathroomsSelect, { target: { value: "2" } });
      fireEvent.change(budgetSelect, { target: { value: "$500k - $1M" } });

      expect(locationSelect.value).toBe("Downtown");
      expect(propertyTypeSelect.value).toBe("Villa");
      expect(bedroomsSelect.value).toBe("3");
      expect(bathroomsSelect.value).toBe("2");
      expect(budgetSelect.value).toBe("$500k - $1M");
    });

    it("should update textarea value on change", () => {
      render(<PropertyContactForm />);

      const messageInput = screen.getByTestId("input-message") as HTMLTextAreaElement;
      fireEvent.change(messageInput, {
        target: { value: "I am interested in this property." },
      });

      expect(messageInput.value).toBe("I am interested in this property.");
    });

    it("should toggle checkbox on click", () => {
      render(<PropertyContactForm />);

      const checkbox = screen.getByTestId("input-agreeToTerms") as HTMLInputElement;
      expect(checkbox.checked).toBe(false);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(true);

      fireEvent.click(checkbox);
      expect(checkbox.checked).toBe(false);
    });
  });

  describe("Validation", () => {
    it("should show error for empty required fields on blur", () => {
      render(<PropertyContactForm />);

      const firstNameInput = screen.getByTestId("input-firstName");
      fireEvent.blur(firstNameInput);

      expect(screen.getByTestId("error-firstName")).toHaveTextContent(
        "First name is required"
      );
    });

    it("should show error for invalid email format", () => {
      render(<PropertyContactForm />);

      const emailInput = screen.getByTestId("input-email");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      expect(screen.getByTestId("error-email")).toHaveTextContent(
        "Please enter a valid email address"
      );
    });

    it("should clear error when valid value is entered", () => {
      render(<PropertyContactForm />);

      const emailInput = screen.getByTestId("input-email");

      // Trigger error
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.blur(emailInput);
      expect(screen.getByTestId("error-email")).toBeInTheDocument();

      // Fix error
      fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
      expect(screen.queryByTestId("error-email")).not.toBeInTheDocument();
    });

    it("should show errors for all required fields on submit", () => {
      render(<PropertyContactForm />);

      const checkbox = screen.getByTestId("input-agreeToTerms");
      const submitButton = screen.getByTestId("submit-button");

      // Check terms to enable submit
      fireEvent.click(checkbox);

      // Submit empty form
      fireEvent.click(submitButton);

      // Check for all required field errors
      expect(screen.getByTestId("error-firstName")).toBeInTheDocument();
      expect(screen.getByTestId("error-lastName")).toBeInTheDocument();
      expect(screen.getByTestId("error-email")).toBeInTheDocument();
      expect(screen.getByTestId("error-phone")).toBeInTheDocument();
      expect(screen.getByTestId("error-preferredLocation")).toBeInTheDocument();
      expect(screen.getByTestId("error-propertyType")).toBeInTheDocument();
      expect(screen.getByTestId("error-bedrooms")).toBeInTheDocument();
      expect(screen.getByTestId("error-bathrooms")).toBeInTheDocument();
      expect(screen.getByTestId("error-budget")).toBeInTheDocument();
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByTestId("input-firstName"), {
        target: { value: "John" },
      });
      fireEvent.change(screen.getByTestId("input-lastName"), {
        target: { value: "Doe" },
      });
      fireEvent.change(screen.getByTestId("input-email"), {
        target: { value: "john@example.com" },
      });
      fireEvent.change(screen.getByTestId("input-phone"), {
        target: { value: "1234567890" },
      });
      fireEvent.change(screen.getByTestId("input-preferredLocation"), {
        target: { value: "Downtown" },
      });
      fireEvent.change(screen.getByTestId("input-propertyType"), {
        target: { value: "Villa" },
      });
      fireEvent.change(screen.getByTestId("input-bedrooms"), {
        target: { value: "3" },
      });
      fireEvent.change(screen.getByTestId("input-bathrooms"), {
        target: { value: "2" },
      });
      fireEvent.change(screen.getByTestId("input-budget"), {
        target: { value: "$500k - $1M" },
      });
      fireEvent.change(screen.getByTestId("input-message"), {
        target: { value: "Interested in this property" },
      });
      fireEvent.click(screen.getByTestId("input-agreeToTerms"));
    };

    it("should call onSubmit with form data when valid", async () => {
      const mockOnSubmit = vi.fn();
      render(<PropertyContactForm onSubmit={mockOnSubmit} />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      });

      const expectedData: PropertyContactFormData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "1234567890",
        preferredLocation: "Downtown",
        propertyType: "Villa",
        bedrooms: "3",
        bathrooms: "2",
        budget: "$500k - $1M",
        message: "Interested in this property",
        agreeToTerms: true,
      };

      expect(mockOnSubmit).toHaveBeenCalledWith(expectedData);
    });

    it("should log form data to console on submit", async () => {
      const consoleSpy = vi.spyOn(console, "log");
      render(<PropertyContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Form submitted:",
          expect.objectContaining({
            firstName: "John",
            email: "john@example.com",
          })
        );
      });

      consoleSpy.mockRestore();
    });

    it("should show success message after submission", async () => {
      render(<PropertyContactForm />);

      fillValidForm();

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("contact-form-success")).toBeInTheDocument();
        expect(screen.getByText("Thank You!")).toBeInTheDocument();
        expect(
          screen.getByText(/Your inquiry has been submitted successfully/)
        ).toBeInTheDocument();
      });
    });

    it("should not submit form with validation errors", () => {
      const mockOnSubmit = vi.fn();
      render(<PropertyContactForm onSubmit={mockOnSubmit} />);

      // Only check terms, don't fill form
      fireEvent.click(screen.getByTestId("input-agreeToTerms"));
      fireEvent.click(screen.getByTestId("submit-button"));

      expect(mockOnSubmit).not.toHaveBeenCalled();
      expect(screen.queryByTestId("contact-form-success")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper label associations for all inputs", () => {
      render(<PropertyContactForm />);

      const firstNameInput = screen.getByTestId("input-firstName");
      const lastNameInput = screen.getByTestId("input-lastName");
      const emailInput = screen.getByTestId("input-email");
      const phoneInput = screen.getByTestId("input-phone");

      expect(firstNameInput).toHaveAttribute("id", "firstName");
      expect(lastNameInput).toHaveAttribute("id", "lastName");
      expect(emailInput).toHaveAttribute("id", "email");
      expect(phoneInput).toHaveAttribute("id", "phone");

      expect(screen.getByLabelText("First Name")).toBe(firstNameInput);
      expect(screen.getByLabelText("Last Name")).toBe(lastNameInput);
      expect(screen.getByLabelText("Email")).toBe(emailInput);
      expect(screen.getByLabelText("Phone")).toBe(phoneInput);
    });

    it("should have focus ring styles on inputs", () => {
      render(<PropertyContactForm />);

      const firstNameInput = screen.getByTestId("input-firstName");
      expect(firstNameInput).toHaveClass("focus:border-violet-600");
      expect(firstNameInput).toHaveClass("focus:ring-2");
    });

    it("should have proper input types for semantic HTML", () => {
      render(<PropertyContactForm />);

      expect(screen.getByTestId("input-firstName")).toHaveAttribute("type", "text");
      expect(screen.getByTestId("input-email")).toHaveAttribute("type", "email");
      expect(screen.getByTestId("input-phone")).toHaveAttribute("type", "tel");
      expect(screen.getByTestId("input-agreeToTerms")).toHaveAttribute(
        "type",
        "checkbox"
      );
    });

    it("should have proper button accessibility", () => {
      render(<PropertyContactForm />);

      const submitButton = screen.getByTestId("submit-button");
      expect(submitButton).toHaveAttribute("type", "submit");
      expect(submitButton).toHaveClass("focus:ring-2");
    });
  });

  describe("Field Types", () => {
    it("should render correct field types as specified", () => {
      render(<PropertyContactForm />);

      // Text fields
      expect(screen.getByTestId("input-firstName").tagName).toBe("INPUT");
      expect(screen.getByTestId("input-firstName")).toHaveAttribute("type", "text");

      // Email field
      expect(screen.getByTestId("input-email")).toHaveAttribute("type", "email");

      // Tel field
      expect(screen.getByTestId("input-phone")).toHaveAttribute("type", "tel");

      // Select fields
      expect(screen.getByTestId("input-preferredLocation").tagName).toBe("SELECT");
      expect(screen.getByTestId("input-propertyType").tagName).toBe("SELECT");
      expect(screen.getByTestId("input-bedrooms").tagName).toBe("SELECT");
      expect(screen.getByTestId("input-bathrooms").tagName).toBe("SELECT");
      expect(screen.getByTestId("input-budget").tagName).toBe("SELECT");

      // Textarea
      expect(screen.getByTestId("input-message").tagName).toBe("TEXTAREA");
    });
  });

  describe("Error States", () => {
    it("should show red border on fields with errors", () => {
      render(<PropertyContactForm />);

      const firstNameInput = screen.getByTestId("input-firstName");
      fireEvent.blur(firstNameInput);

      expect(firstNameInput).toHaveClass("border-red-500");
    });

    it("should not show errors before field is touched", () => {
      render(<PropertyContactForm />);

      expect(screen.queryByTestId("error-firstName")).not.toBeInTheDocument();
      expect(screen.queryByTestId("error-email")).not.toBeInTheDocument();
    });
  });
});
