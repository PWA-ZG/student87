  const width = 320;
  let height = 320;

  let streaming = false;

  let video = null;
  let canvas = null;
  let photo = null;
  let startbutton = null;
  let fileUpload = null;

  function startup() {
    document.getElementById("btnUpload").disabled = true;
    video = document.getElementById("video");
    canvas = document.getElementById("canvas");
    photo = document.getElementById("photo");
    startbutton = document.getElementById("startbutton");

    if (!("mediaDevices" in navigator)) {
      // fallback to file upload button
    
      video.hidden = true;
      startbutton.hidden = true;
      startbutton.style.display = none;
      canvas.hidden = true;
      btnUpload.hidden = true;
      photo.width = width;
      photo.height = width;
      document.getElementById("snapName").hidden = true;

      document.getElementById("inputFile").addEventListener('change', function() {
        if (this.files && this.files[0]) {
          var img = document.getElementById('myImg')
            img.onload = () => {
                URL.revokeObjectURL(img.src);  // no longer needed, free memory
            }
            photo.src = URL.createObjectURL(this.files[0]); // set src to blob url
        }
        document.getElementById("snapName").hidden = false;
        document.getElementById("btnUpload").hidden = false;
        document.getElementById("btnUpload").disabled = false;
      });
    } else {
      document.getElementById("inputFile").hidden = true;
      document.getElementById("myImg").hidden = true;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
      clearphoto();

      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false,
      );

      startbutton.addEventListener(
        "click",
        (ev) => {
          takepicture();
          ev.preventDefault();
          document.getElementById("btnUpload").disabled = false;
        },
        false,
      );
    }
  };

  startup();

// Fill the photo with an indication that none has been
// captured.

  function clearphoto() {
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  }

  function takepicture() {
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  document
    .getElementById("btnUpload")
    .addEventListener("click", function (event) {
      event.preventDefault();
      if (!snapName.value.trim()) {
        alert("Give it a cathcy name!");
        return false;
      }
      document.getElementById("btnUpload").disabled = true;
      clearphoto();
      document.getElementById("snapName").innerHTML = "";
    });