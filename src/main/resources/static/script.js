// ============================================================
// ONLINE JOB PORTAL - script.js
// ============================================================

// Backend URL
const API_BASE_URL = "http://localhost:8081";


// ============================================================
// LOGIN
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        fetch(`${API_BASE_URL}/users/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        })

        .then(async response => {

            const text = await response.text();

            console.log("Login response:", text);

            if (!response.ok) {
                throw new Error("Invalid email or password");
            }

            if (!text) {
                throw new Error("Login returned empty response");
            }

            return JSON.parse(text);

        })

        .then(data => {

            console.log("Logged in user:", data);

            // Save user information
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userRole", data.role);

            const message = document.getElementById("message");

            if (message) {
                message.textContent =
                    "Login successful. Welcome " + data.name;

                message.style.color = "green";
            }

            // Redirect according to role
            setTimeout(() => {

                if (data.role === "RECRUITER") {

                    window.location.href = "recruiter.html";

                } else {

                    window.location.href = "candidate.html";

                }

            }, 1000);

        })

        .catch(error => {

            console.error("Login error:", error);

            const message = document.getElementById("message");

            if (message) {

                message.textContent =
                    "Invalid email or password.";

                message.style.color = "red";
            }

        });

    });
}


// ============================================================
// REGISTRATION
// ============================================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const role =
            document.getElementById("role").value;

        fetch(`${API_BASE_URL}/users`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,
                email: email,
                password: password,
                role: role

            })

        })

        .then(response => {

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            return response.json();

        })

        .then(data => {

            console.log("Registered user:", data);

            const message =
                document.getElementById("registerMessage");

            if (message) {

                message.textContent =
                    "Registration successful!";

                message.style.color = "green";
            }

            registerForm.reset();

        })

        .catch(error => {

            console.error("Registration error:", error);

            const message =
                document.getElementById("registerMessage");

            if (message) {

                message.textContent =
                    "Registration failed. Please try again.";

                message.style.color = "red";
            }

        });

    });
}


// ============================================================
// LOAD ALL JOBS
// ============================================================

function loadJobs() {

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent = "Available Jobs";

    content.innerHTML =
        "<p>Loading jobs...</p>";

    fetch(`${API_BASE_URL}/jobs`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();

        })

        .then(jobs => {

            content.innerHTML = "";

            if (jobs.length === 0) {

                content.innerHTML =
                    "<p>No jobs available.</p>";

                return;
            }

            jobs.forEach(job => {

                const jobCard =
                    document.createElement("div");

                jobCard.className = "job-card";

                jobCard.innerHTML = `

                    <h3>${job.title}</h3>

                    <p>
                        <strong>Company:</strong>
                        ${job.company}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${job.location}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${job.description}
                    </p>

                    <p>
                        <strong>Skills:</strong>
                        <span class="job-skills">
                            ${job.skills}
                        </span>
                    </p>

                    <p class="job-salary">
                        &#8377;${Number(job.salary).toLocaleString("en-IN")}
                    </p>

                    <button
                        class="apply-button"
                        onclick="applyForJob(${job.id})">
                        Apply
                    </button>

                `;

                content.appendChild(jobCard);

            });

        })

        .catch(error => {

            console.error("Load jobs error:", error);

            content.innerHTML =
                "<p>Unable to load jobs.</p>";

        });
}


// ============================================================
// APPLY FOR JOB
// ============================================================

function applyForJob(jobId) {

    const userId =
        localStorage.getItem("userId");

    const userRole =
        localStorage.getItem("userRole");

    if (!userId) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    if (userRole !== "CANDIDATE") {

        alert("Only candidates can apply for jobs.");

        return;
    }

    const application = {

        user: {
            id: Number(userId)
        },

        job: {
            id: Number(jobId)
        },

        status: "APPLIED"

    };

    fetch(`${API_BASE_URL}/applications`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(application)

    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Application failed");
        }

        return response.json();

    })

    .then(data => {

        alert("Application submitted successfully!");

        console.log("Application:", data);

    })

    .catch(error => {

        console.error("Application error:", error);

        alert(
            "You may have already applied for this job."
        );

    });
}


// ============================================================
// MY APPLICATIONS - CANDIDATE
// ============================================================

function loadApplications() {

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent =
        "My Applications";

    content.innerHTML =
        "<p>Loading applications...</p>";

    const userId =
        localStorage.getItem("userId");

    if (!userId) {

        content.innerHTML =
            "<p>Please login first.</p>";

        return;
    }

    fetch(
        `${API_BASE_URL}/applications/user/${userId}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load applications"
                );
            }

            return response.json();

        })

        .then(applications => {

            content.innerHTML = "";

            if (applications.length === 0) {

                content.innerHTML =
                    "<p>You have not applied for any jobs yet.</p>";

                return;
            }

            applications.forEach(application => {

                const applicationCard =
                    document.createElement("div");

                applicationCard.className =
                    "application-card";

                applicationCard.innerHTML = `

                    <h3>
                        ${application.job.title}
                    </h3>

                    <p>
                        <strong>Company:</strong>
                        ${application.job.company}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${application.job.location}
                    </p>

                    <p>
                        <strong>Application ID:</strong>
                        ${application.id}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        <span class="
                            status-badge
                            status-${application.status.toLowerCase()}
                        ">
                            ${application.status}
                        </span>
                    </p>

                `;

                content.appendChild(applicationCard);

            });

        })

        .catch(error => {

            console.error(
                "Applications error:",
                error
            );

            content.innerHTML =
                "<p>Unable to load applications.</p>";

        });
}


// ============================================================
// LOGOUT
// ============================================================

function logout() {

    localStorage.removeItem("userId");

    localStorage.removeItem("userName");

    localStorage.removeItem("userRole");

    window.location.href = "login.html";
}


// ============================================================
// RECRUITER - MY JOBS
// ============================================================

function loadMyJobs() {

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent =
        "My Jobs";

    content.innerHTML =
        "<p>Loading your jobs...</p>";

    const recruiterId =
        localStorage.getItem("userId");

    if (!recruiterId) {

        content.innerHTML =
            "<p>Please login first.</p>";

        return;
    }

    fetch(
        `${API_BASE_URL}/jobs/recruiter/${recruiterId}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load jobs"
                );
            }

            return response.json();

        })

        .then(jobs => {

            content.innerHTML = "";

            if (jobs.length === 0) {

                content.innerHTML =
                    "<p>You have not posted any jobs yet.</p>";

                return;
            }

            jobs.forEach(job => {

                const jobCard =
                    document.createElement("div");

                jobCard.className =
                    "job-card";

                jobCard.innerHTML = `

                    <h3>
                        ${job.title}
                    </h3>

                    <p>
                        <strong>Company:</strong>
                        ${job.company}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${job.location}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${job.description}
                    </p>

                    <p>
                        <strong>Skills:</strong>
                        ${job.skills}
                    </p>

                    <p class="job-salary">
                        &#8377;${Number(job.salary).toLocaleString("en-IN")}
                    </p>

                    <button
                        class="apply-button"
                        onclick="loadApplicants(${job.id})">
                        View Applicants
                    </button>

                `;

                content.appendChild(jobCard);

            });

        })

        .catch(error => {

            console.error(
                "My jobs error:",
                error
            );

            content.innerHTML =
                "<p>Unable to load your jobs.</p>";

        });
}


// ============================================================
// RECRUITER - SHOW POST JOB FORM
// ============================================================

function showPostJobForm() {

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent =
        "Post a New Job";

    content.innerHTML = `

        <div class="job-card">

            <h3>Post Job</h3>

            <input
                type="text"
                id="jobTitle"
                placeholder="Job Title"
                required
            >

            <input
                type="text"
                id="company"
                placeholder="Company Name"
                required
            >

            <input
                type="text"
                id="location"
                placeholder="Location"
                required
            >

            <input
                type="text"
                id="description"
                placeholder="Job Description"
                required
            >

            <input
                type="text"
                id="skills"
                placeholder="Skills (Example: Java, Spring Boot, SQL)"
                required
            >

            <input
                type="number"
                id="salary"
                placeholder="Salary"
                required
            >

            <button
                class="apply-button"
                onclick="postJob()">
                Post Job
            </button>

        </div>

    `;
}


// ============================================================
// RECRUITER - POST JOB
// ============================================================

function postJob() {

    const recruiterId =
        localStorage.getItem("userId");

    const userRole =
        localStorage.getItem("userRole");

    if (!recruiterId) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;
    }

    if (userRole !== "RECRUITER") {

        alert("Only recruiters can post jobs.");

        return;
    }

    const jobTitle =
        document.getElementById("jobTitle").value.trim();

    const company =
        document.getElementById("company").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const skills =
        document.getElementById("skills").value.trim();

    const salary =
        Number(document.getElementById("salary").value);

    // Validate fields
    if (
        !jobTitle ||
        !company ||
        !location ||
        !description ||
        !skills ||
        !salary
    ) {

        alert("Please fill all fields.");

        return;
    }

    const job = {

        title: jobTitle,

        company: company,

        location: location,

        description: description,

        skills: skills,

        salary: salary

    };

    fetch(
        `${API_BASE_URL}/jobs?recruiterId=${recruiterId}`,
        {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(job)

        }
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to post job"
                );
            }

            return response.json();

        })

        .then(data => {

            console.log(
                "Job posted:",
                data
            );

            alert(
                "Job posted successfully!"
            );

            loadMyJobs();

        })

        .catch(error => {

            console.error(
                "Post job error:",
                error
            );

            alert(
                "Failed to post job."
            );

        });
}


// ============================================================
// RECRUITER - VIEW APPLICANTS
// ============================================================

function loadApplicants(jobId) {

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent =
        "Applicants";

    content.innerHTML =
        "<p>Loading applicants...</p>";

    fetch(
        `${API_BASE_URL}/applications/job/${jobId}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to load applicants"
                );
            }

            return response.json();

        })

        .then(applications => {

            content.innerHTML = "";

            if (applications.length === 0) {

                content.innerHTML =
                    "<p>No applicants for this job yet.</p>";

                return;
            }

            applications.forEach(application => {

                const applicantCard =
                    document.createElement("div");

                applicantCard.className =
                    "application-card";

                applicantCard.innerHTML = `

                    <h3>
                        Applicant
                    </h3>

                    <p>
                        <strong>Application ID:</strong>
                        ${application.id}
                    </p>

                    <p>
                        <strong>Name:</strong>
                        ${application.user.name}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${application.user.email}
                    </p>

                    <p>
                        <strong>Job:</strong>
                        ${application.job.title}
                    </p>

                    <p>
                        <strong>Current Status:</strong>

                        <span class="
                            status-badge
                            status-${application.status.toLowerCase()}
                        ">
                            ${application.status}
                        </span>
                    </p>

                    <label>
                        <strong>Update Status:</strong>
                    </label>

                    <select
                        id="status-${application.id}"
                        style="
                            width: 100%;
                            padding: 10px;
                            margin-top: 10px;
                            margin-bottom: 10px;
                        "
                    >

                        <option
                            value="APPLIED"
                            ${application.status === "APPLIED"
                                ? "selected"
                                : ""}
                        >
                            APPLIED
                        </option>

                        <option
                            value="SHORTLISTED"
                            ${application.status === "SHORTLISTED"
                                ? "selected"
                                : ""}
                        >
                            SHORTLISTED
                        </option>

                        <option
                            value="SELECTED"
                            ${application.status === "SELECTED"
                                ? "selected"
                                : ""}
                        >
                            SELECTED
                        </option>

                        <option
                            value="REJECTED"
                            ${application.status === "REJECTED"
                                ? "selected"
                                : ""}
                        >
                            REJECTED
                        </option>

                    </select>

                    <button
                        class="apply-button"
                        onclick="updateApplicationStatus(${application.id})">
                        Update Status
                    </button>

                `;

                content.appendChild(applicantCard);

            });

        })

        .catch(error => {

            console.error(
                "Applicants error:",
                error
            );

            content.innerHTML =
                "<p>Unable to load applicants.</p>";

        });
}


// ============================================================
// UPDATE APPLICATION STATUS
// ============================================================

function updateApplicationStatus(applicationId) {

    const statusElement =
        document.getElementById(
            `status-${applicationId}`
        );

    if (!statusElement) {

        alert("Status field not found.");

        return;
    }

    const status =
        statusElement.value;

    fetch(
        `${API_BASE_URL}/applications/${applicationId}/status?status=${encodeURIComponent(status)}`,
        {

            method: "PUT"

        }
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Failed to update status"
                );
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Application status updated successfully!"
            );

            console.log(
                "Updated application:",
                data
            );

        })

        .catch(error => {

            console.error(
                "Status update error:",
                error
            );

            alert(
                "Failed to update application status."
            );

        });
}


// ============================================================
// ROLE-BASED ACCESS
// ============================================================

const currentPage =
    window.location.pathname;

const currentUserRole =
    localStorage.getItem("userRole");


// Candidate Dashboard Protection

if (
    currentPage.includes("candidate.html")
) {

    if (!currentUserRole) {

        window.location.href =
            "login.html";

    } else if (
        currentUserRole !== "CANDIDATE"
    ) {

        alert(
            "Access denied. Candidate account required."
        );

        window.location.href =
            "login.html";
    }
}


// Recruiter Dashboard Protection

if (
    currentPage.includes("recruiter.html")
) {

    if (!currentUserRole) {

        window.location.href =
            "login.html";

    } else if (
        currentUserRole !== "RECRUITER"
    ) {

        alert(
            "Access denied. Recruiter account required."
        );

        window.location.href =
            "login.html";
    }
}


// ============================================================
// SEARCH JOBS
// ============================================================

function searchJobs() {

    const searchInput =
        document.getElementById("jobSearch");

    if (!searchInput) {
        return;
    }

    const title =
        searchInput.value.trim();

    if (title === "") {

        alert(
            "Please enter a job title."
        );

        return;
    }

    const content =
        document.getElementById("content");

    const sectionTitle =
        document.getElementById("sectionTitle");

    if (!content || !sectionTitle) {
        return;
    }

    sectionTitle.textContent =
        "Search Results";

    content.innerHTML =
        "<p>Searching jobs...</p>";

    fetch(
        `${API_BASE_URL}/jobs/search?title=${encodeURIComponent(title)}`
    )

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Search failed"
                );
            }

            return response.json();

        })

        .then(jobs => {

            content.innerHTML = "";

            if (jobs.length === 0) {

                content.innerHTML =
                    "<p>No jobs found.</p>";

                return;
            }

            jobs.forEach(job => {

                const jobCard =
                    document.createElement("div");

                jobCard.className =
                    "job-card";

                jobCard.innerHTML = `

                    <h3>
                        ${job.title}
                    </h3>

                    <p>
                        <strong>Company:</strong>
                        ${job.company}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${job.location}
                    </p>

                    <p>
                        <strong>Description:</strong>
                        ${job.description}
                    </p>

                    <p>
                        <strong>Skills:</strong>
                        <span class="job-skills">
                            ${job.skills}
                        </span>
                    </p>

                    <p class="job-salary">
                        &#8377;${Number(job.salary).toLocaleString("en-IN")}
                    </p>

                    <button
                        class="apply-button"
                        onclick="applyForJob(${job.id})">
                        Apply
                    </button>

                `;

                content.appendChild(jobCard);

            });

        })

        .catch(error => {

            console.error(
                "Search error:",
                error
            );

            content.innerHTML =
                "<p>Unable to search jobs.</p>";

        });
}


// ============================================================
// RECRUITER WELCOME MESSAGE
// ============================================================

const recruiterWelcome =
    document.getElementById(
        "recruiterWelcome"
    );

if (recruiterWelcome) {

    const recruiterName =
        localStorage.getItem(
            "userName"
        );

    if (recruiterName) {

        recruiterWelcome.textContent =
            "Welcome, " +
            recruiterName +
            "!";

    }
}

