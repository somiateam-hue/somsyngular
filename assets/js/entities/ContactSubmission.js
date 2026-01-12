/**
 * Entity: ContactSubmission
 * Represents a contact form submission (Lead).
 * Focus: Data Integrity & Validation "Money First"
 */
export class ContactSubmission {
    constructor(data = {}) {
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || ''; // Optional but valuable
        this.company = data.company || '';
        this.message = data.message || '';
        this.createdAt = new Date();
    }

    /**
     * Validates the submission data.
     * @returns {Object} { isValid: boolean, errors: Array<string> }
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.length < 2) {
            errors.push("El nombre es obligatorio.");
        }

        if (!this.email || !this.email.includes('@')) {
            errors.push("El email no es válido.");
        }

        if (!this.message || this.message.length < 10) {
            errors.push("Por favor cuéntanos un poco más sobre tu proyecto.");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Serializes for API/Storage
     */
    toJSON() {
        return {
            name: this.name,
            email: this.email,
            phone: this.phone,
            company: this.company,
            message: this.message,
            submitted_at: this.createdAt.toISOString()
        };
    }
}
