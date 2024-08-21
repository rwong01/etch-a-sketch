function createGrid(size = 4) {
    const row = document.createElement("div");
    row.className = "row";
    const square = document.createElement("div");
    square.className = "square";
    for (let i = 0; i < size; i++){
        const clone = square.cloneNode();
        row.appendChild(clone);
    } 
    for (let i = 0; i < size; i++){
        const clone = row.cloneNode(true);
        document.body.appendChild(clone);
    }

    const squares = document.getElementsByClassName("square");
    for (let i=0; i< squares.length; i++){
        squares[i].addEventListener("mouseover", () => {
            squares[i].style.backgroundColor = '#76649c';
        });
        
        squares[i].addEventListener("mouseout", () => {
            squares[i].style.backgroundColor = '';
        });
    }
}

createGrid();


function getNewGridSize () {
    let size = Number(prompt("Enter # of squares per side for new grid (Max = 100): "));
    while (!Number.isInteger(size) || size < 1 || size > 100) {
        size = parseInt(prompt("Invalid input, please try again. Enter # of squares per side for new grid (Min = 1, Max = 100): "));
    }
    console.log(size);
    const rows = document.getElementsByClassName("row");
    while(rows[0]) {
        rows[0].parentNode.removeChild(rows[0]);
    }
    createGrid(size);
}

const input = document.getElementById("input");
input.addEventListener("click", () => {
    getNewGridSize();
});
