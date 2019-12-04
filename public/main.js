const fileTypes = ["jpg", "jpeg", "png"];

function getCanvasBlock() {
  return document
    .getElementsByClassName("canvas")[0]
    .getElementsByClassName("block")[0];
}

function addTextAssets(item) {
  const text = item.parentElement.getElementsByTagName("input")[0].value;
  if (!text.trim()) {
    return alert('Invalid text');
  }
  let obj = getStorageObj("textAssets");

  const id = new Date().getTime().toString();
  obj[id] = {
    text
  };
  localStorage.setItem("textAssets", JSON.stringify(obj));
  printTextAssets();
}

function printTextAssets() {
  const obj = getStorageObj("textAssets");
  const cont = document.createElement("div");

  for (let key in obj) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = obj[key].text;
    span.setAttribute("class", "text-block");

    const button = document.createElement("button");
    button.innerText = "add";
    button.setAttribute("class", "text-block");
    button.setAttribute("class", "btn btn-sm ");
    button.setAttribute("onClick", `addItem("text", "${obj[key].text}") `);

    li.appendChild(span);
    li.appendChild(button);
    cont.appendChild(li);
  }
  document
    .getElementsByClassName("assets")[0]
    .getElementsByClassName("text")[0]
    .getElementsByTagName("ul")[0].innerHTML = cont.innerHTML;
}

function drawImages(response) {
  const ul = document.createElement("ul");

  response.forEach(elem => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    img.setAttribute("class", "img-rounded");
    img.setAttribute("src", elem);

    const btn = document.createElement("button");
    btn.innerText = "add";
    btn.setAttribute("onClick", `addItem("img", "${elem}") `);
    btn.setAttribute("class", "btn btn-default text-block");

    li.appendChild(img);
    li.appendChild(btn);
    ul.appendChild(li);
  });

  return ul;
}

function downloadFiles() {
  // https://www.iconfinder.com/iconsets/education-209
  const response = [
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png"
  ];
  document.getElementById("list-images").innerHTML = drawImages(
    response
  ).innerHTML;
}

function addItem(
  type,
  value,
  left = 0,
  top = 0,
  width = "50px",
  height = "50px"
) {
  let obj = getStorageObj("canvas");
  const id = new Date().getTime().toString();

  obj[id] = {
    type,
    value,
    left,
    top,
    width,
    height
  };

  localStorage.setItem("canvas", JSON.stringify(obj));
  printItems();
}

function removeCanvasItem(id) {
  let obj = getStorageObj("canvas");
  obj[id] = undefined;
  localStorage.setItem("canvas", JSON.stringify(obj));
  printItems();
  clearContentHeader();
}

function updateItem(id, left, top, height, width) {
  let obj = getStorageObj("canvas");

  if (!left) left = obj[id].left;
  if (!top) top = obj[id].top;
  if (!height) height = obj[id].height;
  if (!width) width = obj[id].width;

  obj[id].height = height;
  obj[id].width = width;
  obj[id].left = left;
  obj[id].top = top;

  localStorage.setItem("canvas", JSON.stringify(obj));
}

function getStorageObj(key) {
  let result = {};

  if (localStorage.getItem(key)) {
    try {
      result = JSON.parse(localStorage.getItem(key));
    } catch (e) {
      result = {};
    }
  }

  return result;
}

function drawCanvasItem(item, key) {
  const block = document.createElement("div");

  const element = document.createElement(item.type === "text" ? "div" : "img");

  block.setAttribute("id", key);
  block.style.position = "absolute";
  block.style.display = "flex";
  block.style.left = item.left;
  block.style.top = item.top;
  block.style.height = item.height;
  block.style.width = item.width;
  block.style.alignItems = "center";
  block.style.justifyContent = "center";
  block.setAttribute("draggable", "false");
  block.setAttribute("onclick", "(new ControlPanel).view(this)");

  if (item.type === "text") {
    element.innerText = item.value;
    element.style.fontSize = "20px";
  }

  if (item.type === "img") {
    element.setAttribute("src", item.value);
    element.setAttribute("draggable", "false");
  }
  {
    const buttonCenter = document.createElement("div");
    buttonCenter.innerText = "+";
    buttonCenter.setAttribute("class", "centerButton controlElement");
    buttonCenter.setAttribute("onmouseover", "moveCanvasItem(this)");
    block.appendChild(buttonCenter);
  }
  // {
  //   const blockAngle = document.createElement("div");
  //   blockAngle.setAttribute("class", "blockAngle leftTopButton controlElement");
  //   blockAngle.setAttribute("onmouseover", "resize(this,0)");
  //   block.appendChild(blockAngle);
  // }
  // {
  //   const blockAngle = document.createElement("div");
  //   blockAngle.setAttribute(
  //     "class",
  //     "blockAngle rigthTopButton controlElement"
  //   );
  //   blockAngle.setAttribute("onmouseover", "resize(this,1)");
  //   block.appendChild(blockAngle);
  // }
  {
    const blockAngle = document.createElement("div");
    blockAngle.setAttribute(
      "class",
      "blockAngle rigthBottomButton controlElement"
    );
    blockAngle.setAttribute("onmouseover", "resize(this,2)");
    block.appendChild(blockAngle);
  }
  // {
  //   const blockAngle = document.createElement("div");
  //   blockAngle.setAttribute(
  //     "class",
  //     "blockAngle leftBottomButton controlElement"
  //   );
  //   blockAngle.setAttribute("onmouseover", "resize(this,3)");
  //   block.appendChild(blockAngle);
  // }

  block.appendChild(element);
  return block;
}

function clearContentHeader(params) {
  document
    .getElementsByTagName("header")[0]
    .getElementsByClassName("content")[0].innerHTML = "";

  document
    .getElementsByTagName("header")[0]
    .getElementsByClassName("verticalHR")[0].style.display = "none";
}

function controlHide() {
  arr = document.getElementsByClassName("controlElement");
  for (let index = 0; index < arr.length; index++) {
    arr[index].style.visibility = "hidden";
    arr[index].parentElement.style.border = "none";
  }
  clearContentHeader();
}

function controlShow(elem) {
  arr = elem.getElementsByClassName("controlElement");

  for (let index = 0; index < arr.length; index++) {
    arr[index].style.visibility = "visible";
  }

  elem.style.border = "1px dashed";
}

function printItems() {
  const obj = getStorageObj("canvas");
  const container = document.createElement("div");

  for (let key in obj) {
    const item = obj[key];

    container.appendChild(drawCanvasItem(item, key));
  }

  getCanvasBlock().innerHTML = container.innerHTML;
}

function createBlockOnCoord(x, y, color) {
  const div = document.createElement("div");

  div.style.backgroundColor = color;
  div.style.position = "absolute";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.width = "10px";
  div.style.height = "10px";
  div.innerText = ".";

  document.body.appendChild(div);
}

function resize(element, id) {
  element.addEventListener("mousedown", initialiseResize, false);

  function initialiseResize(e) {
    getCanvasBlock().appendChild(element.parentElement);
    window.addEventListener("mousemove", startResizing, false);
    window.addEventListener("mouseup", stopResizing, false);
    if (element.parentElement.getElementsByTagName("img").length != 0)
      element.parentElement.getElementsByTagName("img")[0].style.visibility =
        "hidden";
    if (element.parentElement.getElementsByTagName("span").length != 0)
      element.parentElement.getElementsByTagName("span")[0].style.visibility =
        "hidden";
  }

  function startResizing(e) {
    const {
      left,
      top,
      bottom,
      right
    } = getCanvasBlock().getBoundingClientRect();
    const elem = element.parentElement.getBoundingClientRect();

    let heightCalc = null;
    let widthCalc = null;
    let topCalc = null;
    let leftCalc = null;

    if (id === 0) {
      heightCalc = elem.bottom - e.pageY;
      widthCalc = elem.right - e.pageX;

      topCalc = elem.bottom - heightCalc - top - 1;
      leftCalc = elem.right - widthCalc - left - 1;
    }

    if (id === 1) {
      heightCalc = elem.bottom - e.pageY;
      widthCalc = e.pageX - elem.left;

      topCalc = elem.bottom - heightCalc - top - 1;
    }

    if (id === 2) {
      heightCalc = e.pageY - top - (elem.top - top);
      widthCalc = e.pageX - left - (elem.left - left);
    }

    if (id === 3) {
      heightCalc = e.pageY - elem.top - top;
      widthCalc = elem.right - e.pageX;

      leftCalc = elem.right - widthCalc - left - 1;
    }

    if (heightCalc >= 50 && widthCalc >= 50) {
      element.parentElement.style.height = heightCalc + "px";
      element.parentElement.style.width = widthCalc + "px";

      element.parentElement.style.top = topCalc + "px";
      element.parentElement.style.left = leftCalc + "px";

      updateItem(
        element.parentElement.getAttribute("id"),
        leftCalc === null ? null : leftCalc + "px",
        topCalc === null ? null : topCalc + "px",
        heightCalc + "px",
        widthCalc + "px"
      );
    }
  }

  function stopResizing(e) {
    window.removeEventListener("mousemove", startResizing, false);
    window.removeEventListener("mouseup", stopResizing, false);

    if (element.parentElement.getElementsByTagName("img").length != 0)
      element.parentElement.getElementsByTagName("img")[0].style.visibility =
        "visible";
    if (element.parentElement.getElementsByTagName("span").length != 0)
      element.parentElement.getElementsByTagName("span")[0].style.visibility =
        "visible";
  }
}

function saveToPng() {
  controlHide();
  html2canvas(document.getElementsByClassName("block")[0]).then(canvas => {
    canvas.toBlob(function(blob) {
      var a = document.createElement("a");
      a.setAttribute("id", "saveToPngA");
      document.body.appendChild(a);
      a.style = "display: none";

      url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = "save.png";
      a.click();
      window.URL.revokeObjectURL(url);
      a.parentNode.removeChild(a);
    });
  });
}

function moveCanvasItem(element) {
  const parent = element.parentElement;
  parent.ondragstart = function() {
    return false;
  };

  element.onmousedown = function(e) {
    if (element.parentElement.getElementsByTagName("img").length != 0)
      element.parentElement.getElementsByTagName("img")[0].style.visibility =
        "hidden";
    if (element.parentElement.getElementsByTagName("span").length != 0)
      element.parentElement.getElementsByTagName("span")[0].style.visibility =
        "hidden";
    moveAt(e);

    getCanvasBlock().appendChild(parent);

    function moveAt(e) {
      const { left, top } = getCanvasBlock().getClientRects()[0];

      const { height, width } = parent.getClientRects()[0];

      mouse_x = window.event.clientX;
      mouse_y = window.event.clientY;

      parent.style.left = `${e.pageX - left - width / 2}px`;
      parent.style.top = `${e.pageY - top - height / 2}px`;
    }

    parent.onmousemove = moveAt;

    parent.onmouseup = function() {
      parent.onmousemove = null;
      document.onmousemove = null;
      parent.onmousemove = null;
      parent.onmouseup = null;
      parent.onmouseup = null;

      const { left, top } = parent.style;
      updateItem(parent.getAttribute("id"), left, top);

      if (element.parentElement.getElementsByTagName("img").length != 0)
        element.parentElement.getElementsByTagName("img")[0].style.visibility =
          "visible";
      if (element.parentElement.getElementsByTagName("span").length != 0)
        element.parentElement.getElementsByTagName("span")[0].style.visibility =
          "visible";
    };
  };
}

document.addEventListener("DOMContentLoaded", function() {
  downloadFiles();
  printItems();
  printTextAssets();
});

class ControlPanel {
  view(elem) {
    controlShow(elem);

    const controls = document.createElement("div");

    if (elem.lastChild.tagName === "IMG") {
      const img = document.createElement("img");
      img.innerText = "Remove";
      img.setAttribute("width", "30px;");
      img.setAttribute("height", "30px;");
      img.setAttribute("src", elem.lastChild.src);
      controls.appendChild(img);
    }

    if (elem.lastChild.tagName === "DIV") {
      const div = document.createElement("div");
      div.innerText = elem.lastChild.innerText;
      div.setAttribute("class", "text");
      controls.appendChild(div);
    }

    {
      const button = document.createElement("button");
      button.innerText = "Remove";
      button.setAttribute("class", "btn");
      button.setAttribute("onclick", 'removeCanvasItem("' + elem.id + '")');
      controls.appendChild(button);
    }

    {
      const button = document.createElement("button");
      button.innerText = "UP";
      button.setAttribute("class", "btn");
      button.setAttribute("onclick", 'moveUp("' + elem.id + '")');
      controls.appendChild(button);
    }

    {
      const button = document.createElement("button");
      button.innerText = "DOWN";
      button.setAttribute("class", "btn");
      button.setAttribute("onclick", 'moveDown("' + elem.id + '")');
      controls.appendChild(button);
    }
    document
      .getElementsByTagName("header")[0]
      .getElementsByClassName("verticalHR")[0].style.display = "block";

    document
      .getElementsByTagName("header")[0]
      .getElementsByClassName("content")[0].innerHTML = controls.innerHTML;
  }
}

function moveUp(id) {
  const element = document.getElementById(id);
  if (element.nextElementSibling)
    element.parentNode.insertBefore(element.nextElementSibling, element);
}

function moveDown(id) {
  const element = document.getElementById(id);
  if (element.previousElementSibling)
    element.parentNode.insertBefore(element, element.previousElementSibling);
}
