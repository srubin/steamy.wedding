const controller = new ScrollMagic.Controller();

const dot = document.getElementById("coastline");
const highway = document.querySelector("#highway #Path");
const car = document.getElementById("CAR");
const landmarks = document.getElementById("landmarks");
const travel = document.getElementById("travel");

const airports = ["sfo", "oak", "sjc", "mry"];

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

function rad2deg(rad) {
  return (180 * rad) / Math.PI;
}

function updateFades(carPosition, ovals, cards) {
  let currentOval = undefined;
  let currentCard = undefined;

  ovals.forEach((placeOval, index) => {
    if (currentOval) {
      return;
    }

    if (carPosition < placeOval.getBoundingClientRect().top) {
      currentOval = placeOval;
      currentCard = cards[index];
    }
  });

  for (const card of cards) {
    card.classList.add("faded");
    card.classList.remove("highlight");
  }

  currentCard = currentCard || cards[cards.length - 1];
  currentCard.classList.remove("faded");
  currentCard.classList.add("highlight");
}

preparePath(dot);
preparePath(highway);

const tween = new TimelineMax().add(
  TweenMax.to(dot, 0.9, {
    strokeDashoffset: 0,
    ease: Linear.easeNone
  })
);

const highwayTween = new TimelineMax().add(
  TweenMax.to(highway, 0.9, {
    strokeDashoffset: 0,
    ease: Linear.easeNone
  })
);

new ScrollMagic.Scene({
  triggerElement: "#travel",
  duration: dot.getBoundingClientRect().height
})
  .setTween(tween)
  .addIndicators()
  .addTo(controller);

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

    updateFades(car.getBoundingClientRect().top, places, landmarkCards);
  })
  .addIndicators()
  .addTo(controller);

for (const airport of airports) {
  const airportId = `#${airport}`;
  const airportDetailsId = `#${airport}-details`;

  new ScrollMagic.Scene({
    triggerElement: airportId,
    duration: 250
  })
    .setTween(airportId, 1, { opacity: 1.0 })
    .addIndicators()
    .addTo(controller);

  new ScrollMagic.Scene({
    triggerElement: airportId,
    duration: 400
  })
    .setTween(
      new TimelineMax()
        .to(airportDetailsId, 1, { opacity: 1 })
        .to(airportDetailsId, 1, { opacity: 0 })
    )
    .addIndicators()
    .addTo(controller);
}
