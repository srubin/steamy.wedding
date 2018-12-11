const controller = new ScrollMagic.Controller();

const dot = document.getElementById("coastline");
const highway = document.querySelector("#highway #Path");
const car = document.getElementById("CAR");

const airports = ["sfo", "oak", "sjc", "mry"];

function preparePath(element) {
  var pathLength = element.getTotalLength();
  element.style["stroke-dasharray"] = pathLength;
  element.style["stroke-dashoffset"] = pathLength;
}

function rad2deg(rad) {
  return 180 * rad / Math.PI;
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
  triggerElement: "#travel2",
  duration: highway.getBoundingClientRect().height
})
  .setTween(highwayTween)
  .on("update", e => {
    const { startPos, endPos, scrollPos } = e;
    const pct = (scrollPos - startPos) / (endPos - startPos);
    const len = highway.getTotalLength();
    console.log(pct);
    const dist = len * pct;
    const { x, y } = highway.getPointAtLength(dist);

    const angle = 0;
    // let angle = 0;
    //
    // if (dist + 1 <= len) {
    //   const posAhead = highway.getPointAtLength(dist + 1);
    //   angle = Math.atan2(posAhead.y - y, posAhead.x - x);
    // } else {
    //   const posBehind = highway.getPointAtLength(dist - 1);
    //   angle = Math.atan2(y - posBehind.y, pos.x - x);
    // }

    car.setAttribute("transform", `translate(${x},${y}) rotate(${rad2deg(angle + Math.PI / 2)})`);
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
