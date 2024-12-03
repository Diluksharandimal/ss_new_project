function SignUpValidation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected pattern
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    // Name validation
    if (!values.name) {
        error.name = "Name should not be empty";
    } else {
        error.name = "";
    }

    // Email validation
    if (!values.email) {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Email address is invalid";
    } else {
        error.email = "";
    }

    // Password validation
    if (!values.password) {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must contain at least 8 characters, including a number, a lowercase and an uppercase letter.";
    } else {
        error.password = "";
    }

    // Confirm Password validation
    if (!values.confirmPassword) {
        error.confirmPassword = "Confirm Password should not be empty";
    } else if (values.password !== values.confirmPassword) {
        error.confirmPassword = "Passwords do not match";
    } else {
        error.confirmPassword = "";
    }

    return error;
}

export default SignUpValidation;
