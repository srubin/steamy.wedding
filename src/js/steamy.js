// Enable all bootstrap tooltips with the data attribute
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
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
const placeDistances = [
  460,
  586,
  616,
  793,
  931,
  1047,
  1363,
  1505,
  1555,
];

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
      card.classList.add('highlight');
      card.classList.remove('faded');
    } else {
      card.classList.remove('highlight');
      card.classList.add('faded');
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

    car.setAttribute("transform", `translate(${x},${y})`);
    updateFadesCenter(landmarkCards);
  })
  .addTo(controller);
