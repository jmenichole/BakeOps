/**
 * BOT (Baked On Time) - Landing Page JavaScript
 * Handles authentication and waitlist signup with Supabase
 */

// Configuration - Supabase credentials
const SUPABASE_URL = 'https://xqshkiygkyxadksvggks.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxc2hraXlna3l4YWRrc3ZnZ2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0OTA1MjAsImV4cCI6MjA4NjA2NjUyMH0.lvlvVjfOu-4oUPL_JbAOCxpxEDkwFNyhqgCC-uLapZE';
const BACKEND_API_URL = 'https://bakebot-3hi9d6ku4-jmenicholes-projects.vercel.app/api/waitlist-signup';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const loginSubmitText = document.getElementById('login-submit-text');
const signupSubmitText = document.getElementById('signup-submit-text');
const loginLoadingSpinner = document.getElementById('login-loading-spinner');
const signupLoadingSpinner = document.getElementById('signup-loading-spinner');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const successText = document.getElementById('success-text');
const errorText = document.getElementById('error-text');
const userStatus = document.getElementById('user-status');
const userEmail = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');

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
function showSuccess(message = 'Success! Check your email for confirmation.') {
    successText.textContent = message;
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
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
 * Sets loading state on the login button
 * @param {boolean} isLoading - Whether form is submitting
 */
function setLoginLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginSubmitText.style.display = 'none';
        loginLoadingSpinner.style.display = 'inline-block';
    } else {
        loginBtn.disabled = false;
        loginSubmitText.style.display = 'inline';
        loginLoadingSpinner.style.display = 'none';
    }
}

/**
 * Sets loading state on the signup button
 * @param {boolean} isLoading - Whether form is submitting
 */
function setSignupLoadingState(isLoading) {
    if (isLoading) {
        signupBtn.disabled = true;
        signupSubmitText.style.display = 'none';
        signupLoadingSpinner.style.display = 'inline-block';
    } else {
        signupBtn.disabled = false;
        signupSubmitText.style.display = 'inline';
        signupLoadingSpinner.style.display = 'none';
    }
}

/**
 * Shows the login form and hides signup form
 */
function showLoginForm() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    hideMessages();
}

/**
 * Shows the signup form and hides login form
 */
function showSignupForm() {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
    hideMessages();
}

/**
 * Shows user status when logged in
 * @param {Object} user - User object from Supabase
 */
function showUserStatus(user) {
    userEmail.textContent = user.email;
    userStatus.style.display = 'block';
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    document.querySelector('.auth-tabs').style.display = 'none';
}

/**
 * Hides user status and shows auth forms
 */
function hideUserStatus() {
    userStatus.style.display = 'none';
    document.querySelector('.auth-tabs').style.display = 'flex';
    showLoginForm();
}

/**
 * Handles login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    setLoginLoadingState(true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                showError('Invalid email or password.');
            } else if (error.message.includes('Email not confirmed')) {
                showError('Please check your email and confirm your account.');
            } else {
                showError(error.message);
            }
        } else {
            showUserStatus(data.user);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Unable to connect. Please check your internet connection and try again.');
    } finally {
        setLoginLoadingState(false);
    }
}

/**
 * Handles signup form submission
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const roleElements = document.getElementsByName('role');
    let role = 'baker'; // Default value

    for (const elem of roleElements) {
        if (elem.checked) {
            role = elem.value;
            break;
        }
    }

    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields.');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }

    setSignupLoadingState(true);

    try {
        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    role: role
                }
            }
        });

        if (error) {
            if (error.message.includes('User already registered')) {
                showError('An account with this email already exists.');
            } else {
                showError(error.message);
            }
        } else {
            // Add to waitlist regardless of email confirmation
            try {
                await fetch(BACKEND_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        role: role,
                        source: 'landing-page-signup'
                    })
                });
            } catch (waitlistError) {
                console.warn('Waitlist signup failed:', waitlistError);
                // Don't show error for waitlist failure
            }

            if (data.user && !data.user.email_confirmed_at) {
                showSuccess('Account created! Please check your email to confirm your account.');
            } else {
                showUserStatus(data.user);
            }
        }
    } catch (error) {
        console.error('Signup error:', error);
        showError('Unable to connect. Please check your internet connection and try again.');
    } finally {
        setSignupLoadingState(false);
    }
}

/**
 * Handles logout
 */
async function handleLogout() {
    try {
        await supabase.auth.signOut();
        hideUserStatus();
    } catch (error) {
        console.error('Logout error:', error);
        showError('Error logging out. Please try again.');
    }
}

/**
 * Checks for existing session on page load
 */
async function checkSession() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            showUserStatus(session.user);
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}

/**
 * Initialize event listeners and check session
 */
function init() {
    // Tab switching
    loginTab.addEventListener('click', showLoginForm);
    signupTab.addEventListener('click', showSignupForm);

    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Input event listeners to clear errors
    document.getElementById('login-email').addEventListener('input', hideMessages);
    document.getElementById('login-password').addEventListener('input', hideMessages);
    document.getElementById('signup-email').addEventListener('input', hideMessages);
    document.getElementById('signup-password').addEventListener('input', hideMessages);

    // Auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
            showUserStatus(session.user);
        } else if (event === 'SIGNED_OUT') {
            hideUserStatus();
        }
    });

    // Check for existing session
    checkSession();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
