document.addEventListener("DOMContentLoaded", () => {
  // Tekst koji formiramo
  const lines = [
    "BLACK",
    "BOX",
    "TESTING"
  ];

  const svg = document.querySelector(".title-anim");
  const lettersLayer = document.getElementById("letters");
  const robotsLayer = document.getElementById("robots");

  // Dimenzije jedne "kutije"
  const boxW = 80;
  const boxH = 48;
  const gap = 14;

  // Helper da kreiramo jednu kutiju sa slovom
  function createLetterBox(x, y, char) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.classList.add("letter");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("class", "letter-box");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", boxW);
    rect.setAttribute("height", boxH);
    rect.setAttribute("opacity", "0");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", "letter-char");
    text.setAttribute("x", x + boxW / 2);
    text.setAttribute("y", y + boxH / 2 + 9); // blagi offset da bude vizuelno centrirano
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.textContent = char;

    g.appendChild(rect);
    g.appendChild(text);
    lettersLayer.appendChild(g);
    return { group: g, rect, text };
  }

  // Helper za robota
  function createRobot(cx, cy) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const body = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    body.setAttribute("class", "robot-body");
    body.setAttribute("r", 7);
    body.setAttribute("cx", cx);
    body.setAttribute("cy", cy);

    const eye1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    eye1.setAttribute("class", "robot-eye");
    eye1.setAttribute("r", 1.4);
    eye1.setAttribute("cx", cx - 2.2);
    eye1.setAttribute("cy", cy - 1.2);

    const eye2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    eye2.setAttribute("class", "robot-eye");
    eye2.setAttribute("r", 1.4);
    eye2.setAttribute("cx", cx + 2.2);
    eye2.setAttribute("cy", cy - 1.2);

    g.appendChild(body); g.appendChild(eye1); g.appendChild(eye2);
    robotsLayer.appendChild(g);
    return { g, body, eye1, eye2 };
  }

  // Postavimo ciljna mesta za svako slovo i napravimo elemente
  const letterItems = [];
  let startX = 40;
  let startY = 40;

  lines.forEach((word, lineIndex) => {
    startX = 40;
    startY = 40 + lineIndex * 100;

    [...word].forEach((ch, i) => {
      const x = startX + i * (boxW + gap);
      const y = startY;

      const { rect } = createLetterBox(x, y, ch);
      // Start offset: izvan ekrana levo/dole
      const fromX = x - (200 + Math.random() * 200);
      const fromY = y + (140 + Math.random() * 120);
      rect.setAttribute("x", fromX);
      rect.setAttribute("y", fromY);

      // Robot krene malo ispred
      const r = createRobot(fromX - 12, fromY + 12);

      letterItems.push({
        target: { x, y },
        rect,
        robot: r
      });
    });
  });

  
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  letterItems.forEach((item, idx) => {
    const d = idx * 0.08; 
    
    tl.to(item.rect, {
      attr: { x: item.target.x, y: item.target.y },
      opacity: 1,
      duration: 0.9
    }, d);

    
    tl.to(item.robot.body, {
      attr: { cx: item.target.x - 12, cy: item.target.y + 12 },
      duration: 0.9
    }, d);
    tl.to(item.robot.eye1, {
      attr: { cx: item.target.x - 14.2, cy: item.target.y + 10.8 },
      duration: 0.9
    }, d);
    tl.to(item.robot.eye2, {
      attr: { cx: item.target.x - 9.8, cy: item.target.y + 10.8 },
      duration: 0.9
    }, d);

    
    tl.to(item.robot.g, { y: "-=3", yoyo: true, repeat: 1, duration: 0.08, ease: "power1.inOut" }, d + 0.92);
  });

  // (opciono) loop sa kratkom pauzom:
  // tl.to({}, { duration: 1.4 });
  // tl.add(() => location.reload());
});