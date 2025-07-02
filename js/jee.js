document.addEventListener("DOMContentLoaded", () => {
  const topicList = document.getElementById("jeeTopics");
  const completed = JSON.parse(localStorage.getItem("jeeTopics")) || {};

  // Restore previously checked items
  for (let topic in completed) {
    const item = topicList.querySelector(`[data-topic='${topic}']`);
    if (item) item.checked = true;
  }

  topicList.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const topic = e.target.dataset.topic;
      completed[topic] = e.target.checked;
      localStorage.setItem("jeeTopics", JSON.stringify(completed));
    }
  });
});
