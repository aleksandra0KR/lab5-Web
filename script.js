document.addEventListener("DOMContentLoaded", () => {
    const heart = document.getElementById("heart");
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const itemsLeft = document.getElementById("itemsLeft");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const player = document.getElementById("youtubePlayer");
    const languageSelector = document.getElementById("languageSelector");
    const taskForm = document.getElementById("taskForm");

    const translations = {
        en: {
            title: "Todo List",
            taskInputPlaceholder: "What needs to be done?",
            submit: "Add Task",
            itemsLeft: " items left",
            allBtn: "All",
            activeBtn: "Active",
            completedBtn: "Completed",
        },
        ru: {
            title: "Список дел",
            taskInputPlaceholder: "Что нужно сделать?",
            submit: "Добавить задание",
            itemsLeft: " элементов осталось",
            allBtn: "Все",
            activeBtn: "Активные",
            completedBtn: "Завершенные",
        },
        fr: {
            title: "Rôle",
            taskInputPlaceholder: "Que dois-je faire?",
            submit: "Ajouter tâche",
            itemsLeft: " éléments restants",
            allBtn: "Tous",
            activeBtn: "Actif",
            completedBtn: "Terminé",
        },
    };

    loadTasks(); // loading tasks from user's local storage

    taskForm.addEventListener("submit", (event) => { // process task adding with event - action object
        event.preventDefault();
        if (taskInput.value.trim() !== "") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
            triggerHeartBeat();
        }
    });

    taskInput.addEventListener("keypress", (event) => { // process task adding by enter button
        if (event.key === "Enter" && taskInput.value.trim() !== "") {
            addTask(taskInput.value.trim());
            taskInput.value = "";
            triggerHeartBeat();
        }
    });

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active"); // highlight active button
            filterTasks(button.id); // show only needed tasks
        });
    });

    languageSelector.addEventListener("change", () => {  // process language change
        const language = languageSelector.value;
        updateLanguage(language);
    });

    function updateLanguage(language) {
        const translation = translations[language];
        document.querySelectorAll("[id]").forEach((element) => {
            const key = element.getAttribute("id");
            if (translation[key]) {
                element.textContent = translation[key];
            }
        });
        taskInput.placeholder = translation.taskInputPlaceholder;
        updateCounter();
    }

    function addTask(taskText) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");

        const taskContent = document.createElement("span");
        taskContent.textContent = taskText;
        taskContent.addEventListener("click", () => toggleComplete(taskItem));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "-";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(taskItem));

        taskItem.appendChild(taskContent);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);

        saveTasks(); // save to LocalStorage
        updateCounter();
    }

    function toggleComplete(taskItem) {
        taskItem.classList.toggle("completed");
        saveTasks(); // update in LocalStorage
        updateCounter();
        triggerHeartBeat();
    }

    function deleteTask(taskItem) {
        taskList.removeChild(taskItem);
        saveTasks();
        updateCounter();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll(".task-item").forEach((item) => {
            tasks.push({
                text: item.querySelector("span").textContent,
                completed: item.classList.contains("completed"),
            });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => {
            const taskItem = document.createElement("li");
            taskItem.classList.add("task-item");
            if (task.completed) taskItem.classList.add("completed");

            const taskContent = document.createElement("span");
            taskContent.textContent = task.text;
            taskContent.addEventListener("click", () => toggleComplete(taskItem));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "-";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteTask(taskItem));

            taskItem.appendChild(taskContent);
            taskItem.appendChild(deleteBtn);
            taskList.appendChild(taskItem);
        });
        updateCounter();
    }

    function updateCounter() {
        const totalTasks = taskList.querySelectorAll(
            ".task-item:not(.completed)",
        ).length;
        itemsLeft.textContent = `${totalTasks}${translations[languageSelector.value].itemsLeft}`;
    }

    function filterTasks(filterId) {
        const allTasks = taskList.querySelectorAll(".task-item");
        allTasks.forEach((task) => {
            switch (filterId) {
                case "allBtn":
                    task.style.display = "flex";
                    break;
                case "activeBtn":
                    task.style.display = task.classList.contains("completed")
                        ? "none"
                        : "flex";
                    break;
                case "completedBtn":
                    task.style.display = task.classList.contains("completed")
                        ? "flex"
                        : "none";
                    break;
            }
        });
    }

    function triggerSparkles() {
        const sparkleInterval = setInterval(() => {
            for (let i = 0; i < 40; i++) { // 40 sparkles in each interval
                const sparkle = document.createElement("div");
                sparkle.classList.add("sparkle");

                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;

                sparkle.style.left = `${x}px`;
                sparkle.style.top = `${y}px`;

                document.body.appendChild(sparkle);

                setTimeout(() => sparkle.remove(), 1000); // remove sparkle from dorm after 1000ms
            }
        }, 300); // interval of an action 300ms

        setTimeout(() => {
            clearInterval(sparkleInterval);
        }, 10000); // stop sparkleInterval after 10 s
    }

    function triggerHeartBeat() {
        heart.classList.add("beating");
        triggerSparkles();

        setTimeout(() => {
            heart.classList.remove("beating");
        }, 10000);

        player.contentWindow.postMessage(
            '{"event":"command","func":"playVideo","args":""}',
            "https://www.youtube.com/embed/O7nMPV9rqlg?enablejsapi=1",
        );
    }
});
