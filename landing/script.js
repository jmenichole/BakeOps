/**
 * BOT (Baked On Time) - Landing Page JavaScript
 * Handles waitlist form submission and UI feedback
 */

// Configuration - Replace with your actual Supabase Edge Function URL
const SUPABASE_FUNCTION_URL = 'https://ucsmotkzafnnidnnmcba.supabase.co/functions/v1/waitlist-signup';

// DOM Elements
const form = document.getElementById('waitlist-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const loadingSpinner = document.getElementById('loading-spinner');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const emailInput = document.getElementById('email');

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Shows success message and hides error message
 */
function showSuccess() {
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    form.style.display = 'none';
}

/**
 * Shows error message with custom text
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    successMessage.style.display = 'none';
}

/**
 * Hides all messages
 */
function hideMessages() {
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
}

/**
 * Sets loading state on the submit button
 * @param {boolean} isLoading - Whether form is submitting
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        loadingSpinner.style.display = 'none';
    }
}

/**
 * Handles form submission
 * @param {Event} e - Form submit event
 */
async function handleSubmit(e) {
    e.preventDefault();
    hideMessages();

    // Get form data
    const email = emailInput.value.trim();
    const roleElements = document.getElementsByName('role');
    let role = 'curious'; // Default value
    
    for (const elem of roleElements) {
        if (elem.checked) {
            role = elem.value;
            break;
        }
    }

    // Validate email
    if (!email) {
        showError('Please enter your email address.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    // Set loading state
    setLoadingState(true);

    try {
        // Submit to Supabase Edge Function
        const response = await fetch(SUPABASE_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                role: role,
                source: 'landing-page'
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Success - show confirmation
            showSuccess();
            form.reset();
        } else if (response.status === 409 || data.error?.includes('duplicate') || data.error?.includes('already')) {
            // Email already exists
            showError('This email is already on our waitlist!');
        } else {
            // Other error
            showError(data.error || 'Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showError('Unable to connect. Please check your internet connection and try again.');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Initialize form event listener
 */
function init() {
    form.addEventListener('submit', handleSubmit);
    
    // Hide messages initially
    hideMessages();
    
    // Add input event listener to clear error on typing
    emailInput.addEventListener('input', () => {
        if (errorMessage.style.display === 'flex') {
            hideMessages();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
