/**
 * index.js file
 * Author: Sk Sakil Ahmed
 * Email: sakil.ruet09@gmail.com
 */
let sectors = [];
// generating large sectors
for (let index = 0; index < 50; index++) {
  var color = randomColor(); // a hex code for an attractive color
  sectors.push({
    color: color,
    bookNo: (index + 1).toLocaleString("bn-BD"),
    accountNo: (index + 1000).toLocaleString("bn-BD"),
    name: `Mr. ${index + 1}`,
  });
}
// End of Sector Generation

const rand = (m, M) => Math.random() * (M - m) + m;
let tot = sectors.length;
const EL_spin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
let arc = TAU / (sectors.length || 1);
const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians
let isWheelSpinning = false;
let winner = null;
let winnerPosition = 3;
/**
 * Environment Initializations Funtion
 * @param null
 */
function initializeVariables() {
  tot = sectors.length;
  arc = TAU / (sectors.length || 1);
}

/**
 * Getting Index Funtion
 * @param null
 */
const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;
/**
 * Drawing Sector Funtion
 * @param sector
 * @param i
 */
function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 10px sans-serif";
  ctx.fillText(
    `${sector.name}(${sector.bookNo}/${sector.accountNo})`,
    rad - 10,
    10
  );
  //
  ctx.restore();
}

/**
 * Rotate Funtion
 * @param null
 */
function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  // checking the board is rotating or not
  if (angVel) {
    // Rotating
    EL_spin.textContent = `${sector.name}
    (${sector.bookNo}/${sector.accountNo})`;
    // Showing the sweetalert
    // Swal.fire(`The winner is ${sector.bookNo}`);
    winner = sector;
  } else {
    processWinner(sector);
  }
  // EL_spin.textContent = !angVel
  //   ? `${sector.bookNo} SPIN ${angVel}`
  //   : `${sector.bookNo} FINDING...`;
  // EL_spin.textContent = !angVel ? "SPIN" : sector.bookNo;
  EL_spin.style.background = sector.color;
}
/**
 * Frame Funtion
 * @param null
 */
function frame() {
  if (!angVel) return;
  angVel *= friction; // Decrement velocity by friction
  if (angVel < 0.002) angVel = 0; // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}
/**
 * Engine Funtion
 * @param null
 */
function engine() {
  frame();
  requestAnimationFrame(engine);
}
/**
 * Removing the Winner from the list
 * @param sector
 */
function processWinner(sector) {
  // removing the sector
  if (isWheelSpinning === true && winner) {
    let processedPosition = "N/A";
    if (winnerPosition === 3) {
      processedPosition = "তৃতীয়";
    } else if (winnerPosition === 2) {
      processedPosition = "দ্বিতীয়";
    } else if (winnerPosition === 1) {
      processedPosition = "প্রথম";
      EL_spin.removeEventListener("click", clickHandler);
    }
    // Showing the Winner Details
    Swal.fire({
      title: "স্বাগতম!",
      text: `${sector.name}(${sector.bookNo}/${sector.accountNo}), আপনি ${processedPosition} পুরষ্কারের জন্য নির্বাচিত হয়েছেন।`,
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
      // background: "#fff url(./lottery3.gif)",
      backdrop: `rgba(0,0,123,0.4) url("./lottery5.gif") no-repeat
  `,
      icon: "warning",
      // showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "আবার দেখুন",
    }).then((result) => {
      if (result.isConfirmed) {
        // Removing the winner from the list
        const findIndex = sectors
          .map((sector) => sector.bookNo)
          .indexOf(sector.bookNo);
        if (findIndex > -1) {
          // attaching the result
          document.getElementById(
            `${winnerPosition}`
          ).innerText = `${processedPosition} পুরস্কারঃ ${sector.name}(বই নংঃ ${sector.bookNo} হিসাব নংঃ ${sector.accountNo})`;
          sector.bookNo;
          sectors.splice(findIndex, 1);
          // Redrawing the Canvas
          initializeVariables();
          sectors.forEach(drawSector);
          EL_spin.textContent = `SPIN`;
        }
        winnerPosition = winnerPosition > 0 ? winnerPosition - 1 : 0;
        winner = null;
        isWheelSpinning = false;
      }
    });
  }
}

// INIT
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine
/**
 * Starting the Rotate/Spinning Function
 * @param null
 */
EL_spin.addEventListener("click", clickHandler);
// EL_spin.addEventListener("click", () => {
// // setting the Wheel Spinning State to True
// isWheelSpinning = true;
// if (!angVel) angVel = rand(0.25, 0.35);
// });
function clickHandler(e) {
  console.log("Button Clicked");
  // setting the Wheel Spinning State to True
  isWheelSpinning = true;
  if (!angVel) angVel = rand(0.25, 0.35);
}
