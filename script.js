const guess = document.querySelector(".guess")
const pegs = guess.querySelectorAll(".peg")

guess.addEventListener("click", function (event) {
  const choice = event.target.closest(".peg")
  console.log(choice)
  pegs.forEach((el) => el.classList.remove("selected-peg"))
  choice.classList.toggle("selected-peg")
})
