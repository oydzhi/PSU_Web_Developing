document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("teachers-container");

    try {
        const response = await fetch("/api/prepods");
        const teachers = await response.json();

        const adminCheckResponse = await fetch("/api/admin/check");
        const adminData = await adminCheckResponse.json();

        teachers.forEach(teacher => {
            const teacherCard = document.createElement("div");
            teacherCard.className = "col-md-4 mb-4";
            teacherCard.innerHTML = `
                <div class="card border-primary shadow-sm">
                    <div class="card-img-wrapper d-flex justify-content-center">
                        <img src="${teacher.photo || '/images/default-avatar.jpg'}" class="card-img-top teacher-image" alt="${teacher.name}">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary">${teacher.name} - ${teacher.position}</h5>
                        <p class="card-text flex-grow-1">${teacher.bio}</p>
                        ${adminData.isAdmin ? `
                            <button class="btn btn-warning btn-sm mt-2 edit-btn" data-id="${teacher.id}" data-name="${teacher.name}" data-position="${teacher.position}" data-bio="${teacher.bio}" data-bs-toggle="modal" data-bs-target="#editTeacherModal">Редактировать</button>
                            <button class="btn btn-danger btn-sm mt-2 delete-btn" data-id="${teacher.id}">Удалить</button>
                        ` : ''}
                    </div>
                </div>
            `;
            container.appendChild(teacherCard);
        });

        document.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const id = e.target.dataset.id;
                if (confirm("Удалить преподавателя?")) {
                    const res = await fetch(`/api/prepods/${id}`, { method: 'DELETE' });
                    if (res.ok) {
                        alert('Преподаватель удален');
                        location.reload();
                    } else {
                        alert('Ошибка удаления');
                    }
                }
            }

            if (e.target.classList.contains('edit-btn')) {
                document.getElementById('editTeacherId').value = e.target.dataset.id;
                document.getElementById('editName').value = e.target.dataset.name;
                document.getElementById('editPosition').value = e.target.dataset.position;
                document.getElementById('editBio').value = e.target.dataset.bio;
            }
        });

        document.getElementById('editTeacherForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('editTeacherId').value;
            const name = document.getElementById('editName').value;
            const position = document.getElementById('editPosition').value;
            const bio = document.getElementById('editBio').value;

            const res = await fetch(`/api/prepods/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, position, bio })
            });

            if (res.ok) {
                alert('Преподаватель обновлен');
                location.reload();
            } else {
                alert('Ошибка обновления');
            }
        });

    } catch (error) {
        console.error("Ошибка загрузки преподавателей", error);
    }
});
