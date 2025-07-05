// JavaScript from index.html moved here
// My Shortened Links modal open/close
const showLinksButton = document.getElementById('showLinksButton');
const myLinksModal = document.getElementById('myLinksModal');
const closeLinksModal = document.getElementById('closeLinksModal');
const myLinksList = document.getElementById('myLinksList');

showLinksButton.addEventListener('click', async () => {
    myLinksModal.classList.remove('hidden');
    myLinksList.innerHTML = '<div class="text-center text-gray-400">Loading...</div>';
    const idToken = localStorage.getItem('idToken');
    const res = await fetch('/my/urls', {
        headers: { 'Authorization': 'Bearer ' + idToken }
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
        myLinksList.innerHTML = data.map(url => `
          <div class="flex items-center justify-between bg-gray-700 rounded p-2 mb-2">
            <div class="flex-1">
              <div class="text-sm text-blue-300 break-all">${window.location.origin}/${url.id}</div>
              <div class="text-xs text-gray-400">${url.longUrl}</div>
            </div>
            <button data-id="${url.id}" class="deleteLinkBtn ml-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">Delete</button>
          </div>
        `).join('');
    } else {
        myLinksList.innerHTML = '<div class="text-center text-gray-400">No links found.</div>';
    }
});

closeLinksModal.addEventListener('click', () => {
    myLinksModal.classList.add('hidden');
});

// Close modal when clicking outside
myLinksModal.addEventListener('click', (e) => {
    if (e.target === myLinksModal) myLinksModal.classList.add('hidden');
});

// Delete link
myLinksList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteLinkBtn')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this link?')) {
            const idToken = localStorage.getItem('idToken');
            const res = await fetch(`/my/urls/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + idToken }
            });
            if (res.ok) {
                e.target.closest('div').remove();
            } else {
                alert('Could not delete!');
            }
        }
    }
});
// On page load, check token
window.addEventListener('DOMContentLoaded', () => {
    const idToken = localStorage.getItem('idToken');
    const mainContent = document.getElementById('main-content');
    const loginRedirect = document.getElementById('login-redirect');
    if (idToken) {
        mainContent.classList.remove('hidden');
    } else {
        loginRedirect.classList.remove('hidden');
    }
});

// Shorten URL form
// ...existing code...
document.getElementById('url-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const longUrl = document.getElementById('longUrl').value;
    const customId = document.getElementById('customId').value;
    const idToken = localStorage.getItem('idToken');
    const response = await fetch('/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(idToken ? { 'Authorization': 'Bearer ' + idToken } : {})
        },
        body: JSON.stringify({ longUrl, customId })
    });

    const data = await response.json();
    const responseDiv = document.getElementById('response');
    const shortUrlInput = document.getElementById('shortUrl');
    const copyButton = document.getElementById('copyButton');

    if (response.ok) {
        shortUrlInput.value = `${window.location.origin}/${data.shortUrl}`;
        responseDiv.classList.remove('hidden');
    } else {
        responseDiv.innerHTML = `<p class="text-red-400">Error: ${data.error || JSON.stringify(data)}</p>`;
        responseDiv.classList.remove('hidden');
    }
});

// Copy button functionality
document.getElementById('copyButton').addEventListener('click', () => {
    const shortUrlInput = document.getElementById('shortUrl');
    shortUrlInput.select();
    document.execCommand('copy');
    alert('Shortened URL copied to clipboard!');
});

// Log out button
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('idToken');
    window.location.reload();
});
