const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const profileContainer = document.getElementById("profile-container");

// 1. Listen for the form submission
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    const user = search.value;
    if (user) {
        getUser(user);
        search.value = "";
    }
});

// 2. Fetch User Data
async function getUser(username) {
    try {
        const response = await fetch(API_URL + username);
        if (!response.ok) throw new Error("No profile found with this username");
        
        const userData = await response.json();
        
        // Fetch repos only if user exists
        const reposResponse = await fetch(API_URL + username + "/repos?sort=created");
        const reposData = await reposResponse.json();
        
        createProfileCard(userData, reposData);
    } catch (err) {
        profileContainer.innerHTML = `<div class="error"><h3>${err.message}</h3></div>`;
    }
}

// 3. Render the UI
function createProfileCard(user, repos) {
    // Get top 5 repos
    const repoLinks = repos
        .slice(0, 5)
        .map(repo => `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`)
        .join("");

    const cardHTML = `
        <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.name || user.login}</h2>
                <p>${user.bio || "This user has no bio."}</p>
                <ul>
                    <li><strong>${user.followers}</strong> Followers</li>
                    <li><strong>${user.following}</strong> Following</li>
                    <li><strong>${user.public_repos}</strong> Repos</li>
                </ul>
                <div class="repos">
                    <h4>Latest Repos:</h4>
                    ${repoLinks || "No public repositories."}
                </div>
            </div>
        </div>
    `;
    profileContainer.innerHTML = cardHTML;
}