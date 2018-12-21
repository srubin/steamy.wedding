// Enable all bootstrap tooltips with the data attribute
$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

const controller = new ScrollMagic.Controller();
const highway = document.querySelector("#highway #Path");
const car = document.getElementById("CAR");
const landmarks = document.getElementById("landmarks");
const travel = document.getElementById("travel");

const places = Array.prototype.slice.call(
  document.querySelectorAll("#places #Oval")
);
places.sort((a, b) => {
  return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
});

// estimated distances along the highway path of the place ovals
const placeDistances = [460, 586, 616, 793, 931, 1047, 1363, 1505, 1555];

const landmarkCards = document.querySelectorAll("#landmarks .card-body");

function preparePath(element) {
  var pathLength = element.getTotalLength();
  element.style["stroke-dasharray"] = pathLength;
  element.style["stroke-dashoffset"] = pathLength;
}

function updateFadesCenter(cards) {
  const windowHeight = window.innerHeight;
  for (const card of cards) {
    const rect = card.getBoundingClientRect();
    // if the top of the card is below 0%
    // and the bottom of the card is above 100%
    if (rect.top > 0 && rect.bottom < windowHeight) {
      card.classList.add("highlight");
      card.classList.remove("faded");
    } else {
      card.classList.remove("highlight");
      card.classList.add("faded");
    }
  }
}

preparePath(highway);

const highwayTween = new TimelineMax().add(
  TweenMax.to(highway, 0.9, {
    strokeDashoffset: 0,
    ease: Linear.easeNone
  })
);

new ScrollMagic.Scene({
  triggerElement: "#map",
  triggerHook: "onLeave",
  duration: () => {
    return landmarks.getBoundingClientRect().height;
  }
})
  .setTween(highwayTween)
  .setPin("#map", { pushFollowers: false })
  .on("update", e => {
    const { startPos, endPos, scrollPos } = e;
    const pct = (scrollPos - startPos) / (endPos - startPos);
    const len = highway.getTotalLength();
    const dist = len * pct;
    const { x, y } = highway.getPointAtLength(dist);

    if (dist < 0) {
      car.setAttribute("visibility", "hidden");
    } else {
      car.removeAttribute("visibility");
    }

    car.setAttribute("transform", `translate(${x},${y})`);
    updateFadesCenter(landmarkCards);
  })
  .addTo(controller);

const header = document.getElementById("header");
const unicorn = document.getElementById("unicorn");
const unicornImg = document.querySelector("#unicorn img");
const {
  height: unicornHeight,
  width: unicornWidth
} = unicornImg.getBoundingClientRect();

function unicornPath() {
  const totalWidth = window.innerWidth + unicornWidth;
  const thirdWidth = totalWidth / 3;
  const halfUnicornWidth = unicornWidth / 2;
  const arrowHeight = 132;
  // let topY = arrowHeight + unicornHeight;
  // if (window.innerWidth < 400) {
  //   topY = arrowHeight;
  // }
  let topY = arrowHeight;
  return {
    autoRotate: true,
    values: [
      {
        x: thirdWidth,
        y: -topY
      },
      {
        x: totalWidth - thirdWidth,
        y: -topY
      },
      { x: totalWidth, y: 0 }
    ]
  };
}

function setupUnicornScene() {
  return (
    new ScrollMagic.Scene({
      triggerElement: "#header",
      triggerHook: "onLeave",
      duration: () => {
        return header.getBoundingClientRect().height / 3;
      }
    })
      .on("update", e => {
        const { startPos, endPos, scrollPos } = e;
        const pct = (scrollPos - startPos) / (endPos - startPos);

        if (pct < 0 || pct > 1) {
          unicorn.style.display = "none";
          return;
        } else {
          unicorn.style.display = "block";
        }

        const yOffset = 132 + unicornHeight;
        const totalX = window.innerWidth + unicornWidth + unicornWidth;
        const middle = totalX / 2;

        const curveX = pct * totalX;
        const a = -0.0005;
        const curveY = a * Math.pow(curveX - middle, 2) + yOffset;

        const x = curveX - (3 / 2) * unicornWidth;
        const y = curveY + unicornWidth / 2;

        const slope = 2 * a * curveX - 2 * a * middle;
        const angle = (-Math.atan(slope) * 180) / Math.PI;

        unicorn.style.top = `${window.innerHeight - y}px`;
        unicorn.style.left = `${x}px`;
        unicorn.style.transform = `rotate(${angle}deg)`;
      })
      .addTo(controller)
  );
}

setupUnicornScene();
