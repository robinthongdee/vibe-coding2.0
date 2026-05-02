const form = document.getElementById("feedbackForm");
const list = document.getElementById("feedbackList");
const charNum = document.getElementById("char-num");
const messageInput = document.getElementById("message");
const statsBadge = document.getElementById("stats");

// อัปเดตตัวนับตัวอักษร
messageInput.addEventListener("input", () => {
    charNum.textContent = messageInput.value.length;
});

// โหลดข้อมูล
window.onload = () => {
    loadData();
};

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const feedback = {
        id: 'fb-' + Date.now(),
        title: document.getElementById("title").value.trim(),
        message: messageInput.value.trim(),
        category: document.getElementById("category").value,
        rating: document.getElementById("rating").value,
        time: new Date().toLocaleString('th-TH', { hour12: false })
    };

    saveLocal(feedback);
    renderCard(feedback, true);
    updateStats();
    showToast("บันทึกความคิดเห็นแล้ว ขอบคุณครับ! ✨");
    form.reset();
    charNum.textContent = 0;
});

function loadData() {
    const saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    list.innerHTML = "";
    if (saved.length === 0) {
        list.innerHTML = '<div class="empty-state">ยังไม่มีข้อมูลในระบบ...</div>';
    } else {
        saved.reverse().forEach(f => renderCard(f));
    }
    updateStats();
}

function renderCard(data, isNew = false) {
    // ลบ Empty State ถ้ามีข้อมูลใหม่เข้า
    if (isNew && list.querySelector(".empty-state")) {
        list.innerHTML = "";
    }

    const card = document.createElement("div");
    card.className = `feedback-card card-${data.category.toLowerCase()}`;
    card.dataset.id = data.id;

    card.innerHTML = `
        <div class="card-header">
            <span class="category-pill">${data.category}</span>
            <button class="delete-btn" title="ลบข้อมูล">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
        </div>
        <div class="card-body">
            <h3>${data.title}</h3>
            <p>${data.message}</p>
        </div>
        <div class="card-footer">
            <span class="rating-stars">${"⭐".repeat(data.rating)}</span>
            <span class="timestamp">${data.time}</span>
        </div>
    `;

    // ระบบลบข้อมูล
    card.querySelector(".delete-btn").addEventListener("click", () => deleteItem(data.id));

    if (isNew) {
        list.prepend(card);
    } else {
        list.appendChild(card);
    }
}

function saveLocal(item) {
    const saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    saved.push(item);
    localStorage.setItem("feedbacks", JSON.stringify(saved));
}

function deleteItem(id) {
    if (confirm("ต้องการลบความคิดเห็นนี้ใช่หรือไม่?")) {
        let saved = JSON.parse(localStorage.getItem("feedbacks"));
        saved = saved.filter(f => f.id !== id);
        localStorage.setItem("feedbacks", JSON.stringify(saved));
        
        const element = document.querySelector(`[data-id="${id}"]`);
        element.style.transform = "scale(0.8)";
        element.style.opacity = "0";
        setTimeout(() => {
            loadData();
            showToast("ลบข้อมูลสำเร็จ");
        }, 300);
    }
}

function updateStats() {
    const count = (JSON.parse(localStorage.getItem("feedbacks")) || []).length;
    statsBadge.innerText = `${count} รายการ`;
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => { toast.classList.remove("show"); }, 3000);
}