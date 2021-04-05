const menuButton = document.querySelector("#menu-btn");
const sidebar = document.querySelector("#sidebar");
const container = document.querySelector(".my-container");

menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("inactive-nav");
    container.classList.toggle("inactive-cont");
})