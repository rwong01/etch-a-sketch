function randomColor() {
    const r = Math.floor(Math.random() * 256); 
    const g = Math.floor(Math.random() * 256); 
    const b = Math.floor(Math.random() * 256); 
    return [r, g, b];
}

function createGrid(size = 4) {
    const grid = document.createElement("div");
    const row = document.createElement("div");
    const square = document.createElement("div");
    grid.id = "grid";
    row.className = "row";
    square.className = "square";
    const squareSize = 100 / size;
    row.style.cssText = `height: ${squareSize}%; width: 100%`;
    square.style.cssText = `width: ${squareSize}%; height: 100%`;
    document.body.appendChild(grid);
    for (let i = 0; i < size; i++){
        const clone = square.cloneNode();
        row.appendChild(clone);
    } 
    for (let i = 0; i < size; i++){
        const clone = row.cloneNode(true);
        grid.appendChild(clone);
    }
    const squares = document.getElementsByClassName("square");
    for (let i=0; i< squares.length; i++){
        squares[i].addEventListener("mouseover", () => {
            const [r, g, b] = randomColor();
            squares[i].style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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
    const grid = document.getElementById("grid");
    document.body.removeChild(grid);
    createGrid(size);
}

const input = document.getElementById("input");
input.addEventListener("click", () => {
    getNewGridSize();
});
