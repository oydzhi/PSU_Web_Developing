document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("news-container");

    try {
        const response = await fetch("/api/news");
        const news = await response.json();

        const adminCheckResponse = await fetch("/api/admin/check");
        const adminData = await adminCheckResponse.json();

        news.forEach(item => {
            const newsCard = document.createElement("div");
            newsCard.className = "col-md-6 mb-4";
            newsCard.innerHTML = `
                <div class="card border-primary shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-primary">${item.title}</h5>
                        <p class="card-text">${item.content}</p>
                        <h8 class="card-subtitle mb-2 text-body-secondary">${item.created_at.slice(0, 10).split('-').reverse().join('/')}</h8>
                        ${adminData.isAdmin ? `
                            <div class="mt-3">
                                <button class="btn btn-warning btn-sm edit-btn" data-id="${item.id}" data-title="${item.title}" data-content="${item.content}" data-bs-toggle="modal" data-bs-target="#editNewsModal">Редактировать</button>
                                <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Удалить</button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            container.appendChild(newsCard);
        });

        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                if (confirm("Удалить новость?")) {
                    const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        alert('Новость удалена');
                        location.reload();
                    } else {
                        alert('Ошибка удаления');
                    }
                }
            }

            if (e.target.classList.contains('edit-btn')) {
                document.getElementById('editNewsId').value = e.target.dataset.id;
                document.getElementById('editTitle').value = e.target.dataset.title;
                document.getElementById('editContent').value = e.target.dataset.content;
            }
        });

        document.getElementById('editNewsForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('editNewsId').value;
            const title = document.getElementById('editTitle').value;
            const content = document.getElementById('editContent').value;

            const res = await fetch(`/api/news/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            if (res.ok) {
                alert('Новость обновлена');
                location.reload();
            } else {
                alert('Ошибка обновления');
            }
        });

    } catch (error) {
        console.error("Ошибка загрузки новостей", error);
    }
});
