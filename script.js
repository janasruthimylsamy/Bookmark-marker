let bookmarkFormEl = document.getElementById("bookmarkForm");
let siteNameInputEl = document.getElementById("siteNameInput");
let siteUrlInputEl = document.getElementById("siteUrlInput");
let siteNameErrMsgEl = document.getElementById("siteNameErrMsg");
let siteUrlErrMsgEl = document.getElementById("siteUrlErrMsg");
let bookmarksListEl = document.getElementById("bookmarksList");

document.addEventListener("DOMContentLoaded", displayBookmarks);

siteNameInputEl.addEventListener("change", function () {
    if (siteNameInputEl.value.trim() === "") {
        siteNameErrMsgEl.textContent = "Required*";
    } else {
        siteNameErrMsgEl.textContent = "";
    }
});

siteUrlInputEl.addEventListener("change", function () {
    if (siteUrlInputEl.value.trim() === "") {
        siteUrlErrMsgEl.textContent = "Required*";
    } else if (!isValidURL(siteUrlInputEl.value.trim())) {
        siteUrlErrMsgEl.textContent = "Enter a valid URL!";
    } else {
        siteUrlErrMsgEl.textContent = "";
    }
});

bookmarkFormEl.addEventListener("submit", function (event) {
    event.preventDefault();
    let siteName = siteNameInputEl.value.trim();
    let siteUrl = siteUrlInputEl.value.trim();
    let isValid = true;

    if (siteName === "") {
        siteNameErrMsgEl.textContent = "Required*";
        isValid = false;
    } else {
        siteNameErrMsgEl.textContent = "";
    }

    if (siteUrl === "") {
        siteUrlErrMsgEl.textContent = "Required*";
        isValid = false;
    } else if (!isValidURL(siteUrl)) {
        siteUrlErrMsgEl.textContent = "Enter a valid URL!";
        isValid = false;
    } else {
        siteUrlErrMsgEl.textContent = "";
    }

    if (isValid) {
        let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

        if (bookmarkFormEl.dataset.editIndex !== undefined) {
            let index = bookmarkFormEl.dataset.editIndex;
            bookmarks[index] = { name: siteName, url: siteUrl };
            delete bookmarkFormEl.dataset.editIndex;
        } else {
            bookmarks.push({ name: siteName, url: siteUrl });
        }

        localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        displayBookmarks();

        siteNameInputEl.value = "";
        siteUrlInputEl.value = "";
    }
});

function displayBookmarks() {
    bookmarksListEl.innerHTML = "";
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    bookmarks.forEach((bookmark, index) => {
        let li = document.createElement("li");

        let anchorEl = document.createElement("a");
        anchorEl.href = bookmark.url;
        anchorEl.textContent = bookmark.name;
        anchorEl.target = "_blank";

        let buttonsDiv = document.createElement("div");

        let editBtn = document.createElement("button");
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit';
        editBtn.className = "edit-btn";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            siteNameInputEl.value = bookmark.name;
            siteUrlInputEl.value = bookmark.url;
            bookmarkFormEl.dataset.editIndex = index;
        });

        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Delete';
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm("Are you sure you want to delete this bookmark?")) {
                bookmarks.splice(index, 1);
                localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
                displayBookmarks();
            }
        });

        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);

        li.appendChild(anchorEl);
        li.appendChild(buttonsDiv);

        li.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON" && e.target.tagName !== "I") {
                window.open(bookmark.url, "_blank");
            }
        });

        bookmarksListEl.appendChild(li);
    });
}

function isValidURL(url) {
    let pattern = new RegExp(
        "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
        "i"
    );
    return pattern.test(url);
}